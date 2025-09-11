"use client";

import { stepProps } from "../utils/props";

export default function Step2({ value, setValue }: stepProps) {
  return (
    <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-240 h-80">
      <div className="flex items-center gap-45 mb-4 ">
        <div className="w-8 h-8 mt-10 ml-10 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
          2
        </div>
        <div className="ml-40 mt-10 text-2xl font-bold text-[#275c9d]">
          Field Slope
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="mt-2 leading-tight text-center pl-65 pr-65 text-lg text-black">
          Flatter fields are less prone to runoff.
          <span className="font-bold">
            {" "}
            Does your field have a slope less than/equal to 3%?
          </span>
        </p>

        <p className="mt-4 leading-tight text-center pl-20 pr-20 text-lg text-black">
          Check using this database:
        </p>

        <div className="flex mt-6 gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
              value === 3
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => setValue(3)}
            type="button"
          >
            Yes (≤ 3%)
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
            No (&gt; 3%)
          </button>
        </div>
      </div>
    </div>
  );
}
