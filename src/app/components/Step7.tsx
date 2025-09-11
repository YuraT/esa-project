import React, { useState } from "react";
import { stepProps } from "../utils/props";

export default function Step7({ value, setValue }: stepProps) {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});

  function handleAnswer(questionId: string, newPoints: number) {
    const prevPoints = answers[questionId] || 0;
    setAnswers({ ...answers, [questionId]: newPoints });
    setValue(value - prevPoints + newPoints);
  }

  return (
    <div className="bg-[#f9f9f9] rounded-3xl p-10 my-18">
      <div className="absolute w-8 h-8 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
        7
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="m-2 text-2xl font-bold text-[#275c9d]">
          Application Parameters
        </h1>

        {/* Question 1 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
            Annual Application Rate Reduction
          </h3>
          <p className="mb-3">Is your application rate</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q1"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q1", 1)}
            >
              10% to &lt; 30%
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q1"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q1", 2)}
            >
              30% to &lt; 60%
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q1"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q1", 3)}
            >
              &ge; 60%
            </button>
          </div>
          <p className="mt-2 mb-5">
            less than the maximum labeled annual application rate?
          </p>
        </div>

        {/* Question 2 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Anionic Polyacrylamide (PAM)
          </h3>
          <p className="my-2">
            Are you applying water-soluble formulations of anionic PAM?
          </p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q2"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q2", 2)}
            >
              Yes
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q2"] === 0
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q2", 0)}
            >
              No
            </button>
          </div>
        </div>

        {/* Question 3 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Proportion of Field Treated
          </h3>
          <p className="my-2">How much of the field is not treated?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q3"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q3", 2)}
            >
              10% to &lt; 30%
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q3"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q3", 3)}
            >
              30% to &lt; 60%
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q3"] === 4
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q3", 4)}
            >
              &ge; 60%
            </button>
          </div>
        </div>

        {/* Question 4 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Soil Incorporation
          </h3>
          <p className="my-2">
            Watering-in or mechanical incorporation before a runoff producing
            event?
          </p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q4"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q4", 1)}
            >
              Yes
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q4"] === 0
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q4", 0)}
            >
              No
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10">[7] Points: {value}</div>
    </div>
  );
}
