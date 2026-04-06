import { geojsonToArcGIS } from "@terraformer/arcgis";
import { NextResponse } from "next/server";

const CACHE_CONTROL = "private, max-age=300, stale-while-revalidate=60";
const ARC_GIS_URL =
  "https://blt.epa.gov/arcgis/rest/services/BLT/PesticideUsageLimitationAreas/MapServer/0/query";

const ARC_GIS_ATTR_FIELDS =
  "objectid,pula_id,status,event_name,effective_date,published_time_stamp,codes,polygon_pula_id,intersect_id,intersected_pula_ids";

const ARC_GIS_CHUNK_SIZE = 150;
const ARC_GIS_TIMEOUT_MS = 30000;
const ARC_GIS_RETRIES = 1;
const EPA_CONCURRENCY = 6;

type ArcGISFeature = {
  attributes: Record<string, any>;
  geometry?: any;
};

function jsonResponse(body: any, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": CACHE_CONTROL,
    },
  });
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function fetchTextWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = ARC_GIS_TIMEOUT_MS,
): Promise<{ res: Response; text: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    const text = await res.text();
    return { res, text };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchArcGISJson(
  params: URLSearchParams,
  label: string,
): Promise<any> {
  const url = `${ARC_GIS_URL}?${params.toString()}`;

  let lastError: unknown;

  for (let attempt = 0; attempt <= ARC_GIS_RETRIES; attempt++) {
    try {
      const started = Date.now();
      const { res, text } = await fetchTextWithTimeout(url);
      const ms = Date.now() - started;

      console.log(`[ArcGIS] ${label} attempt=${attempt + 1} status=${res.status} ms=${ms} urlLength=${url.length} textLength=${text.length}`);

      if (!res.ok) {
        throw new Error(
          `ArcGIS HTTP ${res.status}: ${text.slice(0, 500)}`,
        );
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        console.error(`[ArcGIS] ${label} parse failed. head=`, text.slice(0, 500));
        console.error(`[ArcGIS] ${label} parse failed. tail=`, text.slice(-500));
        throw new Error("ArcGIS returned an incomplete or malformed JSON response");
      }

      if (parsed?.error) {
        throw new Error(`ArcGIS error: ${JSON.stringify(parsed.error)}`);
      }

      return parsed;
    } catch (error) {
      lastError = error;
      if (attempt < ARC_GIS_RETRIES) {
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`${label} failed`);
}

async function getIntersectingObjectIds(
  geometry: any,
): Promise<number[]> {
  const params = new URLSearchParams({
    geometry: JSON.stringify(geometry),
    geometryType: "esriGeometryPolygon",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    f: "json",
    returnIdsOnly: "true",
  });

  const data = await fetchArcGISJson(params, "returnIdsOnly");
  return Array.isArray(data?.objectIds) ? data.objectIds : [];
}

async function fetchArcGISFeaturesByObjectIds(
  objectIds: number[],
  returnGeometry: boolean,
): Promise<ArcGISFeature[]> {
  if (objectIds.length === 0) return [];

  const chunks = chunkArray(objectIds, ARC_GIS_CHUNK_SIZE);
  const allFeatures: ArcGISFeature[] = [];

  for (const chunk of chunks) {
    const params = new URLSearchParams({
      objectIds: chunk.join(","),
      f: "json",
      outFields: ARC_GIS_ATTR_FIELDS,
      returnGeometry: returnGeometry ? "true" : "false",
      geometryPrecision: "5",
    });

    const data = await fetchArcGISJson(
      params,
      `features chunk size=${chunk.length} returnGeometry=${returnGeometry}`,
    );

    if (Array.isArray(data?.features)) {
      allFeatures.push(...data.features);
    }
  }

  return allFeatures;
}

async function getLimitationsForPulas(
  pulaIds: number[],
  prodRegNum: string,
  date: string,
): Promise<any[]> {
  const uniquePulaIds = [...new Set(pulaIds)];
  const results: any[] = [];
  let index = 0;

  async function worker() {
    while (index < uniquePulaIds.length) {
      const currentIndex = index++;
      const pulaId = uniquePulaIds[currentIndex];

      const where = {
        pula_id: pulaId,
        product_registration_number: prodRegNum,
        effective_date: {
          "<": date,
        },
      };

      const select = {
        product_registration_number: 1,
        pula_id: 1,
        limitation: 1,
        last_update: 1,
        code: 1,
        umf: { use: 1, method: 1, form: 1, pula_id: 1 },
      };

      const baseUrl = new URL("https://blt.epa.gov/blt/api/limitations_public");
      baseUrl.searchParams.append("where", JSON.stringify(where));
      baseUrl.searchParams.append("select", JSON.stringify(select));

      try {
        const res = await fetch(baseUrl.toString());
        const text = await res.text();

        if (!res.ok) {
          console.error(`limitations_public failed for pulaId ${pulaId}:`, res.status, text.slice(0, 500));
          continue;
        }

        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          results.push(...parsed);
        }
      } catch (error) {
        console.error(`Error fetching limitations for pulaId ${pulaId}:`, error);
      }
    }
  }

  await Promise.all(
    Array.from({ length: EPA_CONCURRENCY }, () => worker()),
  );

  return results;
}

/**
 * GET /api/pulas-by-geometry
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const geometryParam = searchParams.get("geometry");
  const date = searchParams.get("date");
  const prodRegNum = searchParams.get("prod_reg_num");
  const returnGeometry = searchParams.get("returnGeometry") === "true";

  console.log("pulas-by-geometry params:", {
    hasGeometry: !!geometryParam,
    date,
    prodRegNum,
    returnGeometry,
  });

  if (!geometryParam || !prodRegNum || !date) {
    return jsonResponse(
      { error: "Missing geometry, prod_reg_num, or date query parameters" },
      400,
    );
  }

  let geometry;
  try {
    const parsedGeometry = JSON.parse(geometryParam);

    if (!Array.isArray(parsedGeometry)) {
      throw new Error("Geometry must be an array of Polygon features");
    }

    const coordinates = parsedGeometry.map((feature) => {
      if (feature.geometry.type !== "Polygon") {
        throw new Error("All features must be Polygon type");
      }
      return feature.geometry.coordinates;
    });

    const multiPolygon: GeoJSON.MultiPolygon = {
      type: "MultiPolygon",
      coordinates,
    };

    geometry = geojsonToArcGIS(multiPolygon);
  } catch {
    return jsonResponse(
      {
        error:
          "Invalid geometry parameter - must be valid JSON array of Polygon features",
      },
      400,
    );
  }

  try {
    // Step 1: tiny ArcGIS call: IDs only
    const objectIds = await getIntersectingObjectIds(geometry);

    if (objectIds.length === 0) {
      return jsonResponse({ limitations: [], pulas: [] });
    }

    // Step 2: fetch attributes only in chunks
    const attrFeatures = await fetchArcGISFeaturesByObjectIds(
      objectIds,
      false,
    );

    const pulaIds = attrFeatures
      .map((feature) => Number(feature.attributes?.pula_id))
      .filter((id) => Number.isFinite(id));

    const uniquePulaIds = [...new Set(pulaIds)];

    // Step 3: EPA limitations, parallelized
    const limitations = await getLimitationsForPulas(
      uniquePulaIds,
      prodRegNum,
      date,
    );

    const pulaIdsWithLimitations = new Set(
      limitations.map((limitation: any) => limitation.pula_id),
    );

    const filteredAttrFeatures = attrFeatures.filter((feature) =>
      pulaIdsWithLimitations.has(feature.attributes?.pula_id),
    );

    if (!returnGeometry) {
      const pulas = filteredAttrFeatures.map((feature) => ({
        attributes: feature.attributes,
      }));

      return jsonResponse({ limitations, pulas });
    }

    // Step 4: only now fetch geometry, and only for filtered PULAs
    const filteredObjectIds = filteredAttrFeatures
      .map((feature) => Number(feature.attributes?.objectid))
      .filter((id) => Number.isFinite(id));

    const geometryFeatures = await fetchArcGISFeaturesByObjectIds(
      filteredObjectIds,
      true,
    );

    return jsonResponse({
      limitations,
      pulas: geometryFeatures,
    });
  } catch (error) {
    console.error("Error in /api/pulas-by-geometry:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error";

    if (
      message.includes("aborted") ||
      message.includes("timeout") ||
      message.includes("incomplete or malformed")
    ) {
      return jsonResponse(
        {
          error: "Failed to process request",
          details:
            "The ArcGIS service timed out or returned an incomplete response. Please try a smaller selection or retry.",
        },
        504,
      );
    }

    return jsonResponse(
      {
        error: "Failed to process request",
        details: message,
      },
      500,
    );
  }
}