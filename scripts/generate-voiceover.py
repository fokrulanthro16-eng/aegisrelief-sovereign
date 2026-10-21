import os
import subprocess
import asyncio
import edge_tts

SCENES = [
    {
        "id": 1,
        "name": "scene1",
        "text": "Every single year, billions of dollars in global humanitarian aid are deployed to frontline disaster zones. Yet, thirty to forty percent of relief capital is lost before reaching the ground—swallowed by phantom vouchers, cartel price-gouging, and paper-receipt tampering. Centralized databases cannot fix this, and standard blockchains cannot read the physical world. This is AegisRelief Sovereign—a zero-trust, stateless escrow protocol governed by an autonomous, heterogeneous multi-model AI consensus."
    },
    {
        "id": 2,
        "name": "scene2",
        "text": "AegisRelief completely eliminates single-point AI bias. Rather than trusting a single proprietary model, we enforce an on-chain 2-of-3 Multi-Oracle Quorum across three distinct AI foundations. Oracle A, Google Gemini 2.5 Flash, acts as our Vision and Spatial Forensic Specialist. Oracle B, Hugging Face Donut OCR, parses unstructured thermal receipts into deterministic JSON tables. And Oracle C, Nebius AI Studio running Llama-3.3-70B, serves as an independent economic auditor benchmarking commodities against disaster baselines. Unless two independent nodes sign off cryptographically, not a single dollar moves."
    },
    {
        "id": 3,
        "name": "scene3",
        "text": "Let's run a live audit from our Genesis Pilot Ground in Sylhet, Bangladesh. When an authentic field worker submits an emergency procurement invoice, all three models independently verify the document, reaching a trust score of 96. Instantly, our ERC-4337 Account Abstraction paymaster executes the settlement with zero gas cost to the worker. Simultaneously, the protocol triggers an automated fiat off-ramp, crediting the local merchant directly in BDT, while pinning the cryptographic forensic proof permanently to IPFS."
    },
    {
        "id": 4,
        "name": "scene4",
        "text": "Now, watch how the protocol dismantles an active fraud syndicate. Here, a coastal cartel in Cox's Bazar attempts to submit a tampered invoice, gouging coarse relief rice by over 200 percent. While the visual scanner confirms the paper receipt is physical, Nebius AI detects that prices violate our disaster tolerance threshold and vetoes the transaction. Multi-oracle consensus fails. The trust score collapses, the escrow locks down automatically, vendor payout is frozen at zero dollars, and the fraud attempt is permanently sealed on-chain."
    },
    {
        "id": 5,
        "name": "scene5",
        "text": "Beyond model consensus, AegisRelief implements complete defense-in-depth: Layer-3 Anti-Replay Guards hash every physical invoice with SHA-256 to block double-spend attacks, Sentinel-1 Satellite SAR Telemetry corroborates real-time flood indices, and zkPass Zero-Knowledge DIDs authenticate field officers. Deployed in Bangladesh as our Genesis Pilot Ground and engineered for global scale, AegisRelief Sovereign transforms humanitarian relief from blind trust into cryptographic certainty. Thank you."
    }
]

VOICE = "en-US-ChristopherNeural"

async def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    audio_dir = os.path.join(base_dir, "public", "audio")
    os.makedirs(audio_dir, exist_ok=True)
    
    print(f"Generating studio-grade neural voiceover for 5 scenes with voice: {VOICE}...")
    
    scene_files = []
    durations = {}
    
    for scene in SCENES:
        out_path = os.path.join(audio_dir, f"{scene['name']}.mp3")
        communicate = edge_tts.Communicate(scene["text"], VOICE, rate="+3%", pitch="+0Hz")
        await communicate.save(out_path)
        print(f"  [+] Saved {scene['name']}.mp3")
        scene_files.append(out_path)
        
    print("\nAll 5 scene audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
