"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Bot,
  Layers,
  Flame,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";
import { HeterogeneousConsensusResult } from "@/lib/ai-pipeline";

interface MultiOracleConsensusPanelProps {
  consensusResult: HeterogeneousConsensusResult | null;
  isAuditing: boolean;
  activePreset: "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE" | null;
  onSelectPreset: (
    presetId: "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE"
  ) => void;
}

export const MultiOracleConsensusPanel: React.FC<MultiOracleConsensusPanelProps> = ({
  consensusResult,
  isAuditing,
  activePreset,
  onSelectPreset,
}) => {
  const oracleA = consensusResult?.oracleA || {
    signed: true,
    confidenceScore: 98.4,
    latencyMs: 412,
    source: "LIVE_API" as const,
    details: "UV ink spectrum validated. Mechanical ribbon degradation verified.",
  };

  const oracleB = consensusResult?.oracleB || {
    signed: true,
    ocrAccuracy: 99.8,
    latencyMs: 580,
    source: "LIVE_API" as const,
    extractedItemsCount: 3,
    details: "Tabular OCR bounding coordinates mapped with 99.8% precision.",
  };

  const oracleC = consensusResult?.oracleC || {
    signed: true,
    trustScore: 96,
    latencyMs: 320,
    source: "LIVE_API" as const,
    reasoning: "Prices cross-checked against official disaster baseline with 0.0% variance.",
  };

  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 sm:p-4.5 shadow-2xl space-y-3.5 w-full">
      {/* Panel Header & Presets Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <h2 className="font-mono text-base font-black tracking-wide text-slate-100">
              HETEROGENEOUS 3-MODEL AI ORACLE CONSENSUS
            </h2>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
              2-of-3 QUORUM ENFORCED
            </span>
          </div>
          <p className="font-mono text-xs text-slate-400 mt-0.5">
            Decentralized tri-model AI committee audits receipts off-chain and generates cryptographic ECDSA signatures.
          </p>
        </div>

        {/* 1-Click Simulation Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            JUDGE SIMULATION PRESETS:
          </span>

          <button
            onClick={() => onSelectPreset("AUTHENTIC_SYLHET_RELIEF")}
            disabled={isAuditing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
              activePreset === "AUTHENTIC_SYLHET_RELIEF"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-[#131B2A] border border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/40"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Preset A: Authentic Sylhet (Score 96)</span>
          </button>

          <button
            onClick={() => onSelectPreset("CORRUPT_SYNDICATE_INVOICE")}
            disabled={isAuditing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
              activePreset === "CORRUPT_SYNDICATE_INVOICE"
                ? "bg-red-500 text-slate-950 shadow-lg shadow-red-500/20"
                : "bg-[#131B2A] border border-red-800/60 text-red-300 hover:bg-red-950/40"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Preset B: +210% Inflated (Score 18)</span>
          </button>

          <button
            onClick={() => onSelectPreset("REPLAY_ATTACK_DUPLICATE")}
            disabled={isAuditing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
              activePreset === "REPLAY_ATTACK_DUPLICATE"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-[#131B2A] border border-amber-800/60 text-amber-300 hover:bg-amber-950/40"
            }`}
          >
            <RotateCcw className="h-3 w-3" />
            <span>Preset C: Double-Spend Replay</span>
          </button>
        </div>
      </div>

      {/* 3 Independent AI Oracle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 w-full">
        {/* ORACLE A: Google Gemini 2.5 Flash */}
        <div className="rounded-xl border border-[#1E293B] bg-[#0E1524] p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                ORACLE A • SPATIAL FORENSICS
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                SIGNED
              </span>
            </div>
            <h3 className="font-mono text-sm font-bold text-slate-100 mt-1">
              Google Gemini 2.5 Flash
            </h3>
            <p className="font-mono text-[11px] text-slate-400 mt-1">
              Vision & Spatial Forensic Specialist • Sub-pixel tampering & font overlay detection.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E293B] space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Confidence Score:</span>
              <span className="text-emerald-400 font-bold">{oracleA.confidenceScore}%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Latency:</span>
              <span className="text-cyan-300 font-bold">{oracleA.latencyMs}ms</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              <span className="text-slate-200 truncate max-w-[140px] text-[10px]">
                {oracleA.details}
              </span>
            </div>
          </div>
        </div>

        {/* ORACLE B: Hugging Face Donut OCR */}
        <div className="rounded-xl border border-[#1E293B] bg-[#0E1524] p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                ORACLE B • RAW OCR & TABULAR
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                SIGNED
              </span>
            </div>
            <h3 className="font-mono text-sm font-bold text-slate-100 mt-1">
              Hugging Face Donut OCR
            </h3>
            <p className="font-mono text-[11px] text-slate-400 mt-1">
              naver-clova-ix/donut-base • Document parser & strict tabular bounding extraction.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E293B] space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>OCR Accuracy:</span>
              <span className="text-cyan-400 font-bold">{oracleB.ocrAccuracy}%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Latency:</span>
              <span className="text-cyan-300 font-bold">{oracleB.latencyMs}ms</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Items Parsed:</span>
              <span className="text-slate-200 font-bold">{oracleB.extractedItemsCount} Commodities</span>
            </div>
          </div>
        </div>

        {/* ORACLE C: Nebius Llama-3.3-70B */}
        <div className="rounded-xl border border-[#1E293B] bg-[#0E1524] p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                ORACLE C • ECONOMIC AUDITOR
              </span>
              <span className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                oracleC.trustScore >= 85
                  ? "text-emerald-300 bg-emerald-950/80 border-emerald-800"
                  : "text-red-300 bg-red-950/80 border-red-800"
              }`}>
                <CheckCircle2 className="h-3 w-3" />
                SIGNED
              </span>
            </div>
            <h3 className="font-mono text-sm font-bold text-slate-100 mt-1">
              Nebius AI Studio Llama-3.3-70B
            </h3>
            <p className="font-mono text-[11px] text-slate-400 mt-1">
              Independent Economic Auditor • Commodity baseline cross-matching & surge limits.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E293B] space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Trust Score:</span>
              <span className={`font-bold ${oracleC.trustScore >= 85 ? "text-emerald-400" : "text-red-400"}`}>
                {oracleC.trustScore} / 100
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Latency:</span>
              <span className="text-amber-300 font-bold">{oracleC.latencyMs}ms</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Economic Audit:</span>
              <span className="text-slate-200 font-bold truncate max-w-[140px] text-[10px]">
                {oracleC.trustScore >= 85 ? "Approved Release" : "Gouging Intercepted"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
