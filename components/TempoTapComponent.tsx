import { sanitizeBPM } from "@/common/utils";
import { useBpm } from "@/context/BPMContext";
import { useEffect, useMemo, useRef } from "react";

class TempoTapOMat {
  private lastTapTime: number = 0;
  private diffs: number[] = [];

  public tap(): number | undefined {
    const now = Date.now();
    const delta = now - this.lastTapTime;
    this.lastTapTime = now;

    if (delta > 2000) {
      this.diffs = [];
      return;
    }

    this.diffs.push(delta);

    if (this.diffs.length < 2) {
      return;
    }

    if (this.diffs.length > 8) {
      this.diffs.shift();
    }

    const sum = this.diffs.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / this.diffs.length;
    const bpm = Math.round(60000 / avg);

    return sanitizeBPM(bpm);
  }
}

export function TempoTapComponent() {
  const { setBpm } = useBpm();

  const tapOMat = useMemo(() => new TempoTapOMat(), []);

  const button = useRef<HTMLButtonElement>(null);

  const tap = () => {
    button.current?.classList.remove("transition-colors");
    button.current?.classList.add("transition-none");
    button.current?.classList.remove("bg-gray-100");
    button.current?.classList.add("bg-blue-200");

    const bpm = tapOMat.tap();
    if (bpm) setBpm(bpm);

    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      button.current?.classList.remove("transition-none");
      button.current?.classList.add("transition-colors");
      button.current?.classList.remove("bg-blue-200");
      button.current?.classList.add("bg-gray-100");
    })();
  };

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "t") {
        tap();
      }
    };

    window.addEventListener("keydown", keydown);

    return () => {
      window.removeEventListener("keydown", keydown);
    };
  }, []);

  return (
    <button
      ref={button}
      onClick={tap}
      className="flex h-16 w-16  select-none items-center justify-center rounded-full border-[1.5px] border-dashed border-gray-300 bg-gray-100 font-mono text-sm text-gray-400 transition-colors ease-out"
    >
      tap
    </button>
  );
}
