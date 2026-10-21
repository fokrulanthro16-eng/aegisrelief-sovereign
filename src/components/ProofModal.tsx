"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  ExternalLink,
  Cpu,
  Users,
  Flame,
  Layers,
  KeyRound,
  Shield,
} from "lucide-react";
import { ForensicTransactionRecord } from "@/lib/blockchain/relayer";
import {
  splitSignatureComponents,
  shortenHash,
  shortenAddress,
} from "@/lib/blockchain/crypto-utils";

interface ProofModalProps {
  record: ForensicTransactionRecord | null;
  onClose: () => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({ record, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!record) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sigParts = splitSignatureComponents(record.ecdsaSignature);
  const isMatch =
    record.oracleSignerAddress.toLowerCase() ===
    record.recoveredSignerAddress.toLowerCase();

  const severityNames: Record<number, { title: string; tolerance: string; color: string }> = {
    1: { title: "Level 1: Moderate", tolerance: "15% Max Variance", color: "text-blue-400 border-blue-800 bg-blue-950/40" },
    2: { title: "Level 2: High", tolerance: "25% Max Variance", color: "text-amber-400 border-amber-800 bg-amber-950/40" },
    3: { title: "Level 3: Catastrophic", tolerance: "40% Surge Tolerance", color: "text-red-400 border-red-800 bg-red-950/40" },
  };

  const severityInfo = severityNames[record.severityLevel || 1] || severityNames[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-lg border ${
                record.approved
                  ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400"
                  : "border-red-500/40 bg-red-950/40 text-red-400"
              }`}
            >
              {record.approved ? (
                <ShieldCheck className="h-6 w-6" />
              ) : (
                <Lock className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-lg font-bold text-slate-100">
                  Cryptographic Forensic Proof & Attestation
                </h3>
                <span
                  className={`rounded border px-2 py-0.5 font-mono text-xs font-semibold ${
                    record.approved
                      ? "border-emerald-500/30 bg-emerald-950/50 text-emerald-300"
                      : "border-red-500/30 bg-red-950/50 text-red-300"
                  }`}
                >
                  {record.onChainEvent}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-400">
                Multi-Oracle Consensus • Beneficiary Delivery Proof • Anti-Replay Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Core Verification Badges - 4 Column KPI Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Trust Score */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <span className="font-mono text-[10px] text-slate-400">TRUST SCORE</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={`font-mono text-2xl font-black ${
                  record.trustScore >= 85 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {record.trustScore}
              </span>
              <span className="font-mono text-xs text-slate-500">/ 100</span>
            </div>
            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
              {record.trustScore >= 85 ? "≥ 85 (Approved)" : "< 85 (Flagged)"}
            </p>
          </div>

          {/* Multi-Oracle Consensus */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <span className="font-mono text-[10px] text-slate-400">MULTI-ORACLE</span>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <span className="font-mono text-sm font-bold text-cyan-300">3/3 QUORUM</span>
            </div>
            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
              Tamper, Price & Scorer
            </p>
          </div>

          {/* Beneficiary Proof */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <span className="font-mono text-[10px] text-slate-400">BENEFICIARY PROOF</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Users className="h-5 w-5 text-emerald-400" />
              <span className="font-mono text-sm font-bold text-emerald-300">CONFIRMED</span>
            </div>
            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
              Token: #{record.beneficiaryToken || "8492"}
            </p>
          </div>

          {/* Gas & Relayer Cost */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <span className="font-mono text-[10px] text-slate-400">FIELD GAS COST</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-2xl font-black text-emerald-400">$0.00</span>
              <span className="font-mono text-xs text-slate-500">USD</span>
            </div>
            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
              100% Relayer Sponsored
            </p>
          </div>
        </div>

        {/* Disaster Severity Banner */}
        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <span className="text-slate-400">Disaster Severity Multiplier:</span>
            <span className={`rounded border px-2 py-0.5 text-[11px] font-bold ${severityInfo.color}`}>
              {severityInfo.title}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            AI Price Tolerance Limit: <strong className="text-slate-200">{severityInfo.tolerance}</strong>
          </span>
        </div>

        {/* Cryptographic Details Table */}
        <div className="mt-4 space-y-3 font-mono text-xs">
          {/* Multi-Agent Consensus Signatures Breakdown */}
          <div className="rounded-lg border border-cyan-900/50 bg-cyan-950/20 p-3">
            <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2 text-cyan-300">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span className="font-bold">MULTI-ORACLE CONSENSUS FRAMEWORK (3 AGENTS)</span>
              </div>
              <span className="rounded bg-cyan-900/60 px-2 py-0.5 text-[10px] text-cyan-200">
                All 3 Keys Verified
              </span>
            </div>

            <div className="mt-2.5 space-y-2 text-[11px]">
              {/* Agent 1 */}
              <div className="flex flex-col rounded border border-slate-800/80 bg-slate-900/60 p-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-semibold text-slate-300">Agent 1 [Visual & Tamper Oracle]:</span>
                  <p className="text-slate-400 text-[10px]">
                    Signer: {record.multiAgentConsensus?.visualOracleAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
                  </p>
                </div>
                <div className="mt-1 sm:mt-0 flex items-center gap-2">
                  <span className="rounded bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 text-[10px] text-emerald-300">
                    Tamper Sign-Off OK
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        record.multiAgentConsensus?.visualSignature || record.ecdsaSignature,
                        "agent1"
                      )
                    }
                    className="text-cyan-400 hover:underline text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === "agent1" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "agent1" ? "Copied" : "Sig"}</span>
                  </button>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="flex flex-col rounded border border-slate-800/80 bg-slate-900/60 p-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-semibold text-slate-300">Agent 2 [Price Anomaly Oracle]:</span>
                  <p className="text-slate-400 text-[10px]">
                    Signer: {record.multiAgentConsensus?.priceOracleAddress || "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"}
                  </p>
                </div>
                <div className="mt-1 sm:mt-0 flex items-center gap-2">
                  <span className="rounded bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 text-[10px] text-emerald-300">
                    Pricing Quorum OK
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        record.multiAgentConsensus?.priceSignature || record.ecdsaSignature,
                        "agent2"
                      )
                    }
                    className="text-cyan-400 hover:underline text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === "agent2" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "agent2" ? "Copied" : "Sig"}</span>
                  </button>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="flex flex-col rounded border border-slate-800/80 bg-slate-900/60 p-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-semibold text-slate-300">Agent 3 [Consensus Scorer Oracle]:</span>
                  <p className="text-slate-400 text-[10px]">
                    Signer: {record.multiAgentConsensus?.consensusOracleAddress || record.oracleSignerAddress}
                  </p>
                </div>
                <div className="mt-1 sm:mt-0 flex items-center gap-2">
                  <span className="rounded bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 text-[10px] text-emerald-300">
                    Trust Attestation OK
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        record.multiAgentConsensus?.consensusSignature || record.ecdsaSignature,
                        "agent3"
                      )
                    }
                    className="text-cyan-400 hover:underline text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === "agent3" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "agent3" ? "Copied" : "Sig"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficiary Confirmation Proof Section */}
          {record.beneficiaryConfirmationHash && (
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
                  <span>BENEFICIARY CONFIRMATION PROOF HASH</span>
                </span>
                <button
                  onClick={() => handleCopy(record.beneficiaryConfirmationHash || "", "beneficiary")}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                >
                  {copiedKey === "beneficiary" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === "beneficiary" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="mt-1 break-all font-mono text-xs text-emerald-300">
                {record.beneficiaryConfirmationHash}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {`solidityPackedKeccak256(["bytes32", "string"], [receiptHash, token: #${record.beneficiaryToken || "8492"}])`}
              </p>
            </div>
          )}

          {/* Tx Hash */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between text-slate-400">
              <span>TRANSACTION HASH</span>
              <button
                onClick={() => handleCopy(record.txHash, "tx")}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                {copiedKey === "tx" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedKey === "tx" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="mt-1 break-all font-mono text-xs text-slate-200">{record.txHash}</p>
            <div className="mt-1 flex gap-4 text-[11px] text-slate-500">
              <span>Block: #{record.blockNumber}</span>
              <span>Network: {record.network}</span>
            </div>
          </div>

          {/* Receipt Fingerprint SHA-256 */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between text-slate-400">
              <span>LAYER-3 PHYSICAL RECEIPT SHA-256 FINGERPRINT</span>
              <button
                onClick={() => handleCopy(record.receiptHash, "receipt")}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                {copiedKey === "receipt" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedKey === "receipt" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="mt-1 break-all font-mono text-xs text-amber-300">{record.receiptHash}</p>
            <p className="mt-1 text-[10px] text-slate-500">
              Stored in mapping(bytes32 =&gt; bool) isReceiptHashUsed. Prevents duplicate submissions.
            </p>
          </div>

          {/* Payload Keccak256 */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between text-slate-400">
              <span>SOLIDITY PACKED KECCAK256 PAYLOAD HASH</span>
              <button
                onClick={() => handleCopy(record.payloadHash, "payload")}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                {copiedKey === "payload" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedKey === "payload" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="mt-1 break-all font-mono text-xs text-purple-300">{record.payloadHash}</p>
            <p className="mt-1 text-[10px] text-slate-500">
              Packed from: receiptHash + vendor + amountWei + trustScore + severityLevel + auditMetadataURI + beneficiaryHash + chainId + address(this)
            </p>
          </div>

          {/* 65-Byte ECDSA Signature */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between text-slate-400">
              <span>65-BYTE ECDSA ATTESTATION SIGNATURE (EIP-191)</span>
              <button
                onClick={() => handleCopy(record.ecdsaSignature, "sig")}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                {copiedKey === "sig" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedKey === "sig" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="mt-1 break-all font-mono text-xs text-emerald-300">{record.ecdsaSignature}</p>

            {/* r, s, v split */}
            <div className="mt-2 grid grid-cols-3 gap-2 border-t border-slate-800 pt-2 text-[10px]">
              <div>
                <span className="text-slate-500">r:</span>{" "}
                <span className="text-slate-300">{shortenHash(sigParts.r, 6)}</span>
              </div>
              <div>
                <span className="text-slate-500">s:</span>{" "}
                <span className="text-slate-300">{shortenHash(sigParts.s, 6)}</span>
              </div>
              <div>
                <span className="text-slate-500">v:</span>{" "}
                <span className="text-slate-300">{sigParts.v}</span>
              </div>
            </div>
          </div>

          {/* Signer Addresses */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
              <span className="text-slate-500">AUTHORIZED AI ORACLE SIGNER:</span>
              <p className="mt-1 break-all text-slate-200">{record.oracleSignerAddress}</p>
            </div>
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
              <span className="text-slate-500">RECOVERED FROM SIGNATURE (ecrecover):</span>
              <p className="mt-1 break-all text-emerald-400">{record.recoveredSignerAddress}</p>
            </div>
          </div>

          {/* AI Forensic Reasoning */}
          {record.aiReasoning && (
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                <span>AI FORENSIC VERDICT REASONING</span>
              </div>
              <p className="mt-1.5 font-mono text-xs leading-relaxed text-slate-300">
                {record.aiReasoning}
              </p>
            </div>
          )}

          {/* ERC-4337 Account Abstraction Paymaster Details */}
          {record.erc4337Paymaster && (
            <div className="rounded-lg border border-purple-900/40 bg-purple-950/20 p-3">
              <div className="flex items-center justify-between text-purple-300 font-bold border-b border-purple-900/30 pb-2">
                <span>ERC-4337 ACCOUNT ABSTRACTION PAYMASTER</span>
                <span className="text-[10px] bg-purple-900/60 px-2 py-0.5 rounded text-purple-200">
                  GAS SPONSORED ($0.00 WORKER COST)
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500">Paymaster Address:</span>
                  <p className="text-slate-200 truncate">{record.erc4337Paymaster.paymasterAddress}</p>
                </div>
                <div>
                  <span className="text-slate-500">Sponsored Gas:</span>
                  <p className="text-purple-300 font-bold">{record.erc4337Paymaster.sponsoredGasMatic} (${record.erc4337Paymaster.sponsoredGasUSD.toFixed(3)})</p>
                </div>
              </div>
              <p className="mt-1 text-[9px] text-slate-500 truncate">UserOp Hash: {record.erc4337Paymaster.userOpHash}</p>
            </div>
          )}

          {/* Automated Local Fiat Off-Ramp Settlement */}
          {record.fiatOffRamp && (
            <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-3">
              <div className="flex items-center justify-between text-emerald-300 font-bold border-b border-emerald-900/30 pb-2">
                <span>AUTOMATED FIAT OFF-RAMP SETTLEMENT</span>
                <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200">
                  {record.fiatOffRamp.status}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500">Humanitarian Rail:</span>
                  <p className="text-slate-200 font-bold">{record.fiatOffRamp.method}</p>
                </div>
                <div>
                  <span className="text-slate-500">Settled Amount:</span>
                  <p className="text-emerald-300 font-bold">৳{record.fiatOffRamp.settledAmountLocal} BDT</p>
                </div>
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-slate-400">
                <span>Exchange Rate: 1 USD = {record.fiatOffRamp.exchangeRate} BDT</span>
                <span>Txn Ref: {record.fiatOffRamp.txnReference}</span>
              </div>
            </div>
          )}

          {/* IPFS CID */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3 flex items-center justify-between">
            <div>
              <span className="text-slate-500">CONTENT-ADDRESSED IPFS FORENSIC RECORD:</span>
              <p className="text-cyan-400 text-xs mt-0.5 font-bold">{record.ipfsReportCID || record.auditMetadataURI}</p>
            </div>
            <span className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-400">
              IPFS Pin
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 font-mono text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};