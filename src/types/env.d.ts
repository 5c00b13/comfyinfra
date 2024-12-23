/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COOLIFY_URL: string;
  readonly VITE_COOLIFY_EMAIL: string;
  readonly VITE_COOLIFY_PASSWORD: string;
  readonly VITE_CLAUDE_API_KEY: string;
  readonly VITE_POCKETBASE_URL: string;
  readonly VITE_API_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 