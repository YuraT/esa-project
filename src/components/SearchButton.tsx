import { ChevronDown } from "lucide-react";

interface SearchButtonProps {
  label: string;
}

export default function SearchItem({ label }: SearchButtonProps) {
  return (
    <div className="w-[10vw] h-[8vh] bg-[#4673ab] flex items-center justify-center rounded-[0.5rem]">
          <h1 className="text-white text-2xl font-bold">GO!</h1>
        </div>
  );
}
