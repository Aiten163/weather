<?php
// Простой прокси для OpenWeather API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Ваш API ключ OpenWeather
$api_key = '8d15fee5620728c0123a828598f37174';

// Получаем endpoint и параметры
$endpoint = $_GET['endpoint'] ?? '';
$params = $_GET;
unset($params['endpoint']);

// Определяем базовый URL
if (strpos($endpoint, 'geo') === 0) {
    $base_url = 'https://api.openweathermap.org/geo/1.0/';
    $endpoint = str_replace('geo/', '', $endpoint);
} else {
    $base_url = 'https://api.openweathermap.org/data/2.5/';
}

// Добавляем API ключ
$params['appid'] = $api_key;
$params['units'] = $params['units'] ?? 'metric';
$params['lang'] = $params['lang'] ?? 'en';



// Формируем URL
$url = $base_url . $endpoint . '?' . http_build_query($params);

// Выполняем запрос
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_USERAGENT => 'WeatherDashboard/1.0'
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Отправляем ответ
http_response_code($http_code);
echo $response;
?>
