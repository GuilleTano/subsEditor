import { fileUploader } from "./fileUploader.js";
import { dialogueParser } from "./parser.js";
import { loadFilters } from "./filtersConfig.js";
import { applyFilter, buildRegex } from "./filters.js";
import { renderResults, renderActiveFilters, resetUI, exportFile } from "./renderUi.js";
import { editFile, generateNewFileName } from "./fileEdit.js";

let originalFileName = "";
let originalLines = [];
let dialogueObjects = [];
let dialogueFiltered = [];

document.addEventListener("DOMContentLoaded", async () => {
    // Obtiene los filtros del JSON y construye los Regex
    const filtersList = await loadFilters();
    const { wordRegex, endingRegex } = buildRegex(filtersList.words, filtersList.endings);
    // Muestra los filtros activos
    renderActiveFilters(filtersList.words, filtersList.endings);

    // Cargar y leer el archivo
    document.getElementById("fileInput").addEventListener("change", async function (e) {
        const file = e.target.files[0];
        if (!file) return;
        originalFileName = file.name;
        if (!file.name.endsWith(".ass")) {
            alert("Por favor selecciona un archivo .ass");
            return;
        }
        // Carga el archivo y obtiene las lineas que son de dialogo
        try {
            const uploadFile = await fileUploader(file);
            originalLines = uploadFile;
            dialogueObjects = dialogueParser(uploadFile);

            alert("Archivo cargado y parseado. Ahora puedes filtrar.");
        } catch (error) {
            alert(error);
        }
    });

    // Filtrar archivo
    document.getElementById("filterBtn").addEventListener("click", function () {
        if (!dialogueObjects.length) {
            alert("Primero carga un archivo.");
            return;
        }
        // Aplica los filtros
        dialogueFiltered = applyFilter(dialogueObjects, wordRegex, endingRegex);
        // Muestra solo las lineas que cumplen los filtros
        renderResults(dialogueFiltered, wordRegex, endingRegex);
    });

    // Exportar el nuevo archivo
    document.getElementById("exportBtn").addEventListener("click", function () {
        // Verifica que se cargue un archivo
        if (!dialogueObjects.length) {
            alert("Primero carga un archivo.");
            return;
        }
        // Crea el nuevo archivo, aplicando los cambios
        const newFile = editFile(dialogueFiltered, originalLines);
        if (newFile === null){
            alert("No hay cambios para exportar.");
            return;
        }
        const newNameFile = generateNewFileName(originalFileName);
        // Crea el link y descarga el archivo nuevo
        exportFile(newFile, newNameFile);
        // Limpia la UI
        resetUI();
    });
});
