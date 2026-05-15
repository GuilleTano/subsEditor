// Funcion para normalizar las palabras de la linea de dialogo (quita simbolos, números, etc)
function normalizeWord(word) {
    return word
        .toLowerCase()
        .replace(/[^a-záéíóúüñ]/gi, "");
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

// Limpiar UI despues de exportar
function resetUI() {
    // Limpiar contenedor de líneas
    document.getElementById("editor").innerHTML = "";

    // Limpiar filtros visibles (si lo estás usando)
    const filterBox = document.getElementById("activeFilters");
    if (filterBox) filterBox.innerHTML = "";

    // Resetear input de archivo
    document.getElementById("fileInput").value = "";
}

// Resaltar las palabras o termianciones filtradas
function highlightText(text, wordRegex, endingRegex, excludedWordsSet) {

    // Limpiar tags .ass primero
    const clean = text.replace(/\{.*?\}/g, "").replace(/\\N/g, " ").replace(/\\n/g, " ").replace(/\\h/g, " ");

    // Separar palabras PERO conservando espacios
    const parts = clean.split(/(\s+)/);

    // Reconstruir la linea con highlights
    const highlighted = parts.map(part => {

        // Regex para separar la palabra (core) de los signos de putnuación
        const match = part.match(/^([^a-záéíóúüñ]*)([a-záéíóúüñ]+)([^a-záéíóúüñ]*)$/i);
        if (!match) return part;
        const [, prefix, core, suffix] = match;

        // Normalizar para comparar
        const normalized = normalizeWord(core);

        // Ignorar espacios o strings vacios
        if (!normalized) {
            return part;
        }

        // Ignorar palabras excluidas
        if (excludedWordsSet.has(normalized)) {
            return part;
        }

        // Resaltar palabras completas
        if (wordRegex.test(normalized)) {
            return `${prefix}<span class="highlight-word">${core}</span>${suffix}`;
        }

        // Resaltar terminaciones
        if (endingRegex.test(normalized)) {
            return `${prefix}<span class="highlight-ending">${core}</span>${suffix}`;
        }

        // Si no coincide con nada
        return part;

    }).join("");

    return highlighted;
}

// Mostrar resultados en pantalla
function renderResults(dialogueFiltered, wordRegex, endingRegex, excludedWordsSet) {

    // Limpiar contenido ya filtrado
    const container = document.getElementById("editor");
    container.innerHTML = "";

    for (let obj of dialogueFiltered) {

        const div = document.createElement("div");
        div.className = "line-container";

        // Boton para eliminar resultados
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✖";
        closeBtn.className = "remove-btn";
        closeBtn.onclick = () => {
            div.remove();
        };

        // Timestamp
        const parts = obj.header.split(",");
        const time = document.createElement("div");
        time.className = "timestamp";
        time.textContent = `[${parts[1]} → ${parts[2]}]`;

        // Label
        const label = document.createElement("div");
        label.className = "dialogue-label";
        label.innerHTML = highlightText(
            obj.text,
            wordRegex,
            endingRegex,
            excludedWordsSet
        );

        // Textarea
        const textarea = document.createElement("textarea");
        textarea.value = obj.text;

        textarea.oninput = () => {
            obj.modifiedText = textarea.value;
        };
        div.appendChild(closeBtn);
        div.appendChild(time);
        div.appendChild(label);
        div.appendChild(textarea);
        container.appendChild(div);
    }
}

// Crea el link de descarga y descarga el archivo
function exportFile(newContent, newNameFile) {

    // Se crea un archivo descargable y una URL
    const blob = new Blob([newContent], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = newNameFile;
    a.click();

    // Limpia la memoria
    URL.revokeObjectURL(url);
}

export { renderResults, renderActiveFilters, resetUI, exportFile };