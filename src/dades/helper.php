<?php

$filename = './characters.json';
if (!file_exists($filename)) {
    die("El archivo $filename no existe");
}

$json = file_get_contents($filename);
if ($json === false) {
    die("No se pudo leer el archivo $filename");
}

$characters = json_decode($json, true);
if ($characters === null && json_last_error() !== JSON_ERROR_NONE) {
    die("Error en la decodificación JSON: " . json_last_error_msg());
}

function getCharacterNames($characters) {
    $result = [];
    foreach ($characters as $character) {
        array_push($result, $character['id']);
        if (isset($character['transformacions'])) {
            foreach ($character['transformacions'] as $transformation) {
                array_push($result, $transformation['id']);
            }
        }
    }
    return $result;
}

echo '<pre>';
var_dump(getCharacterNames($characters));
echo '</pre>';
function createCharacterFolders($allCharacters) {
    foreach ($allCharacters as $character) {
        $dirPath = '../assets/' . $character;
        if (!file_exists($dirPath)) {
            mkdir($dirPath, 0777, true);
        }
    }
}
// createCharacterFolders(getCharacterNames($characters));
?>