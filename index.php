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
echo $response_decoded;

include_once("index.html");
