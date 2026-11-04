import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kartu Bicara Digital - Model Pembelajaran Arends",
  description:
    "Aplikasi kartu bicara interaktif berbasis web untuk diskusi kelas yang adil, setara, dan energik sesuai model pembelajaran kooperatif Time Token Arends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#f7faf7] text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
