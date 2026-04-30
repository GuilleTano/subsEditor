const reader = new FileReader();
let textInLines = [];
let dialogueObjects = [];

// VARIABLES PARA EL FILTRO
// Palabras
const BASE_WORDS = [
    "tio",
    "tia",
    "os",
    "chaval"
];

// Terminaciones
const BASE_ENDINGS = [
    "ais",
    "áis"
];

// METODOS DEL READER
reader.onload = function (event) {
    const text = event.target.result; // Obtener el contenido del archivo como texto
    textInLines = text.split(/\r?\n/); // Separarlo en lineas en un array

    //console.log(textInLines);
    parseDialogue();
    //console.log(dialogueObjects);

    alert("Archivo cargado. Ahora puedes filtrar.");
};

reader.onerror = function () {
    alert("Error al leer el archivo.");
};

// Encontrar y separar las lineas que son dialogos en el archivo
function parseDialogue() {
    dialogueObjects = [];
    textInLines.forEach((line, index) => {
        // Detectar las lineas que son dialogos para separarlas
        if (line.trim().startsWith("Dialogue:")) {
            // Usa la doble coma del formato .ass para separar el header de la linea de los dialogos
            const idx = line.indexOf(",,");
            if (idx !== -1) {
                const header = line.slice(0, idx + 2);
                const text = line.slice(idx + 2);

                // Guarda cada linea de dialogo como un objeto
                dialogueObjects.push({
                    index: index,
                    header: header,
                    text: text,
                    modifiedText: null
                });
            }
        }
    });
}

// Función para evitar romper el regex
function escapeRegex(word) {
    return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Funcion para filtrar dialogos por palabras clave
function applyFilter() {
    // Limpiar contenido ya filtrado
    const container = document.getElementById("editor");
    container.innerHTML = "";

    // Obtener palabras clave
    // Input del usuario
    const inputWords = document.getElementById("filterInput")
        .value.split(",")
        .map(w => w.trim())
        .filter(w => w.length > 0);

    // Combinar con base
    const words = [...new Set([...BASE_WORDS, ...inputWords])];
    // Mostrar filtros actuales en pantalla
    renderActiveFilters(words, BASE_ENDINGS);
    // Preparar regex seguro
    const safeWords = words.map(escapeRegex);
    const safeEndings = BASE_ENDINGS.map(escapeRegex);
    // Regex para palabras completas
    const wordRegex = new RegExp(
        `(^|\\s|[¡!¿?.,])(${safeWords.join("|")})(?=$|\\s|[¡!¿?.,])`,
        "i"
    );
    // Regex para terminaciones
    const endingRegex = new RegExp(
        `(${safeEndings.join("|")})(?=[^a-zA-Záéíóúüñ]|$)`,
        "i"
    );

    dialogueObjects.forEach(obj => {
        // Limpia los tags que tienen las lineas en un archivo .ass
        const clean = obj.text.replace(/\{.*?\}/g, "");

        // Aplica el filtro
        const matchWord = wordRegex.test(clean);
        const matchEnding = endingRegex.test(clean);

        if (matchWord || matchEnding) {
            const div = document.createElement("div");
            div.className = "line-container";

            // Timestamp
            const parts = obj.header.split(",");
            const time = document.createElement("div");
            time.className = "timestamp";
            time.textContent = `[${parts[1]} → ${parts[2]}]`;

            // Textarea
            const textarea = document.createElement("textarea");
            textarea.value = obj.text;

            textarea.oninput = () => {
                obj.modifiedText = textarea.value;
            };
            div.appendChild(time);
            div.appendChild(textarea);
            container.appendChild(div);
        }
    });
}

// Mostrar en pantalla los filtros actuales
function renderActiveFilters(words, endings) {
    const container = document.getElementById("activeFilters");
    container.innerHTML = "";

    // Palabras
    const wordDiv = document.createElement("div");
    wordDiv.className = "filter-group";

    const wordTitle = document.createElement("div");
    wordTitle.className = "filter-title";
    wordTitle.textContent = "Palabras:";

    wordDiv.appendChild(wordTitle);

    words.forEach(w => {
        const span = document.createElement("span");
        span.className = "filter-item";
        span.textContent = w;
        wordDiv.appendChild(span);
    });

    // Terminaciones
    const endDiv = document.createElement("div");
    endDiv.className = "filter-group";

    const endTitle = document.createElement("div");
    endTitle.className = "filter-title";
    endTitle.textContent = "Terminaciones:";

    endDiv.appendChild(endTitle);

    endings.forEach(e => {
        const span = document.createElement("span");
        span.className = "filter-item";
        span.textContent = e;
        endDiv.appendChild(span);
    });

    container.appendChild(wordDiv);
    container.appendChild(endDiv);
}

// Guardar cambios y exportar el nuevo archivo
function exportFile() {
    // Verifica que se cargue un archivo
    if (!textInLines.length) {
        alert("Primero carga un archivo.");
        return;
    }

    const map = new Map();

    // Recorre los dialogos editados y los guarda
    dialogueObjects.forEach(obj => {
        if (obj.modifiedText !== null) {
            map.set(obj.index, obj.header + obj.modifiedText);
        }
    });

    if (map.size === 0) {
        alert("No hay cambios para exportar.");
        return;
    }

    // Reconstruye el archivo agregando las modificaciones
    const newContent = textInLines.map((line, i) => {
        return map.has(i) ? map.get(i) : line;
    }).join("\r\n");

    // Se crea un archivo descargable y una URL
    const blob = new Blob([newContent], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");

    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "subtitulos_editados.ass";
    a.click();

    // Limpia la memoria
    URL.revokeObjectURL(url);

    // Limpiar UI
    resetUI();
}

// Limpiar UI despues de exportar
function resetUI() {
    // Limpiar contenedor de líneas
    document.getElementById("editor").innerHTML = "";

    // Limpiar filtros visibles (si lo estás usando)
    const filterBox = document.getElementById("activeFilters");
    if (filterBox) filterBox.innerHTML = "";

    // Resetear input de archivo
    document.getElementById("fileInput").value = "";

    // Limpiar input de filtro
    document.getElementById("filterInput").value = "";

    // Limpiar variables
    textInLines = [];
    dialogueObjects = [];
    alert("Archivo exportado correctamente.");
}

// Cargar y leer el archivo
document.getElementById("fileInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".ass")) {
        alert("Por favor selecciona un archivo .ass");
        return;
    }
    reader.readAsText(file, "utf-8");
});

// Filtrar archivo
document.getElementById("filterBtn").addEventListener("click", applyFilter);

// Exportar el nuevo archivo
document.getElementById("exportBtn").addEventListener("click", exportFile);