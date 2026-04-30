// Encontrar y separar las lineas que son dialogos en el archivo
function dialogueParser(textInLines) {
    let dialogueObjects = [];
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
    return dialogueObjects;
}

export {dialogueParser};