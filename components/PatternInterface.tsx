import { usePattern } from "@/context/PatternContext";
import { BarComponentButton } from "./BarComponent";
import { BarType } from "@/common/types";
import { PatternViewer } from "./PatternViewer";

export function PatternInterface() {
  const { setPattern } = usePattern();

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row items-center space-x-1">
        {["full", "backbeat", "silence"].map((type) => (
          <button
            key={type}
            className=""
            onClick={() => {
              setPattern((prev) => [...prev, type as BarType]);
            }}
          >
            <BarComponentButton type={type as BarType} />
          </button>
        ))}

        <button
          className="rounded border border-gray-300 bg-gray-200 px-2 py-0.5 font-mono text-xs hover:bg-white"
          onClick={() => setPattern((prev) => prev.slice(0, prev.length - 1))}
        >
          remove last
        </button>
      </div>

      <PatternViewer />
    </div>
  );
}
