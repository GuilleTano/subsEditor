import {fileUploader} from "./fileUploader.js";
import {dialogueParser} from "./parser.js";


let dialogueObjects = [];

// Cargar y leer el archivo
document.getElementById("fileInput").addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".ass")) {
        alert("Por favor selecciona un archivo .ass");
        return;
    }

    try{
        const uplaodFile = await fileUploader(file);
        //const parseDialogue = dialogueParser(uplaodFile);
        dialogueObjects = dialogueParser(uplaodFile);

        console.log(parseDialogue);
        alert("Archivo cargado y parseado. Ahora puedes filtrar.");
    } catch (error){
        alert(error);
    }
});



// Filtrar archivo
document.getElementById("filterBtn").addEventListener("click", function(){

    /*

    LLAMAR AL FILTOR Y PASARLE POR PARAMETRO LAS PALABRAS Y TERMINACIONES A FILTRAR   
       
     */

});





// Exportar el nuevo archivo
//document.getElementById("exportBtn").addEventListener("click", exportFile);

/*
1- Cargar el archivo
2- Parsearlo para identificar dialogos
3- Filtrar los dialogos
4- Guardar cambios y exportar
*/