import { ChevronDown } from "lucide-react";

interface SearchItemProps {
  label: string;
}

export default function SearchItem({ label }: SearchItemProps) {
  return (
    <div className="flex flex-col">
      <div className="w-[23vw] h-[6vh] bg-[#678dc9] rounded-t-[0.5rem] flex items-center justify-start pl-3">
        <h1 className="text-white text-[20px] font-bold">{label}</h1>
      </div>
      <div className="w-[23vw] h-[6vh] bg-[#edebeb] rounded-b-[0.5rem] flex items-center justify-end pr-3">
        <ChevronDown className="text-[#275c9d] w-10 h-10" />
      </div>
    </div>
  );
}
