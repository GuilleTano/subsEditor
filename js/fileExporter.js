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

