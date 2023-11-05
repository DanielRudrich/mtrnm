"use client";

import BarComponent, { BarComponentButton } from "@/components/BarComponent";
import { BarType, Position } from "@/common/types";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [pattern, setPattern] = useState<BarType[]>(["full", "backbeat"]);
  const [position, setPosition] = useState<Position>({ bar: 0, beat: 0 });
  const [bpm, setBpm] = useState(120);
  const contextRef = useRef<AudioContext | null>(null);
  const metronomeRef = useRef<AudioWorkletNode | null>(null);

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
    };
  }, []);

  useEffect(() => {
    const metronome = metronomeRef.current;
    if (!metronome) {
      return;
    }

    metronome.port.postMessage({ pattern });
  }, [pattern]);

  const start = () => {
    const audioContext = contextRef.current;
    if (!audioContext) {
      return;
    }
    console.log("resume");
    audioContext.resume();
  };

  const slider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioContext = contextRef.current;
    const metronome = metronomeRef.current;
    if (!audioContext || !metronome) {
      return;
    }

    const value = parseInt(e.target.value);
    metronome.parameters.get("bpm")!.value = value;
    setBpm(value);
  };

  return (
    <main className="container m-auto flex flex-col items-center space-y-2 p-8">
      <div className="text-5xl font-black tracking-tighter text-slate-800">
        MTRNM
      </div>
      <div className="flex flex-row space-x-1">
        <button
          className="rounded bg-gray-300 px-2 py-1 font-mono text-sm hover:bg-gray-400"
          onClick={start}
        >
          start metronome
        </button>
      </div>

      <div className="flex flex-col items-center p-2">
        <div className="text-6xl font-bold tracking-tighter text-gray-700">
          {bpm}
        </div>
        <div className="text-xs uppercase text-gray-400">beats per minute</div>

        <input type="range" min="30" max="240" step="0.01" onChange={slider} />
      </div>

      <div className="flex flex-row items-center space-x-1">
        {["full", "backbeat", "silence"].map((type) => (
          <button
            key={type}
            className=""
            onClick={() => {
              setPattern((prev) => [...prev, type as BarType]);
            }}
          >
            <BarComponentButton type={type as BarType} />
          </button>
        ))}

        <button
          className="rounded border border-slate-400 bg-slate-300 px-2 py-0.5 font-mono text-xs hover:bg-white"
          onClick={() => setPattern((prev) => prev.slice(0, prev.length - 1))}
        >
          remove last
        </button>
      </div>

      <div className="flex flex-col items-center space-y-1 rounded-xl bg-gray-200 p-1">
        <div className="font-mono text-xs font-bold uppercase text-gray-400">
          Pattern
        </div>
        {pattern.length === 0 ? (
          <div className="w-64 text-center font-mono text-sm text-slate-400">
            add bars using the buttons
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

      <div className="h-4"></div>
      <div className="text-xs text-slate-400">
        Made by{" "}
        <Link
          className="font-bold hover:text-slate-500"
          href="https://danielrudrich.de"
        >
          Daniel Rudrich
        </Link>
        {" - "}
        see the{" "}
        <Link
          className="font-bold hover:text-slate-500"
          href="https://github.com/DanielRudrich/mtrnm"
        >
          Source Code
        </Link>
      </div>
    </main>
  );
}
