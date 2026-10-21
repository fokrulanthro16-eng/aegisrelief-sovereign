"use client";

import React from "react";
import {
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { VaultStats } from "@/lib/blockchain/relayer";

interface EnterpriseKpisProps {
  stats: VaultStats;
}

export const EnterpriseKpis: React.FC<EnterpriseKpisProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 w-full">
      {/* KPI 1: TVL */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 sm:p-4.5 shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
            <span className="font-bold uppercase tracking-wider">Total Value Locked (TVL)</span>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              ${stats.balanceUsd >= 1000000
                ? `${(stats.balanceUsd / 1000000).toFixed(2)}M`
                : stats.balanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="h-3 w-3" />
              +8.2% this week
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#1E293B]/60">
          <p className="font-mono text-[10px] text-cyan-400/80 truncate pr-2">
            {stats.balanceEth} ETH Escrowed • Multi-Sig
          </p>
          {/* Strictly Clamped Sparkline SVG */}
          <div className="w-24 h-8 overflow-hidden flex items-center justify-end shrink-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="cyanSpark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 24 Q 20 16, 40 18 T 70 12 T 90 7 L 100 4"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />
              <path
                d="M0 24 Q 20 16, 40 18 T 70 12 T 90 7 L 100 4 L 100 30 L 0 30 Z"
                fill="url(#cyanSpark)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* KPI 2: Relief Funds Disbursed */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 sm:p-4.5 shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
            <span className="font-bold uppercase tracking-wider">Relief Funds Disbursed</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              ${stats.disbursedUsd >= 1000000
                ? `${(stats.disbursedUsd / 1000000).toFixed(2)}M`
                : stats.disbursedUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="h-3 w-3" />
              +14.7% this week
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#1E293B]/60">
          <p className="font-mono text-[10px] text-emerald-400/80 truncate pr-2">
            {stats.disbursedEth} ETH Disbursed • {stats.auditsCount} Audits
          </p>
          {/* Strictly Clamped Sparkline SVG */}
          <div className="w-24 h-8 overflow-hidden flex items-center justify-end shrink-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="emeraldSpark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 25 Q 25 19, 50 14 T 75 10 T 90 5 L 100 2"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <path
                d="M0 25 Q 25 19, 50 14 T 75 10 T 90 5 L 100 2 L 100 30 L 0 30 Z"
                fill="url(#emeraldSpark)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* KPI 3: Fraud Attempt Intercepted */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 sm:p-4.5 shadow-xl hover:border-red-500/40 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
            <span className="font-bold uppercase tracking-wider">Fraud Attempt Intercepted</span>
            <ShieldAlert className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-red-400 tracking-tight">
              ${stats.fraudBlockedUsd >= 1000
                ? `${(stats.fraudBlockedUsd / 1000).toFixed(0)}K`
                : stats.fraudBlockedUsd.toFixed(2)}
            </span>
            <span className="inline-flex items-center text-[10px] font-mono font-bold text-red-300 bg-red-950/80 border border-red-800 px-2 py-0.5 rounded">
              {stats.fraudCount} INCIDENTS BLOCKED
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#1E293B]/60">
          <p className="font-mono text-[10px] text-red-400/80 truncate pr-2">
            {stats.fraudBlockedEth} ETH Locked On-Chain
          </p>
          {/* Strictly Clamped Sparkline SVG */}
          <div className="w-24 h-8 overflow-hidden flex items-center justify-end shrink-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="redSpark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 6 Q 25 18, 50 12 T 75 22 T 100 16"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
              />
              <path
                d="M0 6 Q 25 18, 50 12 T 75 22 T 100 16 L 100 30 L 0 30 Z"
                fill="url(#redSpark)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* KPI 4: Relayer Gas Saved */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 sm:p-4.5 shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
            <span className="font-bold uppercase tracking-wider">Relayer Gas Saved</span>
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              0.042 MATIC
            </span>
            <span className="text-slate-400 text-xs font-mono font-bold">Avg</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#1E293B]/60">
          <p className="font-mono text-[10px] text-purple-300 truncate pr-2">
            Daily Quota Active • $0.00 Gas
          </p>
          {/* Strictly Clamped Sparkline SVG */}
          <div className="w-24 h-8 overflow-hidden flex items-center justify-end shrink-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="purpleSpark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 16 Q 25 8, 50 14 T 80 6 T 100 10"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
              <path
                d="M0 16 Q 25 8, 50 14 T 80 6 T 100 10 L 100 30 L 0 30 Z"
                fill="url(#purpleSpark)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
