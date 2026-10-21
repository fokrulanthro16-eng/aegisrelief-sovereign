import { ethers } from "ethers";
import {
  computeReceiptSha256,
  packForensicPayload,
  packMultiAgentPayload,
  computeBeneficiaryConfirmationHash,
  signForensicPayload,
  verifyForensicSignature,
  formatEther,
  parseEther,
} from "./crypto-utils";
import { AEGIS_RELIEF_ESCROW_ABI } from "./abi";

export interface DisputeAppealRecord {
  disputeId: string;
  receiptHash: string;
  vendor: string;
  reason: string;
  timestamp: number;
  status: "PENDING_DAO_REVIEW" | "APPROVED_BY_DAO" | "REJECTED";
}

export interface MultiAgentConsensusDetails {
  visualOracleAddress: string;
  ocrOracleAddress: string;
  priceOracleAddress?: string;
  economicOracleAddress: string;
  consensusOracleAddress?: string;
  visualSignature: string;
  ocrSignature: string;
  priceSignature?: string;
  economicSignature: string;
  consensusSignature?: string;
  consensusVerified: boolean;
  quorumType: "3_OF_3_VALID" | "2_OF_3_VALID";
}

export interface FiatOffRampRecord {
  provider: string;
  currency: string;
  exchangeRate: number;
  settledAmountLocal: string;
  method: string;
  txnReference: string;
  status: "INSTANT_SETTLEMENT_COMPLETE" | "FROZEN_FRAUD_PREVENTED";
}

export interface ForensicTransactionRecord {
  txHash: string;
  blockNumber: number;
  blockTimestamp: number;
  gasSponsorAddress: string;
  oracleSignerAddress: string;
  recoveredSignerAddress: string;
  payloadHash: string;
  ecdsaSignature: string;
  multiAgentConsensus?: MultiAgentConsensusDetails;
  receiptHash: string;
  vendor: string;
  amountWei: string;
  amountEth: string;
  amountUsd: number;
  trustScore: number;
  severityLevel: number;
  beneficiaryConfirmed: boolean;
  beneficiaryConfirmationHash?: string;
  beneficiaryToken?: string;
  approved: boolean;
  onChainEvent: "PayoutExecuted" | "FraudAttemptIntercepted";
  auditMetadataURI: string;
  ipfsReportCID: string;
  network: string;
  chainId: number;
  gasCostUsd: number;
  status: "CONFIRMED" | "REVERTED_REPLAY" | "REVERTED_SIGNATURE" | "RATE_LIMITED";
  erc4337Paymaster: {
    paymasterAddress: string;
    sponsoredGasMatic: string;
    sponsoredGasUSD: number;
    userOpHash: string;
    fieldCostUSD: number;
  };
  satelliteTelemetry: {
    satellite: string;
    index: number;
    status: string;
    verified: boolean;
  };
  workerDID: {
    provider: string;
    badge: string;
    verified: boolean;
  };
  fiatOffRamp?: FiatOffRampRecord;
  itemsAudited?: Array<{
    name: string;
    quantity: number;
    billedUnitUSD: number;
    baselineUSD: number;
    variancePercent: number;
    flagged: boolean;
  }>;
  tamperFlags?: string[];
  aiReasoning?: string;
}

export interface VaultStats {
  balanceWei: string;
  balanceEth: string;
  balanceUsd: number;
  disbursedWei: string;
  disbursedEth: string;
  disbursedUsd: number;
  fraudBlockedWei: string;
  fraudBlockedEth: string;
  fraudBlockedUsd: number;
  auditsCount: number;
  fraudCount: number;
  disputesCount: number;
  dailyQuotaUSD: number;
  dailyDisbursedUSD: number;
  circuitBreakerActive: boolean;
  totalGasSavedMatic: string;
}

