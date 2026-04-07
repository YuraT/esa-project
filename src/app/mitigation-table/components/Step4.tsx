"use client";

import { stepProps } from "../../utils/props";

export default function Step4({ value, setValue }: stepProps) {
  return (
    <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-full max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 px-4 sm:px-6">
        <div className="w-8 h-8 mt-6 sm:mt-10 shrink-0 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
          4
        </div>
        <div className="sm:ml-4 sm:mt-10 text-xl sm:text-2xl font-bold text-[#275c9d]">
          Mitigation Tracking
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-4">
        <div className="leading-tight text-lg text-black max-w-3xl text-center">
          The EPA gives 1 mitigation point to growers or applicators
        </div>
        <div className="mb-3 leading-tight text-lg text-black max-w-3xl text-center">
          who keep track of their runoff/erosion mitigation steps.
        </div>
        <div className="leading-tight text-lg text-black font-bold max-w-3xl text-center">
          Tracking helps make sure you're meeting the required
        </div>
        <div className="leading-tight text-lg text-black font-bold max-w-3xl text-center">
          number of points listed on pesticide lables or bulletins.
        </div>

        <div className="mt-10 text-lg sm:text-xl font-bold text-[#275c9d] text-center">
          Do you perform Mitigation Tracking?
        </div>
        <div className="flex flex-wrap justify-center mt-4 gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
              value === 1
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => setValue(1)}
            type="button"
          >
            Yes
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
              value === 0
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => setValue(0)}
            type="button"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
