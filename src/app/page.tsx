"use client";
import Footer from "./components/Footer";
import { FiUploadCloud, FiBookOpen } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";
import Link from "next/link";

export default function Home() {
  // tools styling
  const mapButton =
    "font-bold text-white bg-[#4A7DB8] text-lg rounded-lg py-3 px-8 shadow-lg transition-colors hover:bg-[#5A8DC8]";
  const blueTools =
    "font-bold text-white bg-[#537BBA] text-lg rounded-full py-4 px-12 transition-colors hover:bg-[#648fd1]";

  // icons styling
  const iconsSpacing =
    "flex flex-col items-center gap-[clamp(0.5rem,2vw,3rem)]";
  const iconsShape =
    "flex items-center justify-center bg-[#CEDEBD] w-[clamp(2rem,10vw,20rem)] h-[clamp(2rem,10vw,20rem)] rounded-full";
  const iconsSize = "text-[clamp(0.8rem,4vw,8rem)] text-[#3E4651]";

  // steps styling
  const steps = "font-bold text-[#3E4651] leading-tight text-center";
  const stepsDesc =
    "font-normal text-sm text-[#3E4651] max-w-[clamp(10rem,20vw,25rem)] text-center";
return (
  <>
    <div className="w-full bg-[#b8d99a] flex justify-center py-3">
      <div className="flex flex-col items-center gap-1 text-center text-[#2f4f2f] font-semibold text-sm sm:text-base">
        <a
          href="https://www.figma.com/proto/M3Gfd4N786yfrOukakzoW8/EPA-Draft?node-id=1736-3633&p=f&t=PW113dsWhqzea4IB-1&scaling=scale-down&content-scaling=fixed&page-id=1736%3A3629&starting-point-node-id=1736%3A3633"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          VIEW THE MOBILE INTERACTIVE MOCKUP HERE
        </a>

        <a
          href="https://forms.gle/itJTqYvWA8c7A1jM9"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          FIND LINK TO FEEDBACK FORM HERE
        </a>

        <a
          href="https://www.figma.com/proto/M3Gfd4N786yfrOukakzoW8/EPA-Draft?node-id=1657-3015&p=f&t=7VcX6wCPWSWOo4ww-1&scaling=scale-down&content-scaling=fixed&page-id=1657%3A2175&starting-point-node-id=1657%3A3015"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          VIEW THE WEB INTERACTIVE MOCKUP HERE
        </a>
      </div>
    </div>

    <div className="bg-[#3E4651] items-center min-h-screen w-full max-w-full font-[family-name:var(--font-merriweather-sans)] overflow-x-hidden">
      <div className="relative w-full max-w-full overflow-hidden">
        <img
          src="/pesticideuser.svg"
          alt="Pesticide User"
          className="block w-full max-w-full h-auto"
        />

        {/* map button */}
        <div className="absolute top-[5%] right-[0.01%] z-10">
          <div className="flex pr-[clamp(0.3rem,3vw,6rem)]">
            <Link href="/map" className={mapButton}>
              MAP
            </Link>
          </div>
        </div>

        {/* pesticide user image gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#275C9D]/80 to-white/40"></div>

        <div className="absolute top-[20%] sm:top-[25%] left-4 right-4 sm:left-[10%] sm:right-auto w-auto sm:w-[clamp(12rem,60vw,90rem)] max-w-full flex flex-col gap-4 sm:gap-5 sm:px-[clamp(1rem,5vw,6rem)]">
          <div className="min-w-0">
            <p className="font-bold text-white text-[clamp(1rem,5vw,9rem)] pb-1">
              Pesticide Information Center
            </p>
            <p className="font-bold text-[clamp(0.6rem,2.5vw,5rem)] text-white">
              ESA rules, simplified.
            </p>
          </div>
          <div className="w-full max-w-[min(100%,28rem)] sm:max-w-fit shrink-0">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm md:text-base leading-snug text-[#d1d5db]">
                *This site does not store or collect personal data about
                pesticide application*
              </p>
              <p className="text-xs sm:text-sm md:text-base leading-snug text-[#d1d5db] mt-2 sm:mt-3">
                *These are recommendations, not sanctioned or approved*
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Get clear... */}
      <div className="flex items-center bg-white">
        <div className="px-4 sm:px-8 md:pr-[clamp(1rem,5vw,5rem)] md:pl-[clamp(4rem,21vw,23rem)] py-[clamp(1rem,9vw,12rem)] max-w-full">
          <p className="font-bold text-[#375B85] text-left sm:text-right text-[clamp(0.5rem,2.3vw,4rem)]">
            Get clear, customized{" "}
            <span className="text-[#537BBA]">ESA pesticide guidelines</span>{" "}
            based on your location with our easy-to use{" "}
            <span className="text-[#537BBA]">Map Tool</span> and product type
            and usage with our{" "}
            <span className="text-[#537BBA]">Chat Tools</span>.
          </p>
        </div>
      </div>

      <div className="bg-[#F0F0F0] py-[clamp(3rem,8vw,12rem)] px-[clamp(2rem,6vw,8rem)]">
        <div className="flex flex-col items-center gap-[clamp(2rem,6vw,8rem)]">
          <h2 className="font-bold text-[#375B85] text-[clamp(1.5rem,5vw,7rem)]">
            How It Works.
          </h2>

          <div className="flex flex-wrap justify-center gap-[clamp(2rem,6vw,10rem)]">
            {/* 1. Choose */}
            <div className={iconsSpacing}>
              <div className={iconsShape}>
                <FiUploadCloud className={iconsSize} />
              </div>
              <div className="flex flex-col gap-[clamp(0.5rem,1vw,2rem)]">
                <h3 className={steps}>1. Choose</h3>
                <p className={stepsDesc}>
                  the <span className="font-bold">Chat</span> or{" "}
                  <span className="font-bold">Map Tools</span> to begin your
                  search.
                </p>
              </div>
            </div>

            {/* 2. Search */}
            <div className={iconsSpacing}>
              <div className={iconsShape}>
                <IoSearchSharp className={iconsSize} />
              </div>
              <div className="flex flex-col gap-[clamp(0.5rem,1vw,2rem)]">
                <h3 className={steps}>2. Search</h3>
                <p className={stepsDesc}>
                  for your product through the{" "}
                  <span className="font-bold">
                    EPA ESA Pesticide Information on the page you chose
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* 3. Inform */}
            <div className={iconsSpacing}>
              <div className={iconsShape}>
                <FiBookOpen className={iconsSize} />
              </div>
              <div className="flex flex-col gap-[clamp(0.5rem,1vw,2rem)]">
                <h3 className={steps}>3. Inform</h3>
                <p className={stepsDesc}>
                  yourself on the latest information for your{" "}
                  <span className="font-bold">
                    region and state's safe usage
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Your Search */}
      <div className="bg-[#275C9D] py-[clamp(3rem,8vw,12rem)] px-[clamp(2rem,6vw,8rem)]">
        <div className="flex flex-col items-center gap-[clamp(1rem,4vw,6rem)]">
          <h2 className="font-bold text-white text-[clamp(1.5rem,5vw,8rem)]">
            Start Your Search.
          </h2>

          <p className="font-bold text-white text-center text-[clamp(0.75rem,2vw,4rem)] max-w-[clamp(25rem,60vw,70rem)]">
            Choose an option for how you would like find your ESA rules.
          </p>

          <div className="flex flex-wrap justify-center gap-[clamp(1rem,4vw,6rem)]">
            <Link href="/map" className={blueTools}>
              MAP
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </>
);}