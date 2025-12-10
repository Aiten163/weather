<?php
// Включить вывод ошибок для отладки
error_reporting(E_ALL);
ini_set('display_errors', 0); // В production лучше 0

// ========== CORS ЗАГОЛОВКИ ==========
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight OPTIONS запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// ====================================

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
