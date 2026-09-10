import type { Metadata } from "next";
import { Lora, Work_Sans } from "next/font/google";
import TopNav from "@/components/TopNav";
import DossiAIBar from "@/components/DossiAIBar";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Dossier",
  description: "Your professional network, with memory.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lora.variable} ${workSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <TopNav />
        <DossiAIBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
