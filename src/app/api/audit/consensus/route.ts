import { NextRequest, NextResponse } from "next/server";
import { executeMultiOracleConsensus } from "@/lib/ai-pipeline";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const consensus = await executeMultiOracleConsensus(body);

    return NextResponse.json({
      success: true,
      result: consensus,
    });
  } catch (err: any) {
    console.error("Multi-Oracle Consensus error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Consensus execution failed" },
      { status: 500 }
    );
  }
}
