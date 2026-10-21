"use client";

import React, { useState } from "react";
import { X, Gavel, ShieldCheck, AlertTriangle, Send, Sparkles } from "lucide-react";

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptHash: string;
  vendorAddress: string;
  currentScore?: number;
  onDisputeSubmitted: (record: any) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  receiptHash,
  vendorAddress,
  currentScore = 18,
  onDisputeSubmitted,
}) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/relayer/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptHash,
          vendor: vendorAddress,
          reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Dispute Appeal #${data.dispute?.disputeId} has been successfully lodged on-chain for 48-hour DAO review.`);
        onDisputeSubmitted(data.dispute);
        setTimeout(() => {
          setSuccessMsg(null);
          setReason("");
          onClose();
        }, 2200);
      }
    } catch (err: any) {
      alert("Failed to lodge dispute: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/40 bg-[#0B0F17] p-6 shadow-2xl space-y-4 font-mono">
        <div className="flex items-start justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Gavel className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Lodge Sovereign DAO Dispute Appeal
              </h3>
              <p className="text-xs text-slate-400">
                48-Hour Humanitarian Decentralized Court Review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/40 p-4 text-center space-y-2">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-emerald-200 font-bold">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="rounded-lg border border-[#1E293B] bg-[#0E1524] p-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Receipt Fingerprint:</span>
                <span className="text-amber-300 font-bold">{receiptHash.slice(0, 18)}...</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Current AI Trust Score:</span>
                <span className="text-red-400 font-bold">{currentScore} / 100</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Vendor Address:</span>
                <span className="text-slate-200">{vendorAddress.slice(0, 16)}...</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold text-[11px]">
                Ground Relief Justification / Evidence Note:
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain emergency supply dislocation, transportation blockades, or local wholesale spot market surge justifying this invoice..."
                className="w-full rounded-lg border border-[#1E293B] bg-[#05080F] p-3 text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-bold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Submitting to DAO...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Formal Dispute Appeal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
