import { usePattern } from "@/context/PatternContext";
import BarComponent from "./BarComponent";
import { usePosition } from "@/context/PositionContext";
import { useEffect, useRef } from "react";

export function PatternViewer() {
  const infoRef = useRef<HTMLDivElement>(null);

  const { pattern } = usePattern();
  const { position } = usePosition();

  useEffect(() => {
    if (!infoRef.current) return;

    const info = infoRef.current;

    info.classList.remove("transition-colors");
    info.classList.add("transition-none");
    info.classList.remove("text-slate-400");
    info.classList.add("text-blue-400");

    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      info.classList.remove("transition-none");
      info.classList.add("transition-colors");
      info.classList.remove("text-blue-400");
      info.classList.add("text-slate-400");
    })();
  }, [position]);

  return (
    <div className="flex flex-col items-center space-y-1 rounded-xl bg-gray-200 p-1 ease-out">
      <div className="font-mono text-xs font-bold uppercase text-gray-400 transition-colors">
        Pattern
      </div>
      {pattern.length === 0 ? (
        <div
          ref={infoRef}
          className="w-96 p-2 text-center font-mono text-sm text-slate-400"
        >
          add bars using the buttons above or 1, 2, 3 keys
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 p-2 sm:grid-cols-4">
          {pattern.map((bar, i) => (
            <BarComponent
              key={i}
              type={bar}
              beat={position.bar === i ? position.beat : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
