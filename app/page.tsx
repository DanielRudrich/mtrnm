"use client";

import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { Metronome } from "@/components/Metronome";
import { ContextProvider } from "@/context/ContextProvider";
import { PatternInterface } from "@/components/PatternInterface";

export default function Home() {
  return (
    <main className="container m-auto flex flex-col items-center space-y-6 p-8">
      <ContextProvider>
        <Logo />
        <Metronome />
        <PatternInterface />
      </ContextProvider>

      <Footer />
    </main>
  );
}
