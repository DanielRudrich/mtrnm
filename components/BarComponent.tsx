import clsx from "clsx";
import { BarType } from "@/common/types";
import { useEffect, useRef } from "react";

export default function BarComponent({
  type,
  beat,
}: {
  type: BarType;
  beat: number | undefined;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (beat === undefined) {
      return;
    }

    container.current?.classList.remove("transition-colors");
    container.current?.classList.add("transition-none");
    container.current?.classList.remove("bg-slate-100");
    container.current?.classList.add("bg-green-100");
    container.current?.classList.remove("ring-green-300");
    container.current?.classList.add("ring-green-400");

    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      container.current?.classList.remove("transition-none");
      container.current?.classList.add("transition-colors");
      container.current?.classList.remove("bg-green-100");
      container.current?.classList.add("bg-slate-100");
      container.current?.classList.remove("ring-green-400");
      container.current?.classList.add("ring-green-300");
    })();
  }, [beat]);

  return (
    <div
      ref={container}
      className={clsx(
        "flex select-none flex-col items-center rounded-xl border bg-slate-100 px-2 py-1 text-sm shadow-md ring-green-300 ring-offset-1 transition-colors duration-500 ease-out",
        beat !== undefined && "ring-2",
      )}
    >
      <div className="flex flex-row items-center justify-around space-x-1">
        {getPatternStrings(type).map((note, idx) => (
          <div
            key={idx}
            className={clsx(
              "font-music h-7 w-4 text-center text-xl",
              beat === idx ? "font-semibold text-slate-800" : "text-slate-500",
            )}
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarComponentButton({ type }: { type: BarType }) {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      className={clsx(
        "flex select-none flex-col items-center rounded-xl border bg-slate-200 px-2 py-0.5 shadow hover:bg-white",
      )}
    >
      <div className="flex flex-row items-center justify-center space-x-1">
        {getPatternStrings(type).map((note, idx) => (
          <div
            key={idx}
            className="font-music h-6 w-3 text-center text-base text-slate-900"
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}

function getPatternStrings(type: BarType) {
  switch (type) {
    case "full":
      return ["𝅘𝅥𝅮", "𝅘𝅥𝅮", "𝅘𝅥𝅮", "𝅘𝅥𝅮"];
    case "backbeat":
      return ["𝄽", "𝅘𝅥𝅮", "𝄽", "𝅘𝅥𝅮"];
    case "silence":
      return ["𝄽", "𝄽", "𝄽", "𝄽"];
  }
}
