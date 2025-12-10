export interface Coord {
    lat: number
    lon: number
}

export interface WeatherCondition {
    id: number
    main: string
    description: string
    icon: string
}

export interface MainWeatherData {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
}

export interface Wind {
    speed: number
    deg: number
    gust?: number
}

export interface Clouds {
    all: number
}

export interface Sys {
    country: string
    sunrise: number
    sunset: number
}

export interface WeatherData {
    id: number
    name: string
    coord: Coord
    weather: WeatherCondition[]
    main: MainWeatherData
    visibility: number
    wind: Wind
    clouds: Clouds
    dt: number
    sys: Sys
    timezone: number
}

export interface ForecastItem {
    dt: number
    main: MainWeatherData
    weather: WeatherCondition[]
    clouds: Clouds
    wind: Wind
    visibility: number
    pop: number
    rain?: { '3h': number }
    snow?: { '3h': number }
    dt_txt: string
}

export interface ForecastData {
    list: ForecastItem[]
    city: {
        id: number
        name: string
        coord: Coord
        country: string
        timezone: number
    }
}

export interface City {
    id: number
    name: string
    country: string
    coord: Coord
    hasRealId?: boolean // Есть ли реальный ID OpenWeather
    query?: string // Строка для поиска по имени
}

export interface DailyForecast {
    date: Date
    temp_day?: number  // Сделать необязательным
    temp?: number      // Сделать необязательным
    temp_min: number
    temp_max: number
    condition: string
    description: string
    icon?: string
    humidity: number
    wind_speed: number
    precipitation: number
    cloudiness: number
    pressure: number
    hourly_data: HourlyForecast[]
    feels_like?: number,
    pop?: number
}

export interface HourlyForecast {
    time: Date
    temp: number
    condition: string
    icon: string
    precipitation: number
    humidity: number
    wind_speed: number
    wind_direction?: number
}
export interface Translations {
    [key: string]: {
        [key: string]: string
    }
}

// Дополняем интерфейс для лучшей поддержки TypeScript
declare global {
    interface Window {
        translations: Translations
    }
}