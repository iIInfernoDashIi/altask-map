<?php
function json_response()
{
    ob_start();
    ob_clean();
    
    header_remove();
    header("content-type: application/json");

    $data = json_decode(file_get_contents("../room_data.json"))->$room;
    if ($data == null) {
        http_response_code(404); //not found
        exit();
    }
    
    http_response_code(200); //OK
    echo json_encode($data);
    exit();
}

if (isset($_GET['room'])) {
    $room = trim($_GET['room']
} else {
    http_response_code(400); //no argument
    exit();
}

json_response($data);

?>