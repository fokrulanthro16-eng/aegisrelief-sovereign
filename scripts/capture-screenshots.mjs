import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const baseDir = process.cwd();
const screenshotsDir = path.join(baseDir, "docs", "screenshots");

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function capture() {
  console.log("Launching Chromium for Ultra-HD Screenshot Capture (1920x1080, scale factor 2)...");
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

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // 1. Mission Control Overview
  console.log("Capturing 01-mission-control-overview.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "01-mission-control-overview.png"),
    fullPage: false,
  });

  // 2. Preset A: Authentic Sylhet Approved
  console.log("Clicking Preset A: Authentic Sylhet Relief...");
  const presetABtn = await page.waitForSelector('button:has-text("Preset A")', { timeout: 5000 });
  await presetABtn.click();
  await page.waitForTimeout(4000); // Allow multi-oracle consensus and relayer settlement to render

  console.log("Capturing 02-preset-a-authentic-approved.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "02-preset-a-authentic-approved.png"),
    fullPage: false,
  });

  // 3. Preset B: Syndicate Fraud Blocked
  console.log("Clicking Preset B: +210% Inflated Syndicate Invoice...");
  const presetBBtn = await page.waitForSelector('button:has-text("Preset B")', { timeout: 5000 });
  await presetBBtn.click();
  await page.waitForTimeout(4000); // Allow multi-oracle consensus rejection & red laser bounding boxes to render

  console.log("Capturing 03-preset-b-syndicate-fraud-blocked.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "03-preset-b-syndicate-fraud-blocked.png"),
    fullPage: false,
  });

  // 4. Preset C: Replay Attack Guard & Security
  console.log("Clicking Preset C: Double-Spend Replay...");
  const presetCBtn = await page.waitForSelector('button:has-text("Preset C")', { timeout: 5000 });
  await presetCBtn.click();
  await page.waitForTimeout(3000);

  console.log("Scrolling down slightly to frame Layer-3 Anti-Replay Guard, zkPass & CLI...");
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
  await page.waitForTimeout(1500);

  console.log("Capturing 04-preset-c-replay-attack-guard.png...");
  await page.screenshot({
    path: path.join(screenshotsDir, "04-preset-c-replay-attack-guard.png"),
    fullPage: false,
  });

  await browser.close();
  console.log("\nAll 4 Ultra-HD screenshots captured successfully in docs/screenshots/!");

  const files = fs.readdirSync(screenshotsDir);
  for (const f of files) {
    const stat = fs.statSync(path.join(screenshotsDir, f));
    console.log(`  - ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
}

capture().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
