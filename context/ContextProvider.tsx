import { ReactNode, useEffect, useRef, useState } from "react";
import { BpmContext } from "./BPMContext";
import { Pattern } from "@/common/types";
import { PatternContext } from "./PatternContext";
import { PositionContext } from "./PositionContext";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [bpm, setBpm] = useState(120);
  const [pattern, setPattern] = useState<Pattern>(["full", "backbeat"]);
  const [position, setPosition] = useState({ bar: 0, beat: -1 });

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
