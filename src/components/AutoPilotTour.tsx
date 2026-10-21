"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export interface TourScene {
  id: number;
  title: string;
  badge: string;
  audioFile: string;
  durationSec: number;
  presetToSelect?: "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE";
  highlightSelector?: string;
  text: string;
}

export const TOUR_SCENES: TourScene[] = [
  {
    id: 1,
    title: "The Problem & Hook",
    badge: "SCENE 1 / 5",
    audioFile: "/audio/scene1.mp3",
    durationSec: 32.8,
    highlightSelector: "jurisdiction-selector",
    text: "Every single year, billions of dollars in global humanitarian aid are deployed to frontline disaster zones. Yet, thirty to forty percent of relief capital is lost before reaching the ground—swallowed by phantom vouchers, cartel price-gouging, and paper-receipt tampering. Centralized databases cannot fix this, and standard blockchains cannot read the physical world. This is AegisRelief Sovereign—a zero-trust, stateless escrow protocol governed by an autonomous, heterogeneous multi-model AI consensus.",
  },
  {
    id: 2,
    title: "Heterogeneous 3-Model AI Architecture",
    badge: "SCENE 2 / 5",
    audioFile: "/audio/scene2.mp3",
    durationSec: 45.3,
    highlightSelector: "oracle-consensus-panel",
    text: "AegisRelief completely eliminates single-point AI bias. Rather than trusting a single proprietary model, we enforce an on-chain 2-of-3 Multi-Oracle Quorum across three distinct AI foundations. Oracle A, Google Gemini 2.5 Flash, acts as our Vision and Spatial Forensic Specialist. Oracle B, Hugging Face Donut OCR, parses unstructured thermal receipts into deterministic JSON tables. And Oracle C, Nebius AI Studio running Llama-3.3-70B, serves as an independent economic auditor benchmarking commodities against disaster baselines. Unless two independent nodes sign off cryptographically, not a single dollar moves.",
  },
  {
    id: 3,
    title: "Authentic Relief & Gasless Settlement",
    badge: "SCENE 3 / 5",
    audioFile: "/audio/scene3.mp3",
    durationSec: 34.8,
    presetToSelect: "AUTHENTIC_SYLHET_RELIEF",
    highlightSelector: "escrow-decision-panel",
    text: "Let's run a live audit from our Genesis Pilot Ground in Sylhet, Bangladesh. When an authentic field worker submits an emergency procurement invoice, all three models independently verify the document, reaching a trust score of 96. Instantly, our ERC-4337 Account Abstraction paymaster executes the settlement with zero gas cost to the worker. Simultaneously, the protocol triggers an automated fiat off-ramp, crediting the local merchant directly in BDT, while pinning the cryptographic forensic proof permanently to IPFS.",
  },
  {
    id: 4,
    title: "Intercepting Syndicate Fraud",
    badge: "SCENE 4 / 5",
    audioFile: "/audio/scene4.mp3",
    durationSec: 35.2,
    presetToSelect: "CORRUPT_SYNDICATE_INVOICE",
    highlightSelector: "forensic-visualizer",
    text: "Now, watch how the protocol dismantles an active fraud syndicate. Here, a coastal cartel in Cox's Bazar attempts to submit a tampered invoice, gouging coarse relief rice by over 200 percent. While the visual scanner confirms the paper receipt is physical, Nebius AI detects that prices violate our disaster tolerance threshold and vetoes the transaction. Multi-oracle consensus fails. The trust score collapses, the escrow locks down automatically, vendor payout is frozen at zero dollars, and the fraud attempt is permanently sealed on-chain.",
  },
  {
    id: 5,
    title: "Defense-in-Depth & Global Scale",
    badge: "SCENE 5 / 5",
    audioFile: "/audio/scene5.mp3",
    durationSec: 31.9,
    presetToSelect: "REPLAY_ATTACK_DUPLICATE",
    highlightSelector: "bottom-analytics-row",
    text: "Beyond model consensus, AegisRelief implements complete defense-in-depth: Layer-3 Anti-Replay Guards hash every physical invoice with SHA-256 to block double-spend attacks, Sentinel-1 Satellite SAR Telemetry corroborates real-time flood indices, and zkPass Zero-Knowledge DIDs authenticate field officers. Deployed in Bangladesh as our Genesis Pilot Ground and engineered for global scale, AegisRelief Sovereign transforms humanitarian relief from blind trust into cryptographic certainty. Thank you.",
  },
];

interface AutoPilotTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (
    presetId: "AUTHENTIC_SYLHET_RELIEF" | "CORRUPT_SYNDICATE_INVOICE" | "REPLAY_ATTACK_DUPLICATE"
  ) => void;
}

export const AutoPilotTour: React.FC<AutoPilotTourProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scene = TOUR_SCENES[currentSceneIndex];

  // Play audio for current scene
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    // Trigger associated preset
    if (scene.presetToSelect) {
      onSelectPreset(scene.presetToSelect);
    }

    // Play corresponding audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(scene.audioFile);
    audio.muted = isMuted;
    audioRef.current = audio;

    audio.play().catch((err) => {
      console.warn("Audio autoplay blocked, using fallback speech synthesis if needed:", err);
    });

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      if (currentSceneIndex < TOUR_SCENES.length - 1) {
        setCurrentSceneIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [isOpen, currentSceneIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentSceneIndex < TOUR_SCENES.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 px-4 sm:px-8 max-w-5xl mx-auto pointer-events-auto">
      <div className="rounded-2xl border-2 border-cyan-500/60 bg-[#0B0F17]/95 backdrop-blur-xl shadow-2xl p-4 sm:p-5 shadow-cyan-500/20 font-mono transition-all">
        {/* Progress Bar */}
        <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] font-black text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
              {scene.badge} • {scene.title.toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              (Ultra-HD Auto-Pilot Pitch Mode)
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg border border-[#1E293B] bg-[#0E1524] text-slate-300 hover:text-cyan-300 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={handlePrev}
              disabled={currentSceneIndex === 0}
              className="p-1.5 rounded-lg border border-[#1E293B] bg-[#0E1524] text-slate-300 hover:text-cyan-300 disabled:opacity-40 transition-colors"
              title="Previous Scene"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={togglePlay}
              className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-colors"
              title={isPlaying ? "Pause" : "Resume"}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-slate-950" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-slate-950" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentSceneIndex === TOUR_SCENES.length - 1}
              className="p-1.5 rounded-lg border border-[#1E293B] bg-[#0E1524] text-slate-300 hover:text-cyan-300 disabled:opacity-40 transition-colors"
              title="Next Scene"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-red-900/60 bg-red-950/40 text-red-300 hover:bg-red-900/60 transition-colors ml-1"
              title="Close Tour"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Subtitle Teleprompter Text */}
        <div className="mt-3">
          <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed tracking-wide select-none">
            &ldquo;{scene.text}&rdquo;
          </p>
        </div>

        {/* Bottom Scene Indicators */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-[#1E293B]/60">
          <div className="flex items-center gap-1.5">
            {TOUR_SCENES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSceneIndex(idx);
                  setProgress(0);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSceneIndex
                    ? "w-8 bg-cyan-400 shadow-md shadow-cyan-400/50"
                    : idx < currentSceneIndex
                    ? "w-4 bg-emerald-500"
                    : "w-3 bg-slate-700 hover:bg-slate-500"
                }`}
                title={`Jump to Scene ${s.id}: ${s.title}`}
              />
            ))}
          </div>

          <span className="text-cyan-400/90 font-bold">
            Studio-Grade Neural Narration: en-US-ChristopherNeural
          </span>
        </div>
      </div>
    </div>
  );
};
