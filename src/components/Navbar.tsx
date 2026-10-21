"use client";

import React from "react";
import { Shield, Radio, Wifi, WifiOff, Cpu, Terminal, FileCode, RotateCcw } from "lucide-react";

interface NavbarProps {
  activeTab: "field" | "command" | "contract";
  setActiveTab: (tab: "field" | "command" | "contract") => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  queuedCount: number;
  onResetLedger: () => void;
  networkName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOffline,
  setIsOffline,
  queuedCount,
  onResetLedger,
  networkName = "Polygon Amoy (80002)",
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 shadow-lg shadow-cyan-950/50">
            <Shield className="h-5 w-5 text-cyan-400" />
            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 animate-ping rounded-full bg-cyan-400 opacity-75" />
            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold tracking-wider text-slate-100 sm:text-lg">
                AEGIS<span className="text-cyan-400">RELIEF</span>
              </span>
              <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
                SOVEREIGN v2.5
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              Zero-Trust AI Oracle & Gasless Escrow Protocol
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Network & Gas Badge */}
          <div className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-emerald-400">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            <span className="font-mono font-medium">{networkName}</span>
            <span className="text-emerald-500/60">•</span>
            <span className="font-mono font-bold text-emerald-300">$0.00 Field Gas</span>
          </div>

          {/* Offline/Online Mode Indicator */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono transition-all ${
              isOffline
                ? "border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/40"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
            }`}
            title="Click to toggle simulated disaster zone network blackout"
          >
            {isOffline ? (
              <>
                <WifiOff className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>OFFLINE QUEUE ACTIVE</span>
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                <span>SAT-LINK ONLINE</span>
              </>
            )}
            {queuedCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-1.5 py-0.2 font-mono text-[10px] font-bold text-black">
                {queuedCount}
              </span>
            )}
          </button>

          {/* Reset Protocol State */}
          <button
            onClick={onResetLedger}
            title="Reset vault metrics and cleared receipts for judge testing"
            className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 font-mono text-[11px] text-slate-400 hover:border-slate-700 hover:text-slate-200"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex w-full items-center justify-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 p-1 md:w-auto">
          <button
            onClick={() => setActiveTab("field")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-all md:flex-none ${
              activeTab === "field"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Field Worker</span>
          </button>

          <button
            onClick={() => setActiveTab("command")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-all md:flex-none ${
              activeTab === "command"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>3D Command</span>
          </button>

          <button
            onClick={() => setActiveTab("contract")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-all md:flex-none ${
              activeTab === "contract"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Contract & Verifier</span>
          </button>
        </div>
      </div>
    </header>
  );
};
