import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import { Noto_Music } from "next/font/google";
import "./globals.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "MTRNM",
  description: "MTRNM - Metronome with customizable click patterns.",
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
      <Head>
        <meta
          name="description"
          content="Metrome which lets you create custom click patterns to practice tempo and rhythm."
          key="desc"
        />
        <meta
          property="og:title"
          content="MTRNM - Metronome with customizable click patterns."
        />
        <meta
          property="og:description"
          content="Metrome which lets you create custom click patterns to practice tempo and rhythm."
        />
      </Head>
      <body>{children}</body>
    </html>
  );
}
