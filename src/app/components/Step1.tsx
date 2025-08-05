'use client';

import { useEffect } from 'react';
import mitigationPoints from '@/app/data/mitigation-points.json';
import usCounties from '@/app/data/uscounties.json';

export default function Step1({ county, value, setValue }: { county: string, value: number, setValue: (v: number) => void }) {
    // Parse county and state
    let displayCounty = county;
    let points = 0;
    let vulnLabel = '';
    let stateAbbr = '';
    let countyName = '';
    let stateFull = '';
    if (county) {
        [countyName, stateAbbr] = county.split(',').map(s => s.trim());
        // Get full state name from uscounties.json
        const countyEntry = usCounties.find((c: any) => c.county_ascii.toLowerCase() === countyName.toLowerCase() && c.state_id === stateAbbr);
        if (countyEntry) {
            stateFull = countyEntry.state_name;
        }
        // Find points from mitigation-points.json
        const stateObj = mitigationPoints.find((s: any) => s.state === stateFull);
        if (stateObj) {
            const countyObj = stateObj.county.find((c: any) => c.name.toLowerCase() === countyName.toLowerCase());
            if (countyObj) {
                points = countyObj.points;
            }
        }
        // Label
        const vulnMap: Record<number, string> = {
            6: 'very low',
            3: 'low',
            2: 'medium',
            0: 'high',
        };
        vulnLabel = vulnMap[points] || 'unknown';
    }

    useEffect(() => {
        setValue(points);
    }, [county, points, setValue]);

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
                    County: <span className="font-bold">{displayCounty}</span>
                </p>
                <div className="flex mt-8">
                    <div className={`flex items-center justify-center w-30 h-12 rounded-l-4xl text-[#275c9d] font-bold text-lg ${points === 6 ? 'bg-[#d3faad] border-4 border-blue-500' : 'bg-[#d3faad]'}`}>Very Low</div>
                    <div className={`flex items-center justify-center w-30 h-12 text-[#275c9d] font-bold text-lg ${points === 3 ? 'bg-[#fff896] border-4 border-blue-500' : 'bg-[#fff896]'}`}>Low</div>
                    <div className={`flex items-center justify-center w-30 h-12 text-[#275c9d] font-bold text-lg ${points === 2 ? 'bg-[#ffd073] border-4 border-blue-500' : 'bg-[#ffd073]'}`}>Medium</div>
                    <div className={`flex items-center justify-center w-30 h-12 rounded-r-4xl text-[#275c9d] font-bold text-lg ${points === 0 ? 'bg-[#ff796d] border-4 border-blue-500' : 'bg-[#ff796d]'}`}>High</div>
                </div>
                <p className="mt-4 text-lg text-black">Runoff Vulnerability: <span className="font-bold">{vulnLabel}</span> ({points} points)</p>
            </div>
        </div>
    );
};