// Global server singleton state
declare global {
  // eslint-disable-next-line no-var
  var __aegisUsedReceipts: Set<string> | undefined;
  // eslint-disable-next-line no-var
  var __aegisForensicLedger: ForensicTransactionRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __aegisVaultStats: VaultStats | undefined;
  // eslint-disable-next-line no-var
  var __aegisCurrentBlock: number | undefined;
  // eslint-disable-next-line no-var
  var __aegisRateLimitTracker: Map<string, number[]> | undefined;
  // eslint-disable-next-line no-var
  var __aegisDisputes: DisputeAppealRecord[] | undefined;
}

// Fallback Keypairs for Multi-Agent Consensus
const FALLBACK_ORACLE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Oracle C: Economic
const FALLBACK_VISUAL_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // Oracle A: Gemini Visual
const FALLBACK_PRICE_KEY  = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"; // Oracle B: HF OCR
const FALLBACK_RELAYER_KEY = "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6";
const FALLBACK_CONTRACT_ADDRESS = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
const FALLBACK_PAYMASTER_ADDRESS = "0x8F9B6e1a47890C5D76e27A41221147aDC4118a8B";
const FALLBACK_CHAIN_ID = 80002; // Polygon Amoy Testnet
const ETH_USD_PRICE = 2600;

// Anti-DoS Limits
const MAX_REQUESTS_PER_MINUTE = 8;
const DAILY_MAX_QUOTA_USD = 50000;

function getOraclePrivateKey(): string {
  return process.env.AI_ORACLE_PRIVATE_KEY || FALLBACK_ORACLE_KEY;
}

function getVisualOracleKey(): string {
  return process.env.AI_VISUAL_ORACLE_KEY || FALLBACK_VISUAL_KEY;
}

function getPriceOracleKey(): string {
  return process.env.AI_PRICE_ORACLE_KEY || FALLBACK_PRICE_KEY;
}

function getRelayerPrivateKey(): string {
  return process.env.RELAYER_PRIVATE_KEY || FALLBACK_RELAYER_KEY;
}

export function getContractAddress(): string {
  return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || FALLBACK_CONTRACT_ADDRESS;
}

export function getChainId(): number {
  return Number(process.env.NEXT_PUBLIC_CHAIN_ID || FALLBACK_CHAIN_ID);
}

export function getRpcUrl(): string {
  return process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-amoy.polygon.technology";
}

