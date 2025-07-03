import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="items-center min-h-screen font-[family-name:var(--font-merriweather-sans)]">
      <div className="relative">
        <img
          src={"pesticideuser.svg"}
          alt="Pesticide User"
          className="w-full h-auto"
        ></img>
        <div className="absolute inset-0 bg-gradient-to-r from-[#275C9D]/80 to-white/50"></div>
        <div className="absolute top-[25%] left-[10%] w-[clamp(23rem,60vw,51rem)] px-[clamp(1rem,5vw,6rem)]">
          <p className="font-bold text-[clamp(2rem,5vw,4rem)] pb-1">
            Pesticide Information Center
          </p>
          <p className="font-bold text-[clamp(1rem,2.5vw,2rem)] text-white">
            ESA rules, simplified.
          </p>
          <div className="absolute bottom-[-80%]">
            <p className="text-[clamp(0.3rem,1vw,0.6rem)] text-[#9E9FA0]">
              *This site does not store or collect personal data about pesticide
              application*
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-24 bg-white"></div>

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
