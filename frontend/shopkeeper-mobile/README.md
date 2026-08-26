# MediaCare — Shopkeeper Mobile Application

The **MediaCare Shopkeeper Mobile Application** is the authorized mobile client designed for licensed medical shops, pharmacies, and inventory managers. Built with **React Native (Expo SDK 54)** and **Expo Router**, it interfaces with the **Medicine Authenticity & Anti-Counterfeit Verification System** to perform high-speed QR verification, record legitimate supply chain transitions (Receiving, Selling, Returning), manage shop inventory, and prevent counterfeit pharmaceuticals from entering the retail market.

---

## 1. Executive Summary & Core Rules

1. **Zero-Trust Client Principle**: The mobile application is an untrusted client. It never independently decides whether a medicine is genuine or fake. All cryptographic verifications, blockchain proofs, supply chain state transitions, and fraud detection rules are calculated exclusively on the backend server.
2. **Authorized Supply Chain Operations**: Authorized shopkeepers can transition medicine lifecycles (`Receive Stock` from distributors, `Sell Medicine` to consumers, `Process Returns` for damaged/returned goods).
3. **Idempotency on Write Operations**: Critical transaction APIs (`receive`, `sell`, `return`) support `Idempotency-Key` headers to guarantee duplicate network requests never generate duplicate ledger transactions.
4. **Public & Guest Scanner Access**: The app includes a public guest scanner (`/public-scan`) allowing walk-in customers or guests to scan medicines and review instant authenticity scores without logging into a shopkeeper account.

---

## 2. Current Implementation Status Matrix

| Module / Screen | File Path | Status | Key Implemented Features |
| :--- | :--- | :---: | :--- |
| **Root Layout & Auth Guard** | `app/_layout.tsx` | 🟢 Complete | Automatic session check, route protection guards, stack routing |
| **Initial Redirect** | `app/index.tsx` | 🟢 Complete | Automatic router redirect based on authentication state |
| **Shopkeeper Login Screen** | `app/(auth)/login.tsx` | 🟢 Complete | Shopkeeper demo login with animated loading indicators |
| **Public / Guest Scanner** | `app/public-scan.tsx` | 🟢 Complete | `expo-camera` optical scanning, frame guidelines, haptic vibration |
| **Verification Result Modal** | `app/verification.tsx` | 🟢 Complete | Trust Score gauge, full medicine specifications, risk breakdowns |
| **Shopkeeper Tabs Layout** | `app/(shopkeeper)/_layout.tsx`| 🟢 Complete | 5-tab bar with customized icons, badges, and active tints |
| **Shopkeeper Dashboard** | `app/(shopkeeper)/dashboard.tsx`| 🟢 Complete | Safe area padding, Quick Stats (Verified, Suspicious, Counterfeit), Scan hero banner, Recent scans feed |
| **Authenticated QR Scanner** | `app/(shopkeeper)/scan.tsx` | 🟢 Complete | High-performance camera scanner for inventory and sales operations |
| **Transaction Management** | `app/(shopkeeper)/transactions.tsx`| 🟢 Complete | Tabbed operations (`Receive`, `Sell`, `Return`), batch IDs, status badges |
| **Shop Inventory** | `app/(shopkeeper)/inventory.tsx`| 🟢 Complete | Stock inventory overview with status categorization |
| **Shop Profile & Settings** | `app/(shopkeeper)/profile.tsx` | 🟢 Complete | Editable store name, license ID display, address, and secure sign-out |
| **Zustand Auth Store** | `src/store/authStore.ts` | 🟢 Complete | Global state with `User` data, `login`, `logout`, `updateUser`, and `checkAuth` |
| **Hardware Secure Storage** | `src/services/storage/secureStorage.ts`| 🟢 Complete | `expo-secure-store` wrapper for hardware-level token & user data encryption |
| **Axios API Client** | `src/services/api/client.ts` | 🟢 Complete | Axios instance with auth interceptor pipeline & base URL configuration |
| **Auth API Service** | `src/services/api/auth.ts` | 🟢 Complete | Endpoint helper for token verification & shopkeeper account lookup |
| **Scan API Service** | `src/services/api/scan.ts` | 🟢 Complete | Real-time QR payload verification service |
| **Transactions API Service** | `src/services/api/transactions.ts`| 🟢 Complete | Idempotent API calls for `receive`, `sell`, and `return` operations |

---

## 3. High-Level Architecture

```text
┌────────────────────────────────────────────────────────┐
│               Shopkeeper Mobile App                    │
│      (React Native + Expo Router + Zustand)            │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS Request (with Bearer Token / Cookies)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Backend API Server                   │
│      - Auth Middleware & Shopkeeper Role Verification  │
│      - Verification Engine & Fraud Detector            │
│      - Supply Chain State Machine                      │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    ┌─────────────────┐         ┌─────────────────┐
    │  MongoDB Store  │         │   Blockchain    │
    │ (Shop Inventory)│         │(Provenance Log) │
    └─────────────────┘         └─────────────────┘
```

---

## 4. Complete Project Directory Structure

