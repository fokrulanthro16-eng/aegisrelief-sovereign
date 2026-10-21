"use client";

import React, { useState } from "react";
import {
  Users,
  Flame,
  Radio,
  Satellite,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  MapPin,
  Sparkles,
  Wifi,
  Sliders,
} from "lucide-react";
import { JurisdictionZone } from "./EnterpriseHeader";

interface EnterpriseFieldControlsProps {
  selectedZone: JurisdictionZone;
  severityLevel: number;
  onSeverityChange: (level: number) => void;
  beneficiaryToken: string;
  onTokenChange: (token: string) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const EnterpriseFieldControls: React.FC<EnterpriseFieldControlsProps> = ({
  selectedZone,
  severityLevel,
  onSeverityChange,
  beneficiaryToken,
  onTokenChange,
  isOffline,
  onToggleOffline,
}) => {
  const camps = [
    { name: "Camp Alpha", token: "8492" },
    { name: "Camp Beta", token: "9140" },
    { name: "Camp Gamma", token: "1194" },
  ];

  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 flex flex-col justify-between shadow-xl space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Field Worker Portal & Ground Controls
          </h3>
        </div>
        <button
          onClick={onToggleOffline}
          className={`flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border transition-all ${
            isOffline
              ? "bg-amber-950 border-amber-800 text-amber-300 font-bold"
              : "bg-emerald-950/60 border-emerald-800/60 text-emerald-300 font-bold"
          }`}
        >
          <Wifi className="h-3 w-3" />
          <span>{isOffline ? "OFFLINE BUFFER ACTIVE" : "ONLINE CONNECTED"}</span>
        </button>
      </div>

      {/* Dynamic Disaster Severity Multiplier */}
      <div className="space-y-1.5 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 font-bold text-[11px]">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Disaster Severity Multiplier</span>
          </span>
          <span className="text-[10px] text-amber-400 font-bold">
            {severityLevel === 3 ? "40% Surge Tolerance" : severityLevel === 2 ? "25% Tolerance" : "15% Tolerance"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <button
            onClick={() => onSeverityChange(1)}
            className={`p-2 rounded-lg border text-center font-mono text-[10px] transition-all ${
              severityLevel === 1
                ? "border-blue-500 bg-blue-950/40 text-blue-300 font-bold shadow-md shadow-blue-500/10"
                : "border-[#1E293B] bg-[#0E1524] text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="font-bold">Level 1</div>
            <div className="text-[9px] text-slate-400">Moderate 15%</div>
          </button>

          <button
            onClick={() => onSeverityChange(2)}
            className={`p-2 rounded-lg border text-center font-mono text-[10px] transition-all ${
              severityLevel === 2
                ? "border-amber-500 bg-amber-950/40 text-amber-300 font-bold shadow-md shadow-amber-500/10"
                : "border-[#1E293B] bg-[#0E1524] text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="font-bold">Level 2</div>
            <div className="text-[9px] text-slate-400">High 25%</div>
          </button>

          <button
            onClick={() => onSeverityChange(3)}
            className={`p-2 rounded-lg border text-center font-mono text-[10px] transition-all ${
              severityLevel === 3
                ? "border-red-500 bg-red-950/40 text-red-300 font-bold shadow-md shadow-red-500/10"
                : "border-[#1E293B] bg-[#0E1524] text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="font-bold">Level 3</div>
            <div className="text-[9px] text-slate-400">Catastrophic 40%</div>
          </button>
        </div>
      </div>

      {/* Beneficiary Delivery Sign-Off Token */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0E1524] p-3 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-[11px]">
            <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
            <span>Beneficiary Delivery Sign-Off Token</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded">
            Anti-Phantom Lock
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            maxLength={4}
            value={beneficiaryToken}
            onChange={(e) => onTokenChange(e.target.value)}
            placeholder="4-digit token"
            className="w-28 rounded-lg border border-[#1E293B] bg-[#0B0F17] p-2 text-center font-mono text-sm font-black tracking-widest text-emerald-300 focus:border-cyan-500 focus:outline-none"
          />
          <div className="flex flex-1 gap-1 items-center">
            {camps.map((camp) => (
              <button
                key={camp.name}
                onClick={() => onTokenChange(camp.token)}
                className={`flex-1 p-1.5 rounded-lg border text-center font-mono text-[9px] transition-all ${
                  beneficiaryToken === camp.token
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold"
                    : "bg-[#0B0F17] border-[#1E293B] text-slate-400 hover:text-slate-200"
                }`}
              >
                <div>{camp.name}</div>
                <div className="text-slate-500">#{camp.token}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* zkPass / World ID Worker Identity Card */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0E1524] p-3 space-y-1.5 font-mono text-[11px]">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            Field Officer Identity
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
            <ShieldCheck className="h-3 w-3" />
            zkPass Verified
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-200 font-bold">Relief Officer #BD-8841</span>
          <span className="text-slate-500 text-[10px]">World ID Nullifier: Valid</span>
        </div>
      </div>

      {/* Satellite Telemetry Cross-Check */}
      <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/20 p-2.5 flex items-center justify-between font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <Satellite className="h-4 w-4 text-cyan-400" />
          <div>
            <div className="text-cyan-300 font-bold">Sentinel-1 SAR Radar Verified</div>
            <div className="text-slate-400 text-[9px]">Surface Inundation Index: 0.884</div>
          </div>
        </div>
        <span className="bg-cyan-900/60 border border-cyan-700 text-cyan-200 px-1.5 py-0.5 rounded font-bold text-[8px]">
          SATELLITE CONFIRMED
        </span>
      </div>
    </div>
  );
};
