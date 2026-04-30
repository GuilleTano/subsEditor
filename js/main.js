import {fileUploader} from "./fileUploader.js";
import {dialogueParser} from "./parser.js";
import {applyFilter, buildRegex} from "./filters.js";
import {renderResults, renderActiveFilters, resetUI, exportFile} from "./renderUi.js";
import { editFile } from "./fileEdit.js";

let originalLines = [];
let dialogueObjects = [];
let dialogueFiltered = [];

// HAY QUE CREAR EL JSON CON LAS PALABRAS Y TERMINACIONES PARA FILTRAR
const palabras = [
    "tio",
    "tia",
    "os",
    "chaval"
];
const terminaciones = [
    "ais",
    "áis"
];

const { wordRegex, endingRegex } = buildRegex(palabras, terminaciones);

// Cargar y leer el archivo
document.getElementById("fileInput").addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".ass")) {
        alert("Por favor selecciona un archivo .ass");
        return;
    }

    try{
        const uplaodFile = await fileUploader(file);
        originalLines = uplaodFile;
        dialogueObjects = dialogueParser(uplaodFile);

        alert("Archivo cargado y parseado. Ahora puedes filtrar.");
    } catch (error){
        alert(error);
    }
});

// Filtrar archivo
document.getElementById("filterBtn").addEventListener("click", function(){

    // HAY QUE CREAR EL JSON CON LAS PALABRAS Y TERMINACIONES PARA FILTRAR

    dialogueFiltered = applyFilter(dialogueObjects, wordRegex, endingRegex);

    renderResults(dialogueFiltered, wordRegex, endingRegex);
    renderActiveFilters(palabras, terminaciones);

});

// Exportar el nuevo archivo
document.getElementById("exportBtn").addEventListener("click", function(){

    // Verifica que se cargue un archivo
    if (!dialogueObjects.length) {
        alert("Primero carga un archivo.");
        return;
    }

    // Crea el nuevo archivo, aplicando los cambios
    const newFile = editFile(dialogueFiltered, originalLines);

    // Crea el link y descarga el archivo nuevo
    exportFile(newFile);

    // Limpia la UI
    resetUI();
});
