"use client";

import { stepProps } from "../utils/props";

export default function Step4({ value, setValue }: stepProps) {
  return (
    <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-240 pb-10">
      <div className="flex items-center gap-30 mb-4 ">
        <div className="w-8 h-8 mt-10 ml-10 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
          4
        </div>
        <div className="ml-45 mt-10 text-2xl font-bold text-[#275c9d]">
          Mitigation Tracking
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="leading-tight pl-20 pr-20 text-lg text-black">
          The EPA gives 1 mitigation point to growers or applicators
        </div>
        <div className="mb-3 leading-tight pl-20 pr-20 text-lg text-black">
          who keep track of their runoff/erosion mitigation steps.
        </div>
        <div className="leading-tight pl-20 pr-20 text-lg text-black font-bold">
          Tracking helps make sure you're meeting the required
        </div>
        <div className="leading-tight pl-20 pr-20 text-lg text-black font-bold">
          number of points listed on pesticide lables or bulletins.
        </div>

        <div className="mt-10 text-xl font-bold text-[#275c9d]">
          Do you perform Mitigation Tracking?
        </div>
        <div className="flex mt-4 gap-4">
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
