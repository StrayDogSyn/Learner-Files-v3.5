/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MARVEL_PUBLIC_KEY: string
  readonly MARVEL_PRIVATE_KEY: string
  readonly VITE_MARVEL_CACHE_DURATION: string
  readonly VITE_MOCK_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}