
import { NextResponse } from "next/server";


export async function GET() {
 const base_url = "https://blt.epa.gov/blt/api/pulas_public";


 try {
   const res = await fetch(base_url);
   if (!res.ok) {
     return NextResponse.json(
       { error: "Failed to fetch data from pulas_public" },
       { status: res.status }
     );
   }


   const data = await res.json();
   return NextResponse.json(data);
 } catch (error) {
   return NextResponse.json(
     { error: "Network or parsing error", details: String(error) },
     { status: 500 }
   );
 }
}






