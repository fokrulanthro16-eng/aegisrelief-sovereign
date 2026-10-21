"use client";

import React from "react";
import {
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  AlertOctagon,
  Lock,
} from "lucide-react";
import { shortenHash } from "@/lib/blockchain/crypto-utils";

interface BottomAnalyticsRowProps {
  lastReceiptHash?: string;
  totalBlockedCount?: number;
}

export const BottomAnalyticsRow: React.FC<BottomAnalyticsRowProps> = ({
  lastReceiptHash = "0x4a7f29b6e82811a0c4f83e29f8604d5bc89a81f3370e07172cfd5d081f26a111",
  totalBlockedCount = 23,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 w-full">
      {/* CARD 1: Replay Attack Prevented */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-amber-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Replay Attack Prevented
              </h3>
            </div>
            <span className="font-mono text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded-full">
              ON-CHAIN GUARD
            </span>
          </div>

          <div className="mt-3 space-y-2 font-mono text-xs">
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Permanent SHA-256 receipt fingerprint storage in EVM mapping{" "}
              <code className="text-amber-300 font-bold">isReceiptHashUsed[bytes32]</code> blocks all physical receipt recycling and double-spending.
            </p>

            <div className="rounded-lg border border-slate-800 bg-[#0E1524] p-2.5 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-500">
                <span>ACTIVE GUARD HASH:</span>
                <span className="text-emerald-400 font-bold">LOCKED</span>
              </div>
              <p className="text-amber-300 break-all font-mono font-semibold">
                {lastReceiptHash}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex items-center justify-between font-mono text-[10px]">
          <span className="text-slate-400">Total Attacks Intercepted:</span>
          <span className="text-red-400 font-bold">{totalBlockedCount} Incidents</span>
        </div>
      </div>

      {/* CARD 2: OCR Extraction Accuracy (Donut Chart) */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                OCR Extraction Accuracy
              </h3>
            </div>
            <span className="font-mono text-[9px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded-full">
              99.8% PRECISION
            </span>
          </div>

          {/* Donut Chart & Breakdown */}
          <div className="mt-3 flex items-center gap-4">
            {/* Circular Donut SVG */}
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3.5"
                  strokeDasharray="87.96"
                  strokeDashoffset="0.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-sm font-black text-slate-100">99.8%</span>
                <span className="text-[7px] text-slate-500 uppercase">Score</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="flex-1 space-y-1 font-mono text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Font Glyph Recognition:</span>
                <span className="text-slate-200 font-bold">99.9%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Row Bounding Alignment:</span>
                <span className="text-slate-200 font-bold">99.7%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Math Subtotal Verifier:</span>
                <span className="text-emerald-400 font-bold">100.0%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex items-center justify-between font-mono text-[10px]">
          <span className="text-slate-400">Engine:</span>
          <span className="text-cyan-300 font-bold">Hugging Face Donut-Base</span>
        </div>
      </div>

      {/* CARD 3: Verification Metrics (Donut Chart & Checklist) */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Verification Metrics
              </h3>
            </div>
            <span className="font-mono text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
              100% COMPLETE
            </span>
          </div>

          {/* Donut Chart & Checklist */}
          <div className="mt-3 flex items-center gap-4">
            {/* Circular Donut SVG */}
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray="87.96"
                  strokeDashoffset="0.0"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-sm font-black text-slate-100">100%</span>
                <span className="text-[7px] text-slate-500 uppercase">Verified</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="flex-1 space-y-1 font-mono text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Multi-Oracle ECDSA (3/3)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Sentinel-1 SAR Radar (0.884)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>ERC-4337 Paymaster ($0.00 Gas)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex items-center justify-between font-mono text-[10px]">
          <span className="text-slate-400">Timelock & Multi-Sig:</span>
          <span className="text-emerald-400 font-bold">48-Hr Active</span>
        </div>
      </div>
    </div>
  );
};