```text
shopkeeper-mobile/
├── app/
│   ├── _layout.tsx                 # Root layout & auth state guard
│   ├── index.tsx                   # Entry redirect router
│   ├── public-scan.tsx             # Guest / public QR scanner screen
│   ├── verification.tsx            # Verification result modal
│   ├── (auth)/
│   │   └── login.tsx               # Shopkeeper login & demo authentication
│   └── (shopkeeper)/
│       ├── _layout.tsx             # Bottom tab navigation bar
│       ├── dashboard.tsx           # Home dashboard with stats & quick actions
│       ├── scan.tsx                # Authenticated shopkeeper QR scanner
│       ├── transactions.tsx        # Transaction history & supply chain actions
│       ├── inventory.tsx           # Shop inventory overview
│       └── profile.tsx             # Shop profile & license settings
│
├── src/
│   ├── components/                 # Reusable UI components & modals
│   ├── constants/                  # Colors, typography, theme tokens
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts           # Axios HTTP client with interceptors
│   │   │   ├── auth.ts             # Auth service endpoints
│   │   │   ├── scan.ts             # Scan verification API calls
│   │   │   └── transactions.ts     # Receive, Sell, and Return endpoints
│   │   └── storage/
│   │       └── secureStorage.ts    # Hardware Keychain / KeyStore wrapper
│   ├── store/
│   │   └── authStore.ts            # Zustand global authentication state
│   ├── types/                      # TypeScript definitions & data models
│   └── utils/                      # Helper formatting & date utilities
│
├── api_requirements_shopkeeper     # Backend REST API specification & contract
├── app.json                        # Expo application configuration
├── package.json                    # Dependencies & npm scripts
└── tsconfig.json                   # TypeScript compiler configuration
```

---

## 5. Navigation & Screen Flow Diagram

```text
                                  ┌───────────────┐
                                  │   App Launch  │
                                  └───────┬───────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
          [ Not Authenticated ]                          [ Authenticated ]
                    │                                           │
          ┌─────────┴─────────┐                                 ▼
          ▼                   ▼                   ┌───────────────────────────┐
┌───────────────────┐ ┌───────────────┐           │   (shopkeeper) Tab Stack  │
│  (auth)/login     │ │  public-scan  │           ├───────────────────────────┤
└─────────┬─────────┘ └───────┬───────┘           │ • Dashboard (dashboard)   │
          │                   │                   │ • Scan Medicine (scan)    │
          │ (Login Success)   │ (Scan Finished)   │ • Transactions (txns)     │
          ▼                   ▼                   │ • Inventory (inventory)   │
┌───────────────────┐ ┌───────────────┐           │ • Profile (profile)       │
│    (shopkeeper)   │ │ verification  │           └───────────────────────────┘
│     Dashboard     │ │ Result Modal  │
└───────────────────┘ └───────────────┘
```

---

## 6. Supply Chain State Machine & Lifecycle Transitions

The system manages physical medicine packages through an immutable lifecycle:

```text
MANUFACTURED
     │
     ▼
 AVAILABLE (Factory / Distributor)
     │
     ▼
 RECEIVED  (Shopkeeper logs stock into store)
     │
     ▼
   SOLD    (Shopkeeper registers customer purchase)
     │
     ▼
 RETURNED  (Customer returns medication to pharmacy)
     │
     ▼
INSPECTED  (Pharmacist inspects packaging & integrity)
     │
     ▼
 AVAILABLE (Returned to shelf if permitted by policy)
```

### Verification States:
- **`AUTHENTIC`**: Cryptographically valid, clean provenance history, safe for sale/use.
- **`AUTHENTIC_RECEIVED`**: Valid batch currently in shop stock.
- **`AUTHENTIC_SOLD`**: Legitimate batch previously marked as sold.
- **`SUSPICIOUS`**: Pack ID scanned across impossible geographic locations or abnormal frequencies.
- **`QR_DUPLICATION_SUSPECTED`**: Duplicate QR code actively identified in multiple distinct pharmacies.
- **`EXPIRED`**: Genuine product whose manufacturer expiry date has passed.
- **`RECALLED`**: Manufacturer-issued batch safety recall.

---

## 7. Global State Management & Storage

### 1. `authStore.ts` (Zustand)
```typescript
export interface User {
  id: string;
  firebaseUid: string;
  role: string;
  shopId: string;
  status: string;
  email?: string;
  displayName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
```

### 2. `secureStorage.ts` (Expo SecureStore)
- Encrypts user credentials and tokens inside **iOS Keychain** and **Android KeyStore** (hardware-backed TEE / Secure Enclave).
- Persistent across app relaunches and completely inaccessible to other third-party applications.

---

## 8. Technology Stack & Dependencies

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React Native** | `0.81.5` | Native cross-platform UI framework |
| **Expo SDK** | `~54.0.0` | Application toolchain & managed runtime |
| **Expo Router** | `~6.0.24` | File-based typed routing & navigation stacks |
| **React** | `19.1.0` | Core UI component engine |
| **TypeScript** | `~6.0.3` | Static type safety |
| **Zustand** | `^5.0.15` | Fast, reactive state management |
| **Axios** | `^1.19.0` | HTTP client with interceptor pipeline |
| **Expo Camera** | `~17.0.10` | High-speed optical QR and barcode recognition |
| **Expo SecureStore** | `~15.0.8` | Hardware-backed encrypted local storage |
| **Expo Haptics** | `~15.0.8` | Tactile vibration feedback on scans |
| **Lucide React Native** | `^1.33.0` | Vector icons for medical and navigation UI |

---

## 9. Getting Started & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on iOS/Android or a connected Android/iOS Emulator

### Step-by-Step Run Guide

```bash
# 1. Navigate into shopkeeper-mobile
cd d:/Hackathon/MediaCare/shopkeeper-mobile

# 2. Install dependencies
npm install

# 3. Start Expo development server with clean cache
npx expo start -c
```

### Device Testing:
- **Physical Phone**: Scan the terminal QR code using **Expo Go** (Android) or the Camera app (iOS).
- **Android Emulator**: Press `a` in the terminal.
- **iOS Simulator**: Press `i` in the terminal.
- **Web Preview**: Press `w` in the terminal.

---

## 10. Environment Variables

Create a `.env` file in the root of `shopkeeper-mobile`:

```env
# URL pointing to your backend REST API server
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
```
