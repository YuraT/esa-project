'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";
export default function Step1() {

    return (
            <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-230 h-80">
                
                <div className="flex items-center gap-10 mb-4 ">
                    <div className="w-8 h-8 mt-10 ml-10 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                    1
                    </div>
                    <div className="ml-35 mt-10 text-2xl font-bold text-[#275c9d]">
                        County Pesticide Runoff Vulnerability                    
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="mt-2 leading-tight text-center pl-60 pr-60 text-lg text-black">
                        Select your county to see where it lies on the
                        <span className="font-bold"> Pesticide Runoff Vulnerability </span>Scale.
                    </p> 
                    <div className="flex items-center mt-5 w-60 h-10 shadow-md bg-white rounded-2xl border-4 border-[#cee0f5]">
                        <ChevronDown className="ml-50 text-[#99b3d1] hover:cursor-pointer"></ChevronDown>
                    </div>

                    <div className="flex mt-8">
                        <div className="flex items-center justify-center w-30 h-12 bg-[#d3faad] rounded-l-4xl text-[#275c9d] font-bold text-lg">Very Low</div>
                        <div className="flex items-center justify-center w-30 h-12 bg-[#fff896] text-[#275c9d] font-bold text-lg">Low</div>
                        <div className="flex items-center justify-center w-30 h-12 bg-[#ffd073] text-[#275c9d] font-bold text-lg">Medium</div>
                        <div className="flex items-center justify-center  w-30 h-12 bg-[#ff796d] rounded-r-4xl text-[#275c9d] font-bold text-lg">High</div>

                    </div>

                </div>
            
          </div>
      

    );

}