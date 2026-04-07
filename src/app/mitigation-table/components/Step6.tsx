"use client";

import { stepProps } from "../../utils/props";

export default function Step6({ value, setValue }: stepProps) {
  return (
    <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-full max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 px-4 sm:px-6">
        <div className="w-8 h-8 mt-6 sm:mt-10 shrink-0 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
          6
        </div>
        <div className="sm:mt-10 sm:ml-4 text-xl sm:text-2xl font-bold text-[#275c9d]">
          Conversation Program Particiption
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-4">
        <p className="mt-3 leading-tight text-center text-lg sm:text-xl text-[#275c9d] font-bold max-w-3xl">
          Non-Qualified Conservation Program Participation
        </p>

        <p className="mt-3 leading-tight text-center text-m text-black font-medium max-w-3xl">
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

        <p className="mt-6 leading-tight text-center text-lg sm:text-xl text-[#275c9d] font-bold max-w-3xl">
          EPA-Qualified Conservation Program Participation
        </p>

        <p className="mt-3 leading-tight text-center text-m text-black font-medium max-w-3xl">
          Each separate farm must have its own conservation program that meets
          the rules and scores a{" "}
          <span className="font-bold">
            maximum of 9 points (including 2 for being in a program)
          </span>
          , and must keep following those rules after it's approved.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-4">
        <div className="mt-7 flex flex-wrap justify-center gap-4">
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
