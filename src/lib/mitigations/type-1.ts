import { z } from "zod";

export const type1MitigationSchema = z.object({
  countyVuln: z.number().default(0),
  fieldSlope: z.number().default(0),
  soilPoints: z.number().default(0),
  tracking: z.number().default(0),
  techSpecialist: z.number().default(0),
  conservationProgram: z.number().default(0),
  appParams: z.number().default(0),
  inField: z.number().default(0),
  fieldAdjacent: z.number().default(0),
  systems: z.number().default(0),
});

export type Type1MitigationOptions = z.infer<typeof type1MitigationSchema>;

// Keeps the URL param as small as possible: e.g. "2,0,4,0,0,0,0,0,0,0"
export function encodeType1Mitigations(options: Type1MitigationOptions): string {
  const parsed = type1MitigationSchema.parse(options);
  return [
    parsed.countyVuln,
    parsed.fieldSlope,
    parsed.soilPoints,
    parsed.tracking,
    parsed.techSpecialist,
    parsed.conservationProgram,
    parsed.appParams,
    parsed.inField,
    parsed.fieldAdjacent,
    parsed.systems,
  ].join(",");
}

export function decodeType1Mitigations(param: string | null): Type1MitigationOptions {
  if (!param) {
    return type1MitigationSchema.parse({});
  }

  try {
    const parts = param.split(",").map(p => {
      const num = Number(p.trim());
      return Number.isNaN(num) ? 0 : num;
    });

    if (parts.length >= 10) {
      return type1MitigationSchema.parse({
        countyVuln: parts[0],
        fieldSlope: parts[1],
        soilPoints: parts[2],
        tracking: parts[3],
        techSpecialist: parts[4],
        conservationProgram: parts[5],
        appParams: parts[6],
        inField: parts[7],
        fieldAdjacent: parts[8],
        systems: parts[9],
      });
    }

    // fallback if somehow there are fewer items
    const fallback: Partial<Type1MitigationOptions> = {};
    const keys = [
      "countyVuln", "fieldSlope", "soilPoints", "tracking", "techSpecialist",
      "conservationProgram", "appParams", "inField", "fieldAdjacent", "systems"
    ] as const;
    parts.forEach((p, i) => {
      if (i < keys.length) fallback[keys[i]] = p;
    });
    return type1MitigationSchema.parse(fallback);
  } catch (e) {
    console.error("Failed to decode type-1 mitigations:", e);
    return type1MitigationSchema.parse({});
  }
}
