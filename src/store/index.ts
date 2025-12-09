import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import type { Router } from 'vue-router'

export const pinia = createPinia()

export function setupStore(router: Router) {
    pinia.use(({ store }) => {
        store.router = markRaw(router)
    })
}

declare module 'pinia' {
    export interface PiniaCustomProperties {
        router: Router
    }
}