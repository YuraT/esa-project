export const runtime = "nodejs";

import { $typst } from "@myriaddreamin/typst.ts";
import { NextResponse } from "next/server";

type Mitigation = { name: string; points: number };

function safeText(input: unknown) {
  //avoid introducing invalid escapes.
  return String(input ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function fmtDateShort(d = new Date()) {
  return d.toLocaleDateString();
}

function typstString(value: unknown) {
  //safe Typst string literal
  //escapes backslash and double quotes, and normalizes newlines
  const s = String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
  return `"${s}"`;
}

function typstCell(value: unknown) {
  return `[#text(${typstString(value ?? "")})]`;
}

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function buildTypstReport(opts: {
  printDate: string;
  applicationMonth: string;
  product: string;
  county: string;
  regionsCount: number;
  disclaimer: string;
  pulas: any[];
  limitations: any[];
  mitigations: Mitigation[];
}) {
  const {
    printDate,
    applicationMonth,
    product,
    county,
    regionsCount,
    disclaimer,
    pulas,
    limitations,
    mitigations,
  } = opts;

  const pulasSection =
    pulas.length > 0
      ? pulas
          .map((p, i) => {
            const a = p?.attributes ?? {};
            //arcGIS fields: pula_id, pula_name, etc.
            const pulaId = a.pula_id ?? a.PULA_ID ?? "N/A";
            const pulaName =
              a.pula_name ?? a.PULA_NAME ?? a.name ?? a.NAME ?? "PULA";
            return `- #text(${typstString(`PULA ${i + 1}: ${pulaName} (ID: ${pulaId})`)})`;
          })
          .join("\n")
      : `#text(${typstString("No applicable PULAs found in selected regions.")})`;

  const limitationsSection =
    limitations.length > 0
      ? limitations
          .map((l, i) => {
            const code = l?.code ?? "N/A";
            const last = formatDate(l?.last_update ?? "");
            const limText = l?.limitation ?? "";

            const umfArr: any[] = Array.isArray(l?.umf) ? l.umf : [];

            const umfTable =
  umfArr.length > 0
    ? `
#set text(size: 9pt)

#table(
  columns: (2.1fr, 5.2fr, 2.7fr, 1.2fr, 1.2fr, 1.8fr),
  stroke: 0.5pt + rgb("AAAAAA"),
  inset: (x: 5pt, y: 4pt),
  fill: (x, y) => if y == 0 { rgb("F1F1F1") } else { white },
  align: left + horizon,

  [*Use*],
  [*Method*],
  [*Form*],
  [*Code*],
  [*PULA ID*],
  [*Last Update*],

  ${umfArr
    .slice(0, 20)
    .map((u) => {
      return `
  ${typstCell(u?.use ?? "")},
  ${typstCell(u?.method ?? "")},
  ${typstCell(u?.form ?? "")},
  ${typstCell(code)},
  ${typstCell(u?.pula_id ?? "")},
  ${typstCell(last)},
      `;
    })
    .join("\n")}
)

#set text(size: 12pt)
`
    : `#text(${typstString("No UMF details provided")})`;
            return `== Limitation ${i + 1}

*Code:* #text(${typstString(code)}) \\
*Last Updated:* #text(${typstString(last)}) \\

#text(${typstString(limText)})

${umfTable}
`;
          })
          .join("\n\n")
      : "";
  const mitigationTotal = mitigations.reduce((sum, m) => sum + (m?.points ?? 0), 0);

  const mitigationsSection =
    mitigations.length > 0
      ? `== Selected Mitigations
${mitigations
  .map((m) =>
    `- #text(${typstString(`${m.name}: ${m.points} point(s)`)})`
  )
  .join("\n")}

*Total mitigation points:* #text(${typstString(mitigationTotal)})
`
      : `_No mitigations were selected or provided._`;

  const body =
    limitations.length === 0
      ? `== Results
No pesticide use limitations were found for your selected regions, date, and product at this time.

Ensure compliance with the pesticide use instructions on your product label.
`
      : `== Applicable PULAs Found
${pulasSection}

== Limitation Details
${limitationsSection}

== Mitigations
${mitigationsSection}
`;

  return `
#set page(margin: (top: 1in, bottom: 1in, left: 1in, right: 1in))
#set text(font: "Times New Roman", size: 12pt)

#align(center)[
  = Endangered Species Protection Report
]

*Print Date:* ${safeText(printDate)} \\
*Application Month:* ${safeText(applicationMonth)} \\
*Product:* #text(${typstString(product)}) \\
*County:* ${safeText(county)} \\
*Regions selected:* ${safeText(regionsCount)} \\


#text(fill: rgb("666666"), size: 10pt, text(${typstString(disclaimer)}))

${body}
`;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const applicationMonth = url.searchParams.get("month") || "N/A";
    const product = url.searchParams.get("product") || "N/A";
    const county = url.searchParams.get("county") || "N/A";

    //pulas-by-geometry requires `date` and `regions`
    const date = url.searchParams.get("date") || "";
    const regionsParam = url.searchParams.get("regions") || "[]";

    //mitigations payload (JSON string)
    const mitigationsParam = url.searchParams.get("mitigations") || "[]";

    let regions: any[] = [];
    try {
      regions = JSON.parse(regionsParam);
    } catch {
      return NextResponse.json(
        { error: "Invalid regions parameter (must be JSON array)" },
        { status: 400 },
      );
    }

    const regionsCount = Array.isArray(regions) ? regions.length : 0;

    //extract product registration number from "19713-91 – NAME"
    const prodRegNum = product.match(/^\s*[\d\-]+/)?.[0] ?? "";

    if (!date || !prodRegNum || regionsCount === 0) {
      return NextResponse.json(
        {
          error:
            "Missing required params. Expected: date (YYYY-MM-DD), product (starting with reg #), and regions (non-empty JSON array).",
        },
        { status: 400 },
      );
    }

    let mitigations: Mitigation[] = [];
    try {
      const parsed = JSON.parse(mitigationsParam);
      if (Array.isArray(parsed)) mitigations = parsed;
    } catch {
      // ignore bad mitigations
      mitigations = [];
    }

    //call internal API (same host)
    const baseUrl = `${url.protocol}//${url.host}`;
    const pulasUrl =
      `${baseUrl}/api/pulas-by-geometry` +
      `?geometry=${encodeURIComponent(JSON.stringify(regions))}` +
      `&prod_reg_num=${encodeURIComponent(prodRegNum)}` +
      `&date=${encodeURIComponent(date)}` +
      `&returnGeometry=false`;

    const geoRes = await fetch(pulasUrl, { cache: "no-store" });

    if (!geoRes.ok) {
      const errText = await geoRes.text();
      return NextResponse.json(
        { error: "Failed to fetch geometry data", details: errText },
        { status: 500 },
      );
    }

    const geoData: { limitations: any[]; pulas: any[] } = await geoRes.json();

    const typstSource = buildTypstReport({
      printDate: fmtDateShort(),
      applicationMonth,
      product,
      county,
      regionsCount,
      disclaimer: "Disclaimer: These are recommendations, not sanctioned or approved.",
      pulas: Array.isArray(geoData?.pulas) ? geoData.pulas : [],
      limitations: Array.isArray(geoData?.limitations) ? geoData.limitations : [],
      mitigations,
    });

    try{
    const pdf = await $typst.pdf({ mainContent: typstSource });
    if (!pdf) throw new Error("PDF generation failed");

    const bytes = pdf instanceof Uint8Array ? pdf : new Uint8Array(pdf);
    const arrayBuffer = bytes.buffer as ArrayBuffer;

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ESA_Report.pdf"`,
      },
    });
  } catch (e) {
  console.error("TYPST SOURCE THAT FAILED:\n", typstSource);
  throw e;
  }
  

  } catch (e: any) {
    console.error("Error in /api/report:", e);
    return NextResponse.json(
      { error: "Unexpected error", details: String(e?.message ?? e) },
      { status: 500 },
    );
  }
}