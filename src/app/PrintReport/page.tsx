'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';
import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

const PrintReportContent: React.FC = () => {
  const searchParams = useSearchParams();

  const month = searchParams.get('month') ?? '';
  const product = searchParams.get('product') ?? '';
  const county = searchParams.get('county') ?? '';
  const [limitations, setLimitations] = useState<LimitationItem[]>([]);

  const [reportData, setReportData] = useState({
    month: '',
    product: '',
    county: ''
  });

  useEffect(() => {
    setReportData({ month, product, county });

    const stored = localStorage.getItem('esa_limitations');
    if (stored) {
      const parsed = JSON.parse(stored);
      setLimitations(Array.isArray(parsed) ? parsed : [parsed]);
    }
  }, [month, product, county]);

  const wrapText = (
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
): string[] => {
  const tokens = text.split(/\s+/); // split by space
  const lines: string[] = [];
  let currentLine = '';

  for (const token of tokens) {
    const testLine = currentLine ? `${currentLine} ${token}` : token;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      // if single token too long (e.g. Dicamba-Tolerant), try breaking on dash safely
      if (font.widthOfTextAtSize(token, fontSize) > maxWidth && token.includes('-')) {
        const subtokens = token.split('-');
        const hyphenJoined = subtokens.map((sub, i) => (i < subtokens.length - 1 ? sub + '-' : sub));

        for (const part of hyphenJoined) {
          if (!currentLine) {
            currentLine = part;
          } else if (font.widthOfTextAtSize(`${currentLine} ${part}`, fontSize) <= maxWidth) {
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

    page.drawRectangle({
      x: 0,
      y: 842 - 50,
      width,
      height: 50,
      color: rgb(81 / 255, 142 / 255, 171 / 255),
    });

    const title = 'Endangered Species Protection Report';
    const titleFontSize = 20;
    const textWidth = boldFont.widthOfTextAtSize(title, titleFontSize);
    page.drawText(title, {
      x: (width - textWidth) / 2,
      y: 812,
      size: titleFontSize,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // Fetch and embed the EPA logo
    const logoUrl = '/epa-logo.png'; // Must be in the public folder
    const logoImageBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoImageBytes); // Or use embedJpg if it's a .jpg
    const logoDims = logoImage.scale(0.4); // Scale image to fit

    // Draw logo below the header title
    page.drawImage(logoImage, {
    x: (width - logoDims.width) / 2,
    y: 670, // Adjust as needed to position under title
    width: logoDims.width,
    height: logoDims.height,
    });


    const tableFontSize = 14;
    let y = 620;
    const rowGap = 24;

    const rows: [string, string][] = [
      ['Application Month', reportData.month],
      ['Product', reportData.product],
      ['County', reportData.county],
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

        const wrapLines: string[] =
          item.limitation.match(/.{1,90}(\s|$)/g) || [item.limitation];
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
            const headers = ['Use', 'Method', 'Form', 'Code', 'PULA ID', 'Last Update'];
            const values = [
              entry.use || '',
              entry.method || '',
              entry.form || '',
              item.code || '',
              String(entry.pula_id || ''),
              item.last_update ? new Date(item.last_update).toLocaleDateString() : '',
            ];

            const cellPadding = 6;
            const colWidths = [80, 80, 80, 60, 60, 100];
            const tableX = 40;
            const fontSize = 10;
            const lineHeight = fontSize + 2;

            // --- Draw Header Row ---
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

            // --- Draw Data Row with Wrapping ---
            colX = tableX;

            const wrappedLinesPerCol = values.map((val, j) => {
              const maxWidth = colWidths[j] - 2 * cellPadding;
              return wrapText(val, maxWidth, regularFont, fontSize);
            });

            const maxLines = Math.max(...wrappedLinesPerCol.map((lines) => lines.length));
            rowHeight = maxLines * lineHeight + 2 * cellPadding;

            values.forEach((val, j) => {
              const x = tableX + colWidths.slice(0, j).reduce((a, b) => a + b, 0);
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

    // --- Applicable Points Table in PDF ---
    if (mitigationMenuRows.length > 0) {
      y -= 20;
      page.drawText('Applicable Points', {
        x: 40,
        y,
        size: tableFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      y -= rowGap;
      // Table header
      const headers = ['Mitigation Relief', 'Characteristic', 'Points'];
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
      const totalPoints = mitigationMenuRows.reduce((sum, row) => sum + row.points, 0);
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
      page.drawText('Total Points', {
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

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'esa-printable-report.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const mitigationsParam = searchParams.get('mitigations');
  let mitigationMenuRows: {relief: string; characteristic: string; points: number}[] = [];
  if (mitigationsParam) {
    const mitigations = mitigationsParam.split(',').map(Number);
    if (mitigations.length === 6) {
      // Step 1: County Based
      const countyPoints = mitigations[0];
      const vulnMap: Record<number, string> = {
        6: 'very low',
        3: 'low',
        2: 'medium',
        0: 'high',
      };
      const vuln = vulnMap[countyPoints] ?? '';
      if (countyPoints > 0) {
        mitigationMenuRows.push({
          relief: 'County Based',
          characteristic: `Pesticide runoff vulnerability - ${vuln}`,
          points: countyPoints,
        });
      }
      // Step 2: Field Slope
      if (mitigations[1] > 0) {
        mitigationMenuRows.push({
          relief: 'Field Slope',
          characteristic: 'Field Slope <= 3%',
          points: mitigations[1],
        });
      }
      // Step 3: Predominantly sandy soils
      const soilPoints = mitigations[2];
      let hydro = soilPoints === 2 ? 'B' : soilPoints === 3 ? 'A' : '';
      if (soilPoints > 0) {
        mitigationMenuRows.push({
          relief: 'Predominantly sandy soils',
          characteristic: `Hydrologic group - ${hydro}`,
          points: soilPoints,
        });
      }
      // Step 4: Mitigation Tracking
      if (mitigations[3] > 0) {
        mitigationMenuRows.push({
          relief: 'Mitigation Tracking',
          characteristic: 'Documented at the farm level',
          points: mitigations[3],
        });
      }
      // Step 5: Technical Specialist (not applicable if conservation program is selected)
      if (mitigations[4] > 0 && mitigations[5] === 0) {
        mitigationMenuRows.push({
          relief: 'Technical Specialist',
          characteristic: 'Working with and following recommendations from a technical specialist',
          points: mitigations[4],
        });
      }
      // Step 6: Conservation Program (qualified or non-qualified)
      const conservationPoints: Record<number, string> = {
        2: 'Conservation Program (Non-qualified)',
        9: 'Qualified Conservation Program',
      }
      if (mitigations[5] > 0) {
        mitigationMenuRows.push({
          relief: conservationPoints[mitigations[5]] ?? 'Conservation Program',
          characteristic: '',
          points: mitigations[5],
        });
      }
    }
  }

  return (
  <div className="bg-white min-h-screen flex flex-col">
    <Header />
    <div className="flex justify-center mt-2">
      <button
        onClick={generatePDF}
        className="bg-lime-200 text-blue-900 font-bold text-2xl px-15 py-4 rounded-full shadow-md hover:bg-lime-300 transition"
      >
        Download Printable Report
      </button>
    </div>

    {/* --- Preview Box --- */}
    <div className="mb-35 mt-15 max-w-3xl mx-auto mt-8 p-4 border rounded-3xl shadow bg-gray-100 overflow-y-auto max-h-[40vh]">
      <h2 className="text-xl mb-4 text-center text-black">
        Endangered Species Protection Report Preview
      </h2>
      <div className="mb-4 space-y-1 text-gray-800">
        <p><span className="font-semibold">Application Month:</span> {reportData.month}</p>
        <p><span className="font-semibold">Product:</span> {reportData.product}</p>
        <p><span className="font-semibold">County:</span> {reportData.county}</p>
      </div>
      {limitations.map((item, idx) => (
        <div key={idx} className="mb-6 text-gray-800">
          <p className="font-semibold mb-2">Limitation:</p>
          <p className="italic text-gray-700">{item.limitation}</p>
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
                      {item.last_update ? new Date(item.last_update).toLocaleDateString() : ''}
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
                  <td className="p-2 border" colSpan={2}>Total Points</td>
                  <td className="p-2 border">{mitigationMenuRows.reduce((sum, row) => sum + row.points, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    <Footer></Footer>
  </div>
);
};

const PrintReport: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <PrintReportContent />
    </Suspense>
  );
};

export default PrintReport;
