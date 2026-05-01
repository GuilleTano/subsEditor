let filterConfig = {
    words: [],
    endings: []
};

async function loadFilters() {
    try {
        const response = await fetch('./filterList.json');
        const data = await response.json();
        filterConfig = data;

        return filterConfig;
    } catch (error) {
        console.error("Error cargando JSON:", error);
    }
}

export {loadFilters};