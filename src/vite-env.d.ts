/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_COOLIFY_URL: string
  readonly VITE_COOLIFY_EMAIL: string
  readonly VITE_COOLIFY_PASSWORD: string
  readonly VITE_POCKETBASE_URL: string
  readonly BASE_URL: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}