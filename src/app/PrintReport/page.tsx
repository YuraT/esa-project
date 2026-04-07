"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { PDFDocument, rgb, StandardFonts, PDFFont } from "pdf-lib";
import Header from "../components/Header";
import Footer from "../components/Footer";
import dynamic from "next/dynamic";
const PulaMap = dynamic(() => import("../components/PulaMap"), { ssr: false });

type UMFEntry = {
  use?: string;
  method?: string;
  form?: string;
  pula_id?: number;
};

type LimitationItem = {
  limitation: string;
  umf: UMFEntry[];
  code?: string;
  last_update?: string;
};

const GENERAL_USE_VALUES = new Set([
  "All Agricultural uses",
  "All Agricultural Uses",
  "All non-agricultural uses",
  "All Other Uses",
  "Any Use",
]);

function getProdRegNum(product: string) {
  return product.match(/^\s*[\d\-]+/)?.[0] ?? "";
}

async function fetchLimitations(
  regions: string,
  product: string,
  date: string,
) {
  const prodRegNum = getProdRegNum(product);

  const res = await fetch(
    `/api/pulas-by-geometry?geometry=${encodeURIComponent(
      regions,
    )}&prod_reg_num=${encodeURIComponent(
      prodRegNum,
    )}&date=${encodeURIComponent(date)}&returnGeometry=true`,
    {
      cache: "force-cache",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch limitations: ${res.status} ${text}`);
  }

  return res.json();
}

const PrintReportContent: React.FC = () => {
  const searchParams = useSearchParams();

  const month = searchParams.get("month") ?? "";
  const product = searchParams.get("product") ?? "";
  const date = searchParams.get("date") ?? "";
  const crop = searchParams.get("crop") ?? "";
  const county = searchParams.get("county") ?? "";
  const regions = searchParams.get("regions");
  const [limitations, setLimitations] = useState<LimitationItem[]>([]);
  const [pulaData, setPulaData] = useState<any[]>([]);

  const [reportData, setReportData] = useState({
    month: "",
    product: "",
    county: "",
    regions: [] as GeoJSON.Feature<GeoJSON.Polygon>[],
  });

  useEffect(() => {
    async function load() {
      const parsedRegions = regions ? JSON.parse(regions) : [];
      setReportData({ month, product, county, regions: parsedRegions });

      if (!regions || !product || !date) {
        setLimitations([]);
        setPulaData([]);
        return;
      }

      try {
        const parsed = await fetchLimitations(regions, product, date);
        console.log("fetched limitations on print page:", parsed);

        let nextLimitations = parsed.limitations ?? [];

        if (crop) {
          nextLimitations = nextLimitations
            .map((limitation: any) => {
              const filteredUMF = (limitation.umf || []).filter((entry: any) => {
                const use = entry?.use?.trim();
                return use && (GENERAL_USE_VALUES.has(use) || use === crop);
              });

              return {
                ...limitation,
                umf: filteredUMF,
              };
            })
            .filter((limitation: any) => limitation.umf.length > 0);
        }

        setLimitations(nextLimitations);
        setPulaData(parsed.pulas || []);
      } catch (error) {
        console.error("Error loading report data:", error);
        setLimitations([]);
        setPulaData([]);
      }
    }

    load();
  }, [month, date, product, county, regions, crop]);

  const mitigationsParam = searchParams.get("mitigations");
  let mitigationMenuRows: {
    relief: string;
    characteristic: string;
    points: number;
  }[] = [];
  if (mitigationsParam) {
    const mitigations = mitigationsParam.split(",").map(Number);
    if (mitigations.length > 0) {
      // Step 1: County Based
      const countyPoints = mitigations[0];
      const vulnMap: Record<number, string> = {
        6: "very low",
        3: "low",
        2: "medium",
        0: "high",
      };
      const vuln = vulnMap[countyPoints] ?? "";
      if (countyPoints > 0) {
        mitigationMenuRows.push({
          relief: "County Based",
          characteristic: `Pesticide runoff vulnerability - ${vuln}`,
          points: countyPoints,
        });
      }
      // Step 2: Field Slope
      if (mitigations[1] > 0) {
        mitigationMenuRows.push({
          relief: "Field Slope",
          characteristic: "Field Slope <= 3%",
          points: mitigations[1],
        });
      }
      // Step 3: Predominantly sandy soils
      const soilPoints = mitigations[2];
      let hydro = soilPoints === 2 ? "B" : soilPoints === 3 ? "A" : "";
      if (soilPoints > 0) {
        mitigationMenuRows.push({
          relief: "Predominantly sandy soils",
          characteristic: `Hydrologic group - ${hydro}`,
          points: soilPoints,
        });
      }
      // Step 4: Mitigation Tracking
      if (mitigations[3] > 0) {
        mitigationMenuRows.push({
          relief: "Mitigation Tracking",
          characteristic: "Documented at the farm level",
          points: mitigations[3],
        });
      }
      // Step 5: Technical Specialist (not applicable if conservation program is selected)
      if (mitigations[4] > 0 && mitigations[5] === 0) {
        mitigationMenuRows.push({
          relief: "Technical Specialist",
          characteristic:
            "Working with and following recommendations from a technical specialist",
          points: mitigations[4],
        });
      }
      // Step 6: Conservation Program (qualified or non-qualified)
      const conservationPoints: Record<number, string> = {
        2: "Conservation Program (Non-qualified)",
        9: "Qualified Conservation Program",
      };
      if (mitigations[5] > 0) {
        mitigationMenuRows.push({
          relief: conservationPoints[mitigations[5]] ?? "Conservation Program",
          characteristic: "",
          points: mitigations[5],
        });
      }

      // Step 7: Application Parameters
      if (mitigations[6] > 0) {
        mitigationMenuRows.push({
          relief: "Application Parameters",
          characteristic: "",
          points: mitigations[6],
        });
      }
      // Step 8: In-field Mitigation Measures
      if (mitigations[7] > 0) {
        mitigationMenuRows.push({
          relief: "In-field Mitigation Measures",
          characteristic: "",
          points: mitigations[7],
        });
      }
      // Step 9: Field-adjacent Mitigation Measures
      if (mitigations[8] > 0) {
        mitigationMenuRows.push({
          relief: "Field-adjacent Mitigation Measures",
          characteristic: "",
          points: mitigations[8],
        });
      }
      // Step 10: Systems That Capture Runoff and Discharge
      if (mitigations[9] > 0) {
        mitigationMenuRows.push({
          relief: "Systems That Capture Runoff and Discharge",
          characteristic: "",
          points: mitigations[9],
        });
      }
    }
  }

  //const monthToDate = (m: string) => {
  // expects "March 2026"
  //  const d = new Date(`${m} 1`);
  //  return Number.isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  //};

  // const date = month ? monthToDate(month) : "";

  const reportUrlParams = new URLSearchParams({
    month: month ?? "",
    date: date ?? "",
    product: product ?? "",
    county: county ?? "",
    regions: regions ?? "",
  });
  const reportUrl = `/api/report?${reportUrlParams.toString()}`;

  const wrapText = (
    text: string,
    maxWidth: number,
    font: PDFFont,
    fontSize: number,
  ): string[] => {
    const tokens = text.split(/\s+/); // split by space
    const lines: string[] = [];
    let currentLine = "";

    for (const token of tokens) {
      const testLine = currentLine ? `${currentLine} ${token}` : token;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        // if single token too long (e.g. Dicamba-Tolerant), try breaking on dash safely
        if (
          font.widthOfTextAtSize(token, fontSize) > maxWidth &&
          token.includes("-")
        ) {
          const subtokens = token.split("-");
          const hyphenJoined = subtokens.map((sub, i) =>
            i < subtokens.length - 1 ? sub + "-" : sub,
          );

          for (const part of hyphenJoined) {
            if (!currentLine) {
              currentLine = part;
            } else if (
              font.widthOfTextAtSize(`${currentLine} ${part}`, fontSize) <=
              maxWidth
            ) {
              currentLine += ` ${part}`;
            } else {
              lines.push(currentLine);
              currentLine = part;
            }
          }
        } else {
          currentLine = token;
        }
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]);
    const { width } = page.getSize();

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get current date for printing
    const printDate = new Date().toLocaleDateString();

    page.drawRectangle({
      x: 0,
      y: 842 - 50,
      width,
      height: 50,
      color: rgb(81 / 255, 142 / 255, 171 / 255),
    });

    const title = "Endangered Species Protection Report";
    const titleFontSize = 20;
    const textWidth = boldFont.widthOfTextAtSize(title, titleFontSize);
    page.drawText(title, {
      x: (width - textWidth) / 2,
      y: 812,
      size: titleFontSize,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    const tableFontSize = 14;
    let y = 750;
    const rowGap = 24;

    const rows: [string, string][] = [
      ["Print Date", printDate],
      ["Application Month", reportData.month],
      ["Product", reportData.product],
      ["County", reportData.county],
    ];

    rows.forEach(([label, value]) => {
      page.drawText(`${label}:`, {
        x: 40,
        y,
        size: tableFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(value, {
        x: 200,
        y,
        size: tableFontSize,
        font: regularFont,
        color: rgb(0, 0, 0),
      });
      y -= rowGap;
    });

    //disclaimer
    y -= 20;
    page.drawText(
      "Disclaimer: These are recommendations, not sanctioned or approved",
      {
        x: 40,
        y,
        size: 12,
        font: boldFont,
        color: rgb(0.5, 0.5, 0.5),
      },
    );
    y -= 20;

    if (limitations.length > 0) {
      y -= 10;

      for (let i = 0; i < limitations.length; i++) {
        const item = limitations[i];

        page.drawText(`Limitation:`, {
          x: 40,
          y,
          size: tableFontSize,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        y -= rowGap;

        const wrapLines: string[] = item.limitation.match(/.{1,90}(\s|$)/g) || [
          item.limitation,
        ];
        wrapLines.forEach((line) => {
          page.drawText(line.trim(), {
            x: 40,
            y,
            size: 12,
            font: regularFont,
            color: rgb(0.2, 0.2, 0.2),
          });
          y -= 16;
        });

        y -= 10;

        if (Array.isArray(item.umf)) {
          item.umf.forEach((entry: UMFEntry) => {
            const headers = [
              "Use",
              "Method",
              "Form",
              "Code",
              "PULA ID",
              "Last Update",
            ];
            const values = [
              entry.use || "",
              entry.method || "",
              entry.form || "",
              item.code || "",
              String(entry.pula_id || ""),
              item.last_update
                ? new Date(item.last_update).toLocaleDateString()
                : "",
            ];

            const cellPadding = 6;
            const colWidths = [80, 80, 80, 60, 60, 100];
            const tableX = 40;
            const fontSize = 10;
            const lineHeight = fontSize + 2;

            //Draw Header Row
            let colX = tableX;
            let rowHeight = 30;
            headers.forEach((header, j) => {
              page.drawRectangle({
                x: colX,
                y: y - rowHeight,
                width: colWidths[j],
                height: rowHeight,
                borderWidth: 1,
                color: rgb(1, 1, 1),
                borderColor: rgb(0, 0, 0),
              });

              page.drawText(header, {
                x: colX + cellPadding,
                y: y - rowHeight + 10,
                size: fontSize,
                font: boldFont,
                color: rgb(0, 0, 0),
              });

              colX += colWidths[j];
            });
            y -= rowHeight;

            //Draw Data Row with Wrapping
            colX = tableX;

            const wrappedLinesPerCol = values.map((val, j) => {
              const maxWidth = colWidths[j] - 2 * cellPadding;
              return wrapText(val, maxWidth, regularFont, fontSize);
            });

            const maxLines = Math.max(
              ...wrappedLinesPerCol.map((lines) => lines.length),
            );
            rowHeight = maxLines * lineHeight + 2 * cellPadding;

            values.forEach((val, j) => {
              const x =
                tableX + colWidths.slice(0, j).reduce((a, b) => a + b, 0);
              const lines = wrappedLinesPerCol[j];

              page.drawRectangle({
                x,
                y: y - rowHeight,
                width: colWidths[j],
                height: rowHeight,
                borderWidth: 1,
                color: rgb(0.95, 0.95, 0.95),
                borderColor: rgb(0, 0, 0),
              });

              lines.forEach((line, i) => {
                page.drawText(line, {
                  x: x + cellPadding,
                  y: y - cellPadding - lineHeight * (i + 1),
                  size: fontSize,
                  font: regularFont,
                  color: rgb(0, 0, 0),
                });
              });
            });

            y -= rowHeight + 10;

            if (y < 100) {
              page = pdfDoc.addPage([595, 842]);
              y = 800;
            }
          });
        }

        y -= 10;

        if (y < 100) {
          page = pdfDoc.addPage([595, 842]);
          y = 800;
        }
      }
    }

    //Applicable Points Table in PDF
    if (mitigationMenuRows.length > 0) {
      y -= 20;
      page.drawText("Applicable Points", {
        x: 40,
        y,
        size: tableFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      y -= rowGap;
      // Table header
      const headers = ["Mitigation Relief", "Characteristic", "Points"];
      const colWidths = [160, 260, 60];
      let colX = 40;
      headers.forEach((header, j) => {
        page.drawRectangle({
          x: colX,
          y: y - 30,
          width: colWidths[j],
          height: 30,
          borderWidth: 1,
          color: rgb(0.95, 0.95, 0.95),
          borderColor: rgb(0, 0, 0),
        });
        page.drawText(header, {
          x: colX + 8,
          y: y - 12,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        colX += colWidths[j];
      });
      y -= 30;
      // Table rows
      mitigationMenuRows.forEach((row) => {
        colX = 40;
        const values = [row.relief, row.characteristic, String(row.points)];
        values.forEach((val, j) => {
          page.drawRectangle({
            x: colX,
            y: y - 24,
            width: colWidths[j],
            height: 24,
            borderWidth: 1,
            color: rgb(1, 1, 1),
            borderColor: rgb(0, 0, 0),
          });
          page.drawText(val, {
            x: colX + 8,
            y: y - 10,
            size: 12,
            font: regularFont,
            color: rgb(0, 0, 0),
          });
          colX += colWidths[j];
        });
        y -= 24;
      });
      // Total row
      colX = 40;
      const totalPoints = mitigationMenuRows.reduce(
        (sum, row) => sum + row.points,
        0,
      );
      page.drawRectangle({
        x: colX,
        y: y - 24,
        width: colWidths[0] + colWidths[1],
        height: 24,
        borderWidth: 1,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
      });
      page.drawRectangle({
        x: colX + colWidths[0] + colWidths[1],
        y: y - 24,
        width: colWidths[2],
        height: 24,
        borderWidth: 1,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
      });
      page.drawText("Total Points", {
        x: colX + 8,
        y: y - 10,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(String(totalPoints), {
        x: colX + colWidths[0] + colWidths[1] + 8,
        y: y - 10,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      y -= 24;
    }

    // Add PULA map section if data exists
    if (pulaData.length > 0) {
      y -= 30;
      page.drawText("Applicable PULAs in Selected Region", {
        x: 40,
        y,
        size: tableFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      y -= rowGap;

      page.drawText(`Found ${pulaData.length} PULA(s) in selected region:`, {
        x: 40,
        y,
        size: 12,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= 12;

      page.drawText("(See interactive map in web version for visual display)", {
        x: 40,
        y,
        size: 10,
        font: regularFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 16;

      // List PULA details
      pulaData.forEach((pula, index) => {
        const attrs = pula.attributes;
        page.drawText(
          `• PULA ID: ${attrs.pula_id || "N/A"} - ${attrs.event_name || "Unknown Event"}`,
          {
            x: 50,
            y,
            size: 10,
            font: regularFont,
            color: rgb(0, 0, 0),
          },
        );
        y -= 14;

        if (attrs.effective_date) {
          page.drawText(
            `  Effective: ${new Date(attrs.effective_date).toLocaleDateString()}`,
            {
              x: 60,
              y,
              size: 9,
              font: regularFont,
              color: rgb(0.3, 0.3, 0.3),
            },
          );
          y -= 12;
        }

        if (y < 100) {
          page = pdfDoc.addPage([595, 842]);
          y = 800;
        }
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob(
      [pdfBytes instanceof Uint8Array ? pdfBytes.slice().buffer : pdfBytes],
      { type: "application/pdf" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "esa-printable-report.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-content-gutter bg-white min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <div className="flex justify-center mt-2 px-4">
        <button
          onClick={generatePDF}
          className="bg-lime-200 text-blue-900 font-bold text-base sm:text-2xl px-6 sm:px-15 py-3 sm:py-4 rounded-full shadow-md hover:bg-lime-300 transition text-center max-w-full"
        >
          Download Printable Report
        </button>
      </div>

      {/* --- Preview Box --- */}
      <div className="mb-15 mt-8 max-w-4xl w-full mx-auto px-4 sm:px-6 p-4 border rounded-3xl shadow bg-gray-100 overflow-y-auto max-h-[80vh] min-w-0">
        <h2 className="text-xl mb-4 text-center text-black">
          Endangered Species Protection Report Preview
        </h2>
        <div className="mb-4 space-y-1 text-gray-800">
          <p>
            <span className="font-semibold">Print Date:</span>{" "}
            {new Date().toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Application Month:</span>{" "}
            {reportData.month}
          </p>
          <p>
            <span className="font-semibold">Product:</span> {reportData.product}
          </p>
          <p>
            <span className="font-semibold">County:</span> {reportData.county}
          </p>
        </div>
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800 font-semibold">
            Disclaimer: These are recommendations, not sanctioned or approved
          </p>
        </div>
        {limitations.map((item, idx) => (
          <div key={idx} className="mb-6 text-gray-800">
            <p className="font-semibold mb-2">Limitation:</p>
            <p className="italic text-gray-700" dangerouslySetInnerHTML={{ __html: item.limitation }}></p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border border-gray-300">
                <thead className="bg-gray-100 text-gray-900">
                  <tr>
                    <th className="p-2 border">Use</th>
                    <th className="p-2 border">Method</th>
                    <th className="p-2 border">Form</th>
                    <th className="p-2 border">Code</th>
                    <th className="p-2 border">PULA ID</th>
                    <th className="p-2 border">Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {item.umf.map((entry, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 border">{entry.use}</td>
                      <td className="p-2 border">{entry.method}</td>
                      <td className="p-2 border">{entry.form}</td>
                      <td className="p-2 border">{item.code}</td>
                      <td className="p-2 border">{entry.pula_id}</td>
                      <td className="p-2 border">
                        {item.last_update
                          ? new Date(item.last_update).toLocaleDateString()
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {/* Applicable Points Section */}
        {mitigationMenuRows.length > 0 && (
          <div className="mb-6 text-gray-800">
            <h3 className="font-semibold mb-2 text-lg">Applicable Points</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border border-gray-300">
                <thead className="bg-gray-100 text-gray-900">
                  <tr>
                    <th className="p-2 border">Mitigation Relief</th>
                    <th className="p-2 border">Characteristic</th>
                    <th className="p-2 border">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {mitigationMenuRows.map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 border">{row.relief}</td>
                      <td className="p-2 border">{row.characteristic}</td>
                      <td className="p-2 border">{row.points}</td>
                    </tr>
                  ))}
                  <tr className="border-t font-bold bg-gray-200">
                    <td className="p-2 border" colSpan={2}>
                      Total Points
                    </td>
                    <td className="p-2 border">
                      {mitigationMenuRows.reduce(
                        (sum, row) => sum + row.points,
                        0,
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PULA Map Section */}
        {reportData.regions.length > 0 ? (
          <div className="mb-6 text-gray-800">
            <h3 className="font-semibold mb-2 text-lg">
              Applicable PULAs in Selected Regions
            </h3>
            <div>
              <p className="mb-3">
                {pulaData.length > 0
                  ? `Found ${pulaData.length} PULA(s) in selected region:`
                  : "No PULAs found in the selected regions."}
              </p>
              <div className="space-y-2">
                {pulaData.map((pula, index) => {
                  const attrs = pula.attributes;
                  return (
                    <div
                      key={index}
                      className="p-3 bg-red-50 border border-red-200 rounded"
                    >
                      <div className="font-semibold text-red-800">
                        PULA ID: {attrs.pula_id || "N/A"} -{" "}
                        {attrs.event_name || "Unknown Event"}
                      </div>
                      {attrs.effective_date && (
                        <div className="text-sm text-gray-600">
                          Effective:{" "}
                          {new Date(attrs.effective_date).toLocaleDateString()}
                        </div>
                      )}
                      {attrs.published_time_stamp && (
                        <div className="text-sm text-gray-600">
                          Published:{" "}
                          {new Date(
                            attrs.published_time_stamp,
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-gray-800">
            <h3 className="font-semibold mb-2 text-lg">PULA Analysis</h3>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                No regions were selected during the search. To view applicable
                PULAs, please return to the map page and select geographic
                regions before running the search.
              </p>
            </div>
          </div>
        )}

        {/* Interactive PULA Map */}
        <div className="mb-6 text-gray-800">
          <h3 className="font-semibold mb-2 text-lg">Interactive Map</h3>
          <PulaMap
            pulaData={pulaData}
            regions={reportData.regions}
            className="w-full"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const PrintReport: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      }
    >
      <PrintReportContent />
    </Suspense>
  );
};

export default PrintReport;
