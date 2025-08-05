'use client';

import { useState } from "react";

export default function Step4() {

     const [selected, setSelected] = useState<"yes" | "no" | null>(null);

    return (
            <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-240 h-150">
                
                <div className="flex items-center gap-30 mb-4 ">
                    <div className="w-8 h-8 mt-10 ml-10 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                    4
                    </div>
                    <div className="ml-45 mt-10 text-2xl font-bold text-[#275c9d]">
                    Mitigation Tracking
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="leading-tight pl-20 pr-20 text-lg text-black">
                        The EPA gives 1 mitigation point to growers or applicators
                    </div>
                    <div className="mb-3 leading-tight pl-20 pr-20 text-lg text-black">
                        who keep track of their runoff/erosion mitigation steps.
                    </div>
                    <div className="leading-tight pl-20 pr-20 text-lg text-black font-bold">
                        Tracking helps make sure you're meeting the required 
                    </div>
                    <div className="leading-tight pl-20 pr-20 text-lg text-black font-bold">
                        number of points listed on pesticide lables or bulletins.
                    </div>
                    <div className="mt-5 w-85 h-55 bg-[#969595]">
                    </div>

                    <div className="mt-10 text-xl font-bold text-[#275c9d]">
                    Do you perform Mitigation Tracking?
                    </div>

                    <div className="flex">
                        <div 
                            onClick={() => setSelected("yes")}
                            className={`${
                                selected === "yes" ? "bg-[#cee0f5] text-[#275c9d]" : "bg-white text-[#275c9d] hover:bg-[#cee0f5] cursor-pointer"
                            } font-bold text-xl flex items-center justify-center mt-6 h-14 w-28 rounded-l-3xl border-l-4 border-t-4 border-b-4 border-t-[#cee0f5] border-b-[#cee0f5] border-l-[#cee0f5]`}
                        >
                            YES
                        </div>
                        <div 
                            onClick={() => setSelected("no")}
                            className={`${
                                selected === "no" ? "bg-[#cee0f5] text-[#275c9d]" : "bg-white text-[#275c9d] hover:bg-[#cee0f5] cursor-pointer"
                            } font-bold text-xl flex items-center justify-center mt-6 h-14 w-28 rounded-r-3xl border-r-4 border-t-4 border-b-4 border-t-[#cee0f5] border-b-[#cee0f5] border-r-[#cee0f5] border-l-4 border-l-[#cee0f5]`}
                        >
                            NO
                        </div>
                    </div>


                </div>
          </div>

    );

}