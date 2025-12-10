/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_WEATHER_API_KEY: string;
    readonly VITE_USE_PROXY: string;
    readonly VITE_PROXY_URL: string;
    readonly BASE_URL: string;
}