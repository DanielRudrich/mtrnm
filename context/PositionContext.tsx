import { Position } from "@/common/types";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

type PositionContextType = {
  position: Position;
  setPosition: Dispatch<SetStateAction<Position>>;
};

export const PositionContext = createContext<PositionContextType>({
  position: { bar: 0, beat: 0 },
  setPosition: () => {},
});

export const usePosition = () => useContext(PositionContext);
