# PharmaChain — Retail Chemist & POS Web Dashboard

A dedicated, enterprise-grade React web dashboard for retail pharmacists and chemists to manage counter dispensing, inbound delivery intake, stock inventory, and CDSCO recall enforcement with real-time Hyperledger Fabric cryptographic verification.

---

## 🌟 Key Capabilities & Features

1. **Counter Point of Sale (POS) & Dispenser**:
   - Web Camera / Barcode / 2D DataMatrix scanner support with fast manual serial/hash fallback.
   - Real-time cryptographic validation asserting `AT_SHOP` state before dispensing.
   - **Counterfeit & Double-Dispense Protection**: Audio/visual alarm and immediate rejection if a cloned QR or already-sold pack is scanned.
   - Instant GST E-Invoice with verifiable Blockchain Provenance stamp.

2. **Inbound Delivery Stock Intake**:
   - High-speed delivery receiving advancing pack custody from `MINTED` to `AT_SHOP`.
   - Manufacturer cryptographic manifest verification.
   - Duplicate delivery protection.

3. **Live Medicine Inventory Hub**:
   - Categorized stock tracking (Antibiotics, Gastrointestinal, Cardiovascular, etc.).
   - Low stock threshold indicators (<15 units).
   - Shelf expiry timeline warnings (<60 days).
   - CSV / Excel stock manifest export.

4. **Sales & Custody Audit Trail**:
   - Immutable log of all dispensed prescriptions with patient names, timestamps, and Fabric block numbers.
   - Reprintable thermal receipts.

5. **CDSCO Recall & Anti-Counterfeit Safety Center**:
   - Synchronized with CDSCO Form 28-A statutory notifications.
   - Automatic terminal barcode lock preventing any recalled pack from being sold.
   - Built-in counterfeit escalation reporting to State Drug Inspectors.

6. **State-of-the-Art Design Architecture**:
   - WCAG AAA compliant Obsidian Dark & Clean Light themes.
   - Redux Toolkit state management mirroring the manufacturer dashboard.
   - Seamless REST API proxy to `shopkeeper-service` on port `3002`.

---

## 🚀 Running the Dashboard

```bash
# Navigate to dashboard folder
cd Shopkeeper-DashBoard

# Install dependencies (already installed)
npm install

# Start local development server on port 5174
npm run dev

# Build for production
npm run build
```

---

## 🔑 Default Test Credentials

- **Pharmacy Account**: `chemist@medplus.in`
- **Password**: `password123`
- **License**: `DL-20-B-2023-88741` (CDSCO Form 20/21 Approved)
