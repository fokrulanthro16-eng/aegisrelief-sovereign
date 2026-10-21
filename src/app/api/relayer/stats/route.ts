import { NextResponse } from "next/server";
import {
  getVaultStats,
  getForensicLedger,
  getContractAddress,
  getChainId,
  getOracleSignerAddress,
  getMultiOracleAddresses,
  getRelayerAddress,
  getAllUsedReceiptHashes,
  getAllDisputes,
} from "@/lib/blockchain/relayer";

export async function GET() {
  try {
    const stats = getVaultStats();
    const ledger = getForensicLedger();
    const usedHashes = getAllUsedReceiptHashes();
    const disputes = getAllDisputes();
    const multiOracles = getMultiOracleAddresses();

    return NextResponse.json({
      success: true,
      stats,
      ledger,
      usedHashes,
      disputes,
      multiOracles,
      contractAddress: getContractAddress(),
      chainId: getChainId(),
      oracleSigner: getOracleSignerAddress(),
      relayerAddress: getRelayerAddress(),
      network: getChainId() === 80002 ? "Polygon Amoy Testnet" : "Base Sepolia Testnet",
      gasSubsidy: "100% Sponsor Covered ($0.00 Field Cost)",
      antiDoSProtection: "Sliding Window Active (Max 8 req/min)",
      dailyQuotaRemainingUSD: stats.dailyQuotaUSD - stats.dailyDisbursedUSD,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch relayer stats" },
      { status: 500 }
    );
  }
}
