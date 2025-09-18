import { Badge } from "@/components/ui/badge";

const PilotMeter = () => {
  return (
    <div className="mx-auto max-w-[1280px] px-10 py-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
          10 creators
        </Badge>
        <span className="text-slate-400">•</span>
        <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
          36 stories
        </Badge>
        <span className="text-slate-400">•</span>
        <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
          142 reactions
        </Badge>
      </div>
    </div>
  );
};

export default PilotMeter;