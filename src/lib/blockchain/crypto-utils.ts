import { ethers } from "ethers";

/**
 * Computes a standard 0x-prefixed 32-byte SHA-256 hash of a file buffer, base64 data, or string.
 * This represents the physical receipt's tamper-evident digital fingerprint.
 */
export function computeReceiptSha256(input: string | Uint8Array | ArrayBuffer): string {
  if (typeof input === "string") {
    // If it's a data URL (e.g. data:image/png;base64,...), extract or hash the raw bytes/string
    if (input.startsWith("data:")) {
      const base64Content = input.split(",")[1] || input;
      const bytes = ethers.decodeBase64(base64Content);
      return ethers.sha256(bytes);
    }
    return ethers.sha256(ethers.toUtf8Bytes(input));
  }
  return ethers.sha256(new Uint8Array(input));
}

/**
 * Computes the exact keccak256(abi.encodePacked(...)) messageHash matching AegisReliefEscrow.sol (single-oracle):
 * abi.encodePacked(receiptHash, vendor, amountWei, trustScore, auditMetadataURI, block.chainid, address(this))
 */
export function packForensicPayload(
  receiptHash: string,
  vendorAddress: string,
  amountWei: bigint | string | number,
  trustScore: number,
  auditMetadataURI: string,
  chainId: number | bigint | string,
  contractAddress: string
): string {
  const formattedReceiptHash = ethers.zeroPadValue(ethers.getBytes(receiptHash), 32);
  const formattedVendor = ethers.getAddress(vendorAddress);
  const formattedAmount = BigInt(amountWei);
  const formattedTrustScore = Number(trustScore);
  const formattedChainId = BigInt(chainId);
  const formattedContract = ethers.getAddress(contractAddress);

  return ethers.solidityPackedKeccak256(
    ["bytes32", "address", "uint256", "uint8", "string", "uint256", "address"],
    [
      formattedReceiptHash,
      formattedVendor,
      formattedAmount,
      formattedTrustScore,
      auditMetadataURI,
      formattedChainId,
      formattedContract,
    ]
  );
}

/**
 * Computes the keccak256(abi.encodePacked(...)) messageHash for Multi-Agent Consensus:
 * abi.encodePacked(receiptHash, vendor, amountWei, trustScore, severityLevel, auditMetadataURI, beneficiaryConfirmationHash, block.chainid, address(this))
 */
export function packMultiAgentPayload(
  receiptHash: string,
  vendorAddress: string,
  amountWei: bigint | string | number,
  trustScore: number,
  severityLevel: number,
  auditMetadataURI: string,
  beneficiaryConfirmationHash: string,
  chainId: number | bigint | string,
  contractAddress: string
): string {
  const formattedReceiptHash = ethers.zeroPadValue(ethers.getBytes(receiptHash), 32);
  const formattedVendor = ethers.getAddress(vendorAddress);
  const formattedAmount = BigInt(amountWei);
  const formattedTrustScore = Number(trustScore);
  const formattedSeverity = Number(severityLevel);
  const formattedBeneficiaryHash = ethers.zeroPadValue(
    beneficiaryConfirmationHash.startsWith("0x")
      ? ethers.getBytes(beneficiaryConfirmationHash)
      : ethers.toUtf8Bytes(beneficiaryConfirmationHash),
    32
  );
  const formattedChainId = BigInt(chainId);
  const formattedContract = ethers.getAddress(contractAddress);

  return ethers.solidityPackedKeccak256(
    [
      "bytes32",
      "address",
      "uint256",
      "uint8",
      "uint8",
      "string",
      "bytes32",
      "uint256",
      "address",
    ],
    [
      formattedReceiptHash,
      formattedVendor,
      formattedAmount,
      formattedTrustScore,
      formattedSeverity,
      auditMetadataURI,
      formattedBeneficiaryHash,
      formattedChainId,
      formattedContract,
    ]
  );
}

/**
 * Computes the confirmation hash for simulated 4-digit beneficiary delivery sign-off tokens.
 */
export function computeBeneficiaryConfirmationHash(
  receiptHash: string,
  tokenString: string
): string {
  const formattedReceiptHash = ethers.zeroPadValue(ethers.getBytes(receiptHash), 32);
  return ethers.solidityPackedKeccak256(
    ["bytes32", "string"],
    [formattedReceiptHash, tokenString]
  );
}

/**
 * Signs the 32-byte payload hash using an ethers.Wallet.
 * Prepend EIP-191 prefix '\x19Ethereum Signed Message:\n32' as expected by wallet.signMessage(bytes)
 * and recoverSigner(...) in AegisReliefEscrow.sol.
 */
export async function signForensicPayload(
  payloadHash: string,
  oraclePrivateKey: string
): Promise<string> {
  const wallet = new ethers.Wallet(oraclePrivateKey);
  const rawBytes = ethers.getBytes(payloadHash);
  return await wallet.signMessage(rawBytes);
}

/**
 * Recovers the signer address from the payload hash and 65-byte ECDSA signature (EIP-191).
 */
export function verifyForensicSignature(
  payloadHash: string,
  signature: string
): string {
  const rawBytes = ethers.getBytes(payloadHash);
  return ethers.verifyMessage(rawBytes, signature);
}

/**
 * Splits a 65-byte signature into r, s, and v components for on-chain/low-level inspector inspection.
 */
export function splitSignatureComponents(signature: string): { r: string; s: string; v: number } {
  const sig = ethers.Signature.from(signature);
  return {
    r: sig.r,
    s: sig.s,
    v: sig.v,
  };
}

/**
 * Format WEI to human-readable ETH string with high precision.
 */
export function formatEther(wei: bigint | string | number): string {
  try {
    return ethers.formatEther(BigInt(wei));
  } catch {
    return "0.0";
  }
}

/**
 * Parse ETH string to WEI BigInt.
 */
export function parseEther(eth: string): bigint {
  return ethers.parseEther(eth);
}

/**
 * Utility to display shortened Ethereum address (e.g. 0x1234...5678).
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address || "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Utility to display shortened byte hash (e.g. 0x8a9f...e102).
 */
export function shortenHash(hash: string, chars = 6): string {
  if (!hash || hash.length < chars * 2 + 2) return hash || "";
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`;
}
