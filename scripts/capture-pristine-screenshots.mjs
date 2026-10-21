import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const baseDir = process.cwd();
const screenshotsDir = path.join(baseDir, "docs", "screenshots");

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function captureAll() {
  console.log("================================================================");
  console.log("STARTING PRISTINE ULTRA-HD SCREENSHOT CAPTURE (PLAYWRIGHT)");
  console.log("================================================================\n");

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-zygote",
    ],
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });

  console.log("Loading http://localhost:3000 (Production Server)...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2000);

  // --------------------------------------------------------------------------
  // SCREENSHOT 1: Full 8K Enterprise Mission Control Overview
  // --------------------------------------------------------------------------
  console.log("\n[1/6] Capturing 01-mission-control-overview.png...");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(screenshotsDir, "01-mission-control-overview.png"),
    fullPage: false,
  });

  // --------------------------------------------------------------------------
  // SCREENSHOT 2: Preset A (Authentic Sylhet Approved & BDT Fiat Off-Ramp)
  // --------------------------------------------------------------------------
  console.log("\n[2/6] Clicking Preset A: Authentic Sylhet Relief...");
  const presetABtn = await page.waitForSelector('button:has-text("Preset A")', { timeout: 5000 });
  await presetABtn.click();
  console.log("  Waiting for AI Consensus & Escrow Settlement...");
  await page.waitForTimeout(4500); // Wait for consensus quorum + payment approval

  console.log("Capturing 02-preset-a-authentic-approved.png...");
  await page.evaluate(() => window.scrollTo({ top: 180, behavior: "instant" }));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, "02-preset-a-authentic-approved.png"),
    fullPage: false,
  });

  // --------------------------------------------------------------------------
  // SCREENSHOT 3: Preset B (Syndicate Fraud Blocked & Escrow Frozen)
  // --------------------------------------------------------------------------
  console.log("\n[3/6] Clicking Preset B: +210% Inflated Syndicate Invoice...");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  const presetBBtn = await page.waitForSelector('button:has-text("Preset B")', { timeout: 5000 });
  await presetBBtn.click();
  console.log("  Waiting for AI Veto & Red Laser Tamper Scan...");
  await page.waitForTimeout(4500); // Wait for red tamper overlay & escrow freeze

  console.log("Capturing 03-preset-b-syndicate-fraud-blocked.png...");
  await page.evaluate(() => window.scrollTo({ top: 180, behavior: "instant" }));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, "03-preset-b-syndicate-fraud-blocked.png"),
    fullPage: false,
  });

  // --------------------------------------------------------------------------
  // SCREENSHOT 4: Preset C (Layer-3 SHA-256 Anti-Replay Guard)
  // --------------------------------------------------------------------------
  console.log("\n[4/6] Clicking Preset C: Double-Spend Replay Attack...");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  const presetCBtn = await page.waitForSelector('button:has-text("Preset C")', { timeout: 5000 });
  await presetCBtn.click();
  console.log("  Waiting for Layer-3 Replay Guard Rejection...");
  await page.waitForTimeout(3500);

  console.log("Capturing 04-preset-c-replay-attack-guard.png...");
  await page.evaluate(() => window.scrollTo({ top: 380, behavior: "instant" }));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, "04-preset-c-replay-attack-guard.png"),
    fullPage: false,
  });

  // --------------------------------------------------------------------------
  // SCREENSHOT 5: Field Worker Portal, Severity Multiplier & Telemetry
  // --------------------------------------------------------------------------
  console.log("\n[5/6] Framing Field Worker Portal, Severity Multipliers & Satellite Telemetry...");
  await page.evaluate(() => window.scrollTo({ top: 220, behavior: "instant" }));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, "05-field-worker-portal-telemetry.png"),
    fullPage: false,
  });

  // --------------------------------------------------------------------------
  // SCREENSHOT 6: Immutable On-Chain Forensic Ledger & CLI Terminal
  // --------------------------------------------------------------------------
  console.log("\n[6/6] Framing Immutable On-Chain Forensic Ledger & Terminal Logs...");
  await page.evaluate(() => window.scrollTo({ top: 620, behavior: "instant" }));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(screenshotsDir, "06-on-chain-forensic-ledger.png"),
    fullPage: false,
  });

  await browser.close();
  console.log("\nAll 6 Pristine HD Screenshots captured successfully!");

  const files = [
    "01-mission-control-overview.png",
    "02-preset-a-authentic-approved.png",
    "03-preset-b-syndicate-fraud-blocked.png",
    "04-preset-c-replay-attack-guard.png",
    "05-field-worker-portal-telemetry.png",
    "06-on-chain-forensic-ledger.png",
  ];

  for (const f of files) {
    const p = path.join(screenshotsDir, f);
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      console.log(`  ✓ ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
    } else {
      console.error(`  ✗ Missing: ${f}`);
    }
  }
}

captureAll().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
