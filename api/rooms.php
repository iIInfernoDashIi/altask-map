<?php

ob_start();
ob_clean();

header_remove();
header("content-type: application/json");

if (isset($_GET['search'])) {
    $search = trim($_GET['search']);
    $data = json_decode(file_get_contents("../room_data.json"))->$search;
} else {
    $data = json_decode(file_get_contents("../room_data.json"));
}

if ($data == null) {
    http_response_code(404); //not found
    exit();
}

http_response_code(200); //OK
echo json_encode($data);
exit();


?>