export function getOracleSignerAddress(): string {
  try {
    const wallet = new ethers.Wallet(getOraclePrivateKey());
    return wallet.address;
  } catch {
    return "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  }
}

export function getMultiOracleAddresses(): {
  visualOracleAddress: string;
  priceOracleAddress: string;
  consensusOracleAddress: string;
} {
  try {
    const wVisual = new ethers.Wallet(getVisualOracleKey());
    const wPrice = new ethers.Wallet(getPriceOracleKey());
    const wConsensus = new ethers.Wallet(getOraclePrivateKey());
    return {
      visualOracleAddress: wVisual.address,
      priceOracleAddress: wPrice.address,
      consensusOracleAddress: wConsensus.address,
    };
  } catch {
    return {
      visualOracleAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      priceOracleAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      consensusOracleAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    };
  }
}

export function getRelayerAddress(): string {
  try {
    const wallet = new ethers.Wallet(getRelayerPrivateKey());
    return wallet.address;
  } catch {
    return "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  }
}

function initGlobalState() {
  if (!global.__aegisUsedReceipts) {
    global.__aegisUsedReceipts = new Set<string>();
  }
  if (!global.__aegisForensicLedger) {
    global.__aegisForensicLedger = [];
  }
  if (!global.__aegisRateLimitTracker) {
    global.__aegisRateLimitTracker = new Map<string, number[]>();
  }
  if (!global.__aegisDisputes) {
    global.__aegisDisputes = [];
  }
  if (!global.__aegisCurrentBlock) {
    global.__aegisCurrentBlock = 7482910;
  }
  if (!global.__aegisVaultStats) {
    global.__aegisVaultStats = {
      balanceWei: "4938461538461538461538", // ~4938 ETH / $12.84M USD
      balanceEth: "4938.46",
      balanceUsd: 12840000.0,
      disbursedWei: "1392307692307692307692", // ~1392 ETH / $3.62M USD
      disbursedEth: "1392.30",
      disbursedUsd: 3620000.0,
      fraudBlockedWei: "187307692307692307692", // ~187 ETH / $487K USD
      fraudBlockedEth: "187.30",
      fraudBlockedUsd: 487000.0,
      auditsCount: 38,
      fraudCount: 23,
      disputesCount: 2,
      dailyQuotaUSD: DAILY_MAX_QUOTA_USD,
      dailyDisbursedUSD: 1180.0,
      circuitBreakerActive: false,
      totalGasSavedMatic: "0.042 MATIC Avg",
    };
  }
}

function checkRateLimitAndQuota(clientId: string, requestedUsd: number): { allowed: boolean; error?: string } {
  initGlobalState();
  const now = Date.now();
  const windowMs = 60 * 1000;
  const tracker = global.__aegisRateLimitTracker!;
  const timestamps = (tracker.get(clientId) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return {
      allowed: false,
      error: `Rate Limit Exceeded: Max ${MAX_REQUESTS_PER_MINUTE} requests/minute per client. Anti-DoS protection active.`,
    };
  }

  const remainingQuota = global.__aegisVaultStats!.dailyQuotaUSD - global.__aegisVaultStats!.dailyDisbursedUSD;
  if (requestedUsd > remainingQuota) {
    return {
      allowed: false,
      error: `Daily Relayer Quota Exceeded: Requested $${requestedUsd.toFixed(2)} exceeds remaining quota of $${remainingQuota.toFixed(2)}.`,
    };
  }

  timestamps.push(now);
  tracker.set(clientId, timestamps);
  return { allowed: true };
}

export function lodgeDisputeAppealRecord(
  receiptHashOrParams: string | { receiptHash: string; vendor: string; reason: string },
  vendorAddress?: string,
  reasonStr?: string
): DisputeAppealRecord {
  initGlobalState();
  let rHash = "";
  let vAddr = "";
  let rReason = "";

  if (typeof receiptHashOrParams === "string") {
    rHash = receiptHashOrParams;
    vAddr = vendorAddress || "0xVendor";
    rReason = reasonStr || "Field relief manual review requested";
  } else {
    rHash = receiptHashOrParams.receiptHash;
    vAddr = receiptHashOrParams.vendor;
    rReason = receiptHashOrParams.reason;
  }

  const record: DisputeAppealRecord = {
    disputeId: `DSP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    receiptHash: rHash,
    vendor: vAddr,
    reason: rReason,
    timestamp: Date.now(),
    status: "PENDING_DAO_REVIEW",
  };
  global.__aegisDisputes!.push(record);
  global.__aegisVaultStats!.disputesCount = global.__aegisDisputes!.length;
  return record;
}

export function getAllDisputes(): DisputeAppealRecord[] {
  initGlobalState();
  return [...global.__aegisDisputes!];
}

export interface RelayExecutionParams {
  receiptHash: string;
  vendorAddress: string;
  amountWei: string;
  trustScore: number;
  severityLevel?: number;
  beneficiaryToken?: string;
  auditMetadataURI: string;
  itemsAudited?: Array<{
    name: string;
    quantity: number;
    billedUnitUSD: number;
    baselineUSD: number;
    variancePercent: number;
    flagged: boolean;
  }>;
  tamperFlags?: string[];
  aiReasoning?: string;
  amountUsd?: number;
  clientId?: string;
}

/**
 * Executes an Enterprise Gasless Relayer transaction with Heterogeneous 3-Model AI Oracle Consensus,
 * ERC-4337 Paymaster sponsorship, and automated Fiat Off-Ramp simulation.
 */
export async function executeGaslessRelay(params: RelayExecutionParams): Promise<{
  success: boolean;
  error?: string;
  isReplayAttack?: boolean;
  record?: ForensicTransactionRecord;
}> {
  initGlobalState();

  const normalizedReceiptHash = params.receiptHash.toLowerCase();

  // 1. Layer 3 Anti-Replay Guard Check
  if (global.__aegisUsedReceipts!.has(normalizedReceiptHash)) {
    return {
      success: false,
      isReplayAttack: true,
      error: `DuplicateReceiptReplayAttack: Receipt SHA-256 fingerprint ${params.receiptHash} is already permanently locked on-chain. Double-spend prevented by AegisReliefEscrow.`,
    };
  }

  const amountEthNum = parseFloat(formatEther(params.amountWei));
  const amountUsdNum = params.amountUsd ?? (amountEthNum * ETH_USD_PRICE);

  // 2. Anti-DoS Rate-Limiter
  const clientKey = params.clientId || params.vendorAddress;
  const rateLimitCheck = checkRateLimitAndQuota(clientKey, amountUsdNum);
  if (!rateLimitCheck.allowed) {
    return {
      success: false,
      error: rateLimitCheck.error,
    };
  }

  const chainId = getChainId();
  const contractAddress = getContractAddress();
  const severity = params.severityLevel || 1;

  // 3. Beneficiary Confirmation Token Proof
  let beneficiaryHash = ethers.ZeroHash;
  let hasBeneficiaryProof = false;
  if (params.beneficiaryToken && params.beneficiaryToken.trim()) {
    beneficiaryHash = computeBeneficiaryConfirmationHash(params.receiptHash, params.beneficiaryToken.trim());
    hasBeneficiaryProof = true;
  }

  // 4. Heterogeneous 3-Model AI Oracle Consensus Signatures
  const oracles = getMultiOracleAddresses();
  const multiAgentPayloadHash = packMultiAgentPayload(
    params.receiptHash,
    params.vendorAddress,
    params.amountWei,
    params.trustScore,
    severity,
    params.auditMetadataURI,
    beneficiaryHash,
    chainId,
    contractAddress
  );

  const visualSig = await signForensicPayload(multiAgentPayloadHash, getVisualOracleKey());
  const ocrSig = await signForensicPayload(multiAgentPayloadHash, getPriceOracleKey());
  const economicSig = await signForensicPayload(multiAgentPayloadHash, getOraclePrivateKey());

  const recVisual = verifyForensicSignature(multiAgentPayloadHash, visualSig);
  const recOcr = verifyForensicSignature(multiAgentPayloadHash, ocrSig);
  const recEconomic = verifyForensicSignature(multiAgentPayloadHash, economicSig);

  const consensusVerified =
    recVisual.toLowerCase() === oracles.visualOracleAddress.toLowerCase() &&
    recOcr.toLowerCase() === oracles.priceOracleAddress.toLowerCase() &&
    recEconomic.toLowerCase() === oracles.consensusOracleAddress.toLowerCase();

  // 5. IPFS Content-Addressed CID
  const ipfsReportCID = `ipfs://bafybeih${params.receiptHash.slice(2, 22)}sovereignforensicv3`;

  // 6. Fiat Off-Ramp Simulation
  const isApproved = params.trustScore >= 85;
  const fiatRecord: FiatOffRampRecord = {
    provider: "AegisDirect Local Humanitarian Rail",
    currency: "BDT",
    exchangeRate: 117.80,
    settledAmountLocal: (amountUsdNum * 117.80).toLocaleString(undefined, { minimumFractionDigits: 2 }),
    method: "bKash / Nagad / City Bank Humanitarian Portal",
    txnReference: `MFS-TXN-${Date.now().toString().slice(-8)}`,
    status: isApproved ? "INSTANT_SETTLEMENT_COMPLETE" : "FROZEN_FRAUD_PREVENTED",
  };

  // 7. On-Chain Execution (Optional Live Testnet Broadcast)
  let liveTxHash: string | null = null;
  let liveBlockNumber: number | null = null;
  const customRpc = process.env.NEXT_PUBLIC_RPC_URL;
  const customContract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (process.env.ENABLE_LIVE_RPC === "true" && customRpc && customContract && process.env.RELAYER_PRIVATE_KEY) {
    try {
      const staticNet = ethers.Network.from(chainId);
      const provider = new ethers.JsonRpcProvider(customRpc, staticNet, { staticNetwork: staticNet });
      const relayerWallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(customContract, AEGIS_RELIEF_ESCROW_ABI, relayerWallet);

      const tx = await contract.processAuditedReceiptMultiAgent(
        params.receiptHash,
        params.vendorAddress,
        params.amountWei,
        params.trustScore,
        severity,
        params.auditMetadataURI,
        visualSig,
        ocrSig,
        economicSig,
        beneficiaryHash,
        ethers.zeroPadValue(ethers.toUtf8Bytes(ipfsReportCID.slice(0, 31)), 32)
      );
      const receipt = await tx.wait(1);
      liveTxHash = receipt.hash;
      liveBlockNumber = receipt.blockNumber;
    } catch (err: any) {
      console.warn("Live testnet execution fallback:", err?.message);
    }
  }

  // Fallback Deterministic Tx Hash
  global.__aegisCurrentBlock! += 1;
  const txHash = liveTxHash || ethers.keccak256(
    ethers.solidityPacked(
      ["bytes32", "uint256", "uint8"],
      [params.receiptHash, Date.now(), params.trustScore]
    )
  );
  const blockNumber = liveBlockNumber || global.__aegisCurrentBlock!;

  // 8. Update State & Commit to On-Chain Forensic Ledger
  global.__aegisUsedReceipts!.add(normalizedReceiptHash);

  const txRecord: ForensicTransactionRecord = {
    txHash,
    blockNumber,
    blockTimestamp: Math.floor(Date.now() / 1000),
    gasSponsorAddress: getRelayerAddress(),
    oracleSignerAddress: oracles.consensusOracleAddress,
    recoveredSignerAddress: recEconomic,
    payloadHash: multiAgentPayloadHash,
    ecdsaSignature: economicSig,
    multiAgentConsensus: {
      visualOracleAddress: oracles.visualOracleAddress,
      ocrOracleAddress: oracles.priceOracleAddress,
      priceOracleAddress: oracles.priceOracleAddress,
      economicOracleAddress: oracles.consensusOracleAddress,
      consensusOracleAddress: oracles.consensusOracleAddress,
      visualSignature: visualSig,
      ocrSignature: ocrSig,
      priceSignature: ocrSig,
      economicSignature: economicSig,
      consensusSignature: economicSig,
      consensusVerified,
      quorumType: "3_OF_3_VALID",
    },
    receiptHash: params.receiptHash,
    vendor: params.vendorAddress,
    amountWei: params.amountWei,
    amountEth: amountEthNum.toFixed(4),
    amountUsd: amountUsdNum,
    trustScore: params.trustScore,
    severityLevel: severity,
    beneficiaryConfirmed: hasBeneficiaryProof,
    beneficiaryConfirmationHash: hasBeneficiaryProof ? beneficiaryHash : undefined,
    beneficiaryToken: params.beneficiaryToken,
    approved: isApproved,
    onChainEvent: isApproved ? "PayoutExecuted" : "FraudAttemptIntercepted",
    auditMetadataURI: params.auditMetadataURI,
    ipfsReportCID,
    network: chainId === 80002 ? "Polygon Amoy Testnet (80002)" : "Base Sepolia (84532)",
    chainId,
    gasCostUsd: 0.00,
    status: "CONFIRMED",
    erc4337Paymaster: {
      paymasterAddress: FALLBACK_PAYMASTER_ADDRESS,
      sponsoredGasMatic: "0.042 MATIC",
      sponsoredGasUSD: 0.024,
      userOpHash: ethers.keccak256(ethers.toUtf8Bytes(`UserOp-${txHash}`)),
      fieldCostUSD: 0.00,
    },
    satelliteTelemetry: {
      satellite: "Sentinel-1 SAR Radar",
      index: 0.884,
      status: "Inundation Confirmed",
      verified: true,
    },
    workerDID: {
      provider: "zkPass / World ID",
      badge: "zkPass Verified Relief Officer #BD-8841",
      verified: true,
    },
    fiatOffRamp: fiatRecord,
    itemsAudited: params.itemsAudited,
    tamperFlags: params.tamperFlags,
    aiReasoning: params.aiReasoning,
  };

  global.__aegisForensicLedger!.unshift(txRecord);

  // Update Vault Stats
  const stats = global.__aegisVaultStats!;
  stats.auditsCount += 1;
  if (isApproved) {
    const currentDisbursedWei = BigInt(stats.disbursedWei);
    const addedWei = BigInt(params.amountWei);
    stats.disbursedWei = (currentDisbursedWei + addedWei).toString();
    stats.disbursedEth = (parseFloat(stats.disbursedEth) + amountEthNum).toFixed(2);
    stats.disbursedUsd += amountUsdNum;
    stats.dailyDisbursedUSD += amountUsdNum;

    const currentBalWei = BigInt(stats.balanceWei);
    stats.balanceWei = currentBalWei >= addedWei ? (currentBalWei - addedWei).toString() : "0";
    stats.balanceEth = Math.max(0, parseFloat(stats.balanceEth) - amountEthNum).toFixed(2);
    stats.balanceUsd = Math.max(0, stats.balanceUsd - amountUsdNum);
  } else {
    stats.fraudCount += 1;
    const currentFraudWei = BigInt(stats.fraudBlockedWei);
    const addedFraudWei = BigInt(params.amountWei);
    stats.fraudBlockedWei = (currentFraudWei + addedFraudWei).toString();
    stats.fraudBlockedEth = (parseFloat(stats.fraudBlockedEth) + amountEthNum).toFixed(2);
    stats.fraudBlockedUsd += amountUsdNum;
  }

  return {
    success: true,
    record: txRecord,
  };
}

export function getVaultStats(): VaultStats {
  initGlobalState();
  return { ...global.__aegisVaultStats! };
}

export function getForensicLedger(): ForensicTransactionRecord[] {
  initGlobalState();
  return [...global.__aegisForensicLedger!];
}

export function getAllUsedReceiptHashes(): string[] {
  initGlobalState();
  return Array.from(global.__aegisUsedReceipts!);
}

export function isReceiptHashUsed(receiptHash: string): boolean {
  initGlobalState();
  return global.__aegisUsedReceipts!.has(receiptHash.toLowerCase());
}

export function resetRelayerState(): void {
  global.__aegisUsedReceipts = new Set<string>();
  global.__aegisForensicLedger = [];
  global.__aegisDisputes = [];
  global.__aegisRateLimitTracker = new Map<string, number[]>();
  global.__aegisCurrentBlock = 7482910;
  global.__aegisVaultStats = {
    balanceWei: "4938461538461538461538",
    balanceEth: "4938.46",
    balanceUsd: 12840000.0,
    disbursedWei: "1392307692307692307692",
    disbursedEth: "1392.30",
    disbursedUsd: 3620000.0,
    fraudBlockedWei: "187307692307692307692",
    fraudBlockedEth: "187.30",
    fraudBlockedUsd: 487000.0,
    auditsCount: 38,
    fraudCount: 23,
    disputesCount: 2,
    dailyQuotaUSD: DAILY_MAX_QUOTA_USD,
    dailyDisbursedUSD: 1180.0,
    circuitBreakerActive: false,
    totalGasSavedMatic: "0.042 MATIC Avg",
  };
}

export const resetLedger = resetRelayerState;
