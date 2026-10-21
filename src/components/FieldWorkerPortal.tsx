"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  Mic,
  MicOff,
  CheckCircle,
  AlertOctagon,
  RefreshCw,
  Send,
  Zap,
  ShieldCheck,
  FileText,
  Radio,
  Wifi,
  WifiOff,
  Flame,
  Users,
  Sliders,
  Gavel,
  Sparkles,
  CheckCheck,
  X,
  AlertTriangle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { computeReceiptSha256 } from "@/lib/blockchain/crypto-utils";
import {
  OfflineQueuedReceipt,
  addToOfflineQueue,
  getOfflineQueue,
  removeFromOfflineQueue,
} from "@/lib/offline-queue";
import baselineData from "@/config/baseline_prices.json";

interface FieldWorkerPortalProps {
  onRunPreset: (
    presetId: "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE",
    options?: { severityLevel?: number; beneficiaryToken?: string }
  ) => void;
  onSubmitCustom: (data: {
    receiptImage?: string;
    voiceTranscript?: string;
    simulatedZoneId: string;
    receiptHash?: string;
    severityLevel?: number;
    beneficiaryToken?: string;
  }) => void;
  isAuditing: boolean;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  lastRecord: any | null;
  lastError: string | null;
  onViewProof: () => void;
  dailyQuotaRemainingUSD?: number;
}

export const FieldWorkerPortal: React.FC<FieldWorkerPortalProps> = ({
  onRunPreset,
  onSubmitCustom,
  isAuditing,
  isOffline,
  setIsOffline,
  lastRecord,
  lastError,
  onViewProof,
  dailyQuotaRemainingUSD = 48820.0,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<
    "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE" | null
  >("AUTHENTIC_SYLHET_RELIEF");
  const [voiceText, setVoiceText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string>("SYL-01");
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  // Advanced Production Hardening State
  const [severityLevel, setSeverityLevel] = useState<1 | 2 | 3>(1);
  const [beneficiaryToken, setBeneficiaryToken] = useState<string>("8492");
  const [isOcrEnhanceActive, setIsOcrEnhanceActive] = useState<boolean>(true);
  const [contrastLevel, setContrastLevel] = useState<number>(160);
  const [brightnessLevel, setBrightnessLevel] = useState<number>(105);

  // Dispute Appeal Modal State
  const [showDisputeModal, setShowDisputeModal] = useState<boolean>(false);
  const [disputeReason, setDisputeReason] = useState<string>("");
  const [disputeLodgeSuccess, setDisputeLodgeSuccess] = useState<{ id: string; message: string } | null>(null);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setVoiceText(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Trigger confetti on approval
  useEffect(() => {
    if (lastRecord && lastRecord.approved) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#06b6d4", "#3b82f6", "#f59e0b"],
      });
    }
  }, [lastRecord]);

  const handlePresetSelect = (
    presetId: "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE"
  ) => {
    setActivePreset(presetId);
    setSelectedImage(null);
    if (presetId === "CORRUPT_SYNDICATE_INVOICE") {
      setSelectedZone("CTG-02");
      setVoiceText(
        "Cox's Bazar Cyclone Relief: 20 sacks Rice billed at $88 each and 15 Trauma Kits billed at $140 each. Total: $3,860."
      );
    } else {
      setSelectedZone("SYL-01");
      setVoiceText(
        "Sylhet flood sector field purchase: 20 sacks coarse parboiled relief rice, 30 heavy-duty tarpaulins, and 20 boxes water purification tablets. Total: $1,180.00."
      );
    }
    onRunPreset(presetId, { severityLevel, beneficiaryToken });
  };

  const toggleSpeech = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use the preset voice note chips below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setActivePreset(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (activePreset && !selectedImage && !voiceText) {
      onRunPreset(activePreset, { severityLevel, beneficiaryToken });
      return;
    }

    if (!selectedImage && !voiceText) {
      if (activePreset) {
        onRunPreset(activePreset, { severityLevel, beneficiaryToken });
        return;
      }
      alert("Please upload a receipt image, record a voice note, or choose one of the 1-Click presets.");
      return;
    }

    const payloadContent = selectedImage || voiceText;
    const computedHash = computeReceiptSha256(payloadContent);

    if (isOffline) {
      addToOfflineQueue({
        receiptHash: computedHash,
        receiptImage: selectedImage || undefined,
        voiceTranscript: voiceText || undefined,
        simulatedZoneId: selectedZone,
      });
      alert(`🛰️ Disaster Signal Lost: Receipt saved to Offline Queue with SHA-256 fingerprint ${computedHash.slice(0, 10)}... Will automatically flush when connection is restored!`);
      setSelectedImage(null);
      setVoiceText("");
    } else {
      onSubmitCustom({
        receiptImage: selectedImage || undefined,
        voiceTranscript: voiceText || undefined,
        simulatedZoneId: selectedZone,
        receiptHash: computedHash,
        severityLevel,
        beneficiaryToken,
      });
    }
  };

  const handleLodgeDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim() || !lastRecord?.receiptHash) return;

    setIsSubmittingDispute(true);
    try {
      const res = await fetch("/api/relayer/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptHash: lastRecord.receiptHash,
          vendorAddress: lastRecord.vendor,
          reason: disputeReason.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDisputeLodgeSuccess({
          id: data.dispute.disputeId,
          message: data.message,
        });
      } else {
        alert(data.error || "Failed to lodge dispute appeal.");
      }
    } catch (err: any) {
      alert("Failed to connect to dispute council: " + err?.message);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  const allowedVarianceDisplay = severityLevel === 3 ? "40% (Surge Tolerance)" : severityLevel === 2 ? "25% (High Surge)" : "15% (Standard)";

  return (
    <div className="space-y-6">
      {/* JUDGE 1-CLICK SIMULATION BAR */}
      <div className="rounded-xl border border-cyan-500/30 bg-surface p-4 shadow-xl sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-300 sm:text-base">
              Judge Evaluation 1-Click Simulation Profiles
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-cyan-400">
              Relayer Daily Quota: ${dailyQuotaRemainingUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} Available
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Preset A: Happy Path */}
          <button
            onClick={() => handlePresetSelect("AUTHENTIC_SYLHET_RELIEF")}
            disabled={isAuditing}
            className={`group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all disabled:opacity-50 ${
              activePreset === "AUTHENTIC_SYLHET_RELIEF"
                ? "border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50"
                : "border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400 hover:bg-emerald-950/40"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                PRESET A // HAPPY PATH
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">SCORE 96</span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-slate-100 group-hover:text-emerald-300">
              Authentic Sylhet Relief
            </h3>
            <p className="mt-1 font-mono text-[11px] text-slate-400">
              20 Sacks Rice ($28.50), 30 Tarps ($14.00), 20 Water Tabs ($9.50). 0.0% Variance. Multi-Oracle Disbursal.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-400">
              Run Happy Path →
            </span>
          </button>

          {/* Preset B: Corruption Path */}
          <button
            onClick={() => handlePresetSelect("CORRUPT_SYNDICATE_INVOICE")}
            disabled={isAuditing}
            className={`group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all disabled:opacity-50 ${
              activePreset === "CORRUPT_SYNDICATE_INVOICE"
                ? "border-red-400 bg-red-950/40 shadow-lg shadow-red-950/50 ring-1 ring-red-500/50"
                : "border-red-500/40 bg-red-950/20 hover:border-red-400 hover:bg-red-950/40"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="rounded bg-red-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-red-300">
                PRESET B // CORRUPTION PATH
              </span>
              <span className="font-mono text-xs font-bold text-red-400">SCORE 18</span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-slate-100 group-hover:text-red-300">
              210% Inflated Syndicate Invoice
            </h3>
            <p className="mt-1 font-mono text-[11px] text-slate-400">
              Rice billed @ $88/ea (+208.7%), Trauma Kits @ $140 (+211.1%). Tampered font overlay. Fraud Intercepted.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-semibold text-red-400">
              Intercept Syndicate Fraud →
            </span>
          </button>

          {/* Preset C: Replay Attack */}
          <button
            onClick={() => handlePresetSelect("REPLAY_ATTACK_DUPLICATE")}
            disabled={isAuditing}
            className={`group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all disabled:opacity-50 ${
              activePreset === "REPLAY_ATTACK_DUPLICATE"
                ? "border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-950/50 ring-1 ring-amber-500/50"
                : "border-amber-500/40 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-950/40"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-300">
                PRESET C // REPLAY ATTACK
              </span>
              <span className="font-mono text-xs font-bold text-amber-400">ANTI-REPLAY</span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-slate-100 group-hover:text-amber-300">
              Double-Spend Replay Attack
            </h3>
            <p className="mt-1 font-mono text-[11px] text-slate-400">
              Submits identical receipt SHA-256 fingerprint. Caught by Layer 3 on-chain Anti-Replay mapping!
            </p>
            <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-semibold text-amber-400">
              Simulate Double-Spend →
            </span>
          </button>
        </div>
      </div>

      {/* FIELD WORKER SIMPLE SUBMISSION HUD */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Input Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-surface p-5 shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-mono text-base font-bold text-slate-100">
                  Field Relief Worker Portal
                </h3>
                <p className="font-mono text-xs text-slate-400">
                  Multi-Oracle Consensus • Beneficiary Sign-Off • Anti-DoS Protected
                </p>
              </div>

              {/* Offline Resilience Switch */}
              <button
                onClick={() => setIsOffline(!isOffline)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-all ${
                  isOffline
                    ? "border-amber-500/60 bg-amber-950/40 text-amber-300"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                {isOffline ? <WifiOff className="h-3.5 w-3.5 text-amber-400" /> : <Wifi className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{isOffline ? "Offline Sim Active" : "Online Mode"}</span>
              </button>
            </div>

            {/* Disaster Zone Selector */}
            <div className="mt-4">
              <label className="font-mono text-xs text-slate-400">Field Sector / Emergency Zone:</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                {baselineData.emergencyZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    [{z.id}] {z.name} ({z.riskLevel} Risk)
                  </option>
                ))}
              </select>
            </div>

            {/* DYNAMIC DISASTER SEVERITY MULTIPLIER SELECTOR */}
            <div className="mt-3.5 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <span>Dynamic Disaster Severity Multiplier:</span>
                </label>
                <span className="font-mono text-[10px] text-amber-300 font-bold">
                  Tolerance: {allowedVarianceDisplay}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setSeverityLevel(1)}
                  className={`rounded-lg border p-2 text-center transition-all ${
                    severityLevel === 1
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold ring-1 ring-emerald-500/50 shadow-sm"
                      : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="font-bold">Level 1</div>
                  <div className="text-[10px] text-slate-400">Moderate (15%)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSeverityLevel(2)}
                  className={`rounded-lg border p-2 text-center transition-all ${
                    severityLevel === 2
                      ? "border-amber-500 bg-amber-950/40 text-amber-300 font-bold ring-1 ring-amber-500/50 shadow-sm"
                      : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="font-bold">Level 2</div>
                  <div className="text-[10px] text-slate-400">High (25%)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSeverityLevel(3)}
                  className={`rounded-lg border p-2 text-center transition-all ${
                    severityLevel === 3
                      ? "border-red-500 bg-red-950/40 text-red-300 font-bold ring-1 ring-red-500/50 shadow-sm"
                      : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="font-bold">Level 3</div>
                  <div className="text-[10px] text-slate-400">Catastrophic (40%)</div>
                </button>
              </div>
            </div>

            {/* BENEFICIARY CONFIRMATION SIGN-OFF (4-DIGIT TOKEN) */}
            <div className="mt-3.5 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Beneficiary Delivery Sign-Off Token:</span>
                </label>
                <span className="font-mono text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCheck className="h-3 w-3" />
                  Anti-Phantom Delivery Active
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Token (e.g. 8492)"
                  value={beneficiaryToken}
                  onChange={(e) => setBeneficiaryToken(e.target.value)}
                  className="w-full sm:w-36 rounded-lg border border-slate-800 bg-slate-950 p-2 font-mono text-xs text-center font-bold tracking-widest text-emerald-300 focus:border-cyan-500 focus:outline-none"
                />
                <div className="flex flex-1 flex-wrap gap-1 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setBeneficiaryToken("8492")}
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300 hover:text-cyan-300 hover:border-slate-700"
                  >
                    [Camp A: 8492 (38 Families)]
                  </button>
                  <button
                    type="button"
                    onClick={() => setBeneficiaryToken("9140")}
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300 hover:text-cyan-300 hover:border-slate-700"
                  >
                    [Shelter 4: 9140 (52 Families)]
                  </button>
                </div>
              </div>
            </div>

            {/* Receipt Image Capture / Live Visual Invoice Area */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Paper Receipt Photograph / Forensic Visualizer:</span>
                </label>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePreset("AUTHENTIC_SYLHET_RELIEF");
                      setSelectedImage(null);
                      setSelectedZone("SYL-01");
                    }}
                    className={`rounded px-1.5 py-0.5 transition-all ${
                      activePreset === "AUTHENTIC_SYLHET_RELIEF" && !selectedImage
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Authentic
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePreset("CORRUPT_SYNDICATE_INVOICE");
                      setSelectedImage(null);
                      setSelectedZone("CTG-02");
                    }}
                    className={`rounded px-1.5 py-0.5 transition-all ${
                      activePreset === "CORRUPT_SYNDICATE_INVOICE" && !selectedImage
                        ? "bg-red-500/20 text-red-300 border border-red-500/60 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Corrupt
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded px-1.5 py-0.5 transition-all ${
                      selectedImage
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Upload Custom
                  </button>
                </div>
              </div>

              {/* ENHANCED IMAGE PREPROCESSING CONTROLS */}
              <div className="mb-2 flex flex-wrap items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOcrEnhanceActive(!isOcrEnhanceActive)}
                    className={`flex items-center gap-1 rounded px-2 py-0.5 transition-all font-bold ${
                      isOcrEnhanceActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                        : "bg-slate-900 text-slate-500"
                    }`}
                  >
                    <Sliders className="h-3 w-3" />
                    <span>Neural OCR Image Optimizer: {isOcrEnhanceActive ? "ON" : "OFF"}</span>
                  </button>
                </div>

                {isOcrEnhanceActive && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span>Contrast:</span>
                      <input
                        type="range"
                        min="100"
                        max="220"
                        value={contrastLevel}
                        onChange={(e) => setContrastLevel(Number(e.target.value))}
                        className="h-1 w-16 accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-cyan-300">{contrastLevel}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Brightness:</span>
                      <input
                        type="range"
                        min="80"
                        max="140"
                        value={brightnessLevel}
                        onChange={(e) => setBrightnessLevel(Number(e.target.value))}
                        className="h-1 w-14 accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-cyan-300">{brightnessLevel}%</span>
                    </div>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Main Receipt Display Container with Laser Scanner & Canvas Filter */}
              <div
                className="relative rounded-xl border border-slate-700 bg-slate-950/70 p-3 shadow-inner overflow-hidden"
                style={
                  isOcrEnhanceActive
                    ? { filter: `contrast(${contrastLevel}%) brightness(${brightnessLevel}%)` }
                    : undefined
                }
              >
                {/* Forensic Laser Scanner Overlay */}
                {isAuditing && (
                  <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-xl bg-black/20 backdrop-blur-[0.5px]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_51%)] bg-[length:100%_4px] opacity-60" />
                    <div
                      className={`absolute left-0 right-0 h-1.5 shadow-lg transition-all animate-scanner-sweep ${
                        activePreset === "CORRUPT_SYNDICATE_INVOICE"
                          ? "bg-red-500 shadow-[0_0_25px_#ef4444]"
                          : activePreset === "REPLAY_ATTACK_DUPLICATE"
                          ? "bg-amber-400 shadow-[0_0_25px_#f59e0b]"
                          : "bg-emerald-400 shadow-[0_0_25px_#10b981]"
                      }`}
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-2 rounded-md border border-cyan-500/60 bg-black/85 px-2.5 py-1 font-mono text-[10px] text-cyan-300 shadow-lg backdrop-blur-md">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="font-bold">
                        MULTI-ORACLE FORENSIC SCANNER ACTIVE // LEVEL {severityLevel} SEVERITY MATRIX
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 rounded border border-slate-600 bg-black/80 px-2 py-0.5 font-mono text-[9px] text-slate-300">
                      BENEFICIARY TOKEN: {beneficiaryToken || "UNSPECIFIED"}
                    </div>
                  </div>
                )}

                {/* Display 1: Custom Uploaded Image */}
                {selectedImage ? (
                  <div className="relative flex flex-col items-center justify-center p-2">
                    <img
                      src={selectedImage}
                      alt="Uploaded field invoice"
                      className="max-h-72 w-auto rounded border border-slate-700 object-contain shadow-lg"
                    />
                    <div className="mt-2 flex w-full items-center justify-between font-mono text-[10px] text-slate-400">
                      <span className="text-emerald-400">Custom Receipt Image Loaded</span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-cyan-400 underline hover:text-cyan-300"
                      >
                        Replace Image
                      </button>
                    </div>
                  </div>
                ) : activePreset === "CORRUPT_SYNDICATE_INVOICE" ? (
                  /* Display 2: Corrupt Syndicate Invoice with RED FORENSIC BOUNDING BOXES */
                  <div className="relative rounded-lg border border-red-400/80 bg-[#f9fafb] p-3 text-slate-900 shadow-md font-mono text-[11px] select-none">
                    <div className="mb-2 rounded border border-red-600 bg-red-600 px-2 py-1 text-center font-mono text-[10px] font-black text-white uppercase tracking-wider shadow">
                      🚨 AGENT 1 & 2 FORENSIC EVIDENCE: 210% PRICE GOUGING + FONT OVERLAY DETECTED
                    </div>

                    <div className="border-b border-slate-300 pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-sans text-sm font-black text-slate-900 tracking-wide uppercase">
                            M/S COASTAL TRADING SYNDICATE
                          </h4>
                          <p className="text-[10px] text-slate-600">
                            Emergency Disaster Relief Supplies • Marine Drive, Cox&apos;s Bazar
                          </p>
                          <p className="text-[9px] text-slate-500">
                            Commercial Tax Reg: #CTG-SYND-8820 • Sector: [CTG-02] Cyclone Grid
                          </p>
                        </div>
                        <div className="rounded border border-red-500 bg-red-100 px-2 py-0.5 text-right font-mono text-[9px] text-red-800">
                          <span className="font-bold">INVOICE:</span> CTG-2024-9912<br />
                          <span>DATE: 17-AUG-2024</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 space-y-2">
                      <div className="rounded border-2 border-red-500 bg-red-50/70 p-1.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <span className="font-bold text-slate-900">
                              1. Coarse Parboiled Relief Rice (50kg Sack)
                            </span>
                            <span className="block text-[10px] text-slate-600">
                              Quantity: 20 Sacks
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="inline-block rounded border border-red-600 bg-red-200 px-1.5 py-0.5 text-right font-black text-red-950 text-xs">
                              $88.00 <span className="text-[9px] font-normal">/ea</span>
                            </div>
                            <span className="block font-bold text-red-950 mt-0.5 text-xs">
                              = $1,760.00
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between rounded bg-red-600/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                          <span>AGENT-2 PRICE GOUGE: +208.77%</span>
                          <span>BASELINE: $28.50 (Max Tol: {allowedVarianceDisplay})</span>
                        </div>
                      </div>

                      <div className="rounded border-2 border-red-500 bg-red-50/70 p-1.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <span className="font-bold text-slate-900">
                              2. Field Emergency First-Aid & Cholera Kit
                            </span>
                            <span className="block text-[10px] text-slate-600">
                              Quantity: 15 Kits
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="inline-block rounded border border-red-600 bg-red-200 px-1.5 py-0.5 text-right font-black text-red-950 text-xs">
                              $140.00 <span className="text-[9px] font-normal">/ea</span>
                            </div>
                            <span className="block font-bold text-red-950 mt-0.5 text-xs">
                              = $2,100.00
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between rounded bg-red-600/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                          <span>AGENT-2 PRICE GOUGE: +211.11%</span>
                          <span>BASELINE: $45.00 (Max Tol: {allowedVarianceDisplay})</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 rounded border-2 border-dashed border-red-600 bg-red-100 p-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[10px] text-red-900 font-bold uppercase">
                            CLAIMED RELIEF TOTAL:
                          </span>
                          <p className="font-sans text-xs font-black text-red-950">
                            AGENT-1 TAMPER: Arial Bold 14pt vector font overlay on thermal paper
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-sans text-base font-black text-red-900">
                            $3,860.00 USD
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-slate-300 pt-2 text-[9px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <div className="rounded border-2 border-red-600 px-1.5 py-0.5 font-black uppercase text-red-600 rotate-[-4deg]">
                          FRAUD REJECTED
                        </div>
                        <span className="text-slate-600 font-semibold">
                          Smart Escrow Rejection Scheduled
                        </span>
                      </div>
                      <div className="text-right font-mono text-[8px] text-slate-500">
                        SHA-256: 0x9e8c37d042168f0312cb84917a8c3d97f1bb657c9135017ea0cf62aa89849222
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Display 3: Authentic Sylhet Relief Receipt (Preset A or Preset C) */
                  <div className="relative rounded-lg border border-amber-300/80 bg-[#fdfaf2] p-3 text-slate-900 shadow-md font-mono text-[11px] select-none">
                    {activePreset === "REPLAY_ATTACK_DUPLICATE" && (
                      <div className="mb-2 rounded border border-amber-500 bg-amber-500 px-2 py-0.5 text-center font-mono text-[10px] font-black text-black uppercase tracking-wider">
                        ⚠️ LAYER-3 REPLAY TEST: IDENTICAL SHA-256 HASH RESUBMISSION
                      </div>
                    )}

                    <div className="border-b border-amber-200 pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-sans text-sm font-black text-slate-900 tracking-wide uppercase">
                            JALALABAD RELIEF & WHOLESALE DEPOT
                          </h4>
                          <p className="text-[10px] text-slate-600">
                            Govt. Licensed Disaster Relief Supplier #DIS-SYL-9042
                          </p>
                          <p className="text-[9px] text-slate-500">
                            Station Road, Sylhet Sadar • Sector: [SYL-01] Sylhet Flood Sector
                          </p>
                        </div>
                        <div className="rounded border border-emerald-600/40 bg-emerald-50 px-2 py-0.5 text-right font-mono text-[9px] text-emerald-900">
                          <span className="font-bold">VOUCHER:</span> SYL-2024-08819<br />
                          <span>DATE: 16-AUG-2024</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1 text-slate-800">
                      <div className="flex items-center justify-between border-b border-amber-200/60 pb-1 text-[10px] font-semibold text-slate-600">
                        <span>ITEM DESCRIPTION</span>
                        <span>QTY × UNIT = TOTAL</span>
                      </div>

                      <div className="flex items-center justify-between py-0.5">
                        <span className="font-medium">1. Coarse Parboiled Relief Rice (50kg)</span>
                        <span className="font-bold">20 × $28.50 = $570.00</span>
                      </div>

                      <div className="flex items-center justify-between py-0.5">
                        <span className="font-medium">2. Heavy-Duty Tarpaulin (24×18ft)</span>
                        <span className="font-bold">30 × $14.00 = $420.00</span>
                      </div>

                      <div className="flex items-center justify-between py-0.5">
                        <span className="font-medium">3. Water Purification Tablets (1000 Box)</span>
                        <span className="font-bold">20 × $9.50 = $190.00</span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t-2 border-slate-900 pt-1.5">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full border-2 border-emerald-600 bg-emerald-50 px-2 py-1 text-center font-sans text-[8px] font-extrabold uppercase text-emerald-800 rotate-[-6deg] shadow-sm">
                          MUNICIPAL RELIEF AUDIT<br />
                          ★ APPROVED DEPOT ★
                        </div>
                        <div className="text-[9px] text-slate-600">
                          <span>Beneficiary Token:</span>
                          <span className="block font-mono font-bold text-emerald-800">{beneficiaryToken || "8492 (Camp A)"}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] text-slate-600">
                          Disaster Relief Exemption: 0% VAT
                        </span>
                        <span className="font-sans text-sm font-black text-slate-950">
                          TOTAL: $1,180.00 USD
                        </span>
                        <span className="block font-mono text-[9px] text-emerald-700 font-bold">
                          (0.4538 ETH @ $2,600)
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 border-t border-amber-200/70 pt-1 flex items-center justify-between text-[8px] font-mono text-slate-500">
                      <span>VERIFIED OFFICIAL DISASTER BASELINE: 0.0% VARIANCE</span>
                      <span>SHA-256: 0x4a7f29b6e82811a0c4f83e29f8604d5bc89a81f3370e07172cfd5d081f26a111</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Voice Memo / Audio Context */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-slate-400">
                  Voice Note Memo (Optional Context):
                </label>
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] ${
                    isListening
                      ? "bg-red-500/20 text-red-300 border border-red-500 animate-pulse"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                  <span>{isListening ? "Listening..." : "Speak Memo"}</span>
                </button>
              </div>

              <textarea
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="Voice memo transcript or type details (e.g. 20 sacks coarse parboiled relief rice, 30 tarpaulins)..."
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
              />

              <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="text-slate-500">Quick Samples:</span>
                <button
                  type="button"
                  onClick={() =>
                    setVoiceText(
                      "Sylhet flood sector field purchase: 20 sacks coarse parboiled relief rice, 30 heavy-duty tarpaulins, and 20 boxes water purification tablets. Total: $1,180.00."
                    )
                  }
                  className="rounded bg-slate-900 px-2 py-0.5 text-cyan-300 hover:bg-slate-800"
                >
                  [Sample 1: Verified Field Relief Note]
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setVoiceText(
                      "Cox's Bazar Cyclone Relief: 20 sacks Rice billed at $88 each and 15 Trauma Kits billed at $140 each. Total: $3,860."
                    )
                  }
                  className="rounded bg-slate-900 px-2 py-0.5 text-amber-300 hover:bg-slate-800"
                >
                  [Sample 2: Inflated Syndicate Invoice]
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isAuditing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-mono text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Multi-Oracle Consensus Auditing...</span>
                </>
              ) : isOffline ? (
                <>
                  <Send className="h-4 w-4" />
                  <span>Queue Receipt in Offline Storage</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Audit & Release Escrow Funds ($0 Gas)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Visual Status Card & Dispute Appeal Action */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-surface p-6 shadow-xl">
          <div>
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-slate-400">
                Autonomous Escrow Decision Banner
              </span>
              <span className="font-mono text-[10px] text-cyan-400">
                Anti-DoS Protected • Level {severityLevel} Matrix
              </span>
            </div>

            {/* Error or Replay Banner */}
            {lastError && (
              <div className="mt-4 rounded-xl border border-amber-500/60 bg-amber-950/40 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                    <AlertOctagon className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-mono text-base font-bold text-amber-300">
                      Layer 3 Replay Attack or Policy Exception
                    </h4>
                    <p className="mt-0.5 font-mono text-xs text-amber-200/80">
                      Protocol security check intercepted transaction.
                    </p>
                  </div>
                </div>
                <p className="mt-3 font-mono text-xs leading-relaxed text-amber-100/90 bg-black/40 p-3 rounded border border-amber-800">
                  {lastError}
                </p>
              </div>
            )}

            {/* Live Record Status Display */}
            {lastRecord && !lastError ? (
              <div className="mt-4">
                {lastRecord.approved ? (
                  // APPROVED CARD
                  <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-950/30 p-6 glow-emerald">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
                        <CheckCircle className="h-10 w-10" />
                      </div>
                      <div>
                        <h3 className="font-mono text-xl font-black text-emerald-300">
                          PAYMENT APPROVED & DISBURSED
                        </h3>
                        <p className="font-mono text-sm font-bold text-emerald-400">
                          MULTI-ORACLE CONSENSUS SIGNED — $0 GAS PAID
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-emerald-500/30 pt-4 font-mono text-xs">
                      <div>
                        <span className="text-emerald-400/80">AMOUNT DISBURSED:</span>
                        <p className="text-lg font-black text-white">
                          ${lastRecord.amountUsd?.toFixed(2) || "1,180.00"} USD
                        </p>
                        <p className="text-[11px] text-emerald-400">({lastRecord.amountEth} ETH)</p>
                      </div>
                      <div>
                        <span className="text-emerald-400/80">AI TRUST SCORE:</span>
                        <p className="text-lg font-black text-emerald-300">
                          {lastRecord.trustScore}/100
                        </p>
                        <p className="text-[11px] text-emerald-400">Severity: Level {lastRecord.severityLevel || severityLevel}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-black/40 p-3 font-mono text-xs text-emerald-200 border border-emerald-900/50 space-y-1">
                      <p>
                        <strong>Vendor:</strong> {lastRecord.vendor}
                      </p>
                      <p>
                        <strong>Beneficiary Sign-Off:</strong> {lastRecord.beneficiaryConfirmed ? `Verified Token: ${lastRecord.beneficiaryToken || "8492"}` : "Standard Disbursal"}
                      </p>
                      <p>
                        <strong>Multi-Oracle Verification:</strong> 3-of-3 Oracles Signed
                      </p>
                    </div>
                  </div>
                ) : (
                  // FRAUD REJECTED CARD WITH DISPUTE APPEAL BUTTON
                  <div className="rounded-2xl border-2 border-red-500 bg-red-950/40 p-6 glow-red">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse">
                        <AlertOctagon className="h-10 w-10" />
                      </div>
                      <div>
                        <h3 className="font-mono text-xl font-black text-red-300">
                          CORRUPTION & PRICE GOUGING INTERCEPTED
                        </h3>
                        <p className="font-mono text-sm font-bold text-red-400">
                          FRAUD BLOCKED & LOGGED ON-CHAIN BY AI ORACLE
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-red-500/30 pt-4 font-mono text-xs">
                      <div>
                        <span className="text-red-400/80">ATTEMPTED THEFT BLOCKED:</span>
                        <p className="text-lg font-black text-white">
                          ${lastRecord.amountUsd?.toFixed(2) || "3,860.00"} USD
                        </p>
                        <p className="text-[11px] text-red-400">Saved to Vault</p>
                      </div>
                      <div>
                        <span className="text-red-400/80">AI TRUST SCORE:</span>
                        <p className="text-lg font-black text-red-400">
                          {lastRecord.trustScore}/100
                        </p>
                        <p className="text-[11px] text-red-400">Status: REJECTED</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-black/40 p-3 font-mono text-xs text-red-200 border border-red-900/50">
                      <p>
                        <strong>Fraud Logged On-Chain:</strong> Event FraudAttemptIntercepted
                      </p>
                      <p className="mt-1">
                        <strong>Vendor Payout:</strong> LOCKED ($0.00 transferred)
                      </p>
                    </div>

                    {/* DISPUTE APPEAL TRIGGER BUTTON */}
                    <button
                      type="button"
                      onClick={() => setShowDisputeModal(true)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500 bg-amber-950/60 py-2.5 font-mono text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all shadow-md"
                    >
                      <Gavel className="h-4 w-4 text-amber-400" />
                      <span>Request Manual DAO Review / Appeal Flagged Verdict →</span>
                    </button>
                  </div>
                )}
              </div>
            ) : !lastError && (
              <div className="mt-12 flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-800 bg-slate-900/50 text-slate-600">
                  <ShieldCheck className="h-10 w-10 text-cyan-500/40" />
                </div>
                <h4 className="mt-4 font-mono text-sm font-bold text-slate-300">
                  Ready for Ingestion
                </h4>
                <p className="mt-1 max-w-xs font-mono text-xs text-slate-500">
                  Select Severity Level {severityLevel}, enter Beneficiary Token, and click any simulation preset or take a receipt photo.
                </p>
              </div>
            )}
          </div>

          {/* Cryptographic Proof Modal Button */}
          {lastRecord && (
            <div className="mt-6 border-t border-slate-800 pt-4">
              <button
                onClick={onViewProof}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-950/30 py-2.5 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-900/40"
              >
                <FileText className="h-4 w-4" />
                <span>Inspect Multi-Oracle Consensus Signatures & Event Logs →</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DISPUTE APPEAL MODAL (MANUAL DAO REVIEW) */}
      {showDisputeModal && lastRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg rounded-xl border border-amber-500/60 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-slate-100">
                    Sovereign DAO Dispute Review Appeal
                  </h3>
                  <p className="font-mono text-[11px] text-slate-400">
                    Lodge on-chain appeal for Receipt #{lastRecord.receiptHash.slice(0, 14)}...
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setDisputeLodgeSuccess(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {disputeLodgeSuccess ? (
              <div className="mt-5 rounded-lg border border-emerald-500/50 bg-emerald-950/30 p-4 font-mono text-xs text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>APPEAL LODGED SUCCESSFULLY</span>
                </div>
                <p className="mt-2 text-[11px]">
                  <strong>Case ID:</strong> {disputeLodgeSuccess.id}
                </p>
                <p className="mt-1 text-[11px]">
                  {disputeLodgeSuccess.message}
                </p>
                <button
                  onClick={() => setShowDisputeModal(false)}
                  className="mt-4 w-full rounded bg-emerald-500 py-2 font-bold text-slate-950"
                >
                  Return to Portal
                </button>
              </div>
            ) : (
              <form onSubmit={handleLodgeDispute} className="mt-4 space-y-4 font-mono text-xs">
                <div>
                  <label className="text-slate-400">Dispute Justification & Field Context:</label>
                  <textarea
                    rows={4}
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Explain why this invoice should be approved (e.g. Flash flood washed away primary road; emergency high-water boat portage surcharge approved by Upazila Nirbahi Officer)..."
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="text-slate-500">Quick Justification:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDisputeReason(
                        "Flash flood washed away primary embankment; emergency boat transport surcharge was approved by local relief coordinator."
                      )
                    }
                    className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-amber-300 hover:text-amber-200"
                  >
                    [Logistics Surge Justification]
                  </button>
                </div>

                <div className="rounded border border-amber-800/60 bg-amber-950/20 p-2.5 text-[11px] text-amber-300/90">
                  <p>
                    <strong>Notice:</strong> Submitting this appeal will record <code>DisputeAppealLodged</code> in the smart contract. The Sovereign Relief DAO council reviews all lodged appeals within 24 hours.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDispute || !disputeReason.trim()}
                    className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
                  >
                    {isSubmittingDispute ? "Lodging Appeal..." : "Submit Appeal to DAO"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
