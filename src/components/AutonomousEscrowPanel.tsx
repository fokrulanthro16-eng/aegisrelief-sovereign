"use client";

import React, { useState } from "react";
import {
  Gavel,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Banknote,
  Send,
  Sparkles,
  Lock,
} from "lucide-react";
import { ForensicTransactionRecord } from "@/lib/blockchain/relayer";
import { shortenHash, shortenAddress } from "@/lib/blockchain/crypto-utils";

interface AutonomousEscrowPanelProps {
  lastRecord: ForensicTransactionRecord | null;
  isAuditing: boolean;
  onExecuteAudit: () => void;
  onRequestDisputeModal: () => void;
  onInspectProof: () => void;
  trustScore?: number;
}

export const AutonomousEscrowPanel: React.FC<AutonomousEscrowPanelProps> = ({
  lastRecord,
  isAuditing,
  onExecuteAudit,
  onRequestDisputeModal,
  onInspectProof,
  trustScore = 96,
}) => {
  const [copiedCid, setCopiedCid] = useState(false);

  const isApproved = lastRecord ? lastRecord.approved : trustScore >= 85;
  const currentTrustScore = lastRecord ? lastRecord.trustScore : trustScore;
  const ipfsCid = lastRecord?.ipfsReportCID || "ipfs://bafybeih4a7f29b6e828sovereignforensicv3";

  const handleCopyCid = () => {
    navigator.clipboard.writeText(ipfsCid);
    setCopiedCid(true);
    setTimeout(() => setCopiedCid(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-4 flex flex-col justify-between shadow-xl space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
        <div className="flex items-center gap-2">
          <Gavel className="h-4 w-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Autonomous Escrow Decision Panel
          </h3>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-bold">
          Zero-Trust Automated Release
        </span>
      </div>

      {/* Dynamic Status Decision Banner */}
      <div
        className={`rounded-xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg transition-all ${
          isApproved
            ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-200"
            : "border-red-500/50 bg-red-950/30 text-red-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center border ${
              isApproved
                ? "bg-emerald-950 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20"
                : "bg-red-950 border-red-500 text-red-400 shadow-lg shadow-red-500/20"
            }`}
          >
            {isApproved ? <ShieldCheck className="h-7 w-7" /> : <ShieldAlert className="h-7 w-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black tracking-wide">
                {isApproved
                  ? "PAYMENT APPROVED // ESCROW DISBURSED"
                  : "CORRUPTION INTERCEPTED // ESCROW FROZEN"}
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-300 mt-0.5">
              {isApproved
                ? "Autonomous smart contract released funds to vendor without human intervention."
                : "Syndicate markup/tampering intercepted. Zero funds disbursed. Event permanently logged on-chain."}
            </p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex flex-col items-end shrink-0">
          <span className="font-mono text-[10px] text-slate-400 uppercase">Trust Score</span>
          <div className="flex items-baseline gap-1">
            <span
              className={`font-mono text-2xl font-black ${
                isApproved ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {currentTrustScore}
            </span>
            <span className="font-mono text-xs text-slate-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Release & DAO Dispute Appeal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Primary Action Button: Audit & Release */}
        <button
          onClick={onExecuteAudit}
          disabled={isAuditing}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 p-3 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
        >
          {isAuditing ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              <span>Auditing Across 3 Oracles...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 fill-slate-950" />
              <span>Audit & Release Escrow Funds ($0 Gas)</span>
            </>
          )}
        </button>

        {/* Golden Button: Request Manual DAO Review / Appeal */}
        <button
          onClick={onRequestDisputeModal}
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 p-3 font-mono text-xs font-bold transition-all shadow-sm"
        >
          <Gavel className="h-4 w-4 text-amber-400" />
          <span>Request Manual DAO Review / Appeal</span>
        </button>
      </div>

      {/* Automated Local Fiat Off-Ramp Settlement Simulator */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0E1524] p-3 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-[11px] text-slate-100">
              Automated Local Fiat Off-Ramp Settlement
            </span>
          </div>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
            {isApproved ? "INSTANT SETTLEMENT READY" : "OFF-RAMP LOCKED"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
          <div className="rounded bg-[#0B0F17] border border-[#1E293B] p-2">
            <span className="text-slate-500">HUMANITARIAN RAIL:</span>
            <p className="font-bold text-slate-200 mt-0.5 truncate">
              bKash / Nagad / City Bank MFS
            </p>
          </div>
          <div className="rounded bg-[#0B0F17] border border-[#1E293B] p-2">
            <span className="text-slate-500">EXCHANGE RATE:</span>
            <p className="font-bold text-cyan-400 mt-0.5">
              $1.00 USD = 117.80 BDT
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#1E293B] text-[10px]">
          <div>
            <span className="text-slate-400">Vendor Net Payout:</span>{" "}
            <span className="text-emerald-300 font-bold">
              {isApproved ? "৳139,004.00 BDT" : "৳0.00 BDT (Frozen)"}
            </span>
          </div>
          <span className="text-slate-500 text-[9px]">
            Ref: {lastRecord?.fiatOffRamp?.txnReference || "MFS-TXN-88410291"}
          </span>
        </div>
      </div>

      {/* Content-Addressed IPFS Forensic Storage Card */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0E1524] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-bold text-slate-300">CONTENT-ADDRESSED IPFS FORENSIC RECORD</span>
          </div>
          <p className="text-[10px] text-cyan-300 truncate max-w-xs">{ipfsCid}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCid}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300 bg-[#0B0F17] border border-[#1E293B] px-2 py-1 rounded"
          >
            {copiedCid ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedCid ? "Copied" : "Copy CID"}</span>
          </button>
          <button
            onClick={onInspectProof}
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:underline bg-[#0B0F17] border border-cyan-800/40 px-2.5 py-1 rounded font-bold"
          >
            <span>Inspect Proof</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
