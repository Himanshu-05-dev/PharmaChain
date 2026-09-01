/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCKS?: string | boolean;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_BACKEND_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
