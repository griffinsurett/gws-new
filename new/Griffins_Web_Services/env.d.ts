/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_DOMAIN: string;
  readonly PUBLIC_FORMSPREE_ID?: string;
  readonly PUBLIC_GOOGLE_TRANSLATE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}