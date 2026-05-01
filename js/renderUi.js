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

    // Limpiar input de filtro
    document.getElementById("filterInput").value = "";
}

// Resaltar las palabras o termianciones filtradas
function highlightText(text, wordRegex, endingRegex) {

    // Limpiar tags .ass primero
    const clean = text.replace(/\{.*?\}/g, "");

    // Resaltar palabras completas
    let highlighted = clean.replace(wordRegex, (match) => {
        return `<span class="highlight-word">${match}</span>`;
    });

    // Resaltar terminaciones
    highlighted = highlighted.replace(endingRegex, (match) => {
        return `<span class="highlight-ending">${match}</span>`;
    });

    return highlighted;
}

// Mostrar resultados en pantalla
function renderResults(dialogueFiltered, wordRegex, endingRegex) {

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
            endingRegex
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
function exportFile(newContent, newNameFile){

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