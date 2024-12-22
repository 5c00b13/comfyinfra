/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />
import 'vite/client'
interface ImportMetaEnv {
  readonly VITE_COOLIFY_URL: string
  readonly VITE_COOLIFY_EMAIL: string
  readonly VITE_COOLIFY_PASSWORD: string
} 