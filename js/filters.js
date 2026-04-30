function escapeRegex(word) {
    return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildRegex(words, endings){
    // Preparar regex seguro
    const safeWords = words.map(escapeRegex);
    const safeEndings = endings.map(escapeRegex);

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

    return {wordRegex, endingRegex};
}


// Funcion para filtrar dialogos por palabras clave
function applyFilter(dialogueObjects, words, endings) {

    const { wordRegex, endingRegex } = buildRegex(words, endings);
    
    dialogueObjects.forEach(obj => {
        // Limpia los tags que tienen las lineas en un archivo .ass
        const clean = obj.text.replace(/\{.*?\}/g, "");

        // Aplica el filtro
        const matchWord = wordRegex.test(clean);
        const matchEnding = endingRegex.test(clean);

        if (matchWord || matchEnding) {

            // Timestamp
            const lineHeader = obj.header.split(",");
            // Textarea
            const lineDialogue = obj.text;

        }
    });
}

