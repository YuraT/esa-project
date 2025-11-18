"use client";

import { stepProps } from "../../utils/props";

export default function Step6({ value, setValue }: stepProps) {
  return (
    <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-240 pb-10">
      <div className="flex items-center gap-10 mb-4 ">
        <div className="w-8 h-8 mt-10 ml-10 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
          6
        </div>
        <div className="mt-10 ml-40 text-2xl font-bold text-[#275c9d]">
          Conversation Program Particiption
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="mt-3 leading-tight text-center pl-15 pr-15 text-xl text-[#275c9d] font-bold">
          Non-Qualified Conservation Program Participation
        </p>

        <p className="mt-3 leading-tight text-center pl-30 pr-30 text-m text-black font-medium">
          <span className="font-semibold">
            Conservation programs will be 2 points
          </span>{" "}
          until they have been designated by EPA as an EPA-Qualified
          Conservation Program. To see if your program meets requirements, check{" "}
          <a
            href="https://www.epa.gov/pesticides/mitigation-menu"
            className="underline font-semibold text-black hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.epa.gov/pesticides/mitigation-menu
          </a>
          .
        </p>

        <p className="mt-6 leading-tight text-center pl-15 pr-15 text-xl text-[#275c9d] font-bold">
          EPA-Qualified Conservation Program Participation
        </p>

        <p className="mt-3 leading-tight text-center pl-35 pr-35 text-m text-black font-medium">
          Each separate farm must have its own conservation program that meets
          the rules and scores a{" "}
          <span className="font-bold">
            maximum of 9 points (including 2 for being in a program)
          </span>
          , and must keep following those rules after it's approved.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="mt-7 flex gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
              value === 9
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => setValue(9)}
            type="button"
          >
            Qualified Conservation Program
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
              value === 2
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => setValue(2)}
            type="button"
          >
            Non-qualified Conservation Program
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
            None
          </button>
        </div>
      </div>
    </div>
  );
}
