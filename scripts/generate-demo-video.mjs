import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { execSync, spawnSync } from "child_process";
import ffmpegStatic from "ffmpeg-static";

const baseDir = process.cwd();
const tempRecordingsDir = path.join(baseDir, "temp_recordings");
const outputMp4 = path.join(baseDir, "public", "aegisrelief-demo.mp4");
const audioFile = path.join(baseDir, "public", "audio", "full_narration.mp3");
const durationsFile = path.join(baseDir, "public", "audio", "durations.json");

if (!fs.existsSync(audioFile)) {
  console.error("Error: Audio file not found at", audioFile);
  process.exit(1);
}

const durations = JSON.parse(fs.readFileSync(durationsFile, "utf8"));
console.log("Loaded scene durations:", durations);

// Clean up old recordings directory
if (fs.existsSync(tempRecordingsDir)) {
  fs.rmSync(tempRecordingsDir, { recursive: true, force: true });
}
fs.mkdirSync(tempRecordingsDir, { recursive: true });

async function smoothMouseMove(page, targetX, targetY, steps = 25) {
  await page.mouse.move(targetX, targetY, { steps });
  await page.waitForTimeout(200);
}

async function runChoreography() {
  console.log("\n========================================================");
  console.log("STARTING AUTOMATED ULTRA-HD BROWSER RECORDING (PLAYWRIGHT)");
  console.log("========================================================\n");

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // 4K/8K rendering crispness
    recordVideo: {
      dir: tempRecordingsDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Inject visual cursor for smooth video demonstration
  await page.evaluate(() => {
    const cursor = document.createElement("div");
    cursor.id = "playwright-visual-cursor";
    cursor.style.width = "20px";
    cursor.style.height = "20px";
    cursor.style.border = "2px solid #06b6d4";
    cursor.style.backgroundColor = "rgba(6, 182, 212, 0.4)";
    cursor.style.borderRadius = "50%";
    cursor.style.position = "fixed";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "999999";
    cursor.style.transition = "transform 0.08s ease, width 0.15s ease, height 0.15s ease";
    cursor.style.boxShadow = "0 0 15px #06b6d4";
    cursor.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(cursor);

    window.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    window.addEventListener("mousedown", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(0.75)";
      cursor.style.backgroundColor = "rgba(16, 185, 129, 0.8)";
    });

    window.addEventListener("mouseup", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursor.style.backgroundColor = "rgba(6, 182, 212, 0.4)";
    });
  });

  // Launch in-app Auto-Pilot Pitch mode for subtitles
  console.log("Launching in-app Auto-Pilot Tour overlay for subtitles...");
  try {
    const pitchBtn = await page.waitForSelector('button:has-text("Auto-Pilot Pitch")', { timeout: 3000 });
    if (pitchBtn) {
      await pitchBtn.click();
      await page.waitForTimeout(600);
    }
  } catch (e) {
    console.log("Auto-Pilot pitch button triggered via UI state");
  }

  // --------------------------------------------------------------------------
  // SCENE 1: THE PROBLEM & HOOK (~32.8s)
  // --------------------------------------------------------------------------
  console.log("\n[SCENE 1: The Problem & Hook] (Target: ~32.8s)");
  const scene1Start = Date.now();

  // Smooth mouse move to Jurisdiction Selector
  await smoothMouseMove(page, 340, 30, 20);
  await page.click('button:has-text("Sylhet")').catch(() => {});
  await page.waitForTimeout(2500);

  // Hover over other disaster zones in dropdown
  await smoothMouseMove(page, 340, 95, 15);
  await page.waitForTimeout(800);
  await smoothMouseMove(page, 340, 140, 15);
  await page.waitForTimeout(800);
  await smoothMouseMove(page, 340, 185, 15);
  await page.waitForTimeout(800);

  // Close dropdown
  await page.click('button:has-text("Sylhet")').catch(() => {});
  await page.waitForTimeout(1000);

  // Hover across Top 4 KPI Cards
  console.log("  Hovering over KPI cards (TVL, Disbursed, Fraud, Relayer Gas)...");
  await smoothMouseMove(page, 450, 110, 25);
  await page.waitForTimeout(2500);
  await smoothMouseMove(page, 800, 110, 25);
  await page.waitForTimeout(2500);
  await smoothMouseMove(page, 1150, 110, 25);
  await page.waitForTimeout(2500);
  await smoothMouseMove(page, 1500, 110, 25);
  await page.waitForTimeout(2500);

  // Wait remaining Scene 1 time
  const scene1Elapsed = (Date.now() - scene1Start) / 1000;
  const scene1Remain = Math.max(0, (durations.scene1 || 32.8) - scene1Elapsed);
  console.log(`  Scene 1 elapsed: ${scene1Elapsed.toFixed(1)}s, waiting remaining: ${scene1Remain.toFixed(1)}s`);
  await page.waitForTimeout(scene1Remain * 1000);

  // --------------------------------------------------------------------------
  // SCENE 2: HETEROGENEOUS 3-MODEL AI ARCHITECTURE (~45.3s)
  // --------------------------------------------------------------------------
  console.log("\n[SCENE 2: Heterogeneous 3-Model AI Architecture] (Target: ~45.3s)");
  const scene2Start = Date.now();

  // Smoothly move down to 3 Oracle Consensus Cards
  console.log("  Highlighting Oracle A (Gemini 2.5 Flash)...");
  await smoothMouseMove(page, 520, 280, 25);
  await page.waitForTimeout(6000);

  console.log("  Highlighting Oracle B (Hugging Face Donut OCR)...");
  await smoothMouseMove(page, 1050, 280, 25);
  await page.waitForTimeout(6000);

  console.log("  Highlighting Oracle C (Nebius Llama-3.3-70B)...");
  await smoothMouseMove(page, 1560, 280, 25);
  await page.waitForTimeout(6000);

  // Glide across consensus quorum badge
  await smoothMouseMove(page, 430, 210, 20);
  await page.waitForTimeout(4000);

  // Wait remaining Scene 2 time
  const scene2Elapsed = (Date.now() - scene2Start) / 1000;
  const scene2Remain = Math.max(0, (durations.scene2 || 45.3) - scene2Elapsed);
  console.log(`  Scene 2 elapsed: ${scene2Elapsed.toFixed(1)}s, waiting remaining: ${scene2Remain.toFixed(1)}s`);
  await page.waitForTimeout(scene2Remain * 1000);

  // --------------------------------------------------------------------------
  // SCENE 3: AUTHENTIC RELIEF & GASLESS SETTLEMENT (~34.8s)
  // --------------------------------------------------------------------------
  console.log("\n[SCENE 3: Authentic Relief & Gasless Settlement] (Target: ~34.8s)");
  const scene3Start = Date.now();

  // Click Preset A: Authentic Sylhet
  console.log("  Clicking Preset A: Authentic Sylhet...");
  const presetABtn = await page.waitForSelector('button:has-text("Preset A")', { timeout: 3000 });
  if (presetABtn) {
    const box = await presetABtn.boundingBox();
    if (box) await smoothMouseMove(page, box.x + box.width / 2, box.y + box.height / 2, 20);
    await presetABtn.click();
  }
  await page.waitForTimeout(3000);

  // Hover over the authentic receipt with green ink stamp & dot-matrix font
  console.log("  Inspecting Authentic Paper Receipt Visualizer...");
  await smoothMouseMove(page, 480, 480, 25);
  await page.waitForTimeout(3500);

  // Hover over Autonomous Escrow Decision Panel and click "Release Escrow Funds"
  console.log("  Clicking 'Release Escrow Funds' on Escrow Decision Panel...");
  const executeBtn = await page.waitForSelector('button:has-text("Release Escrow Funds")', { timeout: 3000 }).catch(() => null);
  if (executeBtn) {
    const box = await executeBtn.boundingBox();
    if (box) await smoothMouseMove(page, box.x + box.width / 2, box.y + box.height / 2, 20);
    await executeBtn.click();
    await page.waitForTimeout(3500); // Celebrate with confetti
  }

  // Hover over Automated Fiat Off-Ramp (bKash/Nagad in BDT) & IPFS Proof
  await smoothMouseMove(page, 950, 680, 20);
  await page.waitForTimeout(3000);

  // Scroll down slightly to show Immutable On-Chain Forensic Ledger
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(1000);

  // Wait remaining Scene 3 time
  const scene3Elapsed = (Date.now() - scene3Start) / 1000;
  const scene3Remain = Math.max(0, (durations.scene3 || 34.8) - scene3Elapsed);
  console.log(`  Scene 3 elapsed: ${scene3Elapsed.toFixed(1)}s, waiting remaining: ${scene3Remain.toFixed(1)}s`);
  await page.waitForTimeout(scene3Remain * 1000);

  // --------------------------------------------------------------------------
  // SCENE 4: INTERCEPTING SYNDICATE FRAUD (~35.2s)
  // --------------------------------------------------------------------------
  console.log("\n[SCENE 4: Intercepting Syndicate Fraud] (Target: ~35.2s)");
  const scene4Start = Date.now();

  // Click Preset B: +210% Inflated (Score 18)
  console.log("  Clicking Preset B: +210% Inflated Syndicate Invoice...");
  const presetBBtn = await page.waitForSelector('button:has-text("Preset B")', { timeout: 3000 });
  if (presetBBtn) {
    const box = await presetBBtn.boundingBox();
    if (box) await smoothMouseMove(page, box.x + box.width / 2, box.y + box.height / 2, 20);
    await presetBBtn.click();
  }
  await page.waitForTimeout(3500);

  // Hover over the red laser scan and the flagged Arial Bold bounding box
  console.log("  Highlighting Red Tampering Bounding Box on Receipt Visualizer...");
  await smoothMouseMove(page, 480, 470, 25);
  await page.waitForTimeout(4000);

  // Hover over the deep red CORRUPTION INTERCEPTED // ESCROW FROZEN banner
  console.log("  Highlighting 'CORRUPTION INTERCEPTED // ESCROW FROZEN' banner...");
  await smoothMouseMove(page, 950, 420, 25);
  await page.waitForTimeout(4000);

  // Hover over Nebius Oracle C red veto badge
  await smoothMouseMove(page, 1560, 280, 25);
  await page.waitForTimeout(3000);

  // Hover over Fraud Blocked KPI Card (counter incremented)
  await smoothMouseMove(page, 1150, 110, 25);
  await page.waitForTimeout(3000);

  // Wait remaining Scene 4 time
  const scene4Elapsed = (Date.now() - scene4Start) / 1000;
  const scene4Remain = Math.max(0, (durations.scene4 || 35.2) - scene4Elapsed);
  console.log(`  Scene 4 elapsed: ${scene4Elapsed.toFixed(1)}s, waiting remaining: ${scene4Remain.toFixed(1)}s`);
  await page.waitForTimeout(scene4Remain * 1000);

  // --------------------------------------------------------------------------
  // SCENE 5: DEFENSE-IN-DEPTH & GLOBAL SCALE (~31.9s)
  // --------------------------------------------------------------------------
  console.log("\n[SCENE 5: Defense-in-Depth & Global Scale] (Target: ~31.9s)");
  const scene5Start = Date.now();

  // Click Preset C: Double-Spend Replay
  console.log("  Clicking Preset C: Double-Spend Replay...");
  const presetCBtn = await page.waitForSelector('button:has-text("Preset C")', { timeout: 3000 });
  if (presetCBtn) {
    const box = await presetCBtn.boundingBox();
    if (box) await smoothMouseMove(page, box.x + box.width / 2, box.y + box.height / 2, 20);
    await presetCBtn.click();
  }
  await page.waitForTimeout(3000);

  // Scroll down to show Replay Attack Prevented card
  console.log("  Scrolling down to show Replay Attack Prevented card...");
  await page.evaluate(() => window.scrollBy({ top: 380, behavior: "smooth" }));
  await page.waitForTimeout(2500);

  // Hover over On-Chain Hash Guard
  await smoothMouseMove(page, 480, 520, 20);
  await page.waitForTimeout(3000);

  // Hover over zkPass Officer and Sentinel-1 SAR Telemetry
  await smoothMouseMove(page, 1050, 520, 20);
  await page.waitForTimeout(3000);

  // Scroll down further to show Tactical Globe & CLI Forensic Terminal
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
  await page.waitForTimeout(3000);
  await smoothMouseMove(page, 1200, 600, 25);
  await page.waitForTimeout(3000);

  // Scroll back to top for closing grandeur
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(2000);

  // Wait remaining Scene 5 time
  const scene5Elapsed = (Date.now() - scene5Start) / 1000;
  const scene5Remain = Math.max(0, (durations.scene5 || 31.9) - scene5Elapsed);
  console.log(`  Scene 5 elapsed: ${scene5Elapsed.toFixed(1)}s, waiting remaining: ${scene5Remain.toFixed(1)}s`);
  await page.waitForTimeout(scene5Remain * 1000);

  console.log("\nClosing browser context to finalize raw video recording...");
  await page.close();
  await context.close();
  await browser.close();
  console.log("Playwright browser closed successfully.");
}

