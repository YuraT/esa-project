import React, { useState } from "react";
import { stepProps } from "../utils/props";

export default function Step8({ value, setValue }: stepProps) {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});

  function handleAnswer(questionId: string, newPoints: number) {
    const prevPoints = answers[questionId] || 0;
    setAnswers({ ...answers, [questionId]: newPoints });
    setValue(value - prevPoints + newPoints);
  }
  return (
    <div className="bg-[#f9f9f9] rounded-3xl p-10 my-18">
      <div className="absolute w-8 h-8 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
        8
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="m-2 text-2xl font-bold text-[#275c9d]">
          In-field Mitigation Measures
        </h1>

        {/* Question 1 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
            Conservation Tillage
          </h3>
          <p className="mb-3">What tillage practice are you using?</p>
          <div className="">
            <div className="flex gap-4">
              <button
                className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                  answers["q1"] === 3
                    ? "bg-blue-200 border-2 border-blue-500"
                    : "bg-gray-200"
                }`}
                onClick={() => handleAnswer("q1", 3)}
              >
                No-till, including perennial crops
              </button>
              <button
                className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                  answers["q1"] === 2
                    ? "bg-blue-200 border-2 border-blue-500"
                    : "bg-gray-200"
                }`}
                onClick={() => handleAnswer("q1", 2)}
              >
                Reduced, strip, ridge, or mulch tillage
              </button>
            </div>
          </div>
        </div>

        {/* Question 2 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Reservior Tillage
          </h3>
          <p className="my-2">Are you using reservior tillage?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q2"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q2", 3)}
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
            Contour Farming
          </h3>
          <p className="my-2">Are you using contour farming?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q3"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q3", 2)}
            >
              Yes
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q3"] === 0
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
            Vegetable Strips - In-field
          </h3>
          <p className="my-2">Are you using vegetable strips?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q4"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q4", 2)}
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

        {/* Question 5 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Terrace Farming
          </h3>
          <p className="my-2">Are you using terrace farming?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q5"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q5", 2)}
            >
              Yes
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q5"] === 0
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
          <h3 className="font-semibold text-lg text-[#275c9d]">Cover Crop</h3>
          <p className="my-2">How are you using cover crop?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q6"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q6", 1)}
            >
              With tillage
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q6"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q6", 2)}
            >
              No tillage; short-term
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q6"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q6", 3)}
            >
              No tillage; long-term
            </button>
          </div>
        </div>

        {/* Question 7 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Irrigation Water Management
          </h3>
          <p className="my-2">How are you managing irrigation water?</p>
          <div
            className={`mx-15 mb-5 cursor-pointer flex flex-col items-center rounded-xl bg-[#577bb5] ${
              answers["q7"] === 2 ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => handleAnswer("q7", 2)}
          >
            <p className="p-3 text-lg text-white font-bold">
              General irrigation management
            </p>
            <div
              className={`flex items-center p-6 rounded-b-xl ${
                answers["q7"] === 2 ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              <p className="font-medium text-lg text-[#275c9d]">
                Use of soil moisture sensors/evapotranspiration meters with
                center pivots & sprinklers; above ground drip tape, drip
                emitters; micro-sprinklers
              </p>
            </div>
          </div>

          <div
            className={`mx-15 cursor-pointer flex flex-col items-center rounded-xl bg-[#577bb5] ${
              answers["q7"] === 3 ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => handleAnswer("q7", 3)}
          >
            <p className="p-3 text-lg text-white font-bold">No irrigation</p>
            <div
              className={`flex items-center p-6 rounded-b-xl ${
                answers["q7"] === 3 ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              <p className="font-medium text-lg text-[#275c9d]">
                Use of below tarp irrigation, below ground drip tape; dry
                farming, non-irrigated lands
              </p>
            </div>
          </div>
        </div>

        {/* Question 8 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">Mulching</h3>
          <p className="my-2">What are you mulching with?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q8"] === 1
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q8", 1)}
            >
              Permeable artificial materials
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q8"] === 3
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q8", 3)}
            >
              Natural materials
            </button>
          </div>
        </div>

        {/* Question 9 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d]">
            Erosion Barriers
          </h3>
          <p className="my-2">Are you using erosion barriers?</p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q9"] === 2
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q9", 2)}
            >
              Yes
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
                answers["q9"] === 0
                  ? "bg-blue-200 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswer("q9", 0)}
            >
              No
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10">[8] Points: {value}</div>
    </div>
  );
}
