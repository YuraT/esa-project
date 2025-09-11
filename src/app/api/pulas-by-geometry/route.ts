
import { NextResponse } from "next/server";

interface PulaID {
  pula_id: number;
}

export async function POST(request: Request) {
    const { geometry, prod_reg_num } = await request.json();

    if (!geometry || !prod_reg_num) {
        return NextResponse.json({ error: "Missing geometry or prod_reg_num" }, { status: 400 });
    }

    // 1. Get PULA features from ArcGIS service
    const pulaQueryUrl = 'https://blt.epa.gov/arcgis/rest/services/BLT/PesticideUsageLimitationAreas/MapServer/0/query';
    const params = new URLSearchParams({
        geometry: JSON.stringify(geometry),
        geometryType: 'esriGeometryPolygon',
        inSR: '4326',
        spatialRel: 'esriSpatialRelIntersects',
        f: 'json',
        returnGeometry: 'true',
        outFields: '*'
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

        const pula_ids = pulaData.features.map((feature: any) => feature.attributes.pula_id);
        const unique_pula_ids = [...new Set(pula_ids)];

        // 2. Get limitations
        const limitations = await getLimitationsForPulas(unique_pula_ids, prod_reg_num);

        return NextResponse.json({ limitations, pulas: pulaData.features });

    } catch (error) {
        console.error("Error in /api/pulas-by-geometry:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}

async function getLimitationsForPulas(pula_ids: number[], prod_reg_num: string): Promise<any[]> {
    const all_limitations: any[] = [];
    const fetched_pula_ids = new Set();

    for (const pula_id of pula_ids) {
        if (fetched_pula_ids.has(pula_id)) {
            continue;
        }

        const where = {
            pula_id: pula_id,
            product_registration_number: prod_reg_num
        };

        const select = {
            product_registration_number: 1,
            pula_id: 1,
            limitation: 1,
            last_update: 1,
            code: 1,
            umf: { use: 1, method: 1, form: 1, pula_id: 1 }
        };

        const base_url = new URL("https://blt.epa.gov/blt/api/limitations_public");
        base_url.searchParams.append("where", JSON.stringify(where));
        base_url.searchParams.append("select", JSON.stringify(select));

        try {
            const res = await fetch(base_url);
            if (res.ok) {
                const limitations = await res.json();
                if (Array.isArray(limitations) && limitations.length > 0) {
                    all_limitations.push(...limitations);
                }
            }
            fetched_pula_ids.add(pula_id);
        } catch (error) {
            console.error(`Error fetching limitations for pula_id ${pula_id}:`, error);
        }
    }
    return all_limitations;
}
