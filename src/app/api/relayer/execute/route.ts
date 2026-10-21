import { NextRequest, NextResponse } from "next/server";
import { executeGaslessRelay, isReceiptHashUsed } from "@/lib/blockchain/relayer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      receiptHash,
      vendorAddress,
      amountWei,
      trustScore,
      severityLevel,
      beneficiaryToken,
      auditMetadataURI,
      itemsAudited,
      tamperFlags,
      aiReasoning,
      amountUsd,
    } = body;

    if (!receiptHash || !vendorAddress || !amountWei || trustScore === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for gasless escrow execution" },
        { status: 400 }
      );
    }

    // Direct pre-check for anti-replay
    if (isReceiptHashUsed(receiptHash)) {
      return NextResponse.json(
        {
          success: false,
          error: `DuplicateReceiptReplayAttack: Receipt hash ${receiptHash} has already been settled on-chain. Prevented double-spend!`,
          isReplayAttack: true,
        },
        { status: 409 }
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      vendorAddress;

    const result = await executeGaslessRelay({
      receiptHash,
      vendorAddress,
      amountWei,
      trustScore: Number(trustScore),
      severityLevel: severityLevel ? Number(severityLevel) : 1,
      beneficiaryToken: beneficiaryToken || undefined,
      auditMetadataURI: auditMetadataURI || "ipfs://bafybeiaegisrelief...audit",
      itemsAudited,
      tamperFlags,
      aiReasoning,
      amountUsd,
      clientId: clientIp,
    });

    if (!result.success) {
      const isRateLimit = result.error?.includes("Rate-Limit");
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          isReplayAttack: result.error?.includes("DuplicateReceiptReplayAttack"),
          isRateLimited: isRateLimit,
        },
        { status: isRateLimit ? 429 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      record: result.record,
    });
  } catch (err: any) {
    console.error("Relayer execute error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal Relayer Execution Error" },
      { status: 500 }
    );
  }
}
