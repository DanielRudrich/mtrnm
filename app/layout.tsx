import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import { Noto_Music } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "MTRNM",
  description: "Customizable Metronome",
};

const noto = Noto_Music({
  weight: "400",
  subsets: ["music"],
  variable: "--font-noto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${noto.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
