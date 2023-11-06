import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Pattern } from "@/common/types";

type PatternContextType = {
  pattern: Pattern;
  setPattern: Dispatch<SetStateAction<Pattern>>;
};

export const PatternContext = createContext<PatternContextType>({
  pattern: ["full"] as Pattern,
  setPattern: () => {},
});

export const usePattern = () => useContext(PatternContext);
