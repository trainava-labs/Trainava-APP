# Trainava-APP
Trainava Dashboard APP

# 🚀 Trainava Web App

A decentralized, GPU-powered AI platform that lets users train, deploy, and monetize AI models—powered by Web3 and the $TRNV token.

Trainava bridges the gap between GPU providers and AI creators through an open marketplace where anyone can:
- Buy or rent GPU compute power
- Train image, voice, and text generation models
- Deploy AI models as Telegram bots
- Earn rewards in $TRNV for hosting and contributing compute

With a focus on accessibility, Trainava is built for non-coders and developers alike, offering an intuitive dashboard, no-code AI templates, wallet login support, and real-time deployment tools.

---
📁 Repository Structure
Based on the uploaded files, here's how you can structure your **Trainava Web App GitHub repository** with complete setup, code structure, and usage instructions. This will help others understand, contribute to, or fork your project.

---

## 📁 Repository Structure

```
trainava-web-app/
│
├── public/
│   └── index.html
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   │   └── UserContext.tsx
│   ├── hooks/
│   │   └── useWallet.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── web3.ts
│   │   └── gpu-api.ts
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── dashboard.tsx
│   │   ├── buy-gpu-power.tsx
│   │   ├── rent-gpu.tsx
│   │   ├── ai-templates.tsx
│   │   ├── build-ai.tsx
│   │   └── deploy-telegram.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   └── index.ts
│   └── main.jsx
│
├── .nvmrc
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🌐 Live Site

➡️ [https://dashboard.trainava.com](https://dashboard.trainava.com)

---

## 🧰 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: TailwindCSS, shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend**: Supabase (Auth, DB, RPC)
- **Auth**: Email & Web3 Wallet (via RainbowKit/Wagmi)
- **Language**: JavaScript (ES6+ / JSX)

---

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

### 3. Production Build

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

---

## 📁 Key Pages

| Page                  | Description                                   |
|-----------------------|-----------------------------------------------|
| `/`                   | Home page                                     |
| `/dashboard`          | User dashboard showing GPU and model stats    |
| `/buy-gpu-power`      | Purchase GPU compute time                     |
| `/rent-gpu`           | Marketplace to rent GPUs from other users     |
| `/ai-templates`       | Ready-to-use AI model templates               |
| `/build-ai`           | Build and train a custom AI assistant         |
| `/deploy-telegram`    | Deploy a trained model as a Telegram bot      |

---

## 🔐 Environment Setup

Make sure to configure your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_public_key
```

This enables user auth, real-time database updates, and RPC functions used in GPU training and deployment flows.

---

## 💳 Token System ($TRNV)

Trainava uses $TRNV as its native utility token. With $TRNV, you can:
- Rent GPU power
- Pay for training jobs
- Deploy Telegram bots
- Earn rewards as a GPU provider

All transactions are managed via Ethereum-compatible smart contracts.

---

## 🤖 Web3 Integration

- Login via RainbowKit & Wagmi
- Wallet-based session authentication
- Ethers.js used for interacting with smart contracts

Upon connection, the user wallet is linked with their Trainava profile and balances are synced.

---

## 📬 Support

For support or inquiries, contact:
📧 **support@trainava.com**  
💬 **[Telegram Group](https://t.me/Trainava_Labs)**

---

## 📄 License

MIT License – © 2025 Trainava Labs
