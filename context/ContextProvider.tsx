import { ReactNode, useEffect, useState } from "react";
import { BpmContext } from "./BPMContext";
import { BarType, Pattern } from "@/common/types";
import { PatternContext } from "./PatternContext";
import { PositionContext } from "./PositionContext";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bpm, setBpm] = useState(parseBPM(searchParams) ?? 120);
  const [pattern, setPattern] = useState<Pattern>(
    parsePattern(searchParams) ?? ["full", "backbeat"],
  );
  const [position, setPosition] = useState({ bar: 0, beat: -1 });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("bpm", bpm.toString());
    params.set("p", convertPatternToParam(pattern));
    router.replace("?" + params.toString());
  }, [bpm, pattern]);

  return (
    <BpmContext.Provider value={{ bpm, setBpm }}>
      <PatternContext.Provider value={{ pattern, setPattern }}>
        <PositionContext.Provider value={{ position, setPosition }}>
          {children}
        </PositionContext.Provider>
      </PatternContext.Provider>
    </BpmContext.Provider>
  );
};

function parseBPM(searchParams: ReadonlyURLSearchParams): number | null {
  const BPM_MIN = 30;
  const BPM_MAX = 300;

  const param = searchParams.get("bpm");
  if (!param) {
    return null;
  }
  const bpm = parseInt(param);

  if (isNaN(bpm) || bpm < BPM_MIN || bpm > BPM_MAX) {
    return null;
  }

  return bpm;
}

const lookupPattern: Record<string, BarType> = {
  f: "full",
  b: "backbeat",
  s: "silence",
};

function convertPatternToParam(pattern: Pattern): string {
  return pattern.map((bar) => bar[0]).join("");
}

function parsePattern(searchParams: ReadonlyURLSearchParams): Pattern | null {
  const param = searchParams.get("p");
  if (!param) {
    return null;
  }

  const pattern = param.split("").map((c) => lookupPattern[c]);
  if (pattern.some((bar) => !bar)) {
    return null;
  }

  return pattern;
}
