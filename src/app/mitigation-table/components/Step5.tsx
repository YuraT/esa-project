"use client";

import { useState, useEffect } from "react";
import { stepProps } from "../../utils/props";

export default function Step5({ value, setValue }: stepProps) {
  const [checked1, setChecked1] = useState(value !== 0);
  const [checked2, setChecked2] = useState(value !== 0);
  const [checked3, setChecked3] = useState(value !== 0);

  useEffect(() => {
    setValue(checked1 && checked2 && checked3 ? 1 : 0);
  }, [checked1, checked2, checked3, setValue]);

  return (
    <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-full max-w-4xl mx-auto min-h-0 h-auto sm:min-h-[50rem] py-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 px-4 sm:px-6">
        <div className="w-8 h-8 mt-6 sm:mt-10 shrink-0 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
          5
        </div>
        <div className="sm:ml-4 sm:mt-10 text-xl sm:text-2xl font-bold text-[#275c9d]">
          Working with a Technical Specialist
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-4">
        <p className="leading-tight text-center text-lg text-[#275c9d] max-w-3xl">
          The EPA states <span className="font-bold">1 mitigation point</span>{" "}
          is available to grower / applicators that work with a runoff / erosion
          technical expert that meets the characteristics described below.
        </p>

        <p className="mt-6 leading-tight text-center text-lg sm:text-xl text-[#275c9d] font-bold max-w-3xl">
          Check all boxes that apply to the technical expert you work with:
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 mt-7 w-full max-w-2xl min-h-20 rounded-t-xl bg-[#577bb5] p-4 sm:p-0 sm:pl-5">
          <p className="sm:pr-6 flex-1 leading-tight text-lg text-white font-bold">
            Expert has technical training, education, and/or experience in:
          </p>

          <div
            onClick={() => setChecked1(!checked1)}
            className={`w-8 h-7 sm:ml-auto sm:mr-5 shrink-0 rounded-sm flex items-center justify-center self-end sm:self-center ${
              checked1
                ? "bg-white hover:cursor-pointer"
                : "bg-white hover:cursor-pointer"
            }`}
          >
            {checked1 && <span>✔️</span>}
          </div>
        </div>

        <div className="w-full max-w-2xl min-h-0 bg-white rounded-b-xl">
          <ul className="mt-5 ml-5 leading-tight font-medium text-lg pl-5 text-[#275c9d] list-disc list-outside">
            <li>Agricultural discipline</li>
            <li>Water or soil conservation</li>
            <li>
              Or other relevant discipline that provides training and practice
              in the area of runoff or erosion mitigation technologies/measures
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 mt-7 w-full max-w-2xl min-h-0 rounded-xl bg-[#577bb5] p-4 sm:p-0 sm:pl-5">
          <p className="flex-1 sm:pr-6 leading-tight text-lg text-white font-bold">
            Expert participates in continued education or training in the area
            of expertise which should include run off and erosion control.
          </p>

          <div
            onClick={() => setChecked2(!checked2)}
            className={`w-9 h-7 sm:mr-5 shrink-0 rounded-sm flex items-center justify-center self-end sm:self-center ${
              checked2
                ? "bg-white hover:cursor-pointer"
                : "bg-white hover:cursor-pointer"
            }`}
          >
            {checked2 && <span>✔️</span>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-0 mt-7 w-full max-w-2xl min-h-0 rounded-xl bg-[#577bb5] p-4 sm:p-0 sm:pl-5 sm:pr-2 pb-4">
          <p className="flex-1 leading-tight text-lg text-white font-bold">
            Have experience advising on conservation measures designed to
            develop site specific runoff and erosion plans that include
            mitigation measures described in EPA's Mitigation Website.
          </p>

          <div
            onClick={() => setChecked3(!checked3)}
            className={`w-9 h-7 sm:mr-5 shrink-0 rounded-sm flex items-center justify-center self-end sm:self-start sm:mt-1 ${
              checked3
                ? "bg-white hover:cursor-pointer"
                : "bg-white hover:cursor-pointer"
            }`}
          >
            {checked3 && <span>✔️</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
