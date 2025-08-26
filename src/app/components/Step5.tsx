'use client';

import { useState, useEffect } from "react";

export default function Step5({ value, setValue }: { value: number; setValue: (v: number) => void }) {

    const [checked1, setChecked1] = useState(value !== 0);
    const [checked2, setChecked2] = useState(value !== 0);
    const [checked3, setChecked3] = useState(value !== 0);

    useEffect(() => {
        setValue(checked1 && checked2 && checked3 ? 1 : 0);
    }, [checked1, checked2, checked3, setValue]);

    return (
            <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-240 h-200">
                
                <div className="flex items-center gap-10 mb-4 ">
                    <div className="w-8 h-8 mt-10 ml-10 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                    5
                    </div>
                    <div className="ml-40 mt-10 text-2xl font-bold text-[#275c9d]">
                    Working with a Technical Specialist
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="leading-tight text-center pl-35 pr-35 text-lg text-[#275c9d]">
                        The EPA states <span className="font-bold">1 mitigation point</span> is available to grower / applicators
                        that work with a runoff / erosion technical expert that meets the 
                        characteristics described below. 
                    </p> 

                    <p className="mt-6 leading-tight text-center pl-15 pr-15 text-xl text-[#275c9d] font-bold">
                        Check all boxes that apply to the technical expert you work with:
                    </p> 
                    


                    <div className="flex items-center mt-7 w-170 h-20 rounded-t-xl bg-[#577bb5]">
                        <p className="pl-5 pr-10 leading-tight text-lg text-white font-bold">
                            Expert has technical training, education, and/or experience in:
                        </p>

                        <div 
                            onClick={() => setChecked1(!checked1)}
                            className={`w-8 h-7 ml-10 mr-5 rounded-sm flex items-center justify-center ${
                            checked1 ? "bg-white hover:cursor-pointer" : "bg-white hover:cursor-pointer"
                            }`}
                        >
                            {checked1 && <span>✔️</span>}
                        </div>
                    </div>

                    <div className="w-170 h-30 bg-white rounded-b-xl">
                        <ul className="mt-5 ml-5 leading-tight font-medium text-lg pl-5 text-[#275c9d] list-disc list-outside">
                            <li>Agricultural discipline</li>
                            <li>Water or soil conservation</li>
                            <li>Or other relevant discipline that provides training and practice in the area of runoff or erosion mitigation technologies/measures</li>                     
                        </ul>

                    </div>

                    <div className="flex items-center mt-7 w-170 h-30 rounded-xl bg-[#577bb5]">
                        <p className="w-170 pl-5 pr-10 leading-tight text-lg text-white font-bold">
                            Expert participates in continued education or training in the area of expertise which should include run off and erosion control.                        
                        </p>

                        <div 
                            onClick={() => setChecked2(!checked2)}
                            className={`w-9 h-7 mr-5 rounded-sm flex items-center justify-center ${
                            checked2 ? "bg-white hover:cursor-pointer" : "bg-white hover:cursor-pointer"
                            }`}
                        >
                            {checked2 && <span>✔️</span>}
                        </div>
                    </div>

                    <div className="flex items-center mt-7 w-170 h-35 rounded-xl bg-[#577bb5]">
                        <p className="w-170 pl-5 pr-6 leading-tight text-lg text-white font-bold">
                            Have experience advising on conservation measures designed to develop site specific runoff and erosion plans that include mitigation measures described in EPA’s Mitigation Website.                        
                        </p>

                        <div 
                            onClick={() => setChecked3(!checked3)}
                            className={`w-9 h-7 mr-5 rounded-sm flex items-center justify-center ${
                            checked3 ? "bg-white hover:cursor-pointer" : "bg-white hover:cursor-pointer"
                            }`}
                        >
                            {checked3 && <span>✔️</span>}
                        </div>
                    </div>
                </div>
          </div>
    );
};
