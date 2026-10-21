import { NextResponse } from "next/server";
import { resetLedger } from "@/lib/blockchain/relayer";

export async function POST() {
  resetLedger();
  return NextResponse.json({ success: true, message: "Ledger and vault stats reset successfully." });
}
