"use client";

import React from "react";
import {
  LayoutDashboard,
  Vault,
  Users,
  Truck,
  ShieldAlert,
  BarChart3,
  ShieldCheck,
  Settings,
  Radio,
  ExternalLink,
  ChevronRight,
  Layers,
} from "lucide-react";

export type SidebarTab =
  | "mission-control"
  | "escrow-vaults"
  | "field-workers"
  | "relief-operations"
  | "fraud-intelligence"
  | "analytics"
  | "security"
  | "settings";

interface EnterpriseSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  fraudCount?: number;
  operationsCount?: number;
}

export const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  activeTab,
  onTabChange,
  fraudCount = 23,
  operationsCount = 38,
}) => {
  const navItems = [
    {
      id: "mission-control" as SidebarTab,
      label: "Mission Control",
      icon: LayoutDashboard,
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "escrow-vaults" as SidebarTab,
      label: "Escrow Vaults",
      icon: Vault,
      badge: "$12.8M",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "field-workers" as SidebarTab,
      label: "Field Workers",
      icon: Users,
      badge: "142",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      id: "relief-operations" as SidebarTab,
      label: "Relief Operations",
      icon: Truck,
      badge: operationsCount.toString(),
      badgeColor: "bg-slate-700/50 text-slate-300 border-slate-600",
    },
    {
      id: "fraud-intelligence" as SidebarTab,
      label: "Fraud Intelligence",
      icon: ShieldAlert,
      badge: `${fraudCount} BLOCKED`,
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    {
      id: "analytics" as SidebarTab,
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "security" as SidebarTab,
      label: "Security & Oracles",
      icon: ShieldCheck,
      badge: "3/3 QUORUM",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "settings" as SidebarTab,
      label: "Protocol Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[#1E293B] bg-[#0B0F17] flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 via-emerald-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="h-full w-full bg-[#0B0F17] rounded-[7px] flex items-center justify-center">
                <Layers className="h-4.5 w-4.5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-black tracking-wider text-slate-100">
                  AEGISRELIEF
                </span>
                <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-1 py-0.2 text-[9px] font-mono font-bold text-cyan-300">
                  8K
                </span>
              </div>
              <p className="font-mono text-[9px] text-slate-400 tracking-tight">
                SOVEREIGN HUMANITARIAN PROTOCOL
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="px-2 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
            Platform Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                  isActive
                    ? "bg-[#1E293B]/80 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#131B2A]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-cyan-400" : "text-slate-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Node Validator Info Footer */}
      <div className="p-3 border-t border-[#1E293B] bg-[#05080F]/80">
        <div className="rounded-lg border border-[#1E293B] bg-[#0B0F17] p-2.5 space-y-1.5 font-mono text-[10px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-semibold">VALIDATOR NODE</span>
            </span>
            <span className="text-emerald-400 font-bold">18ms</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[9px]">
            <span>BD-AMOY-01 • v3.0.4-PROD</span>
            <span className="text-cyan-400">UPTIME 99.98%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
