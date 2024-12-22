/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_COOLIFY_URL: string
    // Add other env variables here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }