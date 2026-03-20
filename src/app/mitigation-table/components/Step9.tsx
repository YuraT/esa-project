import React, { useState } from "react";
import { stepProps } from "../../utils/props";

export default function Step9({ value, setValue }: { value: string; setValue: (v: string) => void }) {
  const arr = typeof value === "string" ? value.split("-").map(Number) : [0, 0, 0, 0, 0, 0, 0];
  const answers: Record<string, number> = {
    q1: arr[0] || 0,
    q2: arr[1] || 0,
    q3: arr[2] || 0,
    q4: arr[3] || 0,
    q5: arr[4] || 0,
    q6: arr[5] || 0,
    q7: arr[6] || 0,
  };

  function handleAnswer(questionId: string, newPoints: number) {
    const newAnswers = { ...answers, [questionId]: newPoints };
    setValue(`${newAnswers.q1}-${newAnswers.q2}-${newAnswers.q3}-${newAnswers.q4}-${newAnswers.q5}-${newAnswers.q6}-${newAnswers.q7}`);
  }

  const currentPoints = Object.values(answers).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#f9f9f9] rounded-3xl p-10 my-18">
      <div className="absolute w-8 h-8 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
        9
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="m-2 text-2xl font-bold text-[#275c9d]">
          Field-Adjacent Mitigation Measures
        </h1>

        {/* Question 1 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
            Grassed Waterway
          </h3>
          <p className="mb-3">Are there grassed waterways?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q1"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q1", 1)}
            >
              Yes
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q1"] === 0
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q1", 0)}
            >
              No
            </button>
          </div>
        </div>

        {/* Question 2 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Vegetative Filter Strips (VFS) or Field Border Adjacent to Field
          </h3>
          <p className="my-2">How wide is the VFS or field border?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q2"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q2", 1)}
            >
              20 to 30 ft
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q2"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q2", 2)}
            >
              30 to &lt; 60 ft
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q2"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q2", 3)}
            >
              &ge; 60 ft
            </button>
          </div>
        </div>

        {/* Question 3 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Vegetated Ditch
          </h3>
          <p className="my-2">
            Is the ditch located downslope of the application area?
          </p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q3"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q3", 1)}
            >
              Yes
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q3"] === 0
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q3", 0)}
            >
              No
            </button>
          </div>
        </div>

        {/* Question 4 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Riparian Area
          </h3>
          <p className="my-2">How wide is the riparian area?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q4"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q4", 1)}
            >
              20 to &lt; 30 ft
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q4"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q4", 2)}
            >
              30 to &lt; 60 ft
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q4"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q4", 3)}
            >
              &ge; 60 ft
            </button>
          </div>
        </div>

        {/* Question 5 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Constructed and Natural Wetlands
          </h3>
          <p className="my-2">Are there constructed and natural wetlands?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q5"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q5", 3)}
            >
              Yes
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q5"] === 0
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q5", 0)}
            >
              No
            </button>
          </div>
        </div>

        {/* Question 6 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Terrestrial Habitat Landscape Improvement
          </h3>
          <p className="my-2">How wide is the landscape?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q6"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q6", 1)}
            >
              20 to &lt; 30 ft
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q6"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q6", 2)}
            >
              30 to &lt; 60 ft
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q6"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q6", 3)}
            >
              &ge; 60 ft
            </button>
          </div>
        </div>

        {/* Question 7 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Filtering Devices
          </h3>
          <p className="my-2">What do the filtering devices contain?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q7"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q7", 3)}
            >
              Activated carbon
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q7"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q7", 1)}
            >
              Compost amendments
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10">[9] Points: {currentPoints}</div>
    </div>
  );
}