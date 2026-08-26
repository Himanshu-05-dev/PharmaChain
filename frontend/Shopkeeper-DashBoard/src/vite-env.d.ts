/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPKEEPER_SERVER_URL?: string;
  readonly VITE_MANUFACTURER_SERVER_URL?: string;
  readonly VITE_PHARMA_CORE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
