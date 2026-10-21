import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        surface: "#0b1220",
        "surface-card": "#0f172a",
        "surface-border": "#1e293b",
        cyber: {
          green: "#10b981",
          emerald: "#059669",
          neon: "#00ff88",
          cyan: "#06b6d4",
          blue: "#3b82f6",
          amber: "#f59e0b",
          orange: "#f97316",
          red: "#ef4444",
          crimson: "#dc2626",
          purple: "#a855f7"
        }
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
