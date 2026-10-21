"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Shield, AlertTriangle, CheckCircle, Clock, ChevronRight, Activity, Cpu } from "lucide-react";

export interface LogEntry {
  timestamp: string;
  agent: string;
  message: string;
  status: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
}

export interface AuditedItem {
  name: string;
  quantity: number;
  billedUnitUSD: number;
  baselineUSD: number;
  variancePercent: number;
  flagged: boolean;
}

interface ForensicTerminalProps {
  logs: LogEntry[];
  items?: AuditedItem[];
  isAuditing: boolean;
  currentStepIndex?: number;
  trustScore?: number;
  verdict?: "APPROVED" | "REJECTED_FRAUD" | null;
}

export const ForensicTerminal: React.FC<ForensicTerminalProps> = ({
  logs,
  items = [],
  isAuditing,
  currentStepIndex = 0,
  trustScore,
  verdict,
}) => {
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const steps = [
    { label: "AGENT 1: TAMPER OCR", key: "tamper" },
    { label: "AGENT 2: PRICE VARIANCE", key: "price" },
    { label: "AGENT 3: CONSENSUS SCORER", key: "consensus" },
    { label: "LAYER 3: ECDSA SIGNATURE", key: "signature" },
    { label: "EVM: PROTOCOL SETTLEMENT", key: "evm" },
  ];

  const filteredLogs = logs.filter((l) => {
    if (filter === "ALL") return true;
    return l.agent.includes(filter);
  });

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-surface shadow-2xl overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-xs font-bold text-slate-300">
            AEGIS-ORACLE-CLI // MULTI-AGENT FORENSIC ENGINE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAuditing ? (
            <div className="flex items-center gap-1.5 rounded bg-cyan-950/70 px-2 py-0.5 font-mono text-[10px] text-cyan-300 border border-cyan-800">
              <Activity className="h-3 w-3 animate-spin text-cyan-400" />
              <span>FORENSIC AGENTS EXECUTING...</span>
            </div>
          ) : verdict ? (
            <div
              className={`flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-bold border ${
                verdict === "APPROVED"
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                  : "bg-red-950/60 text-red-300 border-red-800"
              }`}
            >
              {verdict === "APPROVED" ? (
                <CheckCircle className="h-3 w-3 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-red-400" />
              )}
              <span>{verdict === "APPROVED" ? "VERDICT: APPROVED" : "VERDICT: REJECTED_FRAUD"}</span>
            </div>
          ) : (
            <div className="font-mono text-[10px] text-slate-500">STANDBY MODE</div>
          )}
        </div>
      </div>

      {/* Sequential Pipeline Step Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-800/80 bg-slate-900/40 text-[10px] font-mono">
        {steps.map((st, idx) => {
          const isPassed = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx && isAuditing;
          return (
            <div
              key={st.key}
              className={`flex items-center justify-center gap-1.5 border-r border-slate-800/80 p-2 transition-all ${
                isPassed
                  ? "bg-emerald-950/20 text-emerald-400"
                  : isCurrent
                  ? "bg-cyan-950/40 text-cyan-300 animate-pulse font-bold"
                  : "text-slate-500"
              }`}
            >
              <span className="rounded-full bg-slate-800 px-1 py-0.2 text-[9px]">
                {idx + 1}
              </span>
              <span className="truncate">{st.label}</span>
            </div>
          );
        })}
      </div>

      {/* Line Item Anomaly Comparison Table (Agent 2 Output) */}
      {items.length > 0 && (
        <div className="border-b border-slate-800 bg-slate-950/40 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              AGENT 2 PRICE BENCHMARK AUDIT (Official Baseline vs Billed)
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              Max Variance Allowed: <strong className="text-emerald-400">+15.0%</strong>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-1">Commodity Line Item</th>
                  <th className="pb-1 text-center">Qty</th>
                  <th className="pb-1 text-right">Billed Unit</th>
                  <th className="pb-1 text-right">Baseline Unit</th>
                  <th className="pb-1 text-right">Price Variance</th>
                  <th className="pb-1 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-1.5 text-slate-200">{it.name}</td>
                    <td className="py-1.5 text-center text-slate-400">{it.quantity}</td>
                    <td className="py-1.5 text-right font-medium text-slate-200">
                      ${it.billedUnitUSD.toFixed(2)}
                    </td>
                    <td className="py-1.5 text-right text-slate-400">
                      ${it.baselineUSD.toFixed(2)}
                    </td>
                    <td className="py-1.5 text-right">
                      <span
                        className={`rounded px-1.5 py-0.5 font-bold ${
                          it.variancePercent > 15
                            ? "bg-red-950/80 text-red-300 border border-red-800 animate-pulse"
                            : "bg-emerald-950/60 text-emerald-300 border border-emerald-900"
                        }`}
                      >
                        {it.variancePercent > 0 ? `+${it.variancePercent.toFixed(1)}%` : `${it.variancePercent.toFixed(1)}%`}
                      </span>
                    </td>
                    <td className="py-1.5 text-center">
                      {it.flagged ? (
                        <span className="font-bold text-red-400">GOUGE FLAGGED</span>
                      ) : (
                        <span className="text-emerald-400">VERIFIED CLEAN</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Terminal Filter Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/50 px-3 py-1.5 text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="h-3 w-3 text-cyan-400" />
          <span className="text-slate-400">STREAMING FORENSIC LOGS:</span>
        </div>
        <div className="flex gap-1">
          {["ALL", "AGENT-1", "AGENT-2", "AGENT-3", "ORACLE"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded px-1.5 py-0.5 transition-all ${
                filter === f
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-800"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="h-56 overflow-y-auto bg-black/90 p-3 font-mono text-[11px] leading-relaxed text-slate-300">
        {filteredLogs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-600">
            [Ready. Click a Simulation Preset or upload an invoice to initiate multi-agent audit]
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-600 shrink-0">
                  [{log.timestamp.substring(11, 19)}]
                </span>
                <span
                  className={`font-semibold shrink-0 ${
                    log.agent.includes("AGENT-1")
                      ? "text-purple-400"
                      : log.agent.includes("AGENT-2")
                      ? "text-blue-400"
                      : log.agent.includes("AGENT-3")
                      ? "text-amber-400"
                      : "text-cyan-400"
                  }`}
                >
                  [{log.agent}]
                </span>
                <span
                  className={`break-all ${
                    log.status === "CRITICAL"
                      ? "text-red-400 font-bold"
                      : log.status === "WARNING"
                      ? "text-amber-300"
                      : log.status === "SUCCESS"
                      ? "text-emerald-300"
                      : "text-slate-300"
                  }`}
                >
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};
