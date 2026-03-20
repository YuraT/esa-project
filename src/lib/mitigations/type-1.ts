import { z } from "zod";

export enum CountyVulnOption {
  VERY_LOW = 6,
  LOW = 3,
  MEDIUM = 2,
  HIGH = 0,
}

export const countyVulnDescriptions: Record<CountyVulnOption, string> = {
  [CountyVulnOption.VERY_LOW]: "Very Low",
  [CountyVulnOption.LOW]: "Low",
  [CountyVulnOption.MEDIUM]: "Medium",
  [CountyVulnOption.HIGH]: "High",
};

export enum FieldSlopeOption {
  LEQ_3 = 3,
  GT_3 = 0,
}

export const fieldSlopeDescriptions: Record<FieldSlopeOption, string> = {
  [FieldSlopeOption.LEQ_3]: "Field Slope \u2264 3%",
  [FieldSlopeOption.GT_3]: "Field Slope > 3%",
};

export enum SoilPointsOption {
  HYDRO_A = 3,
  HYDRO_B = 2,
  OTHER = 0,
}

export const soilPointsDescriptions: Record<SoilPointsOption, string> = {
  [SoilPointsOption.HYDRO_A]: "Hydrologic Group A",
  [SoilPointsOption.HYDRO_B]: "Hydrologic Group B",
  [SoilPointsOption.OTHER]: "Other / Not Sandy",
};

export enum TrackingOption {
  YES = 1,
  NO = 0,
}

export const trackingDescriptions: Record<TrackingOption, string> = {
  [TrackingOption.YES]: "Documented at the farm level",
  [TrackingOption.NO]: "No Mitigation Tracking",
};

export enum TechSpecialistOption {
  YES = 1,
  NO = 0,
}

export const techSpecialistDescriptions: Record<TechSpecialistOption, string> = {
  [TechSpecialistOption.YES]: "Working with and following recommendations from a technical specialist",
  [TechSpecialistOption.NO]: "No Technical Specialist",
};

export enum ConservationProgramOption {
  QUALIFIED = 9,
  NON_QUALIFIED = 2,
  NONE = 0,
}

export const conservationProgramDescriptions: Record<ConservationProgramOption, string> = {
  [ConservationProgramOption.QUALIFIED]: "Qualified Conservation Program",
  [ConservationProgramOption.NON_QUALIFIED]: "Conservation Program (Non-qualified)",
  [ConservationProgramOption.NONE]: "No Conservation Program",
};

export const step7Descriptions = [
  "Annual Application Rate Reduction",
  "Anionic Polyacrylamide (PAM)",
  "Proportion of Field Treated",
  "Soil Incorporation"
];

export const step8Descriptions = [
  "Conservation Tillage",
  "Reservoir Tillage",
  "Contour Farming",
  "In-field Vegetative Strips",
  "Terrace Farming",
  "Cover Crop",
  "Irrigation Water Management",
  "Mulching",
  "Erosion Barriers"
];

export const step9Descriptions = [
  "Grassed Waterway",
  "Vegetative Filter Strips (VFS) or Field Border",
  "Vegetated Ditch",
  "Riparian Area",
  "Constructed and Natural Wetlands",
  "Terrestrial Habitat Landscape Improvement",
  "Filtering Devices"
];

export const step10Descriptions = [
  "Water Retention Systems",
  "Subsurface Drainages and Tile Drainage",
  "Mitigation Measures From Multiple Categories"
];

const arrayCsvCodec = (separator: string, len: number) =>
  z.codec(
    z.string(),
    z.array(z.number()),
    {
      decode: (str) => {
        const arr = str.split(separator).map(n => Number(n) || 0);
        while (arr.length < len) arr.push(0);
        return arr.slice(0, len);
      },
      encode: (arr) => arr.join(separator),
    }
  );

export const type1MitigationInnerSchema = z.object({
  countyVuln: z.enum(CountyVulnOption as any).default(CountyVulnOption.HIGH),
  fieldSlope: z.enum(FieldSlopeOption as any).default(FieldSlopeOption.GT_3),
  soilPoints: z.enum(SoilPointsOption as any).default(SoilPointsOption.OTHER),
  tracking: z.enum(TrackingOption as any).default(TrackingOption.NO),
  techSpecialist: z.enum(TechSpecialistOption as any).default(TechSpecialistOption.NO),
  conservationProgram: z.enum(ConservationProgramOption as any).default(ConservationProgramOption.NONE),
  appParams: arrayCsvCodec("-", 4).default([0, 0, 0, 0]),
  inField: arrayCsvCodec("-", 9).default([0, 0, 0, 0, 0, 0, 0, 0, 0]),
  fieldAdjacent: arrayCsvCodec("-", 7).default([0, 0, 0, 0, 0, 0, 0]),
  systems: arrayCsvCodec("-", 3).default([0, 0, 0]),
});

export const type1MitigationSchema = z.codec(
  z.string(),
  type1MitigationInnerSchema,
  {
    decode: (str) => {
      const parts = str ? str.split(",") : [];
      const parseEnum = (val: string, fallback: number) => {
        const num = Number(val);
        return Number.isNaN(num) ? fallback : num;
      };

      if (parts.length >= 10) {
        return {
          countyVuln: parseEnum(parts[0], CountyVulnOption.HIGH),
          fieldSlope: parseEnum(parts[1], FieldSlopeOption.GT_3),
          soilPoints: parseEnum(parts[2], SoilPointsOption.OTHER),
          tracking: parseEnum(parts[3], TrackingOption.NO),
          techSpecialist: parseEnum(parts[4], TechSpecialistOption.NO),
          conservationProgram: parseEnum(parts[5], ConservationProgramOption.NONE),
          appParams: parts[6] || undefined,
          inField: parts[7] || undefined,
          fieldAdjacent: parts[8] || undefined,
          systems: parts[9] || undefined,
        };
      }
      return {};
    },
    encode: (obj) => {
      return [
        obj.countyVuln,
        obj.fieldSlope,
        obj.soilPoints,
        obj.tracking,
        obj.techSpecialist,
        obj.conservationProgram,
        obj.appParams,
        obj.inField,
        obj.fieldAdjacent,
        obj.systems,
      ].join(",");
    }
  }
);

export type Type1MitigationOptions = z.infer<typeof type1MitigationSchema>;

export function encodeType1Mitigations(options: Type1MitigationOptions): string {
  return type1MitigationSchema.encode(options);
}

export function decodeType1Mitigations(param: string | null): Type1MitigationOptions {
  if (!param) {
    return type1MitigationSchema.decode("");
  }
  try {
    return type1MitigationSchema.decode(param);
  } catch (e) {
    console.error("Failed to decode type-1 mitigations:", e);
    return type1MitigationSchema.decode("");
  }
}
