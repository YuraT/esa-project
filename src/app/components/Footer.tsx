import Link from "next/link";
import React from "react";

const Footer = () => {
  const footer =
    "font-bold text-base sm:text-lg md:text-xl pb-2 sm:pb-[clamp(0.2rem,1vw,1rem)]";
  const footerLinks =
    "block w-full max-w-none sm:max-w-md text-sm sm:text-base leading-snug py-1 hover:underline";

  return (
    <div className="w-full bg-[#3E4651]">
      <div className="flex flex-col sm:flex-row sm:flex-wrap text-white justify-center items-stretch gap-y-8 gap-x-8 sm:gap-x-12 md:gap-x-16 lg:gap-x-24 px-4 py-8 sm:p-[clamp(1rem,3vw,4rem)] w-full max-w-none mx-auto">
        {/* About EPA */}
        <div>
          <p className={footer}>About EPA</p>
          <Link
            className={footerLinks}
            href={"https://www.epa.gov/"}
            target="_blank"
          >
            EPA
          </Link>
        </div>
        {/* Resources */}
        <div>
          <p className={footer}>Resources</p>
          <Link
            className={footerLinks}
            href={"https://blt.epa.gov/blt/swagger/"}
            target="_blank"
          >
            Bulletins Live! Two
          </Link>
          <Link
            className={footerLinks}
            href={
              "https://www.epa.gov/endangered-species/bulletins-live-two-view-bulletins"
            }
            target="_blank"
          >
            BLT API
          </Link>
          <Link
            className={footerLinks}
            href={"https://www.epa.gov/pesticide-registration"}
            target="_blank"
          >
            EPA Pesticide Registration
          </Link>
          <Link
            className={footerLinks}
            href={
              "https://www.epa.gov/laws-regulations/summary-endangered-species-act"
            }
            target="_blank"
          >
            Endangered Species Act Information
          </Link>
          <Link
            className={footerLinks}
            href={"https://www.epa.gov/pesticides/mitigation-menu"}
            target="_blank"
          >
            Mitigation Menu
          </Link>
        </div>
        {/* Legal & Privacy */}
        <div>
          <p className={footer}>Legal & Privacy</p>
          <Link
            className={footerLinks}
            href={
              "https://www.epa.gov/accessibility/epa-accessibility-statement"
            }
            target="_blank"
          >
            Accesibility Statement
          </Link>
          <Link
            className={footerLinks}
            href={"https://www.epa.gov/ocr/no-fear-act-data"}
            target="_blank"
          >
            No FEAR Act Data
          </Link>
          <Link
            className={footerLinks}
            href={"https://www.epa.gov/privacy"}
            target="_blank"
          >
            Privacy
          </Link>
          <Link
            className={footerLinks}
            href={"https://www.epa.gov/privacy/privacy-and-security-notice"}
            target="_blank"
          >
            Privacy & Security Notice
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
