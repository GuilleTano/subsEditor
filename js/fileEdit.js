// Guardar cambios y exportar el nuevo archivo
function editFile(dialogueFiltered, originalLines) {
    const changesMap = new Map();

    // Recorre los dialogos editados y los guarda
    dialogueFiltered.forEach(obj => {
        if (obj.modifiedText !== null && obj.modifiedText !== obj.text) {
            changesMap.set(obj.index, obj.header + obj.modifiedText);
        }
    });

    if (changesMap.size === 0) return null;

    // Reconstruye el archivo agregando las modificaciones
    const newContent = originalLines.map((line, i) => {
        return changesMap.has(i) ? changesMap.get(i) : line;
    }).join("\r\n");


    return newContent;
}

function generateNewFileName(originalName) {
    const dotIndex = originalName.lastIndexOf(".");
    if (dotIndex === -1) {
        return originalName + "_editado";
    }
    const newName = originalName.slice(0, dotIndex);
    const ext = originalName.slice(dotIndex);
    return newName + "_editado" + ext;
}

export {editFile, generateNewFileName};