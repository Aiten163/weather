import { ref } from 'vue'

export function useGeolocation() {
    const location = ref<GeolocationCoordinates | null>(null)
    const error = ref<string | null>(null)
    const isLoading = ref(false)

    const getCurrentLocation = (): Promise<GeolocationCoordinates> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'))
                return
            }

            isLoading.value = true
            error.value = null

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    location.value = position.coords
                    isLoading.value = false
                    resolve(position.coords)
                },
                (err) => {
                    error.value = err.message
                    isLoading.value = false
                    reject(err)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            )
        })
    }

    return {
        location,
        error,
        isLoading,
        getCurrentLocation
    }
}