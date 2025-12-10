// src/locales/index.ts
export const translations = {
    en: {
        // Header
        dashboard: 'Dashboard',
        settings: 'Settings',

        // Current Weather
        feelsLike: 'Feels like',
        min: 'Min',
        max: 'Max',
        wind: 'Wind',
        humidity: 'Humidity',
        visibility: 'Visibility',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        noWeatherData: 'No weather data available',
        gust: 'Gust',

        myLocation: 'My Location',

        // Forecast
        dailyForecast: '7-Day Forecast',  // Исправлено с 5 на 7
        hourlyForecast: 'Hourly Forecast',
        noForecastData: 'No forecast data available',

        // City Management
        addCity: 'Add City',
        removeCity: 'Remove',
        searchCity: 'Search city...',
        confirmRemove: 'Are you sure you want to remove this city?',
        favoriteCities: 'Favorite Cities',
        noCitiesAdded: 'No cities added yet',
        searchToAdd: 'Use search to add cities',
        useMyLocation: 'Use My Location',
        locationError: 'Failed to get location',
        viewDetails: 'View Details',

        // Settings
        temperature: 'Temperature',
        windSpeed: 'Wind Speed',
        pressureUnit: 'Pressure Unit',
        language: 'Language',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
        units: 'Units of Measurement',
        dataManagement: 'Data Management',
        settingsSaved: 'All settings are automatically saved to your browser\'s local storage.',
        clearCache: 'Clear Cache',
        exportSettings: 'Export Settings',
        confirmClearCache: 'Are you sure you want to clear all cached data?',

        // Units
        celsius: 'Celsius',
        fahrenheit: 'Fahrenheit',
        kmh: 'km/h',
        mph: 'mph',
        ms: 'm/s',
        mmHg: 'mmHg',
        hPa: 'hPa',

        // Languages
        english: 'English',
        russian: 'Russian',

        // Pressure Status
        lowPressure: 'Low',
        normalPressure: 'Normal',
        highPressure: 'High',

        // Days
        today: 'Today',
        tomorrow: 'Tomorrow',
        now: 'Now',  // Добавлено
        backToList: 'Back to list',  // Добавлено

        // Weather Conditions
        clear: 'Clear',
        clouds: 'Cloudy',
        rain: 'Rain',
        snow: 'Snow',
        thunderstorm: 'Thunderstorm',
        drizzle: 'Drizzle',
        mist: 'Mist',
        fog: 'Fog',

        // Wind Directions
        N: 'North',
        NE: 'Northeast',
        E: 'East',
        SE: 'Southeast',
        S: 'South',
        SW: 'Southwest',
        W: 'West',
        NW: 'Northwest',

        // Дополнительные
        loading: 'Loading...',
        gettingLocation: 'Getting your location...',
        retry: 'Try Again',
        loadDefault: 'Load Default City',
        pressure: 'Pressure',

        // Прогноз и детали
        precipitation: 'Precipitation',
        cloudiness: 'Cloudiness',
        windDirection: 'Wind Direction',
        selectDay: 'Select day',
        weekDays: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
        detailedForecast: 'Detailed Forecast',
        uvIndex: 'UV Index',
        moonrise: 'Moonrise',
        moonset: 'Moonset',
        refresh: 'Refresh',
        addToFavorites: 'Add to favorites',
        removeFromFavorites: 'Remove from favorites',
        favorites: 'Favorites',
        searching: 'Searching...',
        selectDayForDetails: 'Select a day to view detailed forecast',

        // Удалены дубликаты
    },

    ru: {
        // Header
        title: 'Погодный Дашборд',
        dashboard: 'Панель управления',
        settings: 'Настройки',

        // Current Weather
        feelsLike: 'Ощущается как',
        min: 'Мин',
        max: 'Макс',
        wind: 'Ветер',
        humidity: 'Влажность',
        pressure: 'Давление',
        visibility: 'Видимость',
        sunrise: 'Восход',
        sunset: 'Закат',
        noWeatherData: 'Нет данных о погоде',
        gust: 'Порывы',

        myLocation: 'Мое местоположение',

        // Forecast
        dailyForecast: 'Прогноз на 7 дней',  // Исправлено с 5 на 7
        hourlyForecast: 'Почасовой прогноз',
        noForecastData: 'Нет данных прогноза',

        // City Management
        addCity: 'Добавить город',
        removeCity: 'Удалить',
        searchCity: 'Поиск города...',
        confirmRemove: 'Вы уверены, что хотите удалить этот город?',
        favoriteCities: 'Избранные города',
        noCitiesAdded: 'Городов еще не добавлено',
        searchToAdd: 'Используйте поиск для добавления городов',
        useMyLocation: 'Использовать мое местоположение',
        locationError: 'Не удалось получить местоположение',
        viewDetails: 'Просмотр деталей',

        // Settings
        temperature: 'Температура',
        windSpeed: 'Скорость ветра',
        pressureUnit: 'Единица давления',
        language: 'Язык',
        theme: 'Тема',
        light: 'Светлая',
        dark: 'Темная',
        auto: 'Авто',
        units: 'Единицы измерения',
        dataManagement: 'Управление данными',
        settingsSaved: 'Все настройки автоматически сохраняются в локальное хранилище вашего браузера.',
        clearCache: 'Очистить кэш',
        exportSettings: 'Экспорт настроек',
        confirmClearCache: 'Вы уверены, что хотите очистить все кэшированные данные?',

        // Units
        celsius: 'Цельсий',
        fahrenheit: 'Фаренгейт',
        kmh: 'км/ч',
        mph: 'миль/ч',
        ms: 'м/с',
        mmHg: 'мм рт. ст.',
        hPa: 'гПа',

        // Languages
        english: 'Английский',
        russian: 'Русский',

        // Pressure Status
        lowPressure: 'Низкое',
        normalPressure: 'Нормальное',
        highPressure: 'Высокое',

        // Days
        today: 'Сегодня',
        tomorrow: 'Завтра',
        now: 'Сейчас',  // Добавлено
        backToList: 'Назад к списку',  // Добавлено

        // Weather Conditions
        clear: 'Ясно',
        clouds: 'Облачно',
        rain: 'Дождь',
        snow: 'Снег',
        thunderstorm: 'Гроза',
        drizzle: 'Морось',
        mist: 'Туман',
        fog: 'Туман',

        // Wind Directions
        N: 'Северный',
        NE: 'Северо-восточный',
        E: 'Восточный',
        SE: 'Юго-восточный',
        S: 'Южный',
        SW: 'Юго-западный',
        W: 'Западный',
        NW: 'Северо-западный',

        // Дополнительные
        loading: 'Загрузка...',
        gettingLocation: 'Определяем ваше местоположение...',
        retry: 'Попробовать снова',
        loadDefault: 'Загрузить Москву',

        // Прогноз и детали
        precipitation: 'Осадки',
        cloudiness: 'Облачность',
        windDirection: 'Направление ветра',
        selectDay: 'Выберите день',
        weekDays: 'Вс,Пн,Вт,Ср,Чт,Пт,Сб',
        detailedForecast: 'Подробный прогноз',
        uvIndex: 'УФ индекс',
        moonrise: 'Восход луны',
        moonset: 'Заход луны',
        refresh: 'Обновить',
        addToFavorites: 'Добавить в избранное',
        removeFromFavorites: 'Удалить из избранного',
        favorites: 'Избранное',
        searching: 'Поиск...',
        selectDayForDetails: 'Выберите день для просмотра подробного прогноза',
    }
}