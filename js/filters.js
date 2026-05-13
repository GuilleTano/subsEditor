function escapeRegex(word) {
    return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildRegex(words, endings) {
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

    return { wordRegex, endingRegex };
}

// Funcion para normalizar las palabras de la linea de dialogo (quita simbolos, números, etc)
function normalizeWord(word) {
    return word
        .toLowerCase()
        .replace(/[^a-záéíóúüñ]/gi, "");
}

// Funcion para filtrar dialogos por palabras clave
function applyFilter(dialogueObjects, words, endings, excludedWordsSet) {

    let dialogueFiltered = [];

    dialogueObjects.forEach(obj => {
        // Limpia los tags que tienen las lineas en un archivo .ass
        const clean = obj.text.replace(/\{.*?\}/g, "");
        // Separa la linea por palabra
        const wordsInLine = clean.split(/\s+/);
        let validEnding = false;
        let validWord = false;

        // Aplicamos filtro por palabra, terminación y filtro de exclusión
        for (const word of wordsInLine) {

            const normalized = normalizeWord(word);

            // Si la palabra coincide con el filtro de palabras
            if (words.test(normalized)) {
                validWord = true;
            }
            // Si la terminación coincide con el filtro de endings y no se incluye en el filtro excluyente
            if (normalized.match(endings) && !excludedWordsSet.has(normalized)) {
                validEnding = true;
            }
            // Si se cumple alguno de los filtros
            if (validWord || validEnding) {
                break;
            }
        }
        if (validWord || validEnding) {
            dialogueFiltered.push(obj);
        }
    });

    return dialogueFiltered;
}

export { applyFilter, buildRegex };


/*
obj:
{
index: 62,
header: 'Dialogue: 5,0:07:10.09,0:07:12.74,Default,,', 
text: '0,0,0,,{\\be1}¡Nadie os obliga a acompañarme!', 
modifiedText: null
}
*/
