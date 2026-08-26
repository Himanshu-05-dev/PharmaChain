# Medicine Authenticity System — Shopkeeper Mobile Application

## 1. Overview

The Shopkeeper Mobile Application is the authorized mobile application used by medical shops to interact with the Medicine Authenticity and Anti-Counterfeit System.

It allows an authorized shopkeeper to:

- Login using Google.
- Access their registered shop.
- Scan medicine QR codes.
- Verify medicine authenticity.
- Receive medicine into the shop.
- Sell medicine.
- Process legitimate medicine returns.
- Resell returned medicine when permitted.
- View medicine transaction history.
- View suspicious medicine alerts.
- Report suspicious or duplicated QR codes.
- View shop information and inventory.

The mobile application is **not responsible for determining whether a medicine is genuine or fake**. All security-sensitive decisions are made by the backend.

## 2. Core Principle

The mobile application is an untrusted client.

It must never independently decide:

- Whether a medicine is genuine or fake.
- Whether a QR code is duplicated.
- Whether a medicine can be sold or returned.
- Whether a medicine can be resold.
- Whether a shopkeeper is authorized.
- Whether a transaction is valid.

The backend is always the final authority.

## 3. High-Level Architecture

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
                 +----------------------+
                 | API Gateway / Proxy  |
                 | Reverse Proxy / LB   |
                 +----------+-----------+
                            |
                            v
                 +----------------------+
                 | Shopkeeper API       |
                 | Stateless            |
                 +----------+-----------+
                            |
                            v
                 +----------------------+
                 | Authentication /     |
                 | Authorization Layer  |
                 +----------+-----------+
                            |
                            v
                 +----------------------+
                 | Main Platform        |
                 | Services             |
                 +----------+-----------+
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
          Database     Blockchain     Fraud Engine
```

The mobile application communicates with the backend through HTTPS.

The mobile application must never directly communicate with:

- Database
- Blockchain
- Internal services
- Redis
- Manufacturer systems
- Other private backend services

## 4. Authentication Architecture

Authentication uses:

```text
Google
   |
   v
Firebase Authentication
   |
   v
Firebase ID Token
   |
   v
Shopkeeper Mobile
   |
   v
API Gateway
   |
   v
Backend verifies Firebase ID Token
```

Firebase is responsible for authentication.

The application's backend is responsible for:

- User authorization.
- Shopkeeper role.
- Shop association.
- License association.
- Permissions.
- Account status.

## 5. Important Authorization Rule

Google login does **not** automatically make a user a shopkeeper.

```text
Google Account
      |
      v
Firebase Authentication
      |
      v
Authenticated User
      |
      v
Backend Database
      |
      +-------------------+
      |                   |
      v                   v
Authorized Shopkeeper   Not Authorized
      |                   |
      v                   v
Shopkeeper Access       Access Denied
```

Example backend record:

```json
{
  "userId": "firebase-uid-123",
  "role": "SHOPKEEPER",
  "shopId": "SHOP-001",
  "licenseId": "LIC-12345",
  "status": "ACTIVE"
}
```

The role, shop, license and permissions must come from the backend.

Never trust the mobile client to provide these values.

## 6. Recommended Technology Stack

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

## 7. Project Initialization

```bash
npx create-expo-app@latest shopkeeper-mobile
npx expo install expo-router expo-camera expo-secure-store expo-haptics
npm install firebase axios zustand lucide-react-native
```

## 8. Project Structure

```text
shopkeeper-mobile/

├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── loading.tsx
│   └── (shopkeeper)/
│       ├── _layout.tsx
│       ├── dashboard.tsx
│       ├── scan.tsx
│       ├── verification.tsx
│       ├── inventory.tsx
│       ├── transactions.tsx
│       ├── returns.tsx
│       ├── alerts.tsx
│       ├── reports.tsx
│       ├── profile.tsx
│       └── medicine/
│           └── [packId].tsx
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
│   │   │   ├── inventory.ts
│   │   │   ├── transactions.ts
│   │   │   ├── returns.ts
│   │   │   └── reports.ts
│   │   └── storage/
│   │       └── secureStorage.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── shopStore.ts
│   │   └── inventoryStore.ts
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

## 9. Google Login Flow

```text
Shopkeeper
    |
    v
Continue with Google
    |
    v
Google Account
    |
    v
Firebase Authentication
    |
    v
Firebase User
    |
    v
Firebase ID Token
    |
    v
Shopkeeper Mobile
    |
    v
POST /api/v1/auth/firebase
    |
    v
API Gateway
    |
    v
Auth Service
    |
    v
Verify Firebase ID Token
    |
    v
Find Shopkeeper
    |
    v
Check Role + Shop + Status
    |
    v
Authenticated Session
```

## 10. Firebase Authentication

Configure Google as a sign-in provider in Firebase Authentication.

Firebase should provide identity information such as:

```text
firebaseUid
email
displayName
photoURL
provider
```

The backend determines:

```text
role
shopId
license
permissions
accountStatus
```

## 11. Firebase ID Token

After Google login:

```text
Firebase User
      |
      v
getIdToken()
      |
      v
Firebase ID Token
```

Send it using:

```http
Authorization: Bearer <firebase-id-token>
```

Do not use email, shopId, role or licenseId as authentication proof.

## 12. Backend Token Verification

Backend:

```text
Authorization Header
        |
        v
Extract Firebase ID Token
        |
        v
Firebase Admin SDK
        |
        v
Verify Token
        |
        v
Get Firebase UID
        |
        v
Find User
        |
        v
Check Role
        |
        v
Check Shop Status
```

Firebase Admin credentials must never be included in the mobile application.

## 13. Stateless Architecture

The Shopkeeper API must be stateless.

Do not create server-memory sessions:

```js
sessions[userId] = session;
```

Instead:

```text
Firebase ID Token
       |
       v
Every Request
       |
       v
API Gateway
       |
       v
Token Verification
       |
       v
User Identity
       |
       v
Database
```

Any API instance should be able to process any request.

## 14. API Gateway

The mobile app should use one API URL:

```env
EXPO_PUBLIC_API_URL=https://api.example.com
```

The app must not know:

```text
Database URL
Blockchain URL
Internal service URLs
Private API URLs
Redis URL
Manufacturer service URL
```

Example:

```text
Mobile
  |
  v
api.example.com
  |
  v
API Gateway
  |
  v
Shopkeeper API
  |
  v
Main Services
```

## 15. Axios API Client

Create:

```text
src/services/api/client.ts
```

Responsibilities:

- Base URL.
- Authorization header.
- Timeout.
- Error handling.
- Firebase token retrieval.
- Safe retry handling.
- Request cancellation.

Before an authenticated request:

```text
Firebase User
      |
      v
getIdToken()
      |
      v
Authorization: Bearer TOKEN
      |
      v
API
```

## 16. Authentication Persistence

Firebase maintains authenticated user state.

Do not store passwords.

Do not store Firebase private credentials.

Use:

```text
Expo SecureStore
```

for sensitive application data or application tokens that need local persistence.

## 17. Login API

```http
POST /api/v1/auth/firebase
```

Request:

```json
{
  "firebaseIdToken": "..."
}
```

Backend verifies the token and looks up the shopkeeper account.

Example response:

```json
{
  "success": true,
  "user": {
    "id": "USER-001",
    "firebaseUid": "firebase-uid",
    "role": "SHOPKEEPER",
    "shopId": "SHOP-001",
    "status": "ACTIVE"
  }
}
```

Unauthorized:

```json
{
  "success": false,
  "code": "SHOPKEEPER_NOT_AUTHORIZED"
}
```

## 18. QR Scanner

Use:

```text
expo-camera
```

Flow:

```text
Dashboard
    |
    v
Scan Medicine
    |
    v
Camera Permission
    |
    v
Scan QR
    |
    v
Extract QR Data
    |
    v
POST to backend
```

Do not validate medicine authenticity locally.

## 19. Scan API

```http
POST /api/v1/scan/shopkeeper
```

Request:

```json
{
  "qrData": "PACK-8F91A2C7"
}
```

Authentication:

```http
Authorization: Bearer <firebase-id-token>
```

The server determines:

```text
firebaseUid
shopkeeperId
shopId
role
permissions
```

from authenticated identity.

## 20. Verification Architecture

```text
QR
 |
 v
API Gateway
 |
 v
Shopkeeper API
 |
 v
Verification Service
 |
 +---- Blockchain
 |
 +---- Database
 |
 +---- Manufacturer Data
 |
 +---- Transaction History
 |
 +---- Fraud Engine
 |
 v
Verification Result
```

## 21. Authenticity Logic

Never implement:

```text
QR exists = genuine
QR already exists = fake
```

Instead:

```text
Blockchain Valid
+
Pack Exists
+
Pack Hash/Identity Valid
+
Manufacturer Valid
+
Lifecycle Valid
+
Transaction History Valid
+
Fraud Analysis
=
Final Result
```

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

## 23. Receiving Medicine

If a valid medicine has not been received by a shop:

```text
Manufacturer
     |
     v
Medicine Pack
     |
     v
Shopkeeper scans
     |
     v
Blockchain valid
     |
     v
No conflicting transaction
     |
     v
RECEIVED
```

API:

```http
POST /api/v1/transactions/receive
```

Request:

```json
{
  "packId": "PACK-001"
}
```

## 24. Selling Medicine

API:

```http
POST /api/v1/transactions/sell
```

Request:

```json
{
  "packId": "PACK-001"
}
```

Backend checks:

```text
Authenticated shopkeeper
        |
        v
Correct shop
        |
        v
Pack belongs to shop
        |
        v
Current lifecycle state
        |
        v
Sale allowed?
```

Valid transition:

```text
AVAILABLE
     |
     v
SOLD
```

## 25. Return Flow

API:

```http
POST /api/v1/transactions/return
```

Request:

```json
{
  "packId": "PACK-001",
  "reason": "CUSTOMER_RETURN"
}
```

Example:

```text
SOLD
 |
 v
RETURN REQUEST
 |
 v
SERVER VALIDATION
 |
 v
RETURNED
```

The mobile app must not directly modify status.

## 26. Reselling Returned Medicine

A returned medicine may become available again only when the backend determines that it is allowed.

Example:

```text
SOLD
 |
 v
RETURNED
 |
 v
INSPECTED
 |
 v
AVAILABLE
 |
 v
SOLD
```

The mobile app only requests the operation.

## 27. Transaction State Machine

Recommended lifecycle:

```text
MANUFACTURED
      |
      v
AVAILABLE
      |
      v
RECEIVED
      |
      v
SOLD
      |
      v
RETURNED
      |
      v
INSPECTED
      |
      v
AVAILABLE
```

Fraud status should be separate:

```text
NORMAL
  |
  v
SUSPICIOUS
  |
  v
UNDER_INVESTIGATION
```

## 28. Transaction History

Do not overwrite historical events.

Use append-only events.

Example:

```text
PACK-001

MANUFACTURED
RECEIVED - SHOP-001
SOLD - SHOP-001
RETURNED - SHOP-001
INSPECTED - SHOP-001
AVAILABLE - SHOP-001
SOLD - SHOP-001
```

A `currentStatus` field may exist for quick lookup, but historical events must remain available.

## 29. Idempotency

Important write operations should support idempotency:

```text
Receive
Sell
Return
Report
```

Client sends:

```http
Idempotency-Key: UUID
```

Example:

```text
Request 1
Idempotency-Key: abc123
     |
     v
SUCCESS

Network timeout

Request 2
Idempotency-Key: abc123
     |
     v
Return previous result
```

This prevents duplicate transactions.

## 30. Suspicious QR

If a QR has already been sold and appears again in an impossible or suspicious context:

```text
QR
 |
 v
Verification
 |
 v
Transaction history
 |
 v
Fraud Engine
 |
 v
QR_DUPLICATION_SUSPECTED
```

Display:

```text
🚨 POSSIBLE QR DUPLICATION

This medicine identity appears to have
been reused or duplicated.

Do not accept the medicine without
further verification.
```

The shopkeeper must not override the result.

## 31. QR Duplication Scenario

```text
Original Medicine
PACK-001
QR-001
      |
      v
Sold by Shop A

Someone copies QR-001
      |
      v
Fake Medicine
PACK-001
QR-001
      |
      v
Scanned by Shop B
```

The backend identifies conflicting transaction patterns.

The second scan should be flagged as suspicious.

## 32. Suspicious Report

```http
POST /api/v1/reports/suspicious
```

Request:

```json
{
  "packId": "PACK-001",
  "reason": "QR_DUPLICATION_SUSPECTED",
  "notes": "Same QR appeared on another package"
}
```

Backend automatically records:

```text
shopkeeperId
shopId
packId
timestamp
verification result
transaction history
risk information
```

## 33. Inventory

Inventory screen:

```text
Inventory

Available
Sold
Returned
Suspicious
```

Medicine card:

```text
Paracetamol 500mg

Batch:
BATCH-2026-001

Pack:
PACK-001

Expiry:
18 Aug 2028

Status:
AVAILABLE
```

## 34. Medicine Details

Show:

```text
Medicine
Paracetamol 500mg

Batch
BATCH-2026-001

Pack ID
PACK-001

Manufacturing Date
19 Aug 2026

Expiry Date
18 Aug 2028

Current Status
SOLD

Blockchain
Verified

Risk
LOW
```

## 35. Customer Scanning Must Not Change Status

Customer scans are read-only.

Customer scanning a sold medicine 100 times does not create 100 transactions.

## 36. Shop Profile

Show:

```text
Shop Name
Shop ID
License Number
Address
Owner
Contact
Verification Status
```

Sensitive shop/license information is controlled by the backend.

## 37. Offline Behavior

Authenticity verification requires live backend verification.

If offline:

```text
Unable to verify medicine.

Internet connection is required for
live authenticity verification.
```

Never show "probably genuine" from cached data.

## 38. Error Handling

Support:

```text
INVALID_QR
PACK_NOT_FOUND
BLOCKCHAIN_VERIFICATION_FAILED
UNAUTHORIZED
FORBIDDEN
SHOPKEEPER_NOT_AUTHORIZED
INVALID_LIFECYCLE
ALREADY_SOLD
RETURN_NOT_ALLOWED
QR_DUPLICATION_SUSPECTED
EXPIRED
RECALLED
NETWORK_ERROR
SERVER_ERROR
```

Use clear human-readable messages.

## 39. Security Rules

Never trust mobile input for:

```text
shopId
shopkeeperId
role
permissions
currentStatus
manufacturerId
transactionHistory
riskScore
verificationStatus
```

These must come from backend-controlled systems.

Never include in the mobile app:

```text
Firebase Admin credentials
Database credentials
Blockchain private keys
API secrets
```

## 40. Recommended Screens

Required:

```text
Splash
Login
Authentication Loading
Dashboard
QR Scanner
Verification Result
Medicine Details
Inventory
Transaction History
Returns
Alerts
Reports
Shop Profile
Settings
```

## 41. Navigation

Recommended:

```text
Dashboard
Inventory
Scan
Transactions
Profile
```

Dashboard should contain a prominent:

```text
SCAN MEDICINE
```

button.

## 42. Environment Variables

```env
EXPO_PUBLIC_API_URL=https://api.example.com
```

Development:

```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:8000
```

Do not hard-code backend URLs.

## 43. End-to-End Flow

```text
LOGIN
  |
  v
GOOGLE
  |
  v
FIREBASE AUTH
  |
  v
FIREBASE ID TOKEN
  |
  v
API GATEWAY
  |
  v
AUTH SERVICE
  |
  v
SHOPKEEPER AUTHORIZATION
  |
  v
DASHBOARD
  |
  v
SCAN MEDICINE
  |
  v
VERIFICATION SERVICE
  |
  +---- BLOCKCHAIN
  +---- DATABASE
  +---- TRANSACTION HISTORY
  +---- FRAUD ENGINE
  |
  v
RESULT
```

## 44. Development Rules

1. Use Firebase Authentication for Google Sign-In.
2. Use Firebase Admin SDK only on the backend.
3. Never put Firebase Admin credentials in the mobile app.
4. Google authentication does not automatically grant shopkeeper access.
5. Shopkeeper role must be verified by the backend.
6. API servers must remain stateless.
7. Use the API Gateway as the public backend entry point.
8. Never directly connect the mobile app to the database.
9. Never directly connect the mobile app to blockchain.
10. Never determine authenticity locally.
11. Customer scans must be read-only.
12. Use idempotency for important transaction APIs.
13. Preserve transaction history.
14. Validate all lifecycle transitions server-side.
15. Never trust client-provided shop identity.
16. Never use database existence alone to determine authenticity.
17. Detect QR duplication using transaction history and fraud analysis.
18. Require live server verification for authenticity.
19. Never expose backend secrets in the application.
20. Fail safely when verification is unavailable.
