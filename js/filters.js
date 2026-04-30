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

// Funcion para filtrar dialogos por palabras clave
function applyFilter(dialogueObjects, words, endings) {

    //const { wordRegex, endingRegex } = buildRegex(words, endings);
    let dialogueFiltered = [];

    dialogueObjects.forEach(obj => {
        // Limpia los tags que tienen las lineas en un archivo .ass
        const clean = obj.text.replace(/\{.*?\}/g, "");

        // Aplica el filtro
        const matchWord = words.test(clean);
        const matchEnding = endings.test(clean);

        if (matchWord || matchEnding) {
            //console.log(obj);
            dialogueFiltered.push(obj);
        }
    });

    return dialogueFiltered;
}

export {applyFilter, buildRegex};


/*
obj:
{
index: 62,
header: 'Dialogue: 5,0:07:10.09,0:07:12.74,Default,,', 
text: '0,0,0,,{\\be1}¡Nadie os obliga a acompañarme!', 
modifiedText: null
}
*/