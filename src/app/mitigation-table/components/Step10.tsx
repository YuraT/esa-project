import React, { useEffect, useState } from "react";
export default function Step10({ value, setValue }: { value: number[]; setValue: (v: number[]) => void }) {
  const arr = Array.isArray(value) ? value : [0, 0, 0];
  const answers: Record<string, number> = {
    q1: arr[0] || 0,
    q2: arr[1] || 0,
    q3: arr[2] || 0,
  };
  const [prac1, setPrac1] = useState(false);
  const [prac2, setPrac2] = useState(false);
  const [prac3, setPrac3] = useState(false);

  function handleAnswer(questionId: string, newPoints: number) {
    const newAnswers = { ...answers, [questionId]: newPoints };
    setValue([newAnswers.q1, newAnswers.q2, newAnswers.q3]);
  }

  const currentPoints = Object.values(answers).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (
      (prac1 && prac2) || (prac1 && prac3) || (prac2 && prac3)
    ) {
      handleAnswer("q3", 1);
    } else {
      handleAnswer("q3", 0);
    }
  }, [prac1, prac2, prac3]);

  return (
    <div className="bg-[#f9f9f9] rounded-3xl p-10 my-18">
      <div className="absolute w-8 h-8 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
        10
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="m-2 text-2xl font-bold text-[#275c9d]">
          Systems That Capture Runoff and Discharge
        </h1>

        {/* Question 1 */}
        <div className="flex flex-col items-center m-4">
          <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
            Water Retention Systems
          </h3>
          <p className="mb-3">
            Sediment basins, catch basins, sediment traps, water retention
            ponds?
          </p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q1"] === 2
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q1", 2)}
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
            Subsurface Drainages and Tile Drainage
          </h3>
          <p className="my-2">
            Subsurface tile drains, tile drains without controlled drainage
            structure?
          </p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q2"] === 1
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
                }`}
              onClick={() => handleAnswer("q2", 1)}
            >
              Yes
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${answers["q2"] === 0
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
            Mitigation Measures From Multiple Categories
          </h3>
          <p className="my-2">
            What practices are you using?{" "}
            <span className="font-bold">Select at least 2 options</span>.
          </p>
          <div className="flex gap-4">
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${prac1 ? "bg-blue-200 border-2 border-blue-500" : "bg-gray-200"
                }`}
              onClick={() => setPrac1(!prac1)}
            >
              In-field measure
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${prac2 ? "bg-blue-200 border-2 border-blue-500" : "bg-gray-200"
                }`}
              onClick={() => setPrac2(!prac2)}
            >
              Field-adjacent measure
            </button>
            <button
              className={`cursor-pointer px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${prac3 ? "bg-blue-200 border-2 border-blue-500" : "bg-gray-200"
                }`}
              onClick={() => setPrac3(!prac3)}
            >
              System that captures runoff and discharge
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10">[10] Points: {currentPoints}</div>
    </div>
  );
}
