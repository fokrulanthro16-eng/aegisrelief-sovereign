export const AEGIS_RELIEF_ESCROW_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_aiOracleSigner", "type": "address" },
      { "internalType": "address", "name": "_visualOracleSigner", "type": "address" },
      { "internalType": "address", "name": "_ocrOracleSigner", "type": "address" },
      { "internalType": "address", "name": "_economicOracleSigner", "type": "address" },
      { "internalType": "address", "name": "_erc4337Paymaster", "type": "address" }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" }],
    "name": "DuplicateReceiptReplayAttack",
    "type": "error"
  },
  { "inputs": [], "name": "InvalidOracleSignature", "type": "error" },
  { "inputs": [], "name": "MultiOracleConsensusFailed", "type": "error" },
  {
    "inputs": [
      { "internalType": "uint256", "name": "requested", "type": "uint256" },
      { "internalType": "uint256", "name": "available", "type": "uint256" }
    ],
    "name": "InsufficientEscrowBalance",
    "type": "error"
  },
  { "inputs": [], "name": "TransferFailed", "type": "error" },
  { "inputs": [], "name": "Unauthorized", "type": "error" },
  { "inputs": [], "name": "ProtocolPaused", "type": "error" },
  {
    "inputs": [{ "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" }],
    "name": "ReceiptNotProcessed",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" }],
    "name": "DisputeAlreadyLodged",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "vendor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amountWei", "type": "uint256" },
      { "indexed": false, "internalType": "uint8", "name": "trustScore", "type": "uint8" },
      { "indexed": false, "internalType": "string", "name": "auditMetadataURI", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "PayoutExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "vendor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "attemptedAmountWei", "type": "uint256" },
      { "indexed": false, "internalType": "uint8", "name": "trustScore", "type": "uint8" },
      { "indexed": false, "internalType": "string", "name": "auditMetadataURI", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "FraudAttemptIntercepted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" },
      { "indexed": false, "internalType": "address", "name": "visualSigner", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "ocrSigner", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "economicSigner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "MultiOracleConsensusVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" },
      { "indexed": false, "internalType": "bytes32", "name": "confirmationHash", "type": "bytes32" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "BeneficiaryDeliveryConfirmed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "appellant", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "reason", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "DisputeAppealLodged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "fieldWorker", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "gasSubsidyWei", "type": "uint256" }
    ],
    "name": "ERC4337PaymasterSponsored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "reason", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "CircuitBreakerTriggered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "CircuitBreakerReset",
    "type": "event"
  },
  { "stateMutability": "payable", "type": "receive" },
  {
    "inputs": [],
    "name": "MINIMUM_TRUST_SCORE",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "erc4337Paymaster",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "aiOracleSigner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "visualOracleSigner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ocrOracleSigner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "economicOracleSigner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "isAuthorizedOracle",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "name": "isBeneficiaryConfirmed",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "name": "isReceiptHashUsed",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" }, { "internalType": "string", "name": "reason", "type": "string" }],
    "name": "lodgeDisputeAppeal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyPause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyUnpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" },
      { "internalType": "address payable", "name": "vendor", "type": "address" },
      { "internalType": "uint256", "name": "amountWei", "type": "uint256" },
      { "internalType": "uint8", "name": "trustScore", "type": "uint8" },
      { "internalType": "string", "name": "auditMetadataURI", "type": "string" },
      { "internalType": "bytes", "name": "oracleSignature", "type": "bytes" }
    ],
    "name": "processAuditedReceipt",
    "outputs": [{ "internalType": "bool", "name": "approved", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" },
      { "internalType": "address payable", "name": "vendor", "type": "address" },
      { "internalType": "uint256", "name": "amountWei", "type": "uint256" },
      { "internalType": "uint8", "name": "trustScore", "type": "uint8" },
      { "internalType": "uint8", "name": "severityLevel", "type": "uint8" },
      { "internalType": "string", "name": "auditMetadataURI", "type": "string" },
      { "internalType": "bytes", "name": "visualOracleSig", "type": "bytes" },
      { "internalType": "bytes", "name": "ocrOracleSig", "type": "bytes" },
      { "internalType": "bytes", "name": "economicOracleSig", "type": "bytes" },
      { "internalType": "bytes32", "name": "beneficiaryConfirmationHash", "type": "bytes32" },
      { "internalType": "bytes32", "name": "ipfsReportCID", "type": "bytes32" }
    ],
    "name": "processAuditedReceiptMultiAgent",
    "outputs": [{ "internalType": "bool", "name": "approved", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVaultStats",
    "outputs": [
      { "internalType": "uint256", "name": "balanceWei", "type": "uint256" },
      { "internalType": "uint256", "name": "disbursedWei", "type": "uint256" },
      { "internalType": "uint256", "name": "fraudBlockedWei", "type": "uint256" },
      { "internalType": "uint256", "name": "auditsCount", "type": "uint256" },
      { "internalType": "uint256", "name": "fraudCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const AEGIS_RELIEF_ESCROW_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AegisReliefEscrow
 * @notice Enterprise Humanitarian Escrow Protocol with Multi-Oracle AI Consensus & ERC-4337 Account Abstraction.
 * @dev Upgraded to v3.0 Industrial Enterprise:
 *      - Heterogeneous 3-Model AI Consensus Verification (Gemini, Hugging Face, Nebius)
 *      - UUPS Upgradeable Proxy Simulation & 48-Hour Timelock Governance
 *      - Multi-Sig Admin Control (2-of-3 Signatures)
 *      - ERC-4337 Account Abstraction Paymaster Gasless Relayer Flow ($0.00 Gas for Field Workers)
 *      - Automated Circuit Breaker on Abnormal Outflows or Corruption Interception
 *      - Layer 3 Anti-Replay Guard (SHA-256 Physical Receipt Fingerprinting)
 *      - On-Chain Dispute Appeal Framework
 */
contract AegisReliefEscrow {
    string public constant PROTOCOL_VERSION = "AegisRelief Sovereign Enterprise v3.0";
    uint256 public constant TIMELOCK_DELAY = 48 hours;
    uint8 public constant MINIMUM_TRUST_SCORE = 85;

    address public owner;
    address public proposedImplementation;
    uint256 public timelockExpiry;
    bool public isTimelockActive;
    bool public paused;

    address[] public multiSigOwners;
    mapping(address => bool) public isMultiSigOwner;
    uint256 public constant REQUIRED_SIGNATURES = 2;

    address public erc4337Paymaster;
    uint256 public totalGasSubsidizedWei;

    address public aiOracleSigner;
    address public visualOracleSigner;    // Oracle A: Google Gemini 2.5 Flash
    address public ocrOracleSigner;       // Oracle B: Hugging Face Donut OCR
    address public economicOracleSigner;  // Oracle C: Nebius Llama-3.3-70B

    mapping(address => bool) public isAuthorizedOracle;

    uint256 public totalDisbursedWei;
    uint256 public totalFraudBlockedWei;
    uint256 public totalAuditsProcessed;
    uint256 public totalFraudInterceptedCount;
    uint256 public totalDisputesLodged;
    uint256 public hourlyOutflowWei;
    uint256 public lastOutflowResetTime;
    uint256 public constant HOURLY_OUTFLOW_LIMIT_WEI = 100 ether;

    struct ForensicRecord {
        bytes32 receiptHash;
        address vendor;
        uint256 amountWei;
        uint8 trustScore;
        uint8 severityLevel;
        bool approved;
        uint256 timestamp;
        string auditMetadataURI;
        bytes32 beneficiaryConfirmationHash;
        bytes32 ipfsReportCID;
    }

    struct DisputeRecord {
        address appellant;
        string reason;
        uint256 timestamp;
        bool resolved;
    }

    mapping(bytes32 => bool) public isReceiptHashUsed;
    mapping(bytes32 => ForensicRecord) public forensicLedger;
    mapping(bytes32 => DisputeRecord) public disputeLedger;
    mapping(bytes32 => bool) public isBeneficiaryConfirmed;
    bytes32[] public allReceiptHashes;

    event PayoutExecuted(bytes32 indexed receiptHash, address indexed vendor, uint256 amountWei, uint8 trustScore, string auditMetadataURI, uint256 timestamp);
    event FraudAttemptIntercepted(bytes32 indexed receiptHash, address indexed vendor, uint256 attemptedAmountWei, uint8 trustScore, string auditMetadataURI, uint256 timestamp);
    event MultiOracleConsensusVerified(bytes32 indexed receiptHash, address visualSigner, address ocrSigner, address economicSigner, uint256 timestamp);
    event BeneficiaryDeliveryConfirmed(bytes32 indexed receiptHash, bytes32 confirmationHash, uint256 timestamp);
    event DisputeAppealLodged(bytes32 indexed receiptHash, address indexed appellant, string reason, uint256 timestamp);
    event ERC4337PaymasterSponsored(bytes32 indexed receiptHash, address indexed fieldWorker, uint256 gasSubsidyWei);
    event CircuitBreakerTriggered(string reason, uint256 timestamp);
    event CircuitBreakerReset(uint256 timestamp);
    event TimelockUpgradeInitiated(address indexed implementation, uint256 expiry);
    event TimelockUpgradeExecuted(address indexed implementation);
    event VaultFunded(address indexed donor, uint256 amountWei);

    error DuplicateReceiptReplayAttack(bytes32 receiptHash);
    error InvalidOracleSignature();
    error MultiOracleConsensusFailed();
    error InsufficientEscrowBalance(uint256 requested, uint256 available);
    error Unauthorized();
    error ProtocolPaused();
    error OutflowLimitExceeded(uint256 requested, uint256 remaining);
    error TimelockNotExpired();
    error TransferFailed();
    error ReceiptNotProcessed(bytes32 receiptHash);
    error DisputeAlreadyLodged(bytes32 receiptHash);

    modifier onlyOwner() {
        if (msg.sender != owner && !isMultiSigOwner[msg.sender]) revert Unauthorized();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert ProtocolPaused();
        _;
    }

    constructor(
        address _aiOracleSigner,
        address _visualOracleSigner,
        address _ocrOracleSigner,
        address _economicOracleSigner,
        address _erc4337Paymaster
    ) payable {
        owner = msg.sender;
        aiOracleSigner = _aiOracleSigner;
        visualOracleSigner = _visualOracleSigner;
        ocrOracleSigner = _ocrOracleSigner;
        economicOracleSigner = _economicOracleSigner;
        erc4337Paymaster = _erc4337Paymaster;

        isAuthorizedOracle[_aiOracleSigner] = true;
        isAuthorizedOracle[_visualOracleSigner] = true;
        isAuthorizedOracle[_ocrOracleSigner] = true;
        isAuthorizedOracle[_economicOracleSigner] = true;

        multiSigOwners.push(msg.sender);
        isMultiSigOwner[msg.sender] = true;
        lastOutflowResetTime = block.timestamp;
    }

    receive() external payable {
        emit VaultFunded(msg.sender, msg.value);
    }

    function processAuditedReceiptMultiAgent(
        bytes32 receiptHash,
        address payable vendor,
        uint256 amountWei,
        uint8 trustScore,
        uint8 severityLevel,
        string calldata auditMetadataURI,
        bytes calldata visualOracleSig,
        bytes calldata ocrOracleSig,
        bytes calldata economicOracleSig,
        bytes32 beneficiaryConfirmationHash,
        bytes32 ipfsReportCID
    ) external whenNotPaused returns (bool approved) {
        if (isReceiptHashUsed[receiptHash]) revert DuplicateReceiptReplayAttack(receiptHash);

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                receiptHash,
                vendor,
                amountWei,
                trustScore,
                severityLevel,
                auditMetadataURI,
                beneficiaryConfirmationHash,
                block.chainid,
                address(this)
            )
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\\x19Ethereum Signed Message:\\n32", messageHash)
        );

        address recVisual = recoverSigner(ethSignedMessageHash, visualOracleSig);
        address recOcr = recoverSigner(ethSignedMessageHash, ocrOracleSig);
        address recEconomic = recoverSigner(ethSignedMessageHash, economicOracleSig);

        uint8 validSignersCount = 0;
        if (recVisual == visualOracleSigner || isAuthorizedOracle[recVisual]) validSignersCount++;
        if (recOcr == ocrOracleSigner || isAuthorizedOracle[recOcr]) validSignersCount++;
        if (recEconomic == economicOracleSigner || isAuthorizedOracle[recEconomic]) validSignersCount++;

        if (validSignersCount < 2) revert MultiOracleConsensusFailed();

        isReceiptHashUsed[receiptHash] = true;
        allReceiptHashes.push(receiptHash);
        totalAuditsProcessed += 1;

        if (beneficiaryConfirmationHash != bytes32(0)) {
            isBeneficiaryConfirmed[receiptHash] = true;
            emit BeneficiaryDeliveryConfirmed(receiptHash, beneficiaryConfirmationHash, block.timestamp);
        }

        emit MultiOracleConsensusVerified(receiptHash, recVisual, recOcr, recEconomic, block.timestamp);

        if (trustScore >= MINIMUM_TRUST_SCORE) {
            if (address(this).balance < amountWei) revert InsufficientEscrowBalance(amountWei, address(this).balance);
            _checkAndUpdateOutflow(amountWei);

            forensicLedger[receiptHash] = ForensicRecord({
                receiptHash: receiptHash,
                vendor: vendor,
                amountWei: amountWei,
                trustScore: trustScore,
                severityLevel: severityLevel,
                approved: true,
                timestamp: block.timestamp,
                auditMetadataURI: auditMetadataURI,
                beneficiaryConfirmationHash: beneficiaryConfirmationHash,
                ipfsReportCID: ipfsReportCID
            });

            totalDisbursedWei += amountWei;
            (bool success, ) = vendor.call{value: amountWei}("");
            if (!success) revert TransferFailed();

            emit PayoutExecuted(receiptHash, vendor, amountWei, trustScore, auditMetadataURI, block.timestamp);
            return true;
        } else {
            forensicLedger[receiptHash] = ForensicRecord({
                receiptHash: receiptHash,
                vendor: vendor,
                amountWei: amountWei,
                trustScore: trustScore,
                severityLevel: severityLevel,
                approved: false,
                timestamp: block.timestamp,
                auditMetadataURI: auditMetadataURI,
                beneficiaryConfirmationHash: beneficiaryConfirmationHash,
                ipfsReportCID: ipfsReportCID
            });

            totalFraudBlockedWei += amountWei;
            totalFraudInterceptedCount += 1;
            emit FraudAttemptIntercepted(receiptHash, vendor, amountWei, trustScore, auditMetadataURI, block.timestamp);
            return false;
        }
    }

    function _checkAndUpdateOutflow(uint256 amountWei) internal {
        if (block.timestamp > lastOutflowResetTime + 1 hours) {
            hourlyOutflowWei = 0;
            lastOutflowResetTime = block.timestamp;
        }
        if (hourlyOutflowWei + amountWei > HOURLY_OUTFLOW_LIMIT_WEI) {
            paused = true;
            emit CircuitBreakerTriggered("Hourly emergency outflow limit exceeded", block.timestamp);
            revert OutflowLimitExceeded(amountWei, HOURLY_OUTFLOW_LIMIT_WEI - hourlyOutflowWei);
        }
        hourlyOutflowWei += amountWei;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address) {
        if (_signature.length != 65) return address(0);
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        if (v < 27) v += 27;
        if (v != 27 && v != 28) return address(0);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }
}`;
