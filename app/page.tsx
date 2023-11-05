"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { parse } from "path";

enum Bar {
    FULL = "full",
    BACKBEAT = "backbeat",
    SILENCE = "silence",
}

type Position = {
    bar: number;
    beat: number;
};

export default function Home() {
    const [pattern, setPattern] = useState([Bar.FULL, Bar.BACKBEAT]);
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

    const addFull = () => {
        setPattern((prev) => [...prev, Bar.FULL]);
    };

    const addBACKBEAT = () => {
        setPattern((prev) => [...prev, Bar.BACKBEAT]);
    };

    const addSilence = () => {
        setPattern((prev) => [...prev, Bar.SILENCE]);
    };

    const popLast = () => {
        setPattern((prev) => prev.slice(0, prev.length - 1));
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
            <div className="text-4xl">Metronome</div>
            <div className="flex flex-row space-x-1">
                <button className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400" onClick={start}>
                    start metronome
                </button>
            </div>

            <div className="p-2 flex flex-col items-center">
                <div className="text-4xl font-bold">{bpm}</div>
                <div className="text-xs text-gray-400 uppercase">beats per minute</div>

                <input type="range" min="30" max="240" step="0.01" onChange={slider} />
            </div>

            <div className="flex flex-row space-x-2 p-2  border-dashed border-gray-400 border rounded-sm">
                {pattern.map((bar, i) => (
                    <BarComponent
                        key={i}
                        type={bar}
                        beat={position.bar === i ? position.beat : undefined}
                    />
                ))}
            </div>

            <div className="flex flex-row space-x-1">
                <button
                    className="px-2 py-0.5 text-sm rounded bg-gray-300 border border-gray-400 hover:bg-gray-200"
                    onClick={addFull}
                >
                    add full
                </button>
                <button
                    className="px-2 py-0.5 text-sm rounded bg-gray-300 border border-gray-400 hover:bg-gray-200"
                    onClick={addBACKBEAT}
                >
                    add backbeat
                </button>
                <button
                    className="px-2 py-0.5 text-sm rounded bg-gray-300 border border-gray-400 hover:bg-gray-200"
                    onClick={addSilence}
                >
                    add silence
                </button>
                <button
                    className="px-2 py-0.5 text-sm rounded bg-gray-300 border border-gray-400 hover:bg-gray-200"
                    onClick={popLast}
                >
                    remove last
                </button>
            </div>
        </main>
    );
}

const BarComponent = ({ type, beat }: { type: Bar; beat: number | undefined }) => {
    return (
        <div
            className={clsx(
                "select-none px-2 py-1 rounded-xl flex flex-col items-center text-sm h-8 bg-gradient-to-b from-slate-200 to-slate-300 border ring-green-400 border-gray-500 shadow-md ring-offset-1",
                beat !== undefined && "ring-2"
            )}
        >
            <div className="flex flex-row space-x-1 items-center justify-center">
                {getPatternStrings(type).map((note, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "w-4 h-4 text-center text-lg",
                            beat === idx ? "text-green-400" : "text-slate-600"
                        )}
                    >
                        {note}
                    </div>
                ))}
            </div>
        </div>
    );
};

function getPatternStrings(bar: Bar) {
    switch (bar) {
        case Bar.FULL:
            return ["𝅘𝅥𝅮", "𝅘𝅥𝅮", "𝅘𝅥𝅮", "𝅘𝅥𝅮"];
        case Bar.BACKBEAT:
            return ["𝄽", "𝅘𝅥𝅮", "𝄽", "𝅘𝅥𝅮"];
        case Bar.SILENCE:
            return ["𝄽", "𝄽", "𝄽", "𝄽"];
    }
}
