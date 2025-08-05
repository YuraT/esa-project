'use client';

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Step3 from "../components/Step3";
import Step4 from "../components/Step4";
import Step5 from "../components/Step5";
import Step6 from "../components/Step6";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";


export default function MitigationTable() {
    // State for each mitigation step
    const [countyVuln, setCountyVuln] = useState<number>(0); // 6, 3, 2, 0
    const [fieldSlope, setFieldSlope] = useState<number>(0); // 3 or 0
    const [soilPoints, setSoilPoints] = useState<number>(0); // 2, 3, or 0
    const [tracking, setTracking] = useState<number>(0); // 1 or 0
    const [techSpecialist, setTechSpecialist] = useState<number>(0); // 1 or 2 or 0
    const [conservationProgram, setConservationProgram] = useState<number>(0); // 1 or 2 or 0

    const searchParams = useSearchParams();
    const router = useRouter();

    const month = searchParams.get("month");
    const product = searchParams.get("product");
    const county = searchParams.get("county");

    // Build mitigations param
    const mitigations = [countyVuln, fieldSlope, soilPoints, tracking, techSpecialist, conservationProgram].join(",");

    const scrollToStep = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/*added header manually here due to positioning issue*/}

            <Header />
            <div className="flex">
                <div className="sticky top-0 flex flex-col items-center w-150 h-screen bg-[#cee0f5]">
                    <div className="mt-18 mb-5 text-[#275c9d] text-2xl font-bold">Step _ of 6</div>

                    <div className="flex items-center mt-10 bg-[#bed2e8] w-70 h-15 cursor-pointer" onClick={() => scrollToStep("step1")}>
                        <div className="w-9 h-7 ml-4 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                            1
                        </div>
                        <div className="leading-tight ml-5 text-[#275c9d] font-semibold">County Pesticide Runoff Vulnerability</div>
                    </div>

                    <div className="flex items-center mt-10 bg-[#bed2e8] w-70 h-15 cursor-pointer" onClick={() => scrollToStep("step2")}>
                        <div className="w-7 h-7 ml-4 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                            2
                        </div>
                        <div className="leading-tight ml-5 text-[#275c9d] font-semibold">Field Slope</div>
                    </div>

                    <div className="flex items-center mt-10 bg-[#bed2e8] w-70 h-15 cursor-pointer" onClick={() => scrollToStep("step3")}>
                        <div className="w-7 h-7 ml-4 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                            3
                        </div>
                        <div className="leading-tight ml-5 text-[#275c9d] font-semibold">Predominantly Sandy Soils</div>
                    </div>

                    <div className="flex items-center mt-10 bg-[#bed2e8] w-70 h-15 cursor-pointer" onClick={() => scrollToStep("step4")}>
                        <div className="w-7 h-7 ml-4 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                            4
                        </div>
                        <div className="leading-tight ml-5 text-[#275c9d] font-semibold">Mitigation Tracking</div>
                    </div>

                    <div className="flex items-center mt-10 bg-[#bed2e8] w-70 h-15 cursor-pointer" onClick={() => scrollToStep("step5")}>
                        <div className="w-7 h-7 ml-4 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                            5
                        </div>
                        <div className="leading-tight ml-5 text-[#275c9d] font-semibold">Technical Specialist </div>
                    </div>

                    <div className="flex items-center mt-10 bg-[#bed2e8] w-70 h-15 cursor-pointer" onClick={() => scrollToStep("step6")}>
                        <div className="w-7 h-7 ml-4 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                            6
                        </div>
                        <div className="leading-tight ml-5 text-[#275c9d] font-semibold">Conservation Program </div>
                    </div>

                    <div className="flex items-center mt-10 bg-[#cee0f5] w-80 h-15"></div>
                </div>

                <div className="bg-white ml-20">
                    <p className="mt-10 mb-10 text-[#275c9d] text-4xl font-bold ">Mitigation Menu</p>
                    <p className="mb-5 text-[#275c9d] text-2xl font-bold ">Runoff & Erosion Mitigation Options</p>
                    <p className="mb-5 leading-tight text-black text-xl font-bold mr-60">
                        Select a combination of measures within the tables to achieve the minimum points required by the label or bulletin.
                    </p>
                    <p className="text-[#275c9d] text-xl font-bold mb-5 ">What are Mitigation Points?</p>
                    <p className="mb-15 leading-tight text-black text-xl mr-60">
                        Mitigation points are scores used to show how much action is needed to prevent pesticides from polluting water. More points mean less risk and fewer actions required.
                    </p>

                    <div id="step1"><Step1 value={countyVuln} setValue={setCountyVuln} /></div>
                    <div id="step2"><Step2 value={fieldSlope} setValue={setFieldSlope} /></div>
                    <div id="step3"><Step3 value={soilPoints} setValue={setSoilPoints} /></div>
                    <div id="step4"><Step4 value={tracking} setValue={setTracking} /></div>
                    <div id="step5"><Step5 value={techSpecialist} setValue={setTechSpecialist} /></div>
                    <div id="step6"><Step6 value={conservationProgram} setValue={setConservationProgram} /></div>

                    <div className="mt-10 mb-10">
                    <Link
                        href={`/PrintReport?month=${encodeURIComponent(month || '')}&product=${encodeURIComponent(product || '')}&county=${encodeURIComponent(county || '')}&mitigations=${mitigations}`}
                        className="ml-220 bg-[#275c9d] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1f4b7a] transition duration-200"
                    >
                        Next
                    </Link>
                </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
