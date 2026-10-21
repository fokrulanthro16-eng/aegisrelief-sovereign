import { NextRequest, NextResponse } from "next/server";
import { lodgeDisputeAppealRecord, getAllDisputes, isReceiptHashUsed } from "@/lib/blockchain/relayer";

export async function GET() {
  try {
    const disputes = getAllDisputes();
    return NextResponse.json({ success: true, disputes });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { receiptHash, vendorAddress, reason } = body;

    if (!receiptHash || !reason || !reason.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing receipt hash or dispute appeal justification reason." },
        { status: 400 }
      );
    }

    if (!isReceiptHashUsed(receiptHash)) {
      return NextResponse.json(
        { success: false, error: "Receipt has not been audited yet or does not exist in protocol ledger." },
        { status: 404 }
      );
    }

    const dispute = lodgeDisputeAppealRecord(receiptHash, vendorAddress || "0xVendor", reason.trim());

    return NextResponse.json({
      success: true,
      message: "Manual DAO Review Appeal successfully lodged with Sovereign Relief Council.",
      dispute,
    });
  } catch (err: any) {
    console.error("Dispute appeal error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to lodge dispute appeal" },
      { status: 500 }
    );
  }
}
