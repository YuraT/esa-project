import { $typst } from "@myriaddreamin/typst.ts";

export async function GET(req: { url: string | URL }) {
  const url = new URL(req.url);
  const pdfBytes = await generatePdf(url.searchParams);

  return new Response(pdfBytes, {
    status: 200,
    headers: { "Content-Type": "application/pdf" },
  });
}

async function generatePdf(searchParams: URLSearchParams): Promise<Uint8Array> {
  const date = new Date().toLocaleDateString();
  const applicationMonth = searchParams.get("month") || "N/A";
  const product = searchParams.get("product") || "N/A";
  const county = searchParams.get("county") || "N/A";
  const regions = searchParams.get("regions") || "N/A";

  const typstSource = `
#align(center)[
  = Endangered Species Protection Report
]

*Print Date:* ${date} \\
*Application Month:* ${applicationMonth} \\
*Product:* ${product} \\
*County:* ${county} \\
*Region:* ${regions} \\

`;

  const pdf = await $typst.pdf({ mainContent: typstSource });

  if (!pdf) throw new Error("PDF generation failed");

  return pdf;
}
