"use client";
import Footer from "./components/Footer";
import { FiUploadCloud, FiBookOpen } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Home() {
  // tools styling
  const grayTools =
    "font-bold text-white bg-[#ACADAA] rounded-[clamp(0.75rem,2vw,4rem)] w-[clamp(0.1rem,11vw,18rem)] py-[clamp(0.3rem,1vw,3rem)] text-[clamp(0.2rem,1vw,2rem)] transition-colors hover:bg-[#C1C2BF]";
  const blueTools =
    "font-bold text-white bg-[#537BBA] rounded-[clamp(0.5rem,1.5vw,2rem)] w-[clamp(5rem,20vw,32rem)] py-[clamp(0.5rem,1vw,3rem)] text-[clamp(0.5rem,2vw,4rem)] transition-colors hover:bg-[#648fd1]";

  // icons styling
  const iconsSpacing = "flex items-start gap-x-[clamp(0.1rem,1vw,2rem)]";
  const iconsShape =
    "flex items-center justify-center bg-[#CEDEBD] w-[clamp(2rem,10vw,20rem)] h-[clamp(2rem,10vw,20rem)] rounded-full";
  const iconsSize = "text-[clamp(0.8rem,4vw,8rem)] text-[#3E4651]";

  // steps styling
  const steps =
    "font-bold text-[#3E4651] text-[clamp(0.7rem,2.5vw,4rem)] leading-tight";
  const stepsDesc =
    "font-normal text-[clamp(0.25rem,1.1vw,3rem)] text-[#3E4651] w-[clamp(2.7rem,10vw,20rem)]";

  const router = useRouter();
  const goToChat = () => router.push("/chat");
  const goToMap = () => router.push("/map");
  const goToManualEntry = () => router.push("/manual-entry");

  return (
    <div className="bg-[#3E4651] items-center min-h-screen font-[family-name:var(--font-merriweather-sans)] overflow-x-hidden">
      <div className="relative">
        <img
          src="/pesticideuser.svg"
          alt="Pesticide User"
          className="w-full max-w-screen-3xl h-auto"
        />

        {/* gray search, map, manual entry buttons */}
        <div className="absolute top-[5%] right-[0.01%] z-10">
          <div className="flex pr-[clamp(0.3rem,3vw,6rem)] gap-x-[clamp(0.2rem,1.5vw,3rem)]">
            <button
              className={grayTools}
              onClick={() => router.push("/testing/notification")}
            >
              TESTING
            </button>
            <button className={grayTools} onClick={goToChat}>
              CHAT
            </button>
            <button className={grayTools} onClick={goToMap}>
              MAP
            </button>
            <button className={grayTools} onClick={goToManualEntry}>
              MANUAL ENTRY
            </button>
          </div>
        </div>

        {/* pesticide user image gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#275C9D]/80 to-white/40"></div>

        <div className="absolute top-[25%] left-[10%] w-[clamp(12rem,60vw,90rem)] px-[clamp(1rem,5vw,6rem)]">
          <p className="font-bold text-white text-[clamp(1rem,5vw,9rem)] pb-1">
            Pesticide Information Center
          </p>
          <p className="font-bold text-[clamp(0.6rem,2.5vw,5rem)] text-white">
            ESA rules, simplified.
          </p>
          <div className="absolute bottom-[-70%]">
            <p className="text-[clamp(0.2rem,1vw,2rem)] text-[#9E9FA0]">
              *This site does not store or collect personal data about pesticide
              application*
            </p>
          </div>
        </div>
      </div>

      {/* Get clear... */}
      <div className="flex items-center bg-white">
        <div className="pr-[clamp(1rem,5vw,5rem)] pl-[clamp(4rem,21vw,23rem)] py-[clamp(1rem,9vw,12rem)]">
          <p className="font-bold text-[#375B85] text-right text-[clamp(0.5rem,2.3vw,4rem)]">
            Get clear, customized{" "}
            <span className="text-[#537BBA]">ESA pesticide guidelines</span>{" "}
            based on your location with our easy-to use{" "}
            <span className="text-[#537BBA]">Map Tool</span> and product type
            and usage with our{" "}
            <span className="text-[#537BBA]">Manual Entry</span> or{" "}
            <span className="text-[#537BBA]">Chat Tools</span>.
          </p>
        </div>
      </div>

      {/* How It Works. */}
      <div className="bg-[#F0F0F0] py-[clamp(1rem,6vw,8rem)]">
        <div className="flex justify-center">
          <p className="font-bold text-[#375B85] text-[clamp(0.8rem,3vw,5rem)] pb-[clamp(0.5rem,4vw,4rem)]">
            How It Works.
          </p>
        </div>
        <div className="flex justify-center gap-x-[clamp(0.5rem,6vw,10rem)]">
          {/* 1. Choose */}
          <div className={iconsSpacing}>
            <div className={iconsShape}>
              <FiUploadCloud className={iconsSize} />
            </div>
            <h1 className={steps}>
              1. Choose <br />{" "}
              <p className={stepsDesc}>
                the <span className="font-bold">Chat</span>,{" "}
                <span className="font-bold">Map</span>, or{" "}
                <span className="font-bold">Manual Entry Tools</span> to begin
                your search.{" "}
              </p>
            </h1>
          </div>
          {/* 2. Search */}
          <div className={iconsSpacing}>
            <div className={iconsShape}>
              <IoSearchSharp className={iconsSize} />
            </div>
            <h1 className={steps}>
              2. Search <br />{" "}
              <p className={stepsDesc}>
                for your product through the{" "}
                <span className="font-bold">
                  EPA ESA Pesticide Information on the page you chose
                </span>
                .{" "}
              </p>
            </h1>
          </div>
          {/* 3. Inform */}
          <div className={iconsSpacing}>
            <div className={iconsShape}>
              <FiBookOpen className={iconsSize} />
            </div>
            <h1 className={steps}>
              3. Inform <br />{" "}
              <p className={stepsDesc}>
                yourself on the latest information for your{" "}
                <span className="font-bold">region and state's safe usage</span>
                .{" "}
              </p>
            </h1>
          </div>
        </div>
      </div>

      {/* Start Your Search. */}
      <div className="flex flex-col items-center justify-center bg-[#275C9D] py-[clamp(1rem,5vw,8rem)]">
        <p className="font-bold text-white text-[clamp(1rem,3.5vw,6rem)]">
          Start Your Search.
        </p>
        <p className="font-bold text-white text-center text-[clamp(0.45rem,1.4vw,4rem)] py-[clamp(0.5rem,2vw,4rem)]">
          Choose an option for how you would like find your ESA rules.
        </p>

        <div className="py-[clamp(1rem,3vw,4rem)]">
          <div className="flex gap-x-[clamp(1rem,3vw,5rem)]">
            <button className={blueTools} onClick={goToChat}>
              CHAT
            </button>
            <button className={blueTools} onClick={goToMap}>
              MAP
            </button>
            <button className={blueTools} onClick={goToManualEntry}>
              MANUAL ENTRY
            </button>
          </div>
        </div>
        <p className="font-bold text-[#9E9FA0] text-[clamp(0.3rem,0.8vw,2rem)]">
          *Chat view is experimental and not the most accurate at this time*
        </p>
      </div>

      <Footer/>
    </div>
  );
}
