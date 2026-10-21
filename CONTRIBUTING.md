# Contributing to AegisRelief Sovereign

First off, thank you for considering contributing to **AegisRelief Sovereign**! We welcome open-source contributions from smart contract auditors, AI systems engineers, frontend developers, and humanitarian policy experts worldwide.

---

## 1. Code of Conduct

AegisRelief operates under the principle of radical transparency, respect, and global humanitarian alignment. We maintain a zero-tolerance policy for harassment or discrimination.

---

## 2. Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm** or **pnpm**
- **Python**: 3.10+ (for `edge-tts` voiceover generation if modifying audio pipelines)
- **Git**

### Installation Steps
```bash
# 1. Clone repository
git clone https://github.com/fokrulanthro16-eng/aegisrelief-sovereign.git
cd aegisrelief-sovereign

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the 8K Mission Control Dashboard.

---

## 3. Architecture & Code Style Guidelines

### 3.1. TypeScript & React
- Strict TypeScript mode (`"strict": true` in `tsconfig.json`) is strictly enforced.
- Follow Next.js 14 App Router patterns.
- Do NOT use mock empty functions (`// TODO` or `...` are forbidden in production code).

### 3.2. Tailwind CSS & Enterprise Dark Theme
- Follow the `#0B0F17` dark enterprise aesthetic.
- Avoid restrictive arbitrary container max-widths (`max-w-7xl` or `mx-auto` wrappers) on main dashboards to maintain full-width widescreen scaling.
- Always clamp SVGs and canvas graphs to avoid vector overflow.

### 3.3. Smart Contracts (Solidity)
- Target Solidity version `^0.8.24`.
- Maintain strict checks for reentrancy, integer bounds, and signature verification.
- Always include event emission for both approved payouts and intercepted fraud events.

---

## 4. Git Commit Message Guidelines

We follow the **Conventional Commits** specification:
- `feat:` A new feature or protocol capability
- `fix:` A bug fix or layout correction
- `docs:` Documentation changes or diagrams
- `perf:` Performance optimizations
- `test:` Adding or updating tests
- `chore:` Build scripts or dependency updates

*Example:*
```bash
git commit -m "feat(consensus): add 2-of-3 multi-oracle quorum validator for Llama-3.3-70B"
```

---

## 5. Pull Request Process

1. Fork the repository and create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Verify that there are zero TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```
3. Verify that the production build succeeds:
   ```bash
   npm run build
   ```
4. Push your branch and open a Pull Request against `main`. Provide a clear summary and screenshots of your changes.

---

## 6. Questions & Community

- **GitHub Issues**: For bug reports, feature requests, or technical inquiries.
- **Security Inquiries**: Email `security@aegisrelief.org`.
