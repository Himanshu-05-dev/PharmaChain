# Medicine Authenticity System — Customer Mobile Application

## 1. Overview

The Customer Mobile Application is the public-facing medicine verification application.

Its primary purpose is to allow anyone to scan a medicine's unique QR code and determine whether the medicine has a valid manufacturer-issued identity and a legitimate transaction history.

The most important rule is:

> QR verification must work WITHOUT customer login.

Basic flow:

```text
Open App
   |
   v
Scan Medicine
   |
   v
Receive Verification Result
```

without creating an account.

## 2. Optional Customer Authentication

Google Sign-In is optional.

Login can unlock:

- Scan history.
- Saved medicines.
- Purchase-related records when supported.
- Expiry reminders.
- Personalized features.
- Notifications.
- Profile.

The core QR verification feature remains public.

## 3. Architecture

```text
                         GOOGLE
                            |
                    Google OAuth 2.0
                    / OpenID Connect
                            |
                            v
                 +----------------------+
                 |   Firebase Auth      |
                 | Google Sign-In       |
                 +----------+-----------+
                            |
                     Firebase ID Token
                            |
                            v
Customer Mobile ----------> API Gateway
                            |
                            v
                    Customer API
                       Stateless
                            |
                            v
                   Verification Service
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
          Database     Blockchain     Fraud Engine
```

Anonymous scanning:

```text
Customer
   |
   v
Scan QR
   |
   v
API Gateway
   |
   v
Customer Verification API
   |
   v
Verification Service
```

No authentication token is required for public verification.

## 4. Core Principle

The customer application is an untrusted client.

It must never decide:

```text
Genuine
Fake
Suspicious
Duplicate
Expired
Recalled
```

The backend returns the authoritative verification result.

## 5. Technology Stack

```text
React Native
Expo
TypeScript
Expo Router
Firebase Authentication
Google Sign-In
Axios
Zustand
Expo Camera
Expo Secure Store
Expo Haptics
Lucide React Native
```

## 6. Project Initialization

```bash
npx create-expo-app@latest customer-mobile
npx expo install expo-router expo-camera expo-secure-store expo-haptics
npm install firebase axios zustand lucide-react-native
```

## 7. Project Structure

```text
customer-mobile/

├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (public)/
│   │   ├── home.tsx
│   │   ├── scan.tsx
│   │   └── verification.tsx
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── loading.tsx
│   └── (customer)/
│       ├── _layout.tsx
│       ├── dashboard.tsx
│       ├── history.tsx
│       ├── saved.tsx
│       ├── reminders.tsx
│       └── profile.tsx
│
├── src/
│   ├── components/
│   ├── services/
│   │   ├── firebase/
│   │   │   └── config.ts
│   │   ├── auth/
│   │   │   └── googleAuth.ts
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── scan.ts
│   │   │   ├── verification.ts
│   │   │   └── customer.ts
│   │   └── storage/
│   ├── store/
│   │   ├── authStore.ts
│   │   └── customerStore.ts
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── constants/
│
├── assets/
├── app.json
├── package.json
└── tsconfig.json
```

## 8. Home Screen

The home screen should make scanning the primary action.

```text
+-------------------------------+
|       Medicine Verify         |
|                               |
| Check whether your medicine   |
| is authentic.                 |
|                               |
|       [ SCAN MEDICINE ]       |
|                               |
|       No login required       |
|                               |
|      Continue with Google     |
+-------------------------------+
```

## 9. Public QR Verification

The QR scanner must be accessible without authentication.

```text
Open App
   |
   v
Scan Medicine
   |
   v
Camera
   |
   v
Read QR
   |
   v
POST /api/v1/scan/customer
   |
   v
Verification Service
   |
   v
Result
```

## 10. QR Scanner

Use:

```text
expo-camera
```

Request camera permission only when needed.

If denied:

```text
Camera permission is required
to scan medicine QR codes.
```

## 11. Customer Scan API

```http
POST /api/v1/scan/customer
```

Request:

```json
{
  "qrData": "PACK-8F91A2C7"
}
```

Authentication:

```text
NOT REQUIRED
```

If the user is logged in, the backend may associate the scan with their account.

Authentication must never be required for verification.

## 12. Verification Flow

```text
QR
 |
 v
API Gateway
 |
 v
Customer API
 |
 v
Verification Service
 |
 +---- Blockchain
 |
 +---- Medicine Database
 |
 +---- Manufacturer Data
 |
 +---- Transaction History
 |
 +---- Fraud Engine
 |
 v
Final Verification Result
 |
 v
Customer Mobile
```

## 13. Authenticity Logic

Never implement:

```text
QR exists = genuine
```

and never implement:

```text
Database has transaction = fake
```

Legitimate medicines naturally have database records.

Instead:

```text
Blockchain Valid
+
Pack Identity Valid
+
Manufacturer Valid
+
Lifecycle Valid
+
Transaction History Valid
+
Fraud Analysis
=
Verification Result
```

## 14. Authentic Medicine

Example:

```text
+-------------------------------+
|       ✅ AUTHENTIC             |
|                               |
| Paracetamol 500mg             |
|                               |
| Manufacturer                  |
| ABC Pharmaceuticals           |
|                               |
| Batch                         |
| BATCH-2026-001                |
|                               |
| Manufactured                  |
| 19 Aug 2026                   |
|                               |
| Expiry                        |
| 18 Aug 2028                   |
|                               |
| Status                        |
| SOLD                          |
|                               |
| Shop                          |
| XYZ Medical Store             |
|                               |
| Sale Time                     |
| 19 Aug 2026, 15:30            |
+-------------------------------+
```

## 15. Verification Explanation

Prefer simple user-facing explanations:

```text
✓ Manufacturer verified
✓ Medicine identity verified
✓ Digital record verified
✓ Transaction history valid
```

Optional technical details:

```text
Pack ID
Batch ID
Hash
Blockchain Transaction
Verification Timestamp
```

## 16. Customer Scan Is Read-Only

Scanning a medicine must never modify its lifecycle.

Example:

```text
Medicine:
SOLD
```

Customer scans it 100 times:

```text
SOLD
```

Customer scans are verification requests, not transactions.

## 17. Suspicious Medicine

If the backend identifies suspicious activity:

```text
⚠️ SUSPICIOUS MEDICINE

This medicine identity appears to have
an unusual transaction history.

Possible reasons:

• QR copied
• QR reused
• Unexpected transaction
• Possible counterfeit
```

Do not claim "100% fake" unless the backend has a definitive basis.

Prefer:

```text
POSSIBLE COUNTERFEIT
```

or:

```text
UNABLE TO VERIFY
```

when appropriate.

## 18. QR Duplication Detection

Example:

```text
ORIGINAL
PACK-001
QR-001
   |
   v
Sold by Shop A
```

Copied:

```text
FAKE
PACK-001
QR-001
   |
   v
Appears again at Shop B
```

Backend:

```text
Transaction History
       |
       v
Fraud Engine
       |
       v
QR_DUPLICATION_SUSPECTED
```

Customer sees:

```text
🚨 POSSIBLE QR DUPLICATION

This QR identity appears to have
been reused or duplicated.

Do not rely on this medicine as verified.
```

## 19. Invalid QR

If the QR does not exist:

```text
❌ UNABLE TO VERIFY

This medicine identity could not be
found in the manufacturer's records.

Possible reasons:

• Invalid QR
• Fake product
• Damaged QR
• Unregistered product
• Incorrect scan
```

## 20. Expired Medicine

A genuine medicine can still be expired.

Therefore distinguish:

```text
⚠️ AUTHENTIC BUT EXPIRED
```

from:

```text
❌ FAKE
```

Example:

```text
The medicine is registered with the
manufacturer, but its expiry date
has passed.
```

## 21. Recalled Medicine

If the manufacturer has recalled the batch:

```text
🚨 MEDICINE RECALLED

This medicine belongs to a recalled batch.

Batch:
BATCH-2026-001
```

This is different from counterfeit status.

## 22. Verification States

Support:

```text
AUTHENTIC
AUTHENTIC_RECEIVED
AUTHENTIC_SOLD
AUTHENTIC_RETURNED
AUTHENTIC_AVAILABLE
SUSPICIOUS
QR_DUPLICATION_SUSPECTED
INVALID
EXPIRED
RECALLED
```

The backend determines the state.

## 23. Google Login

Login is optional.

Flow:

```text
Customer
   |
   v
Continue with Google
   |
   v
Google
   |
   v
Firebase Authentication
   |
   v
Firebase ID Token
   |
   v
Customer Mobile
   |
   v
Backend
   |
   v
Find/Create Customer
```

## 24. Firebase Authentication

Firebase handles:

```text
Google Identity
Firebase UID
Email
Display Name
Profile Image
Authentication State
```

The backend handles:

```text
Customer Role
Account Status
Customer Profile
Application Permissions
Application Data
```

## 25. Customer Login API

```http
POST /api/v1/auth/firebase
```

Request:

```json
{
  "firebaseIdToken": "..."
}
```

Backend:

```text
Verify Firebase Token
        |
        v
Get Firebase UID
        |
        v
Find Customer
        |
        +---- Exists
        |
        +---- Create
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "CUSTOMER-001",
    "firebaseUid": "firebase-uid",
    "role": "CUSTOMER"
  }
}
```

## 26. Stateless Authentication

The Customer API is stateless.

Do not use server-memory sessions.

```text
Firebase ID Token
       |
       v
Every Authenticated Request
       |
       v
API Gateway
       |
       v
Authentication Layer
       |
       v
Firebase UID
       |
       v
Database
```

## 27. API Gateway

The mobile application uses:

```env
EXPO_PUBLIC_API_URL=https://api.example.com
```

The app must never know internal service URLs.

```text
Customer Mobile
       |
       v
api.example.com
       |
       v
API Gateway
       |
       v
Customer API
       |
       v
Verification Service
```

## 28. Axios Client

Create:

```text
src/services/api/client.ts
```

Responsibilities:

- Base URL.
- Timeout.
- Error normalization.
- Firebase token injection for authenticated requests.
- Request cancellation.
- Safe retry handling.

Public verification requests do not require Authorization.

Authenticated requests use:

```http
Authorization: Bearer <firebase-id-token>
```

## 29. Optional Customer Features

After login:

```text
Scan History
Saved Medicines
Expiry Reminders
Profile
Notifications
Personalized Features
```

The core product remains:

```text
SCAN → VERIFY
```

## 30. Scan History

Authenticated customers may see:

```text
Scan History

19 Aug 2026
Paracetamol 500mg
✅ Authentic

18 Aug 2026
Vitamin D3
✅ Authentic

17 Aug 2026
Unknown Medicine
⚠️ Suspicious
```

Anonymous scans do not need to be stored permanently against a customer account.

## 31. Purchase History

Only show a purchase record if the backend has reliable evidence connecting the medicine transaction to that customer.

Do not assume:

```text
Customer scanned medicine
=
Customer purchased medicine
```

A scan is not proof of purchase.

## 32. Saved Medicines

Authenticated users may save medicines for convenience.

Saving a medicine must not affect authenticity verification.

## 33. Expiry Reminder

Optional:

```text
Paracetamol 500mg

Expires:
18 Aug 2028

[ Set Reminder ]
```

This is a convenience feature.

## 34. Report Suspicious Medicine

```http
POST /api/v1/reports/suspicious
```

Request:

```json
{
  "packId": "PACK-001",
  "reason": "QR_DUPLICATION_SUSPECTED",
  "notes": "QR appears to have been reused"
}
```

Backend automatically records:

```text
packId
timestamp
verification result
risk information
customerId if authenticated
```

## 35. Privacy

Anonymous verification should require no personal information.

Do not collect name, email, phone or location for basic scanning unless there is a clear requirement.

For authenticated features, collect only required information.

## 36. Offline Behavior

Live authenticity verification requires internet connectivity.

If unavailable:

```text
⚠️ VERIFICATION UNAVAILABLE

We could not contact the verification
server.

Please connect to the internet and
try again.

Do not assume this medicine is genuine
until verification succeeds.
```

Never claim authenticity using stale cached results.

## 37. Loading State

After scanning:

```text
Verifying medicine...
```

If the backend actually provides verification stages, the UI may show them. Otherwise keep the loading message simple.

## 38. Error Handling

Support:

```text
INVALID_QR
PACK_NOT_FOUND
BLOCKCHAIN_VERIFICATION_FAILED
MEDICINE_NOT_FOUND
NETWORK_ERROR
SERVER_ERROR
EXPIRED
RECALLED
SUSPICIOUS
QR_DUPLICATION_SUSPECTED
```

Use clear human-readable messages.

## 39. Security

Never include:

```text
Firebase Admin credentials
Database credentials
Blockchain private keys
Server secrets
Internal service URLs
```

The customer app must never access directly:

```text
Database
Blockchain
Fraud Engine
Manufacturer API
```

## 40. Recommended Screens

Public:

```text
Home
Scan
Verification Result
```

Authentication:

```text
Login
Authentication Loading
```

Authenticated:

```text
Dashboard
History
Saved Medicines
Reminders
Profile
```

## 41. Navigation

Anonymous:

```text
Home
Scan
Login
```

Authenticated:

```text
Home
Scan
History
Saved
Profile
```

## 42. Environment Variables

```env
EXPO_PUBLIC_API_URL=https://api.example.com
```

Development:

```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:8000
```

Never hard-code API URLs throughout the project.

## 43. Verification Result Type

```ts
type VerificationStatus =
  | "AUTHENTIC"
  | "AUTHENTIC_RECEIVED"
  | "AUTHENTIC_SOLD"
  | "AUTHENTIC_RETURNED"
  | "AUTHENTIC_AVAILABLE"
  | "SUSPICIOUS"
  | "QR_DUPLICATION_SUSPECTED"
  | "INVALID"
  | "EXPIRED"
  | "RECALLED";

interface VerificationResult {
  success: boolean;
  status: VerificationStatus;

  pack: {
    packId: string;
    medicineName: string;
    batchId: string;
    manufacturingDate: string;
    expiryDate: string;
  };

  manufacturer?: {
    name: string;
  };

  shop?: {
    name: string;
  };

  transaction?: {
    status: string;
    saleTime?: string;
  };

  risk?: {
    level: string;
    score?: number;
    qrDuplicationSuspected: boolean;
  };
}
```

## 44. Critical Business Rule

Never use:

```text
if databaseRecordExists:
    fake
```

Legitimate medicines will have database records.

Instead:

```text
Blockchain
+
Pack Identity
+
Manufacturer
+
Lifecycle
+
Transaction History
+
Fraud Detection
=
Verification Result
```

## 45. Customer Scan Does Not Create a Transaction

```text
Customer Scan
     |
     v
Verification Request
     |
     v
Read-only
```

It does not create:

```text
RECEIVED
SOLD
RETURNED
```

Only authorized backend operations can modify medicine lifecycle.

## 46. Rate Limiting

Because customer verification is public, the backend should implement:

```text
IP-based rate limit
Device-based abuse protection
QR-based abuse detection
API Gateway throttling
```

Handle:

```text
429 TOO MANY REQUESTS
```

with a clear message.

## 47. End-to-End Public Verification

```text
CUSTOMER
   |
   v
OPEN APP
   |
   v
SCAN QR
   |
   v
CUSTOMER API
   |
   v
API GATEWAY
   |
   v
VERIFICATION SERVICE
   |
   +---- BLOCKCHAIN
   |
   +---- DATABASE
   |
   +---- MANUFACTURER RECORD
   |
   +---- TRANSACTION HISTORY
   |
   +---- FRAUD ENGINE
   |
   v
FINAL RESULT
   |
   +---- AUTHENTIC
   +---- SUSPICIOUS
   +---- DUPLICATION
   +---- INVALID
   +---- EXPIRED
   +---- RECALLED
```

## 48. End-to-End Authenticated Flow

```text
CUSTOMER
   |
   v
Continue with Google
   |
   v
Google
   |
   v
Firebase Authentication
   |
   v
Firebase ID Token
   |
   v
Customer Mobile
   |
   v
API Gateway
   |
   v
Auth Service
   |
   v
Customer Account
   |
   v
Authenticated Features
```

## 49. Development Rules

1. Use Firebase Authentication for Google Sign-In.
2. Use Firebase Admin SDK only on the backend.
3. Never include Firebase Admin credentials in the mobile app.
4. QR verification must work without login.
5. Customer scanning is read-only.
6. Never change medicine status from the customer application.
7. Never determine authenticity locally.
8. Never connect directly to the database.
9. Never connect directly to blockchain.
10. Never trust cached authenticity results.
11. Use the API Gateway as the public backend entry point.
12. Keep backend APIs stateless.
13. Preserve customer privacy.
14. Use rate limiting for public verification APIs.
15. Support suspicious QR reporting.
16. Never treat database existence as proof of authenticity or counterfeit.
17. Distinguish expired/recalled medicines from counterfeit medicines.
18. Never claim a purchase based only on a scan.
19. Do not expose backend secrets.
20. Fail safely when live verification is unavailable.

## 50. Final Objective

The Customer Mobile Application is the public verification layer.

Its primary purpose is:

```text
OPEN APP
   |
   v
SCAN MEDICINE
   |
   v
VERIFY
   |
   v
UNDERSTAND RESULT
```

Optional:

```text
LOGIN WITH GOOGLE
        |
        v
PERSONAL FEATURES
```

The system allows anyone to verify a medicine without requiring an account while providing authenticated users with additional features.

The Main Platform remains the final authority for authenticity, transaction history and counterfeit detection.
