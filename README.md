# LandChain — Blockchain-Based Land Registry

LandChain is a transparent and secure decentralized platform for land registration, verification, and ownership transfer. Combining Ethereum Smart Contracts, React Frontend, MongoDB storage, AI-powered fraud detection, and automatic email confirmation — this project aims to solve the problem of land disputes in rural and urban areas with an immutable digital registry.

---

## 🔹 Project Structure

```
LandChain/
├── contracts/
├── client/
├── ml-models/
├── server/
├── README.md
```

---

## 🚀 Frontend Setup (React)

```
cd client
npm i
```

Create a `.env` file inside `client/`:
```bash
VITE_ADMIN_ID=ADMIN123
```

To start the development server:
```
npm run dev
```

---

## 🤖 Machine Learning Models Setup

### Anomaly Detection
```
cd ml-models
python app_anomaly.py
```
For eg, Visit: `http://127.0.0.1:5000`

---

### Land Valuation
```
cd ml-models
python app.py
```
For eg, Visit: `http://127.0.0.1:5001`

---

### Chatbot
```
cd ml-models
python chatbot.py
```

---

## 🚜 Smart Contract Deployment

1. Copy your Solidity contract:
```
LandRegistry.sol ➔ contracts/contracts/
```

2. Compile and Test on **Remix IDE**:
- Visit: https://remix.ethereum.org
- Create `LandRegistry.sol` and paste the contract code.
- Use Solidity Compiler `0.8.20` and compile.
- Deploy using **JavaScript VM** or **Injected Web3 (MetaMask)**.

### Contract Test Flow:
- `registerLand`: Admin registers land.
- `payForLand`: Owner pays valuation amount in ETH.
- `transferOwnership`: Owner can transfer to new address.
- `getLand`: Query land details.

---

## 🏠 Backend Setup (Express + MongoDB)

```
cd server
npm i
npm run dev
```

Make sure MongoDB is running locally or use MongoDB Atlas. Configure `.env` accordingly.

---

## 🤵 Team Members
- Sambit Mondal
- Arghadeep Goswami
- Arundhati Bera
- Basundhara Islam

---

## 📢 Summary
LandChain enables secure, fraud-proof, and transparent digital land ownership using Web3 technology. It empowers individuals, landowners, and authorities to eliminate disputes, reduce paperwork, and provide immutable property records with AI-driven fraud alerts.

---
