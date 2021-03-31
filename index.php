<?php 
$api_key = getenv('API_KEY');

// Initialize CURL
$ch = curl_init('http://api.ipstack.com/check?access_key='.$api_key.'');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Store the response data
$json = curl_exec($ch);
//var_dump($json);

curl_close($ch);

// Decode JSON response
$response_decoded = json_decode($json, true);

// Output response
//var_dump($response_decoded);

$processed_data = array(
    'Continent' => $response_decoded['continent_name'],
    'Country' => $response_decoded['country_name'],
    'State' => $response_decoded['region_name'],
    'City' => $response_decoded['city'],
    'Zip' => $response_decoded['zip'],
    'Latitude' => $response_decoded['latitude'],
    'Longitude' => $response_decoded['longitude']
);

// Connect to PostgreSQL database
$db_conn = pg_connect(getenv('DATABASE_URL'));

// Update table in database
$res = pg_insert($db_conn, 'Visitors', $processed_data, PG_DML_ESCAPE);
//var_dump($res);

include_once("index.html");
