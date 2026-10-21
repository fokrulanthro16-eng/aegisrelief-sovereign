"use client";

import React, { useState } from "react";
import {
  Globe,
  Radio,
  Copy,
  Check,
  ShieldCheck,
  RotateCcw,
  Zap,
  MapPin,
  ChevronDown,
  Satellite,
  Wifi,
  Sparkles,
  Play,
  Download,
} from "lucide-react";
import { shortenAddress } from "@/lib/blockchain/crypto-utils";

export interface JurisdictionZone {
  id: string;
  name: string;
  region: string;
  isGenesisPilot: boolean;
  activeSeverity: number;
}

export const GLOBAL_JURISDICTIONS: JurisdictionZone[] = [
  {
    id: "SYL-01",
    name: "Sylhet Flood Basin Grid",
    region: "Bangladesh (Genesis Pilot Ground)",
    isGenesisPilot: true,
    activeSeverity: 1,
  },
  {
    id: "CTG-02",
    name: "Cox's Bazar Coastal Cyclone Grid",
    region: "Bangladesh (Genesis Pilot Ground)",
    isGenesisPilot: true,
    activeSeverity: 2,
  },
  {
    id: "TUR-04",
    name: "Antakya Earthquake Corridor",
    region: "Turkey / Syria Humanitarian Axis",
    isGenesisPilot: false,
    activeSeverity: 3,
  },
  {
    id: "UKR-01",
    name: "Kherson Dnieper River Inundation",
    region: "Eastern Europe Emergency Grid",
    isGenesisPilot: false,
    activeSeverity: 2,
  },
  {
    id: "AFG-03",
    name: "Herat Crisis Relief Hub",
    region: "Central Asia Humanitarian Sector",
    isGenesisPilot: false,
    activeSeverity: 3,
  },
];

interface EnterpriseHeaderProps {
  selectedZone: JurisdictionZone;
  onSelectZone: (zone: JurisdictionZone) => void;
  onResetLedger: () => void;
  onStartTour?: () => void;
  walletAddress?: string;
  networkName?: string;
  satLinkActive?: boolean;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({
  selectedZone,
  onSelectZone,
  onResetLedger,
  onStartTour,
  walletAddress = "0x7A3B9184B4b51A07E4f1d44B9E392942C5D14E2F",
  networkName = "Polygon Amoy Testnet (80002)",
  satLinkActive = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="border-b border-[#1E293B] bg-[#0B0F17]/95 backdrop-blur-md px-6 py-2.5 sticky top-0 z-30 flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Left: Jurisdiction Selector & Pilot Badge */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative">
          <button
            onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#0B0F17] hover:border-cyan-500/50 px-3 py-1.5 font-mono text-xs text-slate-200 transition-all shadow-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-100">[{selectedZone.id}] {selectedZone.name}</span>
                {selectedZone.isGenesisPilot && (
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded text-[9px] font-bold">
                    GENESIS PILOT
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">{selectedZone.region}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 ml-1" />
          </button>

          {zoneDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-80 rounded-xl border border-[#1E293B] bg-[#0B0F17] shadow-2xl p-2 z-50 font-mono text-xs space-y-1">
              <div className="px-2 py-1 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                Humanitarian Disaster Zones
              </div>
              {GLOBAL_JURISDICTIONS.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    onSelectZone(zone);
                    setZoneDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-all ${
                    selectedZone.id === zone.id
                      ? "bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-bold"
                      : "text-slate-300 hover:bg-[#131B2A]"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs">[{zone.id}] {zone.name}</div>
                    <div className="text-[10px] text-slate-400">{zone.region}</div>
                  </div>
                  {zone.isGenesisPilot && (
                    <span className="text-[8px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-1 py-0.5 rounded font-bold">
                      PILOT
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* System Health Status Bar */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg border border-emerald-900/40 bg-emerald-950/20 px-3 py-1.5 font-mono text-[11px] text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-tight">SYSTEM HEALTH • ALL SYSTEMS NOMINAL</span>
        </div>
      </div>

      {/* Right: Pitch Button, Video Download, Network, Wallet Pill, Satellite Link & Reset */}
      <div className="flex items-center gap-2.5 flex-wrap justify-end w-full md:w-auto">
        {/* Auto-Pilot Pitch Mode Button */}
        {onStartTour && (
          <button
            onClick={onStartTour}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black px-3 py-1.5 font-mono text-xs shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            title="Launch Autonomous Pitch with Voiceover & Live Subtitles"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span>Auto-Pilot Pitch (Voiceover)</span>
          </button>
        )}

        {/* Download Demo Video MP4 */}
        <a
          href="/aegisrelief-demo.mp4"
          download="aegisrelief-demo.mp4"
          className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 font-bold px-2.5 py-1.5 font-mono text-xs transition-all shadow-sm"
          title="Download Ultra-HD MP4 Demo Video"
        >
          <Download className="h-3.5 w-3.5 text-purple-400" />
          <span className="hidden sm:inline">Download Demo MP4</span>
        </a>

        {/* Sat-Link Indicator */}
        <div className="flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#0B0F17] px-2.5 py-1.5 font-mono text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Satellite className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-slate-300 font-bold">SAT-LINK ACTIVE</span>
        </div>

        {/* Network Badge */}
        <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-2.5 py-1.5 font-mono text-[11px] text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="font-bold">{networkName}</span>
          <span className="text-slate-500 text-[10px]">($0 Gas)</span>
        </div>

        {/* Wallet Address Pill */}
        <div className="flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#0B0F17] px-2.5 py-1.5 font-mono text-[11px]">
          <span className="text-slate-500">RELAYER:</span>
          <span className="text-slate-200 font-bold">{shortenAddress(walletAddress, 4)}</span>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-cyan-300 ml-0.5"
            title="Copy address"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>

        {/* Protocol Ledger Reset */}
        <button
          onClick={onResetLedger}
          className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0B0F17] hover:border-red-500/40 hover:text-red-300 px-2 py-1.5 font-mono text-[11px] text-slate-400 transition-all"
          title="Reset local simulation records"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};
