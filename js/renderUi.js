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

    // Limpiar variables
    textInLines = [];
    dialogueObjects = [];
    alert("Archivo exportado correctamente.");
}
