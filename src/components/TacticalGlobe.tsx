"use client";

import React, { useEffect, useRef, useState } from "react";
import baselineData from "@/config/baseline_prices.json";

interface Beacon {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskLevel: string;
}

interface TacticalGlobeProps {
  lastEvent?: {
    type: "PayoutExecuted" | "FraudAttemptIntercepted";
    zoneId?: string;
    timestamp: number;
  } | null;
}

export const TacticalGlobe: React.FC<TacticalGlobeProps> = ({ lastEvent }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeZone, setActiveZone] = useState<string>("SYL-01");
  const [rotationAngle, setRotationAngle] = useState(0);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);
  const angleYRef = useRef(1.8);
  const angleXRef = useRef(0.35);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let arcProgress = 0;

    // Handle high DPI
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Pre-calculate dot grid on sphere
    const numPoints = 650;
    const points: Array<{ x: number; y: number; z: number }> = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numPoints; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.cos(phi);
      const z = Math.sin(theta) * Math.sin(phi);
      points.push({ x, y, z });
    }

    // Convert lat/lng to sphere point
    const latLngToVector = (lat: number, lng: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(Math.sin(phi) * Math.cos(theta));
      const z = Math.sin(phi) * Math.sin(theta);
      const y = Math.cos(phi);
      return { x, y, z };
    };

    const beacons = baselineData.emergencyZones;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const radius = Math.min(width, height) * 0.38;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Auto rotation if not dragging
      if (!isDraggingRef.current) {
        angleYRef.current += 0.005;
      }

      const cosY = Math.cos(angleYRef.current);
      const sinY = Math.sin(angleYRef.current);
      const cosX = Math.cos(angleXRef.current);
      const sinX = Math.sin(angleXRef.current);

      // Background atmospheric glow
      const radialGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.3
      );
      radialGradient.addColorStop(0, "rgba(6, 182, 212, 0.08)");
      radialGradient.addColorStop(0.7, "rgba(15, 23, 42, 0.4)");
      radialGradient.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Outer orbital telemetry ring
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 1.15, radius * 0.4, angleYRef.current * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Draw sphere background edge
      ctx.strokeStyle = "rgba(14, 165, 233, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Rotate and project 3D points
      const projectedPoints: Array<{ x: number; y: number; z: number; alpha: number }> = [];

      for (const p of points) {
        // Rotate around Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Perspective scale
        const scale = 300 / (300 + z2 * radius);
        const screenX = centerX + x1 * radius * scale;
        const screenY = centerY + y2 * radius * scale;

        // Depth cueing
        const alpha = Math.max(0.1, (z2 + 1) / 2);
        projectedPoints.push({ x: screenX, y: screenY, z: z2, alpha });
      }

      // Draw dots
      for (const pt of projectedPoints) {
        if (pt.z > -0.2) {
          ctx.fillStyle = `rgba(34, 211, 238, ${pt.alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.z > 0.4 ? 1.8 : 1.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(71, 85, 105, 0.25)`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Bangladesh Disaster Beacons
      const time = Date.now() * 0.003;
      beacons.forEach((b: Beacon) => {
        const vec = latLngToVector(b.lat, b.lng);

        // Rotate
        const x1 = vec.x * cosY - vec.z * sinY;
        const z1 = vec.z * cosY + vec.x * sinY;
        const y2 = vec.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + vec.y * sinX;

        if (z2 > -0.1) {
          const scale = 300 / (300 + z2 * radius);
          const screenX = centerX + x1 * radius * scale;
          const screenY = centerY + y2 * radius * scale;

          const isCritical = b.riskLevel === "CRITICAL";
          const beaconColor = isCritical ? "rgb(239, 68, 68)" : "rgb(16, 185, 129)";
          const pulseRadius = 4 + Math.sin(time + b.lat) * 3;

          // Pulse ring
          ctx.strokeStyle = beaconColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(screenX, screenY, pulseRadius + 3, 0, Math.PI * 2);
          ctx.stroke();

          // Center solid beacon
          ctx.fillStyle = beaconColor;
          ctx.beginPath();
          ctx.arc(screenX, screenY, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Text label
          ctx.font = "9px monospace";
          ctx.fillStyle = "rgba(241, 245, 249, 0.9)";
          ctx.fillText(`[${b.id}] ${b.name.split(" ")[0]}`, screenX + 8, screenY - 4);
        }
      });

      // Animated Transaction Arc when an event occurs
      if (lastEvent) {
        arcProgress = (arcProgress + 0.02) % 1;
        const isApproved = lastEvent.type === "PayoutExecuted";
        const arcColor = isApproved ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)";

        ctx.strokeStyle = arcColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY - radius * 0.3, radius * 0.5, 0, Math.PI * arcProgress);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [lastEvent]);

  // Interactive mouse drag to rotate globe
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMouseXRef.current;
    angleYRef.current += deltaX * 0.008;
    lastMouseXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-slate-800 bg-surface p-4 shadow-xl">
      {/* Globe Top HUD */}
      <div className="flex w-full items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
            Tactical Telemetry & Disaster Grid
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <span>LAT: 24.89°N</span>
          <span>•</span>
          <span>LNG: 91.87°E</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-emerald-400">4 BEACONS ONLINE</span>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative h-64 w-full cursor-grab active:cursor-grabbing sm:h-80"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="h-full w-full" />

        {/* Overlay Grid Crosshairs */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full border border-cyan-500/20" />
          <div className="absolute h-0.5 w-full bg-cyan-500/10" />
          <div className="absolute h-full w-0.5 bg-cyan-500/10" />
        </div>

        {/* Live Transaction Flash Notice */}
        {lastEvent && (
          <div className="pointer-events-none absolute bottom-2 left-2 rounded border border-slate-700 bg-black/70 px-2 py-1 font-mono text-[10px] backdrop-blur-sm">
            <span className={lastEvent.type === "PayoutExecuted" ? "text-emerald-400" : "text-red-400"}>
              {lastEvent.type === "PayoutExecuted"
                ? "⚡ DISBURSEMENT ARC ACTIVE -> VENDOR VAULT"
                : "🚨 CORRUPTION INTERCEPTED ARC -> ZERO-PAYOUT LOCK"}
            </span>
          </div>
        )}
      </div>

      {/* Disaster Zones Grid Selector */}
      <div className="mt-3 grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
        {baselineData.emergencyZones.map((zone) => (
          <div
            key={zone.id}
            onClick={() => setActiveZone(zone.id)}
            className={`cursor-pointer rounded-lg border p-2 font-mono transition-all ${
              activeZone === zone.id
                ? "border-cyan-500/60 bg-cyan-950/30 text-cyan-200"
                : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold">{zone.id}</span>
              <span
                className={`rounded px-1 text-[9px] ${
                  zone.riskLevel === "CRITICAL"
                    ? "bg-red-950 text-red-400 border border-red-800"
                    : "bg-amber-950 text-amber-400 border border-amber-800"
                }`}
              >
                {zone.riskLevel}
              </span>
            </div>
            <p className="mt-1 truncate text-[11px] font-medium text-slate-200">{zone.name}</p>
            <p className="text-[10px] text-slate-500">
              {zone.lat.toFixed(2)}°N, {zone.lng.toFixed(2)}°E
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
