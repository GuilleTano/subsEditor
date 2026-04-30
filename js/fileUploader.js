function fileUploader(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const text = event.target.result;
            const textInLines = text.split(/\r?\n/);
            resolve(textInLines);
        };

        reader.onerror = function () {
            reject("Error al leer el archivo.");
        };

        reader.readAsText(file, "utf-8");
    });
}

export {fileUploader};