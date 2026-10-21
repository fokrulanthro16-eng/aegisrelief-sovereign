import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegisRelief Sovereign | Autonomous AI-Audited Disaster Relief Protocol",
  description:
    "Zero-trust disaster relief protocol solving the Blockchain Oracle Problem via Multi-Agent AI Forensics & Gasless Relayers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0F17] text-slate-100 antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
