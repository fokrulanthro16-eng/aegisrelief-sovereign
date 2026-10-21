import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import ffmpegStatic from "ffmpeg-static";

const baseDir = process.cwd();
const audioDir = path.join(baseDir, "public", "audio");
const scenes = ["scene1", "scene2", "scene3", "scene4", "scene5"];

console.log("Analyzing scene audio durations with ffmpeg...");
const durations = {};

for (const sc of scenes) {
  const filePath = path.join(audioDir, `${sc}.mp3`);
  const res = spawnSync(ffmpegStatic, ["-i", filePath], { encoding: "utf8" });
  const text = (res.stdout || "") + (res.stderr || "");
  const match = text.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
  if (match) {
    const hours = parseFloat(match[1]);
    const minutes = parseFloat(match[2]);
    const seconds = parseFloat(match[3]);
    const totalSec = hours * 3600 + minutes * 60 + seconds;
    durations[sc] = Math.round(totalSec * 10) / 10;
    console.log(`  ${sc}: ${durations[sc]}s`);
  }
}

// Check full narration duration
const fullAudioPath = path.join(audioDir, "full_narration.mp3");
const resFull = spawnSync(ffmpegStatic, ["-i", fullAudioPath], { encoding: "utf8" });
const textFull = (resFull.stdout || "") + (resFull.stderr || "");
const matchFull = textFull.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
let totalFullDuration = 180;
if (matchFull) {
  totalFullDuration = parseFloat(matchFull[1]) * 3600 + parseFloat(matchFull[2]) * 60 + parseFloat(matchFull[3]);
  durations.total = Math.round(totalFullDuration * 10) / 10;
  console.log(`  full_narration: ${durations.total}s`);
}

fs.writeFileSync(path.join(audioDir, "durations.json"), JSON.stringify(durations, null, 2));
console.log("Updated durations.json:", durations);
