import { NextResponse } from "next/server";

interface PulaIDs {
  pula_id: number;
}

// function handling get requests to this api route
export async function GET(request: Request) {
  // get request base url (blt)
  const base_url = new URL("https://blt.epa.gov/blt/api/pulas_public");

  // turn request url string into url obj
  const url = new URL(request.url);

  // from url obj search params for county, state, prod_reg_num, and date
  //const prod_reg_num = url.searchParams.get("prod_reg_num");
  const county = url.searchParams.get("county");
  const state = url.searchParams.get("state");
  const date = url.searchParams.get("date")
  const prod_reg_num = url.searchParams.get("prod_reg_num")

  // validating frontend's request has all required query params
  if (!date || !county || !state || !prod_reg_num) {
    return NextResponse.json(
    { error: "Missing one or more required query parameters (date, county, state, prod_reg_num)" },
    { status: 400 }
    );
  }

  // building where to later query at pulas_public endpoint
  const where = {
    states: {
      state_abbr: state,
      counties: {
        name: county,
      }
    },
    effective_date: {
      "<": date
    }
  };

  // building select to later query at pulas_public endpoint
  const select = {
     pula_id: 1 
  };

  // building main url to fetch pula_id's from pulas_public endpoint
  base_url.searchParams.append("where", JSON.stringify(where));
  base_url.searchParams.append("select", JSON.stringify(select));

  // calling fetch to make http req to base url w/error checking
  const res = await fetch(base_url);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch pula IDs" },
      { status: res.status }
    );
  }

  // holding parsed js obj (array of pula_id's)
  const pula_IDs = await res.json();

  // sending off pula_IDs + prod_reg_num for further querying at limitations_public endpoint
  return await limitations_helper(pula_IDs, prod_reg_num)
} 

// helper function for calling limitations_public endpoint w/ pula_ID and prod_reg_num
async function limitations_helper(pula_IDs: PulaIDs[], prod_reg_num: string) {
  // error checking
  if (!pula_IDs || pula_IDs.length === 0) {
    return NextResponse.json({ message: "No PULA IDs found" });
  }

  // loop through all pula_IDs (returned from prev GET request)
  for (const { pula_id } of pula_IDs) {

    // building where to later query at limitations_public endpoint
    const where = {
      pula_id: pula_id,
      product_registration_number: prod_reg_num
    };

    // building select to later query at limitations_public endpoint 
    // more categories can be shown if needed 
    const select = {
      product_registration_number: 1,
      pula_id: 1,
      limitation: 1,
      last_update: 1,
      code: 1,
      umf: {
        use: 1,
        method: 1,
        form: 1,
        pula_id: 1
      }
    };


    // building main url to fetch limitations from limitations_public endpoint
    const base_url = new URL("https://blt.epa.gov/blt/api/limitations_public");
    base_url.searchParams.append("where", JSON.stringify(where));
    base_url.searchParams.append("select", JSON.stringify(select));

    // calling fetch to make http req to base url w/error checking
    const res = await fetch(base_url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch limitations" },
        { status: res.status }
      );
    }

    // holding parsed js obj (prod_reg_num, pula_id, limitation string)
    const limitations = await res.json();

    // if limitations array for specific pula_id is not empty, a match has been found
    // returning limitation matching to specific county, date, and prod_reg_num 
    if (Array.isArray(limitations) && limitations.length > 0) {
      return NextResponse.json(limitations);
    }
  }
  return NextResponse.json({ message: "No limitations found" });
}

