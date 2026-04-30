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


// Función para evitar romper el regex
function escapeRegex(word) {
    return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Funcion para filtrar dialogos por palabras clave
function applyFilter(dialogueObjects) {
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
