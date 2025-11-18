"use client";

type ApplicationRateMethodProps = {
  pesticideType: string;
  setPesticideType: (v: string) => void;
  applicationRate: string;
  setApplicationRate: (v: string) => void;
  soilDepth: string;
  setSoilDepth: (v: string) => void;
};

export default function ApplicationRateMethod({
  pesticideType,
  setPesticideType,
  applicationRate,
  setApplicationRate,
  soilDepth,
  setSoilDepth,
}: ApplicationRateMethodProps) {
  return (
    <div className="mb-12 flex flex-col bg-[#f9f9f9] rounded-3xl w-[720px] max-w-full px-10 py-10 shadow-sm">
      <div className="flex items-start gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#275c9d]">
            Application Rate and Method
          </h2>
          <p className="mt-2 text-[#275c9d] text-base font-semibold">
            Fill in your pesticide details below  this helps us calculate the
            right mitigation requirements for your application.
          </p>
        </div>
      </div>

      {/* Pesticide Type */}
      <div className="mb-6">
        <label className="block text-[#275c9d] text-xl font-bold mb-2">
          Pesticide Type
        </label>
        <input
          type="text"
          placeholder="Type Pesticide Type..."
          value={pesticideType}
          onChange={(e) => setPesticideType(e.target.value)}
          className="w-full h-12 rounded-2xl border border-[#cbd5f5] bg-white px-4 text-[#275c9d] text-base shadow-[0_0_0_2px_rgba(206,224,245,0.7)] focus:outline-none"
        />
      </div>

      {/* Application Rate */}
      <div className="mb-6">
        <label className="block text-[#275c9d] text-xl font-bold mb-1">
          Application Rate
        </label>
        <p className="mb-2 text-sm text-[#4b5563]">
          How much pesticide is applied per acre?{" "}
          <span className="text-[#275c9d] font-semibold">
            ex: 2.0 lbs a.i./Acre
          </span>
        </p>
        <input
          type="text"
          placeholder="LBS a.i. / Acre..."
          value={applicationRate}
          onChange={(e) => setApplicationRate(e.target.value)}
          className="w-full h-12 rounded-2xl border border-[#cbd5f5] bg-white px-4 text-[#275c9d] text-base shadow-[0_0_0_2px_rgba(206,224,245,0.7)] focus:outline-none"
        />
      </div>

      {/* Soil Incorporation Depth */}
      <div className="mb-4">
        <label className="block text-[#275c9d] text-xl font-bold mb-1">
          Soil Incorporation Depth
        </label>
        <p className="mb-2 text-sm text-[#4b5563]">
          How deep the product is incorporated into soil?{" "}
          <span className="text-[#275c9d] font-semibold">ex: 3 inches</span>
        </p>
        <input
          type="text"
          placeholder="Enter depth or county..."
          value={soilDepth}
          onChange={(e) => setSoilDepth(e.target.value)}
          className="w-full h-12 rounded-2xl border border-[#cbd5f5] bg-white px-4 text-[#275c9d] text-base shadow-[0_0_0_2px_rgba(206,224,245,0.7)] focus:outline-none"
        />
      </div>
    </div>
  );
}
