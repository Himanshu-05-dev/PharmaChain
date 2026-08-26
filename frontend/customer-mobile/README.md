# MediaCare — Customer Mobile Application

The **MediaCare Customer Mobile Application** is the public-facing medicine verification, trust assessment, and counterfeit reporting mobile platform. Built with **React Native (Expo SDK 54)** and **Expo Router**, it empowers patients, consumers, and healthcare shoppers to verify medicine authenticity instantly, review full batch and supply chain histories, report suspicious/fake medications, and manage personal scan records.

---

## 1. Executive Summary & Core Rules

1. **Zero-Login Public Verification**: Any user can scan and verify any medicine instantly without creating an account or logging in.
2. **Untrusted Client Architecture**: The mobile application never determines whether a medicine is genuine or fake locally. All verification logic, cryptographic blockchain proofs, and fraud pattern detections are calculated by the backend verification engine.
3. **Read-Only Consumer Scanning**: Consumer scans verify authenticity without altering the medicine's supply chain lifecycle state (i.e. scanning a medicine 100 times does not create 100 sales).
4. **Multi-State Fraud & Risk Evaluation**: Distinguishes between **Authentic**, **Suspicious**, **QR Duplication Suspected**, **Expired**, and **Recalled** medications.

---

## 2. Current Implementation Status Matrix

| Module / Screen | File Path | Status | Key Implemented Features |
| :--- | :--- | :---: | :--- |
| **Root Layout & Guards** | `app/_layout.tsx` | 🟢 Complete | `SafeAreaProvider`, route protection, auth state routing |
| **Initial Redirect** | `app/index.tsx` | 🟢 Complete | Automatic redirect to `/(public)/home` |
| **Public Landing Screen** | `app/(public)/home.tsx` | 🟢 Complete | "Scan Medicine Now" hero button + Quick Google Demo Login |
| **Public Camera Scanner** | `app/(public)/scan.tsx` | 🟢 Complete | Camera permission handling, barcode/QR viewfinder, frame overlay |
| **Public Verification Modal** | `app/(public)/verification.tsx` | 🟢 Complete | Instant trust score modal with batch specifications |
| **Authenticated Tabs Layout**| `app/(tabs)/_layout.tsx` | 🟢 Complete | 5-tab navigation with floating central scan button & custom active tint |
| **Home Customer Dashboard** | `app/(tabs)/index.tsx` | 🟢 Complete | Camera notch safe area insets, quick stats (12 Verified, 2 Suspicious, 1 Counterfeit), Scan card, Recent Scans list |
| **Medicine Scan History** | `app/(tabs)/history.tsx` | 🟢 Complete | Category filter tabs (`All`, `Verified`, `Suspicious`, `Counterfeit`), detailed item cards, navigation to results |
| **In-App QR Scanner** | `app/(tabs)/scan.tsx` | 🟢 Complete | Real-time `expo-camera` barcode scanning, target viewfinder |
| **Counterfeit Reports Log** | `app/(tabs)/reports.tsx` | 🟢 Complete | User-submitted reports list with status badges (`Pending`, `Reviewed`, `Resolved`), empty state handling |
| **User Profile & Settings** | `app/(tabs)/profile.tsx` | 🟢 Complete | Editable Name & Email, avatar initial badge, Save Changes, fail-safe Sign Out |
| **Detailed Scan Result** | `app/scan-result.tsx` | 🟢 Complete | Authenticity Trust Score (96/100 or 42/100), full specs (Mfg, Batch, Expiry, Pack ID), Risk reasons breakdown, "Report Medicine" trigger |
| **Counterfeit Report Form** | `app/report.tsx` | 🟢 Complete | Evidence upload grid (Photo, Invoice, QR, Other), description input, pharmacy/seller name, purchase date & location |
| **Auth State Management** | `src/store/authStore.ts` | 🟢 Complete | Zustand store with `user`, `isAuthenticated`, `setAuth`, and `logout` |
| **Report State Store** | `src/store/reportStore.ts` | 🟢 Complete | Persistent Zustand store for user-submitted counterfeit reports |
| **Customer Store** | `src/store/customerStore.ts`| 🟢 Complete | Customer preferences & cached session management |
| **Axios API Client** | `src/services/api/client.ts` | 🟢 Complete | Centralized Axios instance with base URL & auth interceptor |
| **Firebase Configuration** | `src/config/firebase.ts` | 🟢 Complete | Firebase App & Auth with AsyncStorage persistence support |

---

## 3. High-Level Architecture

```text
┌────────────────────────────────────────────────────────┐
│               Customer Mobile App                      │
│     (React Native + Expo Router + Zustand)             │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS (Public Scan or Authenticated Token)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Backend API Server                   │
│      - Public QR Verification Engine                   │
│      - Fraud & QR Duplication Analysis Engine          │
│      - User Profile & Reports Database                 │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    ┌─────────────────┐         ┌─────────────────┐
    │  MongoDB Store  │         │   Blockchain    │
    │  (App Records)  │         │ (Authenticity)  │
    └─────────────────┘         └─────────────────┘
```

---

## 4. Complete Project Directory Structure

```text
customer-mobile/
├── app/
│   ├── _layout.tsx                 # Root layout with SafeAreaProvider & navigation stack
│   ├── index.tsx                   # Entry point (redirects to /(public)/home)
│   ├── scan-result.tsx             # Full scan result with Trust Score & Risk Breakdown
│   ├── report.tsx                  # Suspicious medicine evidence submission form
│   │
│   ├── (public)/                   # Public / Unauthenticated Routes
│   │   ├── _layout.tsx             # Public stack layout
│   │   ├── home.tsx                # Welcome landing screen (Scan hero + Login)
│   │   ├── scan.tsx                # Public guest QR scanner
│   │   └── verification.tsx        # Public verification modal
│   │
│   └── (tabs)/                     # Authenticated Customer Tab Navigator
│       ├── _layout.tsx             # Bottom tab bar configuration
│       ├── index.tsx               # Customer home dashboard with stats & recent scans
│       ├── history.tsx             # Filterable medicine scan history screen
│       ├── scan.tsx                # Authenticated QR barcode camera scanner
│       ├── reports.tsx             # Track submitted counterfeit reports
│       └── profile.tsx             # User profile, display name, email & logout
│
├── src/
│   ├── config/
│   │   └── firebase.ts             # Firebase Auth initialization & persistence
│   ├── services/
│   │   └── api/
│   │       └── client.ts           # Axios HTTP client instance & API helpers
│   ├── store/
│   │   ├── authStore.ts            # Global user authentication & logout state
│   │   ├── reportStore.ts          # Zustand store for user-submitted reports
│   │   └── customerStore.ts        # Customer preferences state
│   └── types/                      # TypeScript definitions & data models
│
├── assets/                         # Application icons, splash screens, and images
├── app.json                        # Expo configuration & scheme registration
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
                                          ▼
                               ┌─────────────────────┐
                               │   (public)/home     │
                               └──────────┬──────────┘
                                          │
                     ┌────────────────────┴────────────────────┐
                     ▼                                         ▼
            [ Scan Medicine Now ]                    [ Continue with Google ]
                     │                                         │
                     ▼                                         ▼
          ┌─────────────────────┐                   ┌─────────────────────┐
          │   (public)/scan     │                   │  (tabs) Dashboard   │
          └──────────┬──────────┘                   └──────────┬──────────┘
                     │ (QR Scanned)                            │
                     ▼                                         ├── History (history)
          ┌─────────────────────┐                              ├── Scan (scan)
          │     scan-result     │                              ├── Reports (reports)
          └──────────┬──────────┘                              └── Profile (profile)
                     │ (If Suspicious / Report)
                     ▼
          ┌─────────────────────┐
          │     /report Form    │
          └─────────────────────┘
```

---

## 6. Verification Logic & State Machine

The verification engine evaluates the scanned QR code against multiple criteria:

```text
Blockchain Cryptographic Proof
+
Pack Identity Verification
+
Manufacturer Registry Check
+
Supply Chain Lifecycle Validity
+
Transaction Pattern & Geolocation History
+
Fraud Anomaly & Duplication Detection
=
Final Authenticity Evaluation Result
```

### Verification States:
1. **`AUTHENTIC` / `Verified`**: Manufacturer verified, blockchain valid, digital record clean, safe for consumption. (Trust Score: ~96/100).
2. **`SUSPICIOUS`**: Pack scanned across impossible locations, supply chain mismatch, or unusual frequency. (Trust Score: ~42/100).
3. **`QR_DUPLICATION_SUSPECTED` / `Counterfeit`**: Duplicate QR code detected in multiple retail outlets simultaneously.
4. **`EXPIRED`**: Genuine medicine whose manufacturer expiry date has passed.
5. **`RECALLED`**: Genuine medicine flagged by manufacturer for safety recall.
6. **`INVALID`**: QR code not found in manufacturer cryptographic registry.

---

## 7. Global State Management (Zustand)

### 1. `authStore.ts`
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setAuth: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}
```
- **Usage**: Controls customer login status and handles clean sign-out back to the public screen.

### 2. `reportStore.ts`
```typescript
interface Report {
  id: string;
  medicineName: string;
  description: string;
  date: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
}
```
- **Usage**: Persists consumer-submitted counterfeit reports across the session for real-time tracking in the **Reports** tab.

---

## 8. Technology Stack & Dependencies

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React Native** | `0.81.5` | Cross-platform native mobile foundation |
| **Expo SDK** | `~54.0.8` | Managed runtime and development toolchain |
| **Expo Router** | `~6.0.24` | File-based typed routing & stack management |
| **TypeScript** | `~5.9.2` | Static typing and interface contracts |
| **Zustand** | `^5.0.15` | Fast, reactive state management |
| **Axios** | `^1.19.0` | HTTP client with request interceptors |
| **Expo Camera** | `~17.0.10` | Real-time QR and barcode optical recognition |
| **React Native Safe Area Context**| `~5.6.0` | Dynamic camera notch and status bar spacing |
| **Lucide React Native** | `^1.33.0` | Medical and UI vector iconography |

---

## 9. Getting Started & Running Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on iOS/Android or an Android Emulator / iOS Simulator

### Step-by-Step Run Guide

```bash
# 1. Navigate into customer-mobile
cd d:/Hackathon/MediaCare/customer-mobile

# 2. Install dependencies
npm install

# 3. Start Expo development server with clean cache
npx expo start -c
```

### Device Testing:
- **Physical Device**: Scan the terminal QR code using **Expo Go** (Android) or Camera (iOS).
- **Android Emulator**: Press `a` in the terminal.
- **iOS Simulator**: Press `i` in the terminal.
- **Web Browser**: Press `w` in the terminal.

---

## 10. Environment Variables

Create a `.env` file in the root of `customer-mobile`:

```env
# Backend REST API Endpoint
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000

# Google OAuth Web Client ID
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=322850796310-d0ch9gdql5k7icslm75ip0soufbgisdj.apps.googleusercontent.com
```
