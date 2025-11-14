import { geojsonToArcGIS } from "@terraformer/arcgis";
import { NextResponse } from "next/server";

/**
 * GET /api/pulas-by-geometry
 *
 * Query parameters:
 * - geometry: GeoJSON string representing an array of Polygon features (converted to MultiPolygon)
 * - date: Filter by application date (YYYY-MM-DD)
 * - prod_reg_num: Product registration number to filter limitations
 * - returnGeometry: "true" to include geometry in PULA features, "false" or omitted for attributes only
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const geometryParam = searchParams.get("geometry");
  const date = searchParams.get("date");
  const prodRegNum = searchParams.get("prod_reg_num");
  const returnGeometry = searchParams.get("returnGeometry") === "true";

  if (!geometryParam || !prodRegNum || !date) {
    return NextResponse.json(
      { error: "Missing geometry, prod_reg_num, or date query parameters" },
      { status: 400 },
    );
  }

  let geometry;
  try {
    const parsedGeometry = JSON.parse(geometryParam);

    // Handle arrays of polygons
    if (!Array.isArray(parsedGeometry)) {
      throw new Error("Geometry must be an array of Polygon features");
    }

    // Convert array of GeoJSON Polygon features to a single MultiPolygon
    const coordinates = parsedGeometry.map((feature) => {
      if (feature.geometry.type !== "Polygon") {
        throw new Error("All features must be Polygon type");
      }
      return feature.geometry.coordinates;
    });

    const multiPolygon: GeoJSON.MultiPolygon = {
      type: "MultiPolygon",
      coordinates: coordinates,
    };

    geometry = geojsonToArcGIS(multiPolygon);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Invalid geometry parameter - must be valid JSON array of Polygon features",
      },
      { status: 400 },
    );
  }

  // 1. Get PULA features from ArcGIS service
  const pulaQueryUrl =
    "https://blt.epa.gov/arcgis/rest/services/BLT/PesticideUsageLimitationAreas/MapServer/0/query";
  const params = new URLSearchParams({
    geometry: JSON.stringify(geometry),
    geometryType: "esriGeometryPolygon",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    f: "json",
    returnGeometry: returnGeometry.toString(),
    outFields: "*",
  });

  try {
    const pulaRes = await fetch(`${pulaQueryUrl}?${params.toString()}`);
    if (!pulaRes.ok) {
      throw new Error(`Failed to fetch PULAs: ${pulaRes.statusText}`);
    }
    const pulaData = await pulaRes.json();

    if (!pulaData.features || pulaData.features.length === 0) {
      return NextResponse.json({ limitations: [], pulas: [] });
    }

    const pulaIds: number[] = pulaData.features.map(
      (feature: any) => feature.attributes.pula_id,
    );
    const uniquePulaIds = [...new Set(pulaIds)];

    // 2. Get limitations
    const limitations = await getLimitationsForPulas(
      uniquePulaIds,
      prodRegNum,
      date,
    );

    // 3. Filter PULAs to only include ones with applicable limitations
    const pulaIdsWithLimitations = new Set(
      limitations.map((limitation: any) => limitation.pula_id),
    );

    const filteredPulaFeatures = pulaData.features.filter((feature: any) =>
      pulaIdsWithLimitations.has(feature.attributes.pula_id),
    );

    // 4. Process PULA features based on returnGeometry parameter
    const processedPulas = returnGeometry
      ? filteredPulaFeatures
      : filteredPulaFeatures.map((feature: any) => ({
          attributes: feature.attributes,
        }));

    return NextResponse.json({ limitations, pulas: processedPulas });
  } catch (error) {
    console.error("Error in /api/pulas-by-geometry:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

async function getLimitationsForPulas(
  pulaIds: number[],
  prodRegNum: string,
  date: string,
): Promise<any[]> {
  const allLimitations: any[] = [];
  const fetchedPulaIds = new Set();

  for (const pulaId of pulaIds) {
    if (fetchedPulaIds.has(pulaId)) {
      continue;
    }

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
      const res = await fetch(baseUrl);
      if (res.ok) {
        const limitations = await res.json();
        if (Array.isArray(limitations) && limitations.length > 0) {
          allLimitations.push(...limitations);
        }
      }
      fetchedPulaIds.add(pulaId);
    } catch (error) {
      console.error(`Error fetching limitations for pulaId ${pulaId}:`, error);
    }
  }
  return allLimitations;
}
