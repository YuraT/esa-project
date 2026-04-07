import React, { useState } from "react";
import { stepProps } from "../../utils/props";
import { IoClose } from "react-icons/io5";

export default function Step8({ value, setValue }: stepProps) {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [
    showConservationTillageInfographic,
    setShowConservationTillageInfographic,
  ] = useState(false);
  const [showReservoirTillageInfographic, setShowReservoirTillageInfographic] =
    useState(false);
  const [showContourFarmingInfographic, setShowContourFarmingInfographic] =
    useState(false);
  const [
    showInFieldVegetativeStripsInfographic,
    setShowInFieldVegetativeStripsInfographic,
  ] = useState(false);
  const [
    showIrrigationWaterManagementInfographic,
    setShowIrrigationWaterManagementInfographic,
  ] = useState(false);
  const [showTerraceFarmingInfographic, setShowTerraceFarmingInfographic] =
    useState(false);
  const [showMulchingInfographic, setShowMulchingInfographic] = useState(false);
  const [showErosionBarriersInfographic, setShowErosionBarriersInfographic] =
    useState(false);
  const [showCoverCropInfographic, setShowCoverCropInfographic] =
    useState(false);

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
          <div className="flex gap-2">
            <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
              Conservation Tillage
            </h3>
            <button
              className="cursor-pointer w-6 h-6 rounded-full bg-[#577bb5] text-white flex items-center justify-center text-sm"
              onClick={() => setShowConservationTillageInfographic(true)}
            >
              ?
            </button>
          </div>
          {/* Conservation Tillage Infographic */}
          {showConservationTillageInfographic && (
            <div className="flex p-4 sm:p-10 mb-10 flex-col w-full max-w-2xl items-center justify-center bg-[#F5F4F4] shadow-2xl rounded-xl text-center">
              <div className="flex w-full justify-end mb-4">
                <button
                  className="text-4xl"
                  onClick={() => setShowConservationTillageInfographic(false)}
                >
                  <IoClose />
                </button>
              </div>
              <h1 className="text-[#275C9D] text-2xl font-extrabold">
                Conservation Tillage
              </h1>
              <p className="text-[#537BBA] m-8">What is it?</p>
              <p className="text-[#537BBA] mb-4">
                A tillage practice where 30% of the soil surface is covered in
                crop residue. This lowers the level of soil erosion from water
                or pesticide runoff.{" "}
              </p>
              <img
                src="/conservationtillage1.jpg"
                alt="Conservation Tillage 1"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-3 text-[#3E4651] font-light">
                A no-till corn planter seeding into dead wheat residue in
                Montana.
              </p>
              <img
                src="/conservationtillage2.jpg"
                alt="Conservation Tillage 2"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-3 text-[#3E4651] font-light">
                Soybean plants emerging through dead wheat residue in a Montana
                no-till system.
              </p>
            </div>
          )}
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
          <div className="flex gap-2">
            <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
              Reservoir Tillage
            </h3>
            <button
              className="cursor-pointer w-6 h-6 rounded-full bg-[#577bb5] text-white flex items-center justify-center text-sm"
              onClick={() => setShowReservoirTillageInfographic(true)}
            >
              ?
            </button>
          </div>
          {/* Reservoir Tillage Infographic */}
          {showReservoirTillageInfographic && (
            <div className="flex p-4 sm:p-10 mb-10 flex-col w-full max-w-2xl items-center justify-center bg-[#F5F4F4] shadow-2xl rounded-xl text-center">
              <div className="flex w-full justify-end mb-4">
                <button
                  className="text-4xl"
                  onClick={() => setShowReservoirTillageInfographic(false)}
                >
                  <IoClose />
                </button>
              </div>
              <h1 className="text-[#275C9D] text-2xl font-extrabold">
                Reservoir Tillage
              </h1>
              <p className="text-[#537BBA] m-8">What is it?</p>
              <p className="text-[#537BBA] mb-4">
                A tillage practice where farmers create small holes on the soil
                surface to prevent water or pesticide runoff.
              </p>
              <img
                src="/reservoirtillage1.jpg"
                alt="Reservoir Tillage 1"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-3 text-[#3E4651] font-light">
                Heavy equipment is required for some BMPs as seen on this
                terrace installation.
              </p>
            </div>
          )}
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
          <div className="flex gap-2">
            <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
              Contour Farming
            </h3>
            <button
              className="cursor-pointer w-6 h-6 rounded-full bg-[#577bb5] text-white flex items-center justify-center text-sm"
              onClick={() => setShowContourFarmingInfographic(true)}
            >
              ?
            </button>
          </div>
          {/* Contour Farming Infographic */}
          {showContourFarmingInfographic && (
            <div className="flex p-4 sm:p-10 mb-10 flex-col w-full max-w-2xl items-center justify-center bg-[#F5F4F4] shadow-2xl rounded-xl text-center">
              <div className="flex w-full justify-end mb-4">
                <button
                  className="text-4xl"
                  onClick={() => setShowContourFarmingInfographic(false)}
                >
                  <IoClose />
                </button>
              </div>
              <h1 className="text-[#275C9D] text-2xl font-extrabold">
                Contour Farming
              </h1>
              <p className="text-[#537BBA] m-8">What is it?</p>
              <p className="text-[#537BBA] mb-4">
                Contour farming is planting along the land's natural shape. This
                would create a level difference between rows, slowing rainwater
                and pesticide runoff among others.
              </p>
              <img
                src="/contourfarming1.jpg"
                alt="Contour Farming 1"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-3 text-[#3E4651] font-light">
                Contour farming helps protect topsoil and maintain long-term
                productivity in these Washington hills.
              </p>
            </div>
          )}
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
          <div className="flex gap-2">
            <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
              In-field Vegetative Strips
            </h3>
            <button
              className="cursor-pointer w-6 h-6 rounded-full bg-[#577bb5] text-white flex items-center justify-center text-sm"
              onClick={() => setShowInFieldVegetativeStripsInfographic(true)}
            >
              ?
            </button>
          </div>
          {/* In-field Vegetative Strips Infographic */}
          {showInFieldVegetativeStripsInfographic && (
            <div className="flex p-4 sm:p-10 mb-10 flex-col w-full max-w-2xl items-center justify-center bg-[#F5F4F4] shadow-2xl rounded-xl text-center">
              <div className="flex w-full justify-end mb-4">
                <button
                  className="text-4xl"
                  onClick={() =>
                    setShowInFieldVegetativeStripsInfographic(false)
                  }
                >
                  <IoClose />
                </button>
              </div>
              <h1 className="text-[#275C9D] text-2xl font-extrabold">
                In-field Vegetative Strips
              </h1>
              <p className="text-[#537BBA] m-8">What is it?</p>
              <p className="text-[#537BBA] mb-4">
                Vegetation strips are narrow bands of permanent vegetation
                planted between crop rows or along field contours. These strips
                trap sediment, absorb nutrients, and filter pollutants before
                they leave the field, protecting downstream water quality.
              </p>
              <img
                src="/infield1.jpg"
                alt="In-field Vegetative Strips 1"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-4 text-[#3E4651] font-light">
                A vegetative barrier composed of barley seeded into corn within
                the field.
              </p>
              <img
                src="/infield2.jpg"
                alt="In-field Vegetative Strips 2"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-3 text-[#3E4651] font-light">
                A vegetative filter strip in Missouri made of a grass planting
                in an off-field border. Note the contour farming and protection
                of the wetland where cattails and grass are left untouched.
              </p>
            </div>
          )}
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
          <div className="flex gap-2">
            <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
              Terrace Farming
            </h3>
            <button
              className="cursor-pointer w-6 h-6 rounded-full bg-[#577bb5] text-white flex items-center justify-center text-sm"
              onClick={() => setShowTerraceFarmingInfographic(true)}
            >
              ?
            </button>
          </div>
          {/* Terrace Farming Infographic */}
          {showTerraceFarmingInfographic && (
            <div className="flex p-4 sm:p-10 mb-10 flex-col w-full max-w-2xl items-center justify-center bg-[#F5F4F4] shadow-2xl rounded-xl text-center">
              <div className="flex w-full justify-end mb-4">
                <button
                  className="text-4xl"
                  onClick={() => setShowTerraceFarmingInfographic(false)}
                >
                  <IoClose />
                </button>
              </div>
              <h1 className="text-[#275C9D] text-2xl font-extrabold">
                Terrace Farming
              </h1>
              <p className="text-[#537BBA] m-8">What is it?</p>
              <p className="text-[#537BBA] mb-4">
                Terraces are step-like ridges built on hillsides. They slow down
                water, stop soil from washing away, and make sloped land easier
                to farm.
              </p>
              <img
                src="/terrace1.jpg"
                alt="Terrace Farming 1"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-4 text-[#3E4651] font-light">
                Ridge-and-channel style terraces on Missouri cropland protect
                sloped soils and the stream below.
              </p>
            </div>
          )}
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
          <div className="flex gap-2">
            <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
              Cover Crop
            </h3>
            <button
              className="cursor-pointer w-6 h-6 rounded-full bg-[#577bb5] text-white flex items-center justify-center text-sm"
              onClick={() => setShowCoverCropInfographic(true)}
            >
              ?
            </button>
          </div>
          {/* Cover Crop Infographic */}
          {showCoverCropInfographic && (
            <div className="flex p-4 sm:p-10 mb-10 flex-col w-full max-w-2xl items-center justify-center bg-[#F5F4F4] shadow-2xl rounded-xl text-center">
              <div className="flex w-full justify-end mb-4">
                <button
                  className="text-4xl"
                  onClick={() => setShowCoverCropInfographic(false)}
                >
                  <IoClose />
                </button>
              </div>
              <h1 className="text-[#275C9D] text-2xl font-extrabold">
                Cover Crop
              </h1>
              <p className="text-[#537BBA] m-8">What is it?</p>
              <p className="text-[#537BBA] mb-4">
                Cover crops are planted when main crops aren't growing. They
                protect bare soil from erosion, add nutrients, and improve soil
                structure for the next planting season.
              </p>
              <img
                src="/covercrop1.jpg"
                alt="Cover Crop 1"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-4 text-[#3E4651] font-light">
                Cereal rye cover crop
              </p>
              <img
                src="/covercrop2.jpg"
                alt="Cover Crop 2"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-4 text-[#3E4651] font-light">
                A crop seeder planting into a cover crop.
              </p>
            </div>
          )}
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
          <div className="flex gap-2">
            <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
              Irrigation Water Management
            </h3>
            <button
              className="cursor-pointer w-6 h-6 rounded-full bg-[#577bb5] text-white flex items-center justify-center text-sm"
              onClick={() => setShowIrrigationWaterManagementInfographic(true)}
            >
              ?
            </button>
          </div>
          {/* Irrigation Water Management Infographic */}
          {showIrrigationWaterManagementInfographic && (
            <div className="flex p-4 sm:p-10 mb-10 flex-col w-full max-w-2xl items-center justify-center bg-[#F5F4F4] shadow-2xl rounded-xl text-center">
              <div className="flex w-full justify-end mb-4">
                <button
                  className="text-4xl"
                  onClick={() =>
                    setShowIrrigationWaterManagementInfographic(false)
                  }
                >
                  <IoClose />
                </button>
              </div>
              <h1 className="text-[#275C9D] text-2xl font-extrabold">
                Irrigation Water Management
              </h1>
              <p className="text-[#537BBA] m-8">What is it?</p>
              <p className="text-[#537BBA] mb-4">
                Irrigation water management means using the right amount of
                water at the right time. It saves water, keeps plants healthy,
                and prevents runoff or waste.
              </p>
              <img
                src="/irrigationwater1.jpg"
                alt="Irrigation Water Management 1"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-4 text-[#3E4651] font-light">
                A slope drain transports water down a slope in a conveyance such
                as a drain pipe or concrete causeway to prevent contact between
                the scouring forces of water and the vulnerable soil slope.
              </p>
            </div>
          )}
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
          <div className="flex gap-2">
            <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
              Mulching
            </h3>
            <button
              className="cursor-pointer w-6 h-6 rounded-full bg-[#577bb5] text-white flex items-center justify-center text-sm"
              onClick={() => setShowMulchingInfographic(true)}
            >
              ?
            </button>
          </div>
          {/* Mulching Infographic */}
          {showMulchingInfographic && (
            <div className="flex p-4 sm:p-10 mb-10 flex-col w-full max-w-2xl items-center justify-center bg-[#F5F4F4] shadow-2xl rounded-xl text-center">
              <div className="flex w-full justify-end mb-4">
                <button
                  className="text-4xl"
                  onClick={() => setShowMulchingInfographic(false)}
                >
                  <IoClose />
                </button>
              </div>
              <h1 className="text-[#275C9D] text-2xl font-extrabold">
                Mulching
              </h1>
              <p className="text-[#537BBA] m-8">What is it?</p>
              <p className="text-[#537BBA] mb-4">
                Mulching covers the soil with straw, wood chips, or other
                materials. It helps hold moisture, keeps weeds down, and
                protects the soil from washing or blowing away.
              </p>
              <img
                src="/mulching1.jpg"
                alt="Mulching 1"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-4 text-[#3E4651] font-light">
                Hydraulic mulch like this Flexterra is easily applied as a
                spray-on product.
              </p>
            </div>
          )}
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
          <div className="flex gap-2">
            <h3 className="font-semibold text-lg text-[#275c9d] mb-2">
              Erosion Barriers
            </h3>
            <button
              className="cursor-pointer w-6 h-6 rounded-full bg-[#577bb5] text-white flex items-center justify-center text-sm"
              onClick={() => setShowErosionBarriersInfographic(true)}
            >
              ?
            </button>
          </div>
          {/* Erosion Barriers Infographic */}
          {showErosionBarriersInfographic && (
            <div className="flex p-4 sm:p-10 mb-10 flex-col w-full max-w-2xl items-center justify-center bg-[#F5F4F4] shadow-2xl rounded-xl text-center">
              <div className="flex w-full justify-end mb-4">
                <button
                  className="text-4xl"
                  onClick={() => setShowErosionBarriersInfographic(false)}
                >
                  <IoClose />
                </button>
              </div>
              <h1 className="text-[#275C9D] text-2xl font-extrabold">
                Erosion Barriers
              </h1>
              <p className="text-[#537BBA] m-8">What is it?</p>
              <p className="text-[#537BBA] mb-4">
                Erosion barriers like fiber rolls or silt fences are placed on
                slopes or ditches to slow water and catch soil. They help keep
                dirt where it belongs in the field, and not in the stream.
              </p>
              <img
                src="/errosion1.jpg"
                alt="Errosion Barriers 1"
                className="mt-3 w-full h-auto bg-[#D9D9D9] p-5 rounded-xl"
              />
              <p className="my-4 text-[#3E4651] font-light">
                A fiber roll installed along the base of a short slope to
                capture sediment released on this recently installed vegetated
                buffer.
              </p>
            </div>
          )}
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
