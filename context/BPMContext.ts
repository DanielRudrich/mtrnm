import { Dispatch, SetStateAction, createContext, useContext } from "react";

type BpmContextType = {
  bpm: number;
  setBpm: Dispatch<SetStateAction<number>>;
};

export const BpmContext = createContext<BpmContextType>({
  bpm: 120,
  setBpm: () => {},
});

export const useBpm = () => useContext(BpmContext);
