"use client";

import React, { useState } from "react";
import {
  FileCode,
  ShieldAlert,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Copy,
  Check,
  Lock,
  Layers,
  Users,
  Flame,
  Shield,
  Activity,
  KeyRound,
} from "lucide-react";
import { AEGIS_RELIEF_ESCROW_SOURCE } from "@/lib/blockchain/abi";
import {
  packForensicPayload,
  packMultiAgentPayload,
  computeBeneficiaryConfirmationHash,
  verifyForensicSignature,
  signForensicPayload,
  shortenAddress,
} from "@/lib/blockchain/crypto-utils";

interface MultiOracleAddresses {
  visualOracle?: string;
  priceOracle?: string;
  consensusOracle?: string;
  visualOracleAddress?: string;
  priceOracleAddress?: string;
  consensusOracleAddress?: string;
}

interface ContractInspectorProps {
  usedReceipts: string[];
  oracleSignerAddress: string;
  multiOracleAddresses?: MultiOracleAddresses;
  contractAddress: string;
  chainId: number;
}

export const ContractInspector: React.FC<ContractInspectorProps> = ({
  usedReceipts,
  oracleSignerAddress,
  multiOracleAddresses = {},
  contractAddress,
  chainId,
}) => {
  const visualAddress =
    multiOracleAddresses.visualOracle ||
    multiOracleAddresses.visualOracleAddress ||
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const priceAddress =
    multiOracleAddresses.priceOracle ||
    multiOracleAddresses.priceOracleAddress ||
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  const consensusAddress =
    multiOracleAddresses.consensusOracle ||
    multiOracleAddresses.consensusOracleAddress ||
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  // 1. Live isReceiptHashUsed Query State
  const [searchHash, setSearchHash] = useState("");
  const [queryResult, setQueryResult] = useState<{ checked: boolean; isUsed: boolean } | null>(null);

  // 2. Interactive ECDSA Sandbox State
  const [sandboxMode, setSandboxMode] = useState<"MULTI_AGENT" | "SINGLE_ORACLE">("MULTI_AGENT");
  const defaultReceipt = "0x4a7f29b6e82811a0c4f83e29f8604d5bc89a81f3370e07172cfd5d081f26a111";
  const defaultVendor = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  const defaultAmountWei = "453846153846153846";
  const defaultTrustScore = 96;
  const defaultSeverity = 1;
  const defaultBeneficiaryToken = "8492";
  const defaultURI = "ipfs://bafybeihsylhetauthentic2024reliefattestation001";

  const [sandboxReceipt, setSandboxReceipt] = useState(defaultReceipt);
  const [sandboxVendor, setSandboxVendor] = useState(defaultVendor);
  const [sandboxAmount, setSandboxAmount] = useState(defaultAmountWei);
  const [sandboxScore, setSandboxScore] = useState(defaultTrustScore);
  const [sandboxSeverity, setSandboxSeverity] = useState(defaultSeverity);
  const [sandboxToken, setSandboxToken] = useState(defaultBeneficiaryToken);
  const [sandboxURI, setSandboxURI] = useState(defaultURI);

  // Sandbox signatures & verification results
  const [sandboxPayloadHash, setSandboxPayloadHash] = useState<string>("");
  const [sandboxBeneficiaryHash, setSandboxBeneficiaryHash] = useState<string>("");
  const [singleSignature, setSingleSignature] = useState<string>("");
  const [multiSignatures, setMultiSignatures] = useState<{
    visualSig: string;
    priceSig: string;
    consensusSig: string;
  }>({ visualSig: "", priceSig: "", consensusSig: "" });

  const [recoveredSigners, setRecoveredSigners] = useState<{
    visual: string;
    price: string;
    consensus: string;
  }>({ visual: "", price: "", consensus: "" });

  const [verificationStatus, setVerificationStatus] = useState<"IDLE" | "VERIFIED" | "TAMPER_DETECTED">("IDLE");
  const [copiedCode, setCopiedCode] = useState(false);

  // Multi-Oracle Dev Private Keys
  const FALLBACK_VISUAL_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
  const FALLBACK_PRICE_KEY = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
  const FALLBACK_CONSENSUS_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  // Run authentic signing demo
  const handleGenerateValidSignature = async () => {
    try {
      if (sandboxMode === "MULTI_AGENT") {
        const benHash = computeBeneficiaryConfirmationHash(sandboxReceipt, sandboxToken);
        setSandboxBeneficiaryHash(benHash);

        const pHash = packMultiAgentPayload(
          sandboxReceipt,
          sandboxVendor,
          sandboxAmount,
          sandboxScore,
          sandboxSeverity,
          sandboxURI,
          benHash,
          chainId,
          contractAddress
        );
        setSandboxPayloadHash(pHash);

        // Sign with all 3 agent keys
        const vSig = await signForensicPayload(pHash, FALLBACK_VISUAL_KEY);
        const pSig = await signForensicPayload(pHash, FALLBACK_PRICE_KEY);
        const cSig = await signForensicPayload(pHash, FALLBACK_CONSENSUS_KEY);

        setMultiSignatures({ visualSig: vSig, priceSig: pSig, consensusSig: cSig });

        const recV = verifyForensicSignature(pHash, vSig);
        const recP = verifyForensicSignature(pHash, pSig);
        const recC = verifyForensicSignature(pHash, cSig);

        setRecoveredSigners({ visual: recV, price: recP, consensus: recC });
        setVerificationStatus("VERIFIED");
      } else {
        const pHash = packForensicPayload(
          sandboxReceipt,
          sandboxVendor,
          sandboxAmount,
          sandboxScore,
          sandboxURI,
          chainId,
          contractAddress
        );
        setSandboxPayloadHash(pHash);

        const sig = await signForensicPayload(pHash, FALLBACK_CONSENSUS_KEY);
        setSingleSignature(sig);

        const recovered = verifyForensicSignature(pHash, sig);
        setRecoveredSigners({ visual: "", price: "", consensus: recovered });
        setVerificationStatus("VERIFIED");
      }
    } catch (err) {
      console.error("Signature generation error:", err);
    }
  };

  // Tamper with trustScore or severity to simulate an attacker altering parameters
  const handleTamperScore = () => {
    const tampered = sandboxScore === 96 ? 99 : 96;
    setSandboxScore(tampered);

    if (sandboxMode === "MULTI_AGENT") {
      const benHash = computeBeneficiaryConfirmationHash(sandboxReceipt, sandboxToken);
      const newHash = packMultiAgentPayload(
        sandboxReceipt,
        sandboxVendor,
        sandboxAmount,
        tampered,
        sandboxSeverity,
        sandboxURI,
        benHash,
        chainId,
        contractAddress
      );
      setSandboxPayloadHash(newHash);

      if (multiSignatures.visualSig) {
        try {
          const recV = verifyForensicSignature(newHash, multiSignatures.visualSig);
          const recP = verifyForensicSignature(newHash, multiSignatures.priceSig);
          const recC = verifyForensicSignature(newHash, multiSignatures.consensusSig);
          setRecoveredSigners({ visual: recV, price: recP, consensus: recC });

          if (
            recV.toLowerCase() === visualAddress.toLowerCase() &&
            recP.toLowerCase() === priceAddress.toLowerCase() &&
            recC.toLowerCase() === consensusAddress.toLowerCase()
          ) {
            setVerificationStatus("VERIFIED");
          } else {
            setVerificationStatus("TAMPER_DETECTED");
          }
        } catch {
          setVerificationStatus("TAMPER_DETECTED");
        }
      }
    } else {
      const newHash = packForensicPayload(
        sandboxReceipt,
        sandboxVendor,
        sandboxAmount,
        tampered,
        sandboxURI,
        chainId,
        contractAddress
      );
      setSandboxPayloadHash(newHash);

      if (singleSignature) {
        try {
          const recovered = verifyForensicSignature(newHash, singleSignature);
          setRecoveredSigners({ visual: "", price: "", consensus: recovered });
          if (recovered.toLowerCase() === oracleSignerAddress.toLowerCase()) {
            setVerificationStatus("VERIFIED");
          } else {
            setVerificationStatus("TAMPER_DETECTED");
          }
        } catch {
          setVerificationStatus("TAMPER_DETECTED");
        }
      }
    }
  };

  const handleQueryHash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHash.trim()) return;
    const normalized = searchHash.trim().toLowerCase();
    const isUsed = usedReceipts.some((h) => h.toLowerCase() === normalized);
    setQueryResult({ checked: true, isUsed });
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-surface p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-cyan-400" />
            <h2 className="font-mono text-base font-bold text-slate-100 sm:text-lg">
              Smart Contract Architecture & Cryptographic Verifier
            </h2>
          </div>
          <p className="font-mono text-xs text-slate-400 mt-0.5">
            AegisReliefEscrow.sol deployed on Polygon Amoy (80002) • Multi-Oracle Attestation & Anti-DoS Escrow
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5">
            <span className="text-slate-500">ESCROW CONTRACT:</span>{" "}
            <span className="text-cyan-300 font-semibold">{shortenAddress(contractAddress, 5)}</span>
          </div>
        </div>
      </div>

      {/* 3 AUTHORIZED MULTI-ORACLE SIGNER NODES CARDS */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Oracle 1 */}
        <div className="rounded-xl border border-slate-800 bg-surface p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] font-semibold text-slate-400">AGENT 1 [VISUAL ORACLE]</span>
            <Shield className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-2 font-mono text-xs font-bold text-cyan-300 break-all">
            {visualAddress}
          </p>
          <p className="mt-1 font-mono text-[10px] text-slate-400">
            Signs visual OCR & tamper-evidence attestations
          </p>
        </div>

        {/* Oracle 2 */}
        <div className="rounded-xl border border-slate-800 bg-surface p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] font-semibold text-slate-400">AGENT 2 [PRICE ORACLE]</span>
            <Activity className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 font-mono text-xs font-bold text-amber-300 break-all">
            {priceAddress}
          </p>
          <p className="mt-1 font-mono text-[10px] text-slate-400">
            Signs commodity variance & dynamic severity checks
          </p>
        </div>

        {/* Oracle 3 */}
        <div className="rounded-xl border border-slate-800 bg-surface p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] font-semibold text-slate-400">AGENT 3 [CONSENSUS ORACLE]</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-mono text-xs font-bold text-emerald-300 break-all">
            {consensusAddress}
          </p>
          <p className="mt-1 font-mono text-[10px] text-slate-400">
            Signs aggregate trust score & final escrow approval
          </p>
        </div>
      </div>

      {/* Grid: Interactive Sandbox & Anti-Replay Registry Query */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* INTERACTIVE ECDSA ECRECOVER SANDBOX */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-surface p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400" />
              <h3 className="font-mono text-sm font-bold text-slate-200">
                Interactive Multi-Oracle Consensus Sandbox
              </h3>
            </div>
            {/* Mode Switcher */}
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setSandboxMode("MULTI_AGENT")}
                className={`rounded px-2 py-0.5 font-bold transition-all ${
                  sandboxMode === "MULTI_AGENT"
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                3-Agent Quorum
              </button>
              <button
                type="button"
                onClick={() => setSandboxMode("SINGLE_ORACLE")}
                className={`rounded px-2 py-0.5 font-bold transition-all ${
                  sandboxMode === "SINGLE_ORACLE"
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Single Key
              </button>
            </div>
          </div>

          <p className="mt-3 font-mono text-xs text-slate-400">
            Simulate how `AegisReliefEscrow.sol` verifies off-chain multi-oracle ECDSA signatures and beneficiary proofs.
            Try tampering with the Trust Score or Severity Level to observe cryptographic rejection!
          </p>

          <div className="mt-4 space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400">Receipt SHA-256 Hash:</label>
              <input
                type="text"
                value={sandboxReceipt}
                onChange={(e) => setSandboxReceipt(e.target.value)}
                className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2 text-amber-300 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400">Vendor Address:</label>
                <input
                  type="text"
                  value={sandboxVendor}
                  onChange={(e) => setSandboxVendor(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2 text-slate-300 focus:border-cyan-500 focus:outline-none text-[11px]"
                />
              </div>

              <div>
                <label className="text-slate-400">Trust Score (0-100):</label>
                <input
                  type="number"
                  value={sandboxScore}
                  onChange={(e) => setSandboxScore(Number(e.target.value))}
                  className={`mt-1 w-full rounded border p-2 font-bold focus:outline-none ${
                    sandboxScore >= 85
                      ? "border-emerald-800 bg-emerald-950/30 text-emerald-300"
                      : "border-red-800 bg-red-950/30 text-red-300"
                  }`}
                />
              </div>
            </div>

            {sandboxMode === "MULTI_AGENT" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Disaster Severity Level:</label>
                  <select
                    value={sandboxSeverity}
                    onChange={(e) => setSandboxSeverity(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2 text-amber-300 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value={1}>Level 1: Moderate (15% tol)</option>
                    <option value={2}>Level 2: High (25% tol)</option>
                    <option value={3}>Level 3: Catastrophic (40% tol)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400">Beneficiary Token (4-Digits):</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={sandboxToken}
                    onChange={(e) => setSandboxToken(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2 text-emerald-300 font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-400">Amount (WEI):</label>
              <input
                type="text"
                value={sandboxAmount}
                onChange={(e) => setSandboxAmount(e.target.value)}
                className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2 text-slate-300 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleGenerateValidSignature}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-400"
            >
              <Play className="h-3.5 w-3.5" />
              <span>
                {sandboxMode === "MULTI_AGENT" ? "1. Sign with 3 Oracle Keys" : "1. Sign with Oracle Key"}
              </span>
            </button>

            <button
              onClick={handleTamperScore}
              disabled={sandboxMode === "MULTI_AGENT" ? !multiSignatures.visualSig : !singleSignature}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-xs font-bold transition-all ${
                (sandboxMode === "MULTI_AGENT" ? multiSignatures.visualSig : singleSignature)
                  ? "border-red-500/60 bg-red-950/40 text-red-300 hover:bg-red-900/50"
                  : "border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>2. Tamper Score (Simulate Forgery)</span>
            </button>
          </div>

          {/* Verification Result Display */}
          {verificationStatus !== "IDLE" && (
            <div
              className={`mt-4 rounded-lg border p-4 font-mono text-xs ${
                verificationStatus === "VERIFIED"
                  ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-200"
                  : "border-red-500/60 bg-red-950/40 text-red-200"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {verificationStatus === "VERIFIED" ? (
                  <>
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span>
                      {sandboxMode === "MULTI_AGENT"
                        ? "3/3 MULTI-ORACLE CONSENSUS QUORUM ATTESTED"
                        : "CRYPTOGRAPHIC SIGNATURE VERIFIED AUTHENTIC"}
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-5 w-5 text-red-400" />
                    <span>INVALID ORACLE SIGNATURE: TAMPERING INTERCEPTED!</span>
                  </>
                )}
              </div>

              <div className="mt-2 space-y-1 text-[11px]">
                <p>
                  <strong>Payload Hash:</strong> {sandboxPayloadHash.substring(0, 24)}...
                </p>
                {sandboxMode === "MULTI_AGENT" ? (
                  <>
                    <p>
                      <strong>Visual Oracle Signer:</strong> {recoveredSigners.visual}
                    </p>
                    <p>
                      <strong>Price Oracle Signer:</strong> {recoveredSigners.price}
                    </p>
                    <p>
                      <strong>Consensus Oracle Signer:</strong> {recoveredSigners.consensus}
                    </p>
                    <p className="mt-1 font-semibold">
                      {verificationStatus === "VERIFIED"
                        ? "✓ All 3 recovered signers match authorized protocol oracle addresses. Smart contract executes payout!"
                        : "✗ Payload mismatch caused recovered address deviation. Smart contract reverts with InvalidOracleSignature()!"}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Authorized Oracle:</strong> {oracleSignerAddress}
                    </p>
                    <p>
                      <strong>Recovered Signer (ecrecover):</strong> {recoveredSigners.consensus}
                    </p>
                    <p className="mt-1 font-semibold">
                      {verificationStatus === "VERIFIED"
                        ? "✓ Signer matches authorized oracle. Funds can be disbursed."
                        : "✗ Hash mismatch altered the recovered address. Smart contract will REVERT with InvalidOracleSignature(). Escrow protected!"}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ANTI-REPLAY REGISTRY LIVE LOOKUP & ANTI-DOS METRICS */}
        <div className="flex flex-col space-y-6">
          {/* Anti-Replay Registry */}
          <div className="flex flex-col rounded-xl border border-slate-800 bg-surface p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-cyan-400" />
                <h3 className="font-mono text-sm font-bold text-slate-200">
                  Layer 3 Anti-Replay Registry (isReceiptHashUsed)
                </h3>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                {usedReceipts.length} Hashes Stored
              </span>
            </div>

            <p className="mt-3 font-mono text-xs text-slate-400">
              Query the protocol&apos;s anti-replay mapping. Any receipt hash that has already been
              disbursed or blocked is permanently locked to prevent double-spending attacks.
            </p>

            <form onSubmit={handleQueryHash} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Paste 0x... 32-byte SHA-256 receipt hash"
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                className="flex-1 rounded border border-slate-800 bg-slate-950 p-2 font-mono text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-slate-800 px-4 py-2 font-mono text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                Query
              </button>
            </form>

            {/* Quick Click Preset Test Hashes */}
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="text-slate-500">Preset Hashes:</span>
              <button
                type="button"
                onClick={() => setSearchHash("0x4a7f29b6e82811a0c4f83e29f8604d5bc89a81f3370e07172cfd5d081f26a111")}
                className="text-cyan-400 underline hover:text-cyan-300"
              >
                [Sylhet Receipt]
              </button>
              <button
                type="button"
                onClick={() => setSearchHash("0x9e8c37d042168f0312cb84917a8c3d97f1bb657c9135017ea0cf62aa89849222")}
                className="text-cyan-400 underline hover:text-cyan-300"
              >
                [Corrupt Syndicate]
              </button>
            </div>

            {/* Query Result Badge */}
            {queryResult && (
              <div
                className={`mt-4 rounded-lg border p-4 font-mono text-xs ${
                  queryResult.isUsed
                    ? "border-amber-500/50 bg-amber-950/30 text-amber-200"
                    : "border-slate-800 bg-slate-900/50 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {queryResult.isUsed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-amber-400" />
                      <span>STATUS: RECEIPT HASH ALREADY USED (LOCKED)</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4 text-emerald-400" />
                      <span>STATUS: UNUSED (AVAILABLE FOR ATTESTATION)</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {queryResult.isUsed
                    ? "isReceiptHashUsed[receiptHash] == true. Re-submitting this receipt will trigger DuplicateReceiptReplayAttack(receiptHash)."
                    : "isReceiptHashUsed[receiptHash] == false. Ready to be processed by the Multi-Agent Forensic Relayer."}
                </p>
              </div>
            )}

            {/* Stored Hashes List */}
            <div className="mt-4 flex-1">
              <span className="font-mono text-[11px] text-slate-400">
                Recent On-Chain Used Receipt Hashes:
              </span>
              <div className="mt-1 max-h-28 overflow-y-auto rounded border border-slate-800 bg-slate-950 p-2 font-mono text-[10px] space-y-1 text-slate-300">
                {usedReceipts.length === 0 ? (
                  <span className="text-slate-600">No receipt hashes committed yet.</span>
                ) : (
                  usedReceipts.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-amber-400/90 hover:text-amber-300">
                      <span className="truncate">{h}</span>
                      <span className="text-slate-500 shrink-0 ml-2">#0{i + 1}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Relayer Anti-DoS & Quota Guard Card */}
          <div className="rounded-xl border border-slate-800 bg-surface p-5 shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  Relayer Rate-Limiting & Anti-DoS Shield
                </h3>
              </div>
              <span className="rounded bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 text-[10px] text-emerald-300">
                Active & Enforced
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded border border-slate-800 bg-slate-950/60 p-2.5">
                <span className="text-[10px] text-slate-500">MAX RATE LIMIT</span>
                <p className="mt-1 text-base font-bold text-cyan-300">8 Req / Min</p>
                <p className="text-[10px] text-slate-400">Sliding Window Protection</p>
              </div>

              <div className="rounded border border-slate-800 bg-slate-950/60 p-2.5">
                <span className="text-[10px] text-slate-500">DAILY RELAYER CEILING</span>
                <p className="mt-1 text-base font-bold text-emerald-300">$50,000 USD</p>
                <p className="text-[10px] text-slate-400">Escrow Depletion Cap</p>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500">
              Protects gasless relayer from sybil exhaustion and Denial-of-Service relay spam during emergency conditions.
            </p>
          </div>
        </div>
      </div>

      {/* SOLIDITY SMART CONTRACT SOURCE CODE INSPECTOR */}
      <div className="rounded-xl border border-slate-800 bg-surface p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-slate-200">
              AegisReliefEscrow.sol (Multi-Agent Consensus Solidity Contract)
            </h3>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(AEGIS_RELIEF_ESCROW_SOURCE);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300 hover:bg-slate-700"
          >
            {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedCode ? "Copied" : "Copy Source"}</span>
          </button>
        </div>

        <div className="mt-3 max-h-96 overflow-y-auto rounded-lg border border-slate-900 bg-black/90 p-4 font-mono text-xs leading-relaxed text-slate-300">
          <pre>{AEGIS_RELIEF_ESCROW_SOURCE}</pre>
        </div>
      </div>
    </div>
  );
};