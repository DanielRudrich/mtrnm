export type BarType = "full" | "backbeat" | "silence";

export type Pattern = BarType[];

export type Position = {
  bar: number;
  beat: number;
};
