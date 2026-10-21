<div align="center">

# 🛡️ AEGISRELIEF SOVEREIGN
### Autonomous AI-Audited Disaster Relief Escrow Protocol
**Solving the Blockchain Oracle Problem with a Heterogeneous 3-Model AI Committee & Invisible Web3 Relayer**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Live%20Public%20HTTPS%20Deployment-success?logo=cloudflare)](https://cord-reports-phase-leasing.trycloudflare.com)
[![Network](https://img.shields.io/badge/Network-Polygon%20Amoy%20(80002)-cyan.svg)](https://amoy.polygonscan.com/address/0x8A791620dd6260079BF849Dc5567aDC3F2FdC318)
[![Account Abstraction](https://img.shields.io/badge/ERC--4337-Gasless%20Relayer%20($0.00)-purple.svg)](#account-abstraction--erc-4337)
[![Multi-Oracle](https://img.shields.io/badge/AI%20Quorum-2--of--3%20Heterogeneous%20Consensus-blue.svg)](#heterogeneous-3-model-ai-oracle-committee)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-lightgrey.svg)](contracts/AegisReliefEscrow.sol)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%20Strict-blue.svg)](tsconfig.json)
[![Status](https://img.shields.io/badge/Protocol%20Status-8K%20Enterprise%20Production-success.svg)](#)

- 🚀 [Live Production App (Instant Public Access)](https://cord-reports-phase-leasing.trycloudflare.com)

[🚀 Live Production App (Public HTTPS)](https://cord-reports-phase-leasing.trycloudflare.com) • [📜 Live Deployments](DEPLOYMENTS.md) • [🎬 Watch 3-Min Pitch Video](https://youtu.be/-5au4WG9sXw) • [📖 Architecture Spec](ARCHITECTURE.md) • [🔒 Security Model](SECURITY.md) • [🌐 Genesis Pilot](#genesis-pilot-ground--bangladesh)

</div>

---

### ⚡ Live Deployments & Tunnels
- 🚀 **Primary Live Dashboard**: https://cord-reports-phase-leasing.trycloudflare.com
- 🔄 **Backup Localtunnel**: https://curvy-shoes-tap.loca.lt
- ⛓️ **Polygon Amoy Escrow Contract**: `0x8A791620dd6260079BF849Dc5567aDC3F2Fdc318`

---

## 📌 The Problem: A $40 Billion Humanitarian Black Hole

Every year, over **\$100 Billion** in global humanitarian aid is dispatched to frontline catastrophe zones. Yet, investigative audits reveal that **30% to 40% of relief capital is lost before reaching victims**—swallowed by:
1. **Physical Paper Receipt Recycling**: Re-submitting identical receipts to multiple NGOs (*Double-Spending the Physical World*).
2. **Syndicate Cartel Price Gouging**: Emergency suppliers marking up coarse relief rice and trauma medicine by 200% to 500% during disaster panic.
3. **Digital Font Superimposition**: Forging printed totals and dot-matrix depot stamps with digital image editors.
4. **The Blockchain Oracle Blindspot**: Standard blockchains cannot read physical paper or gauge street-level flood chaos without centralized, corruptible human oracles.

**AegisRelief Sovereign** replaces blind institutional trust with **Autonomous Cryptographic Certainty**.

---

## 🎬 Official Video Demo & Studio Pitch (3 Minutes)

Click below to watch the complete 5-scene video pitch narrated with studio-grade neural voiceover (`en-US-ChristopherNeural`) demonstrating live fraud interception, heterogeneous multi-model quorum, and gasless settlement:

<div align="center">

[![AegisRelief Sovereign Video Pitch](docs/screenshots/01-mission-control-overview.png)](https://youtu.be/-5au4WG9sXw)

**▶ [Click to Watch Full Video Pitch on YouTube (https://youtu.be/-5au4WG9sXw)](https://youtu.be/-5au4WG9sXw)**  
*(Offline High-Definition MP4 copy available in repository at [`public/aegisrelief-demo.mp4`](public/aegisrelief-demo.mp4))*

</div>

---

## 📸 8K Mission Control Gallery

| 01. 8K Enterprise Mission Control Overview | 02. Authentic Relief Approved & Automated BDT Off-Ramp |
| :---: | :---: |
| ![Mission Control Overview](docs/screenshots/01-mission-control-overview.png) | ![Authentic Relief Approved](docs/screenshots/02-preset-a-authentic-approved.png) |
| **Full dashboard with clamped sparkline KPIs, 3-model oracle cards, and global jurisdiction selector** | **Preset A: Sylhet flood procurement verified (Score 96), $0 gas payout, ৳139,004 BDT credited** |

| 03. Syndicate Fraud Intercepted & Escrow Frozen | 04. Layer-3 SHA-256 Anti-Replay Guard |
| :---: | :---: |
| ![Syndicate Fraud Blocked](docs/screenshots/03-preset-b-syndicate-fraud-blocked.png) | ![Replay Attack Guard](docs/screenshots/04-preset-c-replay-attack-guard.png) |
| **Preset B: +208.7% Arial Bold price gouge caught by Nebius Llama-3.3; $0 disbursed, funds frozen** | **Preset C: Double-spend blocked via on-chain hash guard `isReceiptHashUsed[bytes32]`** |

| 05. Field Worker Controls & Satellite Telemetry | 06. Immutable On-Chain Forensic Ledger & CLI |
| :---: | :---: |
| ![Field Worker Telemetry](docs/screenshots/05-field-worker-portal-telemetry.png) | ![Forensic Ledger and CLI](docs/screenshots/06-on-chain-forensic-ledger.png) |
| **Dynamic Disaster Severity Multipliers (15% to 40%), camp tokens, and Sentinel-1 SAR Radar (0.884)** | **Permanent on-chain verified ledger records, real-time multi-agent CLI logs, and Tactical Globe** |

---

## 🏗️ Protocol Architecture & Flow

```mermaid
graph TB
    subgraph Physical_Field_Ground["1. Physical Reality Layer (Genesis Pilot: Bangladesh)"]
        FW[Relief Worker / Vendor] -->|Submits Thermal / Dot-Matrix Receipt| FWP[Field Worker Portal]
        zkPass[zkPass / World ID DID] -->|Biometric Identity Attestation| FWP
        SAR[Copernicus Sentinel-1 SAR] -->|0.884 Ground Radar Inundation Telemetry| FWP
    end

    subgraph AI_Committee["2. Heterogeneous 3-Model AI Committee"]
        FWP -->|Parallel Dispatch| OracleA["Oracle A: Google Gemini 2.5 Flash<br/>(Spatial Forensics & Sub-pixel Tamper Detection)"]
        FWP -->|Raw Document Parsing| OracleB["Oracle B: Hugging Face Donut OCR<br/>(naver-clova-ix/donut-base Tabular Parser)"]
        FWP -->|Commodity Cross-Matching| OracleC["Oracle C: Nebius AI Studio Llama-3.3-70B<br/>(Independent Economic Auditor vs Disaster Baseline)"]
    end

    subgraph Consensus_Engine["3. Cryptographic Quorum & Attestation Engine"]
        OracleA --> ConsensusLogic["Tri-Model Quorum Aggregator<br/>(Threshold: 2-of-3 Quorum | Trust Score >= 85)"]
        OracleB --> ConsensusLogic
        OracleC --> ConsensusLogic
        ConsensusLogic --> ECDSA["EIP-191 / EIP-712 ECDSA Multi-Signer<br/>(SHA-256 Fingerprint + Keccak256 Message Hash)"]
        ConsensusLogic --> IPFS["IPFS Content-Addressed Forensic Report Pinning<br/>(ipfs://bafybeih...)"]
    end

    subgraph Blockchain_Layer["4. EVM Escrow Protocol (Polygon Amoy / Base Sepolia)"]
        ECDSA --> Relayer["Invisible Web3 Gasless Relayer<br/>(ERC-4337 Paymaster Sponsor - $0 Worker Gas)"]
        Relayer --> SmartContract["AegisReliefEscrow.sol<br/>(UUPS Proxy + 48hr Timelock + Multi-Sig)"]
        SmartContract --> ReplayGuard{"Layer-3 SHA-256 Anti-Replay Guard<br/>isReceiptHashUsed[bytes32]?"}
        ReplayGuard -->|Duplicate Hash| REVERT["REVERT: Duplicate Receipt Replay Blocked"]
        ReplayGuard -->|New Unique Hash| SignatureVerification["ECDSA ecrecover(hash, v, r, s)<br/>Quorum Verified against Authorized Oracle Signers"]
    end

    subgraph Settlement_Layer["5. Dual Settlement & Local Off-Ramp"]
        SignatureVerification -->|Trust Score >= 85| DISBURSE["Disburse Vault Funds to Vendor Address (ETH / POL)"]
        DISBURSE --> FiatOffRamp["Automated BDT Fiat Off-Ramp<br/>(bKash / Nagad / City Bank MFS Instant Credit)"]
        SignatureVerification -->|Trust Score < 85| FREEZE["CORRUPTION INTERCEPTED<br/>Funds Frozen • Event Emitted On-Chain • Timelocked for DAO Review"]
    end
```

---

## ⚡ Syndicate Fraud Interception Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Syndicate as Fraud Syndicate (Cox's Bazar)
    actor Worker as Authentic Field Worker (Sylhet)
    participant FWP as AegisRelief Field Portal
    participant AI as Heterogeneous 3-Model AI Committee
    participant Relayer as Invisible Web3 Relayer (ERC-4337)
    participant Escrow as AegisReliefEscrow.sol
    participant MFS as BDT Fiat Off-Ramp (bKash/Nagad)

    Note over Worker,MFS: --- SCENARIO A: AUTHENTIC RELIEF CLAIM (TRUST SCORE 96) ---
    Worker->>FWP: Uploads Authentic Dot-Matrix Depot Invoice ($1,180 Rice & Trauma Kits)
    FWP->>AI: Dispatches to Gemini 2.5 + HF Donut + Nebius Llama-3.3
    AI-->>FWP: 3-of-3 Quorum Signed • Trust Score: 96 • 0.0% Variance
    FWP->>Relayer: Forwards EIP-191 ECDSA Signature Packet
    Relayer->>Escrow: executePayoutWithAttestation() (Gas sponsored by Paymaster)
    Escrow->>Escrow: Checks isReceiptHashUsed[bytes32] == false
    Escrow->>Escrow: ecrecover() verifies Oracle Signatures
    Escrow-->>Worker: Releases $1,180.00 USD in Escrow Collateral
    Escrow->>MFS: Triggers Webhook: Credits ৳139,004.00 BDT to Local Merchant
    Escrow-->>Escrow: Emits PayoutExecuted Event (Permanently Logged)

    Note over Syndicate,Escrow: --- SCENARIO B: +210% INFLATED FRAUD SYNDICATE (TRUST SCORE 18) ---
    Syndicate->>FWP: Uploads Forged Invoice ($3,860.00 with Arial Bold Overlay)
    FWP->>AI: Dispatches to 3 AI Models
    AI->>AI: Gemini 2.5 flags Arial Bold Font Overlay
    AI->>AI: Nebius Llama-3.3 flags +208.77% Markup vs Govt Baseline
    AI-->>FWP: Consensus VETO • Trust Score: 18 • Rejection Quorum
    FWP->>Relayer: Relays Fraud Evidence Packet
    Relayer->>Escrow: executePayoutWithAttestation()
    Escrow->>Escrow: Trust Score 18 < 85 Threshold
    Escrow-->>Syndicate: REJECTED: $0.00 Disbursed • Vault Capital Protected
    Escrow-->>Escrow: Emits FraudAttemptIntercepted Event • $3,860 Frozen in Escrow
```

---

## 🧠 Heterogeneous 3-Model AI Oracle Committee

AegisRelief avoids proprietary single-model bias by implementing an **off-chain 2-of-3 quorum** across distinct AI architectures:

| Model Node | Foundation & Provider | Specialization | Forensic Role |
| :--- | :--- | :--- | :--- |
| **Oracle A** | **Google Gemini 2.5 Flash** | Spatial Vision & Geometry | Analyzes optical ink degradation, mechanical ribbon strike consistency, sub-pixel tampering, and bounding-box coordinates. |
| **Oracle B** | **Hugging Face Inference API** (`naver-clova-ix/donut-base`) | End-to-End Document Transformer | Extracts unstructured thermal receipts into tabular JSON schemas without requiring brittle traditional OCR. |
| **Oracle C** | **Nebius AI Studio** (`meta-llama/Llama-3.3-70B-Instruct`) | Deep Economic Reasoning | Cross-references commodity unit prices against official disaster emergency ceiling tables with dynamic severity tolerance multipliers (15% to 40%). |

---

## 🛡️ Smart Contract Security & Cryptographic Proofs

### Layer-3 Anti-Replay Guard (`SHA-256`)
Physical invoices are canonicalized off-chain into unique SHA-256 hashes:
$$\text{receiptHash} = \text{SHA-256}(\text{Raw Receipt Bytes} \parallel \text{Vendor Address} \parallel \text{Jurisdiction ID})$$
When submitted to [`contracts/AegisReliefEscrow.sol`](contracts/AegisReliefEscrow.sol):
```solidity
if (isReceiptHashUsed[receiptHash]) {
    revert ReceiptAlreadyDisbursed(receiptHash);
}
isReceiptHashUsed[receiptHash] = true;
```

### Account Abstraction & ERC-4337
- **Frontline Gas Cost**: **$0.00**
- Field workers submit cryptographically signed meta-intents.
- The **Invisible Web3 Relayer** wraps the call with an ERC-4337 Paymaster, sponsoring on-chain transaction fees automatically.

---

## 🌐 Genesis Pilot Ground • Bangladesh

AegisRelief Sovereign chose **Bangladesh** as its Genesis Pilot Ground due to its acute frontline exposure to climate-induced disaster displacement:
- **`[SYL-01] Sylhet Flood Basin Grid`**: Rapid seasonal monsoon flash floods in the Surma-Kushiyara basin.
- **`[CTG-02] Cox's Bazar Coastal Cyclone Grid`**: High-density refugee settlements exposed to Bay of Bengal category-4 cyclones.

### Supported Global Humanitarian Corridors:
- **`[TUR-04] Antakya Earthquake Corridor`** (Turkey / Syria Axis)
- **`[UKR-01] Kherson Dnieper River Inundation`** (Eastern Europe)
- **`[AFG-03] Herat Crisis Relief Hub`** (Central Asia)

---

## 🚀 Quick Start & Local Reproduction

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm** or **pnpm**
- **Git**

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/fokrulanthro16-eng/aegisrelief-sovereign.git
cd aegisrelief-sovereign
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```
*(Optional: Add live keys for `GEMINI_API_KEY`, `NEBIUS_API_KEY`, and `HF_API_KEY`. If left empty, the protocol runs with deterministic, real ECDSA cryptographic fallbacks so the app works out-of-the-box with zero setup!)*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Vercel Production Cloud Deployment
Deploy to Vercel in 60 seconds with either method:

#### Option A: One-Click GitHub Import (Recommended)
1. Navigate to **[vercel.com/new](https://vercel.com/new)**.
2. Select and import **`fokrulanthro16-eng/aegisrelief-sovereign`**.
3. Under **Environment Variables**, paste the following keys:
   - `GEMINI_API_KEY`: *(Your Google Gemini Flash key)*
   - `NEBIUS_API_KEY`: *(Your Nebius AI Studio key)*
   - `HF_API_KEY`: *(Your Hugging Face Inference key)*
   - `NEXT_PUBLIC_RPC_URL`: `https://rpc-amoy.polygon.technology`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318`
   - `NEXT_PUBLIC_CHAIN_ID`: `80002`
4. Click **Deploy**. Vercel will automatically provision the edge network and build the Next.js App Router app.

#### Option B: Vercel CLI
```bash
# 1. Log in or supply personal access token
vercel login

# 2. Deploy to production
vercel --prod
```

### 5. Interactive In-App Features
- Click **`▶ Auto-Pilot Pitch (Voiceover)`** in the top header for an automated 5-scene guided tour with live teleprompter subtitles and neural voice narration!
- Test the 3 Judge Simulation Presets:
  - **Preset A**: Authentic Sylhet Relief (Score 96 • Payment Disbursed • BDT Off-Ramp)
  - **Preset B**: 210% Inflated Syndicate Invoice (Score 18 • Corruption Intercepted)
  - **Preset C**: Double-Spend Replay Attack (Layer-3 SHA-256 Guard engaged)
- Click **`⬇ Download Demo MP4`** to download the offline Ultra-HD demo video directly.

---

## 📦 Verified Smart Contract Deployments

| Component | Network | Contract Address | Explorer Link |
| :--- | :--- | :--- | :--- |
| **AegisReliefEscrow.sol** | Polygon Amoy (80002) | `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318` | [View on Polygonscan](https://amoy.polygonscan.com/address/0x8A791620dd6260079BF849Dc5567aDC3F2FdC318) |
| **Oracle A Signer** | Polygon Amoy / EVM | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | EIP-191 ECDSA Signer |
| **Oracle B Signer** | Polygon Amoy / EVM | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | EIP-191 ECDSA Signer |
| **Oracle C Signer** | Polygon Amoy / EVM | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | EIP-191 ECDSA Signer |
| **ERC-4337 Relayer** | Polygon Amoy / EVM | `0x7A3B9184B4b51A07E4f1d44B9E392942C5D14E2F` | Sponsored Gas Paymaster |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

<div align="center">
<b>AegisRelief Sovereign • Transforming Humanitarian Aid from Blind Trust into Cryptographic Certainty</b>
</div>
