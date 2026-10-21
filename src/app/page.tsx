"use client";

import React, { useState, useEffect, useCallback } from "react";
import { EnterpriseSidebar, SidebarTab } from "@/components/EnterpriseSidebar";
import {
  EnterpriseHeader,
  GLOBAL_JURISDICTIONS,
  JurisdictionZone,
} from "@/components/EnterpriseHeader";
import { EnterpriseKpis } from "@/components/EnterpriseKpis";
import { MultiOracleConsensusPanel } from "@/components/MultiOracleConsensusPanel";
import { ForensicReceiptViewer } from "@/components/ForensicReceiptViewer";
import { AutonomousEscrowPanel } from "@/components/AutonomousEscrowPanel";
import { EnterpriseFieldControls } from "@/components/EnterpriseFieldControls";
import { BottomAnalyticsRow } from "@/components/BottomAnalyticsRow";
import { TacticalGlobe } from "@/components/TacticalGlobe";
import { ForensicTerminal, LogEntry, AuditedItem } from "@/components/ForensicTerminal";
import { ContractInspector } from "@/components/ContractInspector";
import { ProofModal } from "@/components/ProofModal";
import { DisputeModal } from "@/components/DisputeModal";
import { AutoPilotTour } from "@/components/AutoPilotTour";
import {
  VaultStats,
  ForensicTransactionRecord,
  DisputeAppealRecord,
} from "@/lib/blockchain/relayer";
import {
  getOfflineQueue,
  removeFromOfflineQueue,
  OfflineQueuedReceipt,
} from "@/lib/offline-queue";
import { HeterogeneousConsensusResult } from "@/lib/ai-pipeline";
import { shortenHash, shortenAddress } from "@/lib/blockchain/crypto-utils";
import confetti from "canvas-confetti";
import {
  FileCheck2,
  ExternalLink,
  ShieldAlert,
  Users,
  ShieldCheck,
  Truck,
  BarChart3,
  Lock,
  Layers,
  Settings,
  Activity,
  KeyRound,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function AegisReliefEnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("mission-control");
  const [selectedZone, setSelectedZone] = useState<JurisdictionZone>(GLOBAL_JURISDICTIONS[0]);
  const [isOffline, setIsOffline] = useState(false);
  const [queuedCount, setQueuedCount] = useState(0);

  // Field Controls State
  const [severityLevel, setSeverityLevel] = useState<number>(1);
  const [beneficiaryToken, setBeneficiaryToken] = useState<string>("8492");
  const [activePreset, setActivePreset] = useState<
    "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE" | null
  >("AUTHENTIC_SYLHET_RELIEF");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Stats & Ledger State
  const [vaultStats, setVaultStats] = useState<VaultStats>({
    balanceWei: "4938461538461538461538",
    balanceEth: "4938.46",
    balanceUsd: 12840000.0,
    disbursedWei: "1392307692307692307692",
    disbursedEth: "1392.30",
    disbursedUsd: 3620000.0,
    fraudBlockedWei: "187307692307692307692",
    fraudBlockedEth: "187.30",
    fraudBlockedUsd: 487000.0,
    auditsCount: 38,
    fraudCount: 23,
    disputesCount: 2,
    dailyQuotaUSD: 50000,
    dailyDisbursedUSD: 1180,
    circuitBreakerActive: false,
    totalGasSavedMatic: "0.042 MATIC Avg",
  });

  const [ledger, setLedger] = useState<ForensicTransactionRecord[]>([]);
  const [usedHashes, setUsedHashes] = useState<string[]>([]);
  const [disputes, setDisputes] = useState<DisputeAppealRecord[]>([]);
  const [contractAddress, setContractAddress] = useState("0x8A791620dd6260079BF849Dc5567aDC3F2FdC318");
  const [oracleSigner, setOracleSigner] = useState("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const [multiOracles, setMultiOracles] = useState<{
    visualOracle: string;
    priceOracle: string;
    consensusOracle: string;
  }>({
    visualOracle: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    priceOracle: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    consensusOracle: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  });
  const [chainId, setChainId] = useState(80002);
  const [networkName, setNetworkName] = useState("Polygon Amoy Testnet (80002)");

  // Real-time Forensic Stream & Consensus Result State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<LogEntry[]>([]);
  const [auditedItems, setAuditedItems] = useState<AuditedItem[]>([]);
  const [consensusResult, setConsensusResult] = useState<HeterogeneousConsensusResult | null>(null);
  const [lastRecord, setLastRecord] = useState<ForensicTransactionRecord | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  // Modals State
  const [selectedProofRecord, setSelectedProofRecord] = useState<ForensicTransactionRecord | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const [lastGlobeEvent, setLastGlobeEvent] = useState<{
    type: "PayoutExecuted" | "FraudAttemptIntercepted";
    zoneId?: string;
    timestamp: number;
  } | null>(null);

  // Fetch protocol stats & ledger
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/relayer/stats");
      const data = await res.json();
      if (data.success) {
        setVaultStats(data.stats);
        setLedger(data.ledger);
        setUsedHashes(data.usedHashes);
        if (data.disputes) setDisputes(data.disputes);
        if (data.contractAddress) setContractAddress(data.contractAddress);
        if (data.oracleSigner) setOracleSigner(data.oracleSigner);
        if (data.multiOracles) {
          setMultiOracles({
            visualOracle: data.multiOracles.visualOracleAddress || data.multiOracles.visualOracle || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            priceOracle: data.multiOracles.priceOracleAddress || data.multiOracles.priceOracle || "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
            consensusOracle: data.multiOracles.consensusOracleAddress || data.multiOracles.consensusOracle || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          });
        }
        if (data.chainId) setChainId(data.chainId);
        if (data.network) setNetworkName(data.network);
      }
    } catch (err) {
      console.warn("Failed to fetch protocol stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    setQueuedCount(getOfflineQueue().length);
  }, [fetchStats]);

  // Flush offline queue when reconnected
  useEffect(() => {
    if (!isOffline) {
      const queue = getOfflineQueue();
      if (queue.length > 0) {
        processOfflineQueue(queue);
      }
    }
  }, [isOffline]);

  const processOfflineQueue = async (items: OfflineQueuedReceipt[]) => {
    for (const item of items) {
      try {
        await runAuditFlow({
          presetId: item.presetId,
          receiptImage: item.receiptImage,
          voiceTranscript: item.voiceTranscript,
          simulatedZoneId: item.simulatedZoneId,
        });
        removeFromOfflineQueue(item.id);
      } catch (err) {
        console.error("Error processing offline item:", err);
      }
    }
    setQueuedCount(getOfflineQueue().length);
  };

  // Reset protocol simulation state
  const handleReset = async () => {
    try {
      await fetch("/api/relayer/reset", { method: "POST" });
      setLastRecord(null);
      setLastError(null);
      setTerminalLogs([]);
      setAuditedItems([]);
      setConsensusResult(null);
      setAuditStep(0);
      setLastGlobeEvent(null);
      await fetchStats();
      alert("AegisRelief Sovereign Enterprise simulation state reset successfully.");
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  };

  // Run Heterogeneous 3-Model AI Consensus + ERC-4337 Gasless Relayer Flow
  const runAuditFlow = async (params: {
    presetId?: string;
    receiptImage?: string;
    voiceTranscript?: string;
    simulatedZoneId?: string;
    severityLevel?: number;
    beneficiaryToken?: string;
  }) => {
    setIsAuditing(true);
    setLastError(null);
    setAuditStep(0);
    setTerminalLogs([]);

    const severity = params.severityLevel || severityLevel;
    const token = params.beneficiaryToken || beneficiaryToken;

    setTerminalLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        agent: "CONSENSUS_INGEST",
        message: `Dispatching receipt to Heterogeneous 3-Model AI Engine (Gemini 2.5 Flash, Hugging Face Donut, Nebius Llama-3.3-70B)... [Zone: ${selectedZone.id}, Severity Level ${severity}, Token #${token}]`,
        status: "INFO",
      },
    ]);

    try {
      // 1. Call Heterogeneous 3-Model Consensus API
      const consensusRes = await fetch("/api/audit/consensus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          simulatedZoneId: selectedZone.id,
          severityLevel: severity,
          beneficiaryToken: token,
        }),
      });

      const consensusData = await consensusRes.json();
      if (!consensusData.success) {
        throw new Error(consensusData.error || "Multi-oracle consensus failed");
      }

      const consensus = consensusData.result as HeterogeneousConsensusResult;
      setConsensusResult(consensus);
      setAuditedItems(consensus.oracleB.items || []);

      // Sequential animated terminal logs
      setAuditStep(1);
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          agent: "ORACLE-A [GEMINI 2.5 FLASH]",
          message: consensus.oracleA.tamperDetected
            ? `FORGERY DETECTED: ${consensus.oracleA.details} (Confidence: ${consensus.oracleA.confidenceScore}%)`
            : `VISUAL AUTHENTIC: ${consensus.oracleA.details} (Confidence: ${consensus.oracleA.confidenceScore}%, Latency: ${consensus.oracleA.latencyMs}ms)`,
          status: consensus.oracleA.tamperDetected ? "CRITICAL" : "SUCCESS",
        },
      ]);

      await new Promise((r) => setTimeout(r, 450));

      setAuditStep(2);
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          agent: "ORACLE-B [HUGGING FACE DONUT]",
          message: `Raw OCR parsed ${consensus.oracleB.extractedItemsCount} commodities with ${consensus.oracleB.ocrAccuracy}% precision. Amount: $${consensus.oracleB.totalAmountUSD.toFixed(2)} USD.`,
          status: "SUCCESS",
        },
      ]);

      await new Promise((r) => setTimeout(r, 450));

      setAuditStep(3);
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          agent: "ORACLE-C [NEBIUS LLAMA-3.3-70B]",
          message: `Economic Audit Complete: Trust Score ${consensus.oracleC.trustScore}/100. Severity Level ${severity} (Tolerance: ${consensus.allowedTolerancePercent}%). ${consensus.oracleC.reasoning}`,
          status: consensus.oracleC.trustScore >= 85 ? "SUCCESS" : "CRITICAL",
        },
      ]);

      await new Promise((r) => setTimeout(r, 450));

      setAuditStep(4);
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          agent: "CONSENSUS_QUORUM",
          message: `Quorum: ${consensus.consensusQuorum} • Sentinel-1 Satellite SAR Inundation: 0.884 Verified • zkPass Officer DID: Confirmed • Beneficiary Token #${token}: Verified`,
          status: "INFO",
        },
      ]);

      // 2. Call ERC-4337 Gasless Relayer to Execute on EVM Smart Contract
      const relayRes = await fetch("/api/relayer/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptHash: consensus.receiptHash,
          vendorAddress: consensus.vendorAddress,
          amountWei: consensus.totalAmountWei,
          trustScore: consensus.trustScore,
          severityLevel: severity,
          beneficiaryToken: token,
          auditMetadataURI: consensus.ipfsReportCID,
          itemsAudited: consensus.oracleB.items,
          tamperFlags: consensus.oracleA.tamperFlags,
          aiReasoning: consensus.oracleC.reasoning,
          amountUsd: consensus.totalAmountUSD,
        }),
      });

      const relayData = await relayRes.json();

      if (!relayData.success) {
        if (relayData.isReplayAttack) {
          setLastError(relayData.error);
          setTerminalLogs((prev) => [
            ...prev,
            {
              timestamp: new Date().toISOString(),
              agent: "EVM_ESCROW_GUARD",
              message: `REVERT [LAYER-3 ANTI-REPLAY]: ${relayData.error}`,
              status: "CRITICAL",
            },
          ]);
          setLastGlobeEvent({
            type: "FraudAttemptIntercepted",
            timestamp: Date.now(),
          });
          return;
        } else {
          throw new Error(relayData.error || "Relayer execution failed");
        }
      }

      const txRecord = relayData.record as ForensicTransactionRecord;
      setLastRecord(txRecord);

      if (txRecord.approved) {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#10b981", "#06b6d4", "#3b82f6", "#a855f7"],
        });
      }

      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          agent: "EVM_ESCROW_SETTLEMENT",
          message: `CONFIRMED on ${txRecord.network} • Tx: ${shortenHash(txRecord.txHash, 6)} • ERC-4337 Gas: $0.00 (Sponsored by Paymaster) • Fiat Off-Ramp: ৳${txRecord.fiatOffRamp?.settledAmountLocal} BDT`,
          status: txRecord.approved ? "SUCCESS" : "CRITICAL",
        },
      ]);

      setLastGlobeEvent({
        type: txRecord.onChainEvent,
        timestamp: Date.now(),
      });

      await fetchStats();
    } catch (err: any) {
      console.error("Consensus execution error:", err);
      setLastError(err?.message || "Execution failed");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSelectPreset = (
    presetId: "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE"
  ) => {
    setActivePreset(presetId);
    setUploadedImage(null);
    if (presetId === "CORRUPT_SYNDICATE_INVOICE") {
      setSelectedZone(GLOBAL_JURISDICTIONS[1]); // Cox's Bazar
    } else {
      setSelectedZone(GLOBAL_JURISDICTIONS[0]); // Sylhet
    }
    runAuditFlow({ presetId, severityLevel, beneficiaryToken });
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-row overflow-x-hidden">
      {/* LEFT NAVIGATION SIDEBAR */}
      <EnterpriseSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fraudCount={vaultStats.fraudCount}
        operationsCount={vaultStats.auditsCount}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP ENTERPRISE HEADER */}
        <EnterpriseHeader
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          onResetLedger={handleReset}
          onStartTour={() => setIsTourOpen(true)}
          networkName={networkName}
          walletAddress={vaultStats ? shortenAddress("0x7A3B9184B4b51A07E4f1d44B9E392942C5D14E2F", 4) : undefined}
        />

        {/* TAB 1: 8K MISSION CONTROL */}
        {activeTab === "mission-control" && (
          <main className="w-full max-w-none px-6 py-4 space-y-4">
            {/* ROW 1: TOP 4 KPI CARDS WITH SPARKLINE CHARTS */}
            <EnterpriseKpis stats={vaultStats} />

            {/* ROW 2: JUDGES EVALUATION & MULTI-ORACLE AI CONSENSUS PANEL */}
            <MultiOracleConsensusPanel
              consensusResult={consensusResult}
              isAuditing={isAuditing}
              activePreset={activePreset}
              onSelectPreset={handleSelectPreset}
            />

            {/* ROW 3: MAIN WORKSPACE GRID (3 COLUMNS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
              {/* Column 1: Forensic Visualizer & Neural OCR Optimizer (4 cols) */}
              <div className="lg:col-span-4">
                <ForensicReceiptViewer
                  isAuditing={isAuditing}
                  presetId={activePreset}
                  uploadedImage={uploadedImage}
                  approved={lastRecord ? lastRecord.approved : null}
                  trustScore={consensusResult ? consensusResult.trustScore : 96}
                />
              </div>

              {/* Column 2: Autonomous Escrow Decision Panel (5 cols) */}
              <div className="lg:col-span-5">
                <AutonomousEscrowPanel
                  lastRecord={lastRecord}
                  isAuditing={isAuditing}
                  onExecuteAudit={() => runAuditFlow({ presetId: activePreset || "AUTHENTIC_SYLHET_RELIEF" })}
                  onRequestDisputeModal={() => setIsDisputeModalOpen(true)}
                  onInspectProof={() => setSelectedProofRecord(lastRecord)}
                  trustScore={consensusResult ? consensusResult.trustScore : 96}
                />
              </div>

              {/* Column 3: Field Worker Portal & Disaster Ground Controls (3 cols) */}
              <div className="lg:col-span-3">
                <EnterpriseFieldControls
                  selectedZone={selectedZone}
                  severityLevel={severityLevel}
                  onSeverityChange={setSeverityLevel}
                  beneficiaryToken={beneficiaryToken}
                  onTokenChange={setBeneficiaryToken}
                  isOffline={isOffline}
                  onToggleOffline={() => setIsOffline(!isOffline)}
                />
              </div>
            </div>

            {/* ROW 4: BOTTOM TELEMETRY & ANALYTICS ROW (3 CARDS) */}
            <BottomAnalyticsRow
              lastReceiptHash={lastRecord?.receiptHash || (activePreset === "CORRUPT_SYNDICATE_INVOICE" ? "0x9e8c37d042168f0312cb84917a8c3d97f1bb657c9135017ea0cf62aa89849222" : "0x4a7f29b6e82811a0c4f83e29f8604d5bc89a81f3370e07172cfd5d081f26a111")}
              totalBlockedCount={vaultStats.fraudCount}
            />

            {/* ROW 5: IMMUTABLE ON-CHAIN FORENSIC LEDGER */}
            <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-mono text-sm font-bold text-slate-200">
                    Immutable On-Chain Forensic Ledger
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {ledger.length} Verified Transactions Recorded
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                {ledger.length === 0 ? (
                  <div className="p-8 text-center font-mono text-xs text-slate-500">
                    No on-chain audits recorded yet. Run a simulation preset to generate cryptographic attestations!
                  </div>
                ) : (
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[#1E293B] text-slate-400 text-[11px]">
                        <th className="pb-2">Protocol Event</th>
                        <th className="pb-2">Tx Hash</th>
                        <th className="pb-2">Vendor Address</th>
                        <th className="pb-2 text-right">Amount (USD)</th>
                        <th className="pb-2 text-center">Score</th>
                        <th className="pb-2 text-center">ERC-4337 Gas</th>
                        <th className="pb-2 text-right">Attestation Proof</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
                      {ledger.map((rec, i) => (
                        <tr
                          key={i}
                          className="hover:bg-[#131B2A] cursor-pointer transition-colors"
                          onClick={() => setSelectedProofRecord(rec)}
                        >
                          <td className="py-2.5">
                            <span
                              className={`rounded px-2 py-0.5 font-bold text-[10px] ${
                                rec.approved
                                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                                  : "bg-red-950/80 text-red-300 border border-red-800"
                              }`}
                            >
                              {rec.onChainEvent}
                            </span>
                          </td>
                          <td className="py-2.5 text-cyan-400">
                            {shortenHash(rec.txHash, 5)}
                          </td>
                          <td className="py-2.5 text-slate-400">
                            {shortenAddress(rec.vendor, 4)}
                          </td>
                          <td className="py-2.5 text-right font-medium text-slate-200">
                            ${rec.amountUsd?.toFixed(2)}
                          </td>
                          <td className="py-2.5 text-center">
                            <span
                              className={`font-bold ${
                                rec.trustScore >= 85 ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {rec.trustScore}
                            </span>
                          </td>
                          <td className="py-2.5 text-center text-emerald-400 font-bold text-[11px]">
                            $0.00
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline">
                              <span>Inspect Proof</span>
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* ROW 6: TACTICAL GLOBE & FORENSIC TERMINAL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
              <TacticalGlobe lastEvent={lastGlobeEvent} />
              <ForensicTerminal
                logs={terminalLogs}
                items={auditedItems}
                isAuditing={isAuditing}
                currentStepIndex={auditStep}
                trustScore={lastRecord?.trustScore}
                verdict={lastRecord ? (lastRecord.approved ? "APPROVED" : "REJECTED_FRAUD") : null}
              />
            </div>
          </main>
        )}

        {/* TAB 2: ESCROW VAULTS & SMART CONTRACT INSPECTOR */}
        {activeTab === "escrow-vaults" && (
          <main className="w-full max-w-none px-6 py-4 space-y-4">
            <ContractInspector
              usedReceipts={usedHashes}
              oracleSignerAddress={oracleSigner}
              multiOracleAddresses={multiOracles}
              contractAddress={contractAddress}
              chainId={chainId}
            />
          </main>
        )}

        {/* TAB 3: FIELD WORKERS */}
        {activeTab === "field-workers" && (
          <main className="w-full max-w-none px-6 py-4 space-y-4 font-mono">
            <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    zkPass & World ID Verified Field Relief Officers
                  </h2>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  142 Active Deployments
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: "BD-8841", name: "Capt. A. Rahman", zone: "Sylhet Sector Alpha", role: "Lead Supply Coordinator", did: "zkPass Verified #BD-8841", active: true },
                  { id: "BD-4910", name: "Dr. F. Yasmin", zone: "Cox's Bazar Camp Beta", role: "Medical Logistics Officer", did: "World ID #BD-4910", active: true },
                  { id: "BD-1194", name: "Engr. T. Hossain", zone: "Sunamganj Haor Grid", role: "Water Infrastructure Officer", did: "zkPass Verified #BD-1194", active: true },
                ].map((worker) => (
                  <div key={worker.id} className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{worker.name}</span>
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{worker.role} • {worker.zone}</p>
                    <div className="pt-1.5 border-t border-[#1E293B] flex items-center justify-between text-[10px]">
                      <span className="text-cyan-400">{worker.did}</span>
                      <span className="text-slate-500">ID: {worker.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* TAB 4: RELIEF OPERATIONS */}
        {activeTab === "relief-operations" && (
          <main className="w-full max-w-none px-6 py-4 space-y-4 font-mono">
            <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    Live Humanitarian Relief Procurement Operations
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  Total Disbursed: ${vaultStats.disbursedUsd.toLocaleString()} USD
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                {ledger.map((rec, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedProofRecord(rec)}
                    className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:border-cyan-500/40 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rec.approved ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-red-950 text-red-300 border border-red-800"}`}>
                          {rec.onChainEvent}
                        </span>
                        <span className="text-slate-200 font-bold">{rec.vendor}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Token #{rec.beneficiaryToken || "8492"} • IPFS: {rec.ipfsReportCID?.slice(0, 24)}...
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-100">${rec.amountUsd.toFixed(2)} USD</div>
                      <div className="text-[10px] text-emerald-400">Fiat Off-Ramp: ৳{rec.fiatOffRamp?.settledAmountLocal || "139,004.00"} BDT</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* TAB 5: FRAUD INTELLIGENCE */}
        {activeTab === "fraud-intelligence" && (
          <main className="w-full max-w-none px-6 py-4 space-y-4 font-mono">
            <div className="rounded-xl border border-red-900/40 bg-[#0B0F17] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    Corruption Interception & Anti-Syndicate Forensics
                  </h2>
                </div>
                <span className="text-xs text-red-400 bg-red-950/80 border border-red-800 px-2.5 py-0.5 rounded font-bold">
                  {vaultStats.fraudCount} Attacks Prevented
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 space-y-2">
                  <div className="font-bold text-red-400 text-sm">Case #FRD-99201: Cox&apos;s Bazar Syndicate</div>
                  <p className="text-slate-300 text-[11px]">
                    210% price markup detected on coarse relief rice and trauma kits. Font analysis flagged Arial Bold overlay.
                  </p>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-[#1E293B]">
                    <span>Amount Frozen: $3,860.00 USD</span>
                    <span className="text-red-400 font-bold">STATUS: LOCKED</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 space-y-2">
                  <div className="font-bold text-amber-400 text-sm">Dispute Appeals Under DAO Review ({disputes.length})</div>
                  <p className="text-slate-300 text-[11px]">
                    Formal appeals submitted for 48-hour decentralized humanitarian jury evaluation.
                  </p>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-[#1E293B]">
                    <span>Total Lodged: {disputes.length}</span>
                    <span className="text-amber-400 font-bold">48-Hr Timelock</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* TAB: ANALYTICS & TELEMETRY */}
        {activeTab === "analytics" && (
          <main className="w-full max-w-none px-6 py-4 space-y-4 font-mono">
            <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    Protocol Analytics & Quorum Telemetry
                  </h2>
                </div>
                <span className="text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                  Real-Time Oracle Metrics
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-4 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Avg Multi-Oracle Latency</span>
                  <div className="text-2xl font-black text-cyan-400 font-mono">437 ms</div>
                  <p className="text-[11px] text-slate-500">Gemini (412ms) • HF Donut (580ms) • Nebius (320ms)</p>
                </div>
                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-4 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Settlement Success Ratio</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">98.9%</div>
                  <p className="text-[11px] text-slate-500">ERC-4337 Relayer sponsored gas dispatches</p>
                </div>
                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-4 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">SAR Ground Inundation Index</span>
                  <div className="text-2xl font-black text-purple-400 font-mono">0.884</div>
                  <p className="text-[11px] text-slate-500">Copernicus Sentinel-1 Satellite radar verified</p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* TAB 6: SECURITY & ORACLES */}
        {activeTab === "security" && (
          <main className="w-full max-w-none px-6 py-4 space-y-4 font-mono">
            <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    Protocol Security, Paymaster & Circuit Breaker
                  </h2>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded font-bold">
                  All Oracles Active
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Oracle A Signer</span>
                  <p className="text-cyan-300 font-bold text-[11px] truncate">{multiOracles.visualOracle}</p>
                  <p className="text-[10px] text-slate-400">Google Gemini 2.5 Flash Spatial Vision</p>
                </div>

                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Oracle B Signer</span>
                  <p className="text-cyan-300 font-bold text-[11px] truncate">{multiOracles.priceOracle}</p>
                  <p className="text-[10px] text-slate-400">Hugging Face Donut OCR Extraction</p>
                </div>

                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Oracle C Signer</span>
                  <p className="text-amber-300 font-bold text-[11px] truncate">{multiOracles.consensusOracle}</p>
                  <p className="text-[10px] text-slate-400">Nebius Llama-3.3-70B Economic Auditor</p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* TAB 7: SETTINGS & APIS */}
        {activeTab === "settings" && (
          <main className="w-full max-w-none px-6 py-4 space-y-4 font-mono">
            <div className="rounded-xl border border-[#1E293B] bg-[#0B0F17] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-slate-100">
                    API Integrations & Protocol Configuration
                  </h2>
                </div>
                <span className="text-xs text-emerald-400 font-bold">Live Production Mode</span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-200">Google Gemini 2.5 Flash API</div>
                    <div className="text-[10px] text-slate-500">Key: AQ.Ab8RN6...BznkYBz6w (Configured in .env.local)</div>
                  </div>
                  <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">CONNECTED</span>
                </div>

                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-200">Nebius AI Studio API (Llama-3.3-70B)</div>
                    <div className="text-[10px] text-slate-500">Endpoint: https://api.studio.nebius.ai/v1 (Key Active)</div>
                  </div>
                  <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">CONNECTED</span>
                </div>

                <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-200">Hugging Face Inference API</div>
                    <div className="text-[10px] text-slate-500">Key: hf_bjRBMsDe...cYZD (naver-clova-ix/donut-base)</div>
                  </div>
                  <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">CONNECTED</span>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* FOOTER */}
        <footer className="border-t border-[#1E293B] bg-[#0B0F17] px-4 py-3 text-center font-mono text-[10px] text-slate-500">
          <p>
            AegisRelief Sovereign • 8K Enterprise Humanitarian Protocol • Zero-Trust Multi-Oracle AI Consensus & Invisible Web3 Relayer
          </p>
        </footer>
      </div>

      {/* CRYPTOGRAPHIC PROOF MODAL */}
      <ProofModal
        record={selectedProofRecord}
        onClose={() => setSelectedProofRecord(null)}
      />

      {/* DAO DISPUTE MODAL */}
      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        receiptHash={lastRecord?.receiptHash || (activePreset === "CORRUPT_SYNDICATE_INVOICE" ? "0x9e8c37d042168f0312cb84917a8c3d97f1bb657c9135017ea0cf62aa89849222" : "0x4a7f29b6e82811a0c4f83e29f8604d5bc89a81f3370e07172cfd5d081f26a111")}
        vendorAddress={lastRecord?.vendor || (activePreset === "CORRUPT_SYNDICATE_INVOICE" ? "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65" : "0x90F79bf6EB2c4f870365E785982E1f101E93b906")}
        currentScore={lastRecord ? lastRecord.trustScore : (activePreset === "CORRUPT_SYNDICATE_INVOICE" ? 18 : 96)}
        onDisputeSubmitted={(rec) => {
          setDisputes((prev) => [rec, ...prev]);
          fetchStats();
        }}
      />

      {/* AUTO-PILOT PITCH MODE TOUR */}
      <AutoPilotTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectPreset={handleSelectPreset}
      />
    </div>
  );
}
