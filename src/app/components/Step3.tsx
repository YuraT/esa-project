'use client';

import { useState } from "react";
import { ChevronDown } from 'lucide-react';


export default function Step3() {

    return (

            <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-240 h-90">
                
                <div className="flex items-center gap-22 mb-4 ">
                    <div className="w-8 h-8 mt-10 ml-10 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                    3
                    </div>
                    <div className="ml-45 mt-10 text-2xl font-bold text-[#275c9d]">
                    Predominantly Sandy Soils
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="italic font-bold mt-2 leading-tight text-center pl-50 pr-50 text-lg text-black">
                        **This option can only be used if the product label does not prohibit application on sandy soils**                        
                    </p> 

                    <p className="mt-4 leading-tight text-center pl-50 pr-50 text-lg text-black">
                        Determine whether your soil falls into <span className="font-bold">Moderately Sandy Soils</span> or <span className="font-bold">Predominantly Sandy Soils</span>.                 
                    </p> 

                   
                    <div className="flex items-center mt-5 w-60 h-10 shadow-md bg-white rounded-2xl border-4 border-[#cee0f5]">
                        <ChevronDown className="ml-50 text-[#99b3d1] hover:cursor-pointer"></ChevronDown>
                    </div>
                    
               

                    <p className="mt-4 leading-tight text-center pl-50 pr-50 text-lg text-black">
                        If you are unsure about your soil group, visit the <span className="font-bold">USDA’s Web Soil Texture Survey Tool</span> and begin a soil survey.
                    </p>

                    


                </div>

            
          </div>

    );

}