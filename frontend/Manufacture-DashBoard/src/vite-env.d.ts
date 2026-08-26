/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MANUFACTURER_ID: string;
  readonly VITE_FABRIC_CHANNEL: string;
  readonly VITE_CHAINCODE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
