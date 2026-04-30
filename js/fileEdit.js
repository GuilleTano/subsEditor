// Guardar cambios y exportar el nuevo archivo
function editFile(dialogueFiltered, originalLines) {
    const map = new Map();

    // Recorre los dialogos editados y los guarda
    dialogueFiltered.forEach(obj => {
        if (obj.modifiedText !== null) {
            map.set(obj.index, obj.header + obj.modifiedText);
        }
    });

    if (map.size === 0) {
        alert("No hay cambios para exportar.");
        return;
    }

    // Reconstruye el archivo agregando las modificaciones
    const newContent = originalLines.map((line, i) => {
        return map.has(i) ? map.get(i) : line;
    }).join("\r\n");


    return newContent;
}

export {editFile};