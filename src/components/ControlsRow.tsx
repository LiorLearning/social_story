import { ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const ControlsRow = () => {
  return (
    <div className="mx-auto max-w-[1280px] px-10 py-4">
      <div className="flex items-center justify-between">
        {/* Left tabs */}
        <div className="flex items-center gap-6">
          <button className="h-11 px-4 text-body font-medium text-ink border-b-2 border-indigo-600 focus-ring">
            All
          </button>
          <button className="h-11 px-4 text-body text-slate-700 hover:text-ink transition-colors focus-ring">
            My Class
          </button>
          <button className="h-11 px-4 text-body text-slate-700 hover:text-ink transition-colors focus-ring">
            New
          </button>
          <button className="h-11 px-4 text-body text-slate-700 hover:text-ink transition-colors flex items-center gap-1 focus-ring">
            <Star className="w-4 h-4" />
            Top
          </button>
          <Button 
            variant="ghost" 
            className="h-11 px-4 text-body text-slate-700 hover:text-ink flex items-center gap-1 focus-ring"
          >
            Genre
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Right sort */}
        <Button 
          variant="ghost"
          className="h-11 px-4 text-body text-slate-700 hover:text-ink flex items-center gap-1 focus-ring"
        >
          Newest
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ControlsRow;