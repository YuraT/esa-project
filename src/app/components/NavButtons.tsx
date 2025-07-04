import React from "react";

const navButtonClass =
  "font-bold text-white bg-[#ACADAA] rounded-3xl w-[clamp(5rem,11vw,15rem)] py-[clamp(0.5rem,1vw,3rem)] text-[clamp(0.5rem,1vw,5rem)] transition-colors hover:bg-[#C1C2BF]";

const NavButtons = () => {
  return (
    <div className="flex pr-[clamp(1rem,3vw,4rem)] gap-x-[clamp(0.2rem,1.5vw,2rem)] font-[family-name:var(--font-merriweather-sans)]">
      <button className={navButtonClass}>CHAT</button>
      <button className={navButtonClass}>MAP</button>
      <button className={navButtonClass}>MANUAL ENTRY</button>
    </div>
  );
};

export default NavButtons;