async function mergeVideoAndAudio() {
  console.log("\n========================================================");
  console.log("MERGING RECORDED VIDEO WITH NEURAL AUDIO (FFMPEG)");
  console.log("========================================================\n");

  const files = fs.readdirSync(tempRecordingsDir).filter(f => f.endsWith(".webm"));
  if (files.length === 0) {
    throw new Error("No recorded .webm video found in " + tempRecordingsDir);
  }

  const rawVideoPath = path.join(tempRecordingsDir, files[0]);
  console.log("Raw recorded video found:", rawVideoPath);
  console.log("Audio track:", audioFile);
  console.log("Output target:", outputMp4);

  if (fs.existsSync(outputMp4)) {
    fs.unlinkSync(outputMp4);
  }

  // FFmpeg command to multiplex video + audio into Ultra-HD H.264 MP4
  const ffmpegCmd = [
    "-y",
    "-i", rawVideoPath,
    "-i", audioFile,
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-ar", "44100",
    "-shortest",
    outputMp4
  ];

  console.log("Executing ffmpeg merge...");
  const res = spawnSync(ffmpegStatic, ffmpegCmd, { stdio: "inherit" });

  if (res.status !== 0) {
    throw new Error(`FFmpeg exited with error status ${res.status}`);
  }

  if (fs.existsSync(outputMp4)) {
    const stats = fs.statSync(outputMp4);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\nSUCCESS! Generated production video: ${outputMp4}`);
    console.log(`File size: ${sizeMb} MB`);
  } else {
    throw new Error("Output MP4 was not created!");
  }

  // Cleanup raw recordings
  try {
    fs.rmSync(tempRecordingsDir, { recursive: true, force: true });
    console.log("Cleaned up temporary recording files.");
  } catch (e) {}
}

async function main() {
  try {
    await runChoreography();
    await mergeVideoAndAudio();
    console.log("\nALL TASKS COMPLETED SUCCESSFULLY!");
  } catch (err) {
    console.error("FATAL ERROR in demo generator:", err);
    process.exit(1);
  }
}

main();
