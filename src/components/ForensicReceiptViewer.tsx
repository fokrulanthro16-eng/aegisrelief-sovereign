"use client";

import React, { useState } from "react";
import {
  FileText,
  Sliders,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ZoomIn,
  Eye,
  Scan,
  Maximize2,
} from "lucide-react";

interface ForensicReceiptViewerProps {
  isAuditing: boolean;
  presetId: "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE" | null;
  uploadedImage: string | null;
  approved: boolean | null;
  trustScore?: number;
}

export const ForensicReceiptViewer: React.FC<ForensicReceiptViewerProps> = ({
  isAuditing,
  presetId,
  uploadedImage,
  approved,
  trustScore = 96,
}) => {
  const [contrast, setContrast] = useState(160);
  const [brightness, setBrightness] = useState(105);
  const [invert, setInvert] = useState(false);

  const isCorrupt = presetId === "CORRUPT_SYNDICATE_INVOICE" || (trustScore !== undefined && trustScore < 85);

  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 flex flex-col justify-between shadow-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
        <div className="flex items-center gap-2">
          <Scan className="h-4 w-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Paper Receipt Photograph / Forensic Visualizer
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-500 bg-[#131B2A] border border-[#1E293B] px-1.5 py-0.5 rounded">
          Neural OCR Active
        </span>
      </div>

      {/* Visualizer Canvas Card */}
      <div className="relative rounded-lg border border-[#1E293B] bg-[#05080F] overflow-hidden min-h-[310px] flex flex-col justify-between p-3 select-none">
        {/* Animated Laser Scanner Sweep during audit */}
        {isAuditing && (
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400 animate-scanner-sweep z-20 pointer-events-none" />
        )}

        {/* Receipt Visual Content */}
        <div
          style={{
            filter: `contrast(${contrast}%) brightness(${brightness}%) ${
              invert ? "invert(100%)" : ""
            }`,
          }}
          className="relative rounded border border-slate-800 bg-[#0F172A]/90 p-3 font-mono text-[11px] text-slate-200 transition-all space-y-2 shadow-inner"
        >
          {/* Receipt Top Header */}
          <div className="border-b border-dashed border-slate-700 pb-2 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              OFFICIAL RELIEF PROCUREMENT INVOICE
            </p>
            <p className="font-bold text-xs text-slate-100">
              {isCorrupt
                ? "M/S Coastal Trading Syndicate, Cox's Bazar"
                : "Messrs. Jalalabad Food Depot, Sylhet"}
            </p>
            <p className="text-[9px] text-slate-500">
              Disaster Zone: {isCorrupt ? "CTG-02 Cyclone Sector" : "SYL-01 Flood Basin"} • Reg: #BD-774129
            </p>
          </div>

          {/* Line Items Table with Forensic Bounding Boxes */}
          <div className="space-y-1.5 pt-1">
            {isCorrupt ? (
              <>
                {/* Inflated Item 1 with Red Forgery Bounding Box */}
                <div className="relative rounded border-2 border-red-500 bg-red-950/30 p-1.5 transition-all">
                  <span className="absolute -top-2 right-1.5 bg-red-600 text-white font-black text-[8px] px-1 rounded shadow">
                    FLAGGED: ARIAL BOLD OVERLAY (+208.7%)
                  </span>
                  <div className="flex justify-between text-red-200 font-bold">
                    <span>20x Coarse Parboiled Rice (50kg)</span>
                    <span className="text-red-300 font-mono text-xs">$88.00 / sack</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-red-400">
                    <span>Govt Ceiling: $28.50</span>
                    <span className="font-bold">Total: $1,760.00</span>
                  </div>
                </div>

                {/* Inflated Item 2 with Red Forgery Bounding Box */}
                <div className="relative rounded border-2 border-red-500 bg-red-950/30 p-1.5 transition-all">
                  <span className="absolute -top-2 right-1.5 bg-red-600 text-white font-black text-[8px] px-1 rounded shadow">
                    FLAGGED: TAMPERED PRICE (+211.1%)
                  </span>
                  <div className="flex justify-between text-red-200 font-bold">
                    <span>15x Emergency Trauma Kit</span>
                    <span className="text-red-300 font-mono text-xs">$140.00 / kit</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-red-400">
                    <span>Govt Ceiling: $45.00</span>
                    <span className="font-bold">Total: $2,100.00</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Authentic Item 1 with Green Verified Bounding Box */}
                <div className="relative rounded border border-emerald-500/50 bg-emerald-950/20 p-1.5 transition-all">
                  <span className="absolute -top-2 right-1.5 bg-emerald-600 text-slate-950 font-black text-[8px] px-1 rounded shadow">
                    MATCHED 0.0% VARIANCE
                  </span>
                  <div className="flex justify-between text-emerald-200 font-semibold">
                    <span>20x Coarse Relief Rice (50kg)</span>
                    <span className="font-mono text-xs">$28.50 / sack</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Official Baseline: $28.50</span>
                    <span>Total: $570.00</span>
                  </div>
                </div>

                {/* Authentic Item 2 */}
                <div className="relative rounded border border-emerald-500/50 bg-emerald-950/20 p-1.5 transition-all">
                  <div className="flex justify-between text-emerald-200 font-semibold">
                    <span>30x Heavy-Duty Shelter Tarp</span>
                    <span className="font-mono text-xs">$14.00 / tarp</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Official Baseline: $14.00</span>
                    <span>Total: $420.00</span>
                  </div>
                </div>

                {/* Authentic Item 3 */}
                <div className="relative rounded border border-emerald-500/50 bg-emerald-950/20 p-1.5 transition-all">
                  <div className="flex justify-between text-emerald-200 font-semibold">
                    <span>20x Water Purification Tablets</span>
                    <span className="font-mono text-xs">$9.50 / box</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Official Baseline: $9.50</span>
                    <span>Total: $190.00</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Receipt Footer with Official Ink Stamp & SHA-256 Digest */}
          <div className="pt-2 border-t border-dashed border-slate-700 flex items-center justify-between text-[10px]">
            <div>
              <p className="text-slate-400">GRAND TOTAL:</p>
              <p className={`font-mono text-sm font-black ${isCorrupt ? "text-red-400" : "text-emerald-400"}`}>
                ${isCorrupt ? "3,860.00 USD" : "1,180.00 USD"}
              </p>
            </div>

            {/* Official Ink Stamp Badge */}
            <div
              className={`rounded border px-2 py-1 text-center font-bold text-[9px] tracking-tight ${
                isCorrupt
                  ? "border-red-500 text-red-400 bg-red-950/40 rotate-2"
                  : "border-emerald-500 text-emerald-300 bg-emerald-950/40 -rotate-2"
              }`}
            >
              <div>{isCorrupt ? "⚠️ FORGERY SUSPECT" : "★ RELIEF VERIFIED"}</div>
              <div className="text-[8px] text-slate-400">MUNICIPAL EXCISE STAMP</div>
            </div>
          </div>
        </div>

        {/* Real-Time SHA-256 Fingerprint Indicator */}
        <div className="mt-2 flex items-center justify-between font-mono text-[9px] text-slate-500 border-t border-slate-900 pt-1.5">
          <span>SHA-256: {isCorrupt ? "0x9e8c37...9222" : "0x4a7f29...a111"}</span>
          <span className="text-cyan-400">NEURAL SCAN: COMPLETE</span>
        </div>
      </div>

      {/* Neural OCR Image Optimizer (Contrast & Brightness Sliders) */}
      <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-[11px] font-bold">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>Neural OCR Image Optimizer</span>
          </span>
          <button
            onClick={() => setInvert(!invert)}
            className={`text-[9px] px-1.5 py-0.5 rounded border ${
              invert ? "bg-cyan-500 text-slate-950 font-bold" : "border-slate-700 text-slate-400"
            }`}
          >
            Invert Spectrum
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Contrast:</span>
              <span className="text-cyan-400 font-bold">{contrast}%</span>
            </div>
            <input
              type="range"
              min="100"
              max="250"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Brightness:</span>
              <span className="text-cyan-400 font-bold">{brightness}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Consensus Verification Badge */}
      <div
        className={`rounded-lg border p-2.5 flex items-center justify-between font-mono text-[11px] font-bold ${
          isCorrupt
            ? "border-red-500/50 bg-red-950/30 text-red-300"
            : "border-emerald-500/50 bg-emerald-950/30 text-emerald-300"
        }`}
      >
        <div className="flex items-center gap-2">
          {isCorrupt ? (
            <ShieldAlert className="h-4 w-4 text-red-400" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          )}
          <span className="text-[10px] tracking-tight">
            {isCorrupt
              ? "CORRUPTION INTERCEPTED // ESCROW TRANSACTION FROZEN"
              : "3-of-3 MULTI-ORACLE CONSENSUS SIGNED // ESCROW TRANSACTION AUTHORIZED"}
          </span>
        </div>
        <span className="rounded bg-black/40 px-1.5 py-0.5 text-[9px] font-bold">
          {isCorrupt ? "SCORE: 18" : "SCORE: 96"}
        </span>
      </div>
    </div>
  );
};
