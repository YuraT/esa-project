import NavButtons from "./components/NavButtons";

export default function Home() {
  return (
    <div className="items-center min-h-screen font-[family-name:var(--font-merriweather-sans)]">
      <div className="relative">
        <img
          src={"pesticideuser.svg"}
          alt="Pesticide User"
          className="w-full h-auto"
        ></img>

        {/** search, map, manual entry buttons */}
        <div className="absolute top-[5%] right-4 z-10">
          <NavButtons></NavButtons>
        </div>

        {/** background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#275C9D]/80 to-white/25"></div>

        <div className="absolute top-[25%] left-[10%] w-[clamp(23rem,60vw,51rem)] px-[clamp(1rem,5vw,6rem)]">
          <p className="font-bold text-[clamp(2rem,5vw,4rem)] pb-1">
            Pesticide Information Center
          </p>
          <p className="font-bold text-[clamp(1rem,2.5vw,2rem)] text-white">
            ESA rules, simplified.
          </p>
          <div className="absolute bottom-[-70%]">
            <p className="text-[clamp(0.3rem,1vw,1rem)] text-[#9E9FA0]">
              *This site does not store or collect personal data about pesticide
              application*
            </p>
          </div>
        </div>
      </div>

      {/** get clear... */}
      <div className="flex items-center relative h-[clamp(11rem,30vw,30rem)] bg-white">
        <div className="pr-[clamp(2rem,5vw,5rem)] pl-[clamp(5rem,21vw,21rem)]">
          <p className="font-bold text-[#375B85] text-right text-[clamp(0.8rem,2.3vw,3rem)]">
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

      {/** how it works */}
      <div className="relative bg-[#F0F0F0] h-[clamp(11rem,30vw,30rem)]"></div>

      {/** start your search */}
      <div className="relative bg-[#275C9D] h-[clamp(13rem,35vw,35rem)]">
        <div><NavButtons></NavButtons></div>
      </div>

      {/** footer */}

      {/* <footer className="absolute row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://blt.epa.gov/blt/swagger/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          BLT API
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.epa.gov/pesticides/mitigation-menu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Mitigation Menu
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.epa.gov/endangered-species"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          EPA
        </Link>
      </footer> */}
    </div>
  );
}
