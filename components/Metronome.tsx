import { useBpm } from "@/context/BPMContext";
import { usePattern } from "@/context/PatternContext";
import { usePosition } from "@/context/PositionContext";
import { useCallback, useEffect, useRef, useState } from "react";

import { BsFillPlayFill, BsStopFill } from "react-icons/bs";
import { TempoTapComponent } from "./TempoTapComponent";
import BPMSlider from "./BPMSlider";

export function Metronome() {
  const { bpm } = useBpm();
  const { pattern } = usePattern();
  const { setPosition } = usePosition();

  const [playing, setPlaying] = useState(false);

  const contextRef = useRef<AudioContext | null>(null);
  const metronomeRef = useRef<AudioWorkletNode | null>(null);

  useEffect(() => {
    const metronome = metronomeRef.current;
    if (!metronome) {
      return;
    }
    metronome.parameters.get("bpm")!.value = bpm;
  }, [bpm]);

  useEffect(() => {
    const audioContext = new AudioContext();
    audioContext.audioWorklet
      ?.addModule("audioworklet/metronome.worklet.js")
      .then((_) => {
        contextRef.current = audioContext;
        const metronome = new AudioWorkletNode(audioContext, "metronome", {
          processorOptions: { pattern },
        });
        metronomeRef.current = metronome;
        metronome.port.onmessage = (e) => {
          setPosition(e.data);
        };
        metronome.connect(audioContext.destination);
      })
      .catch((reason) => {
        console.error("Failed to load worklet with", reason);
      });

    return () => {
      contextRef.current?.suspend();
      contextRef.current = null;
      metronomeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const metronome = metronomeRef.current;
    if (!metronome) {
      return;
    }

    metronome.port.postMessage({ pattern });
  }, [pattern]);

  const togglePlaying = useCallback(() => {
    const audioContext = contextRef.current;
    const metronome = metronomeRef.current;
    if (!audioContext || !metronome) {
      return;
    }

    audioContext.resume();

    const newPlaying = !playing;
    metronome.parameters.get("playing")!.value = newPlaying ? 1 : 0;
    setPlaying(newPlaying);
  }, [playing]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-evenly space-x-2">
        <TempoTapComponent />
        <div className="flex flex-col items-center p-2">
          <div className="text-6xl font-bold tracking-tighter text-gray-700">
            {bpm}
          </div>
          <div className="text-xs uppercase text-gray-400">
            beats per minute
          </div>
        </div>
        <button
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 px-2 py-1 font-mono text-2xl text-gray-600 hover:bg-gray-300"
          onClick={togglePlaying}
        >
          {playing ? <BsStopFill /> : <BsFillPlayFill />}
        </button>
      </div>
      <BPMSlider />
    </div>
  );
}
