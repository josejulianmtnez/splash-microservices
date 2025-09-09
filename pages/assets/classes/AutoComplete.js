/**
 * Class AutoComplete
 * Clase encargada de auto completar un campo de búsqueda en base a un Array u Objeto
 */
export class AutoComplete {

    // Variables privadas que serán accesibles solo dentro de la clase
    #searchInput
    #optionsContainer
    #badgesContainer
    #items
    #resetBadges
    #itemsSelected

    constructor() {
        // Inicialización de las variables privadas
        this.#searchInput
        this.#optionsContainer
        this.#badgesContainer
        this.#items
        this.#resetBadges = true
        this.#itemsSelected = []
    }

    // Métodos para obtener y definir los valores actuales de las variables privadas
    #getSearchInput() {
        return this.#searchInput;
    }

    #setSearchInput(searchInput) {
        this.#searchInput = searchInput
    }

    #getOptionsContainer() {
        return this.#optionsContainer
    }

    #setOptionsContainer(optionsContainer) {
        this.#optionsContainer = optionsContainer
    }

    #getBadgesContainer() {
        return this.#badgesContainer
    }

    #setBadgesContainer(badgesContainer) {
        this.#badgesContainer = badgesContainer
    }

    #getItems() {
        return this.#items
    }

    #setItems(items) {
        this.#items = items
    }

    #getResetBadges() {
        return this.#resetBadges
    }

    getItemsSelected(){
        return this.#itemsSelected
    }

    #sortItems(dataList){
        dataList.sort((a, b) => {
            return a.value.localeCompare(b.value, 'es', { sensitivity: 'base' });
        });
        return dataList
    }

    #createBadge = (itemSelected) => {
        //this.#getOptionsContainer().style.display = "none"  // Ocultar la lista
        this.getItemsSelected().push(itemSelected.id)
        const badge = document.createElement('span')
        badge.classList.add("badge", "bg-success", "p-2", "mt-2", "mx-2", "d-flex", "align-content-center", "rounded-pill")
        badge.style.fontSize = "12px"
        badge.innerText = itemSelected.value
        const btnClose = document.createElement('button')
        btnClose.type = "button"
        btnClose.classList.add("btn-close", "p-0", "m-0", "ms-1")
        btnClose.style.width = "10px"
        btnClose.style.height = "10px"

        btnClose.addEventListener("click", () => {
            badge.remove()
            this.#itemsSelected = this.getItemsSelected().filter(item => item !== itemSelected.id);
            this.#getItems().push(itemSelected)
            this.#setItems(this.#sortItems(this.#getItems()))
        });

        badge.appendChild(btnClose)
        this.#getSearchInput().blur() // Perder el foco del input
        this.#getBadgesContainer().appendChild(badge) // Agregar badge para ver el usuario seleccionado

        // Eliminar elemento del array original
        const newItems = this.#getItems().filter(item => {
            // Comparar el objeto completo, no solo el id
            return JSON.stringify(item) !== JSON.stringify(itemSelected);
        });

        this.#resetBadges = false
        this.updateItems(newItems)
    }

    selectItems(itemsToSelect){
        // Validar que 'itemsSelected' sea un array
        if (!Array.isArray(itemsToSelect)) {
            console.error("Las opciones a seleccionar deben estar en un array.");
            return;
        }

        itemsToSelect.forEach(item => {
            if(!isNaN(+item)) item = +item
            const itemSelected = this.#getItems().find(option => option.id === item);
            this.#createBadge(itemSelected)
        })
    }

    reset(){
        this.#items = [];
        this.#resetBadges = true;
        this.#itemsSelected = [];
        this.#getOptionsContainer().innerHTML = "";
        this.#getBadgesContainer().innerHTML = ""; 
    }
    

    // Método para actualizar la variable privada
    updateItems(newDataList) {

        const backNewDataList = newDataList // Hacer copia del array original

        // Validar que 'newDataList' sea un array
        if (!Array.isArray(backNewDataList)) {
            console.error("El 'optionsData' debe ser un array.");
            return;
        }

        // Validar que 'newDataList' sea un array de objetos que cumplan con mínimo dos propiedades `id` y `value` {id: valor, value: valor}
        for (let item of backNewDataList) {
            if (typeof item !== 'object' || item === null || !('id' in item) || !('value' in item)) {
                console.error("Cada elemento en 'optionsData' debe ser un objeto con las propiedades 'id' y 'value'.");
                return;
            }

            // Convertir 'id' y 'value' a número
            if(!isNaN(+item.id)) item.id = +item.id  // Para convertir a número (entero o flotante)
            if(!isNaN(+item.value)) item.value = +item.id  // Lo mismo para 'value'
            if (item.subValue && !isNaN(+item.subValue)) item.subValue = +item.subValue
        }

        this.#getOptionsContainer().innerHTML = ""
        if(this.#getResetBadges()) { 
            this.#getBadgesContainer().innerHTML = "" 
            this.getItemsSelected().length = 0
        }

        newDataList = this.#sortItems(backNewDataList)

        // Actualizamos el array
        this.#setItems(newDataList)
        this.#resetBadges = true
    }

    /**
        * Inicializa los eventos y configura los componentes necesarios para el autocompletado.
        * 
        * @param {Object} settings - Configuración necesaria para inicializar el autocompletado.
        * @param {HTMLElement} settings.searchInput - Elemento del input de búsqueda.
        * @param {HTMLElement} settings.optionsContainer - Contenedor donde se mostrarán las opciones.
        * @param {HTMLElement} settings.badgesContainer - Contenedor para los elementos seleccionados.
        * @param {Array} settings.optionsData - Datos con las opciones que se mostrarán en el autocompletado (OPCIONAL AL INICIALIZAR).
        * 
        * No retorna ningún valor. Solo configura los elementos y actualiza el estado del autocompletado.
     */
    autoComplete(settings) {

        // Validar que 'settings' es un objeto
        if (typeof settings !== 'object' || settings === null) {
            console.error("La configuración 'settings' debe ser un objeto.");
            return;
        }

        // Validar 'searchInput' (Debe ser un elemento de tipo input o similar)
        if (!(settings.searchInput instanceof HTMLInputElement)) {
            console.error("El 'searchInput' debe ser un elemento input del DOM.");
            return;
        }

        // Validar 'optionsContainer' (Debe ser un elemento del DOM, como un div)
        if (!(settings.optionsContainer instanceof HTMLElement)) {
            console.error("El 'optionsContainer' debe ser un elemento del DOM (de preferencia, un div).");
            return;
        }

        // Validar 'badgesContainer' (Debe ser un elemento del DOM, como un div)
        if (!(settings.badgesContainer instanceof HTMLElement)) {
            console.error("El 'badgesContainer' debe ser un elemento del DOM (de preferencia, un div).");
            return;
        }

        // Validar 'optionsData' Este definida
        if (!settings.optionsData) {
            settings.optionsData = [];
        }

        this.#setSearchInput(settings.searchInput)
        this.#setOptionsContainer(settings.optionsContainer)
        this.#setBadgesContainer(settings.badgesContainer)
        this.updateItems(settings.optionsData)

        this.#getOptionsContainer().classList.add("position-absolute", "bg-white", "top-100", "start-0", "end-0", "z-3", "shadow", "border", "border-light-subtle", "overflow-y-auto", "rounded-bottom")
        this.#getOptionsContainer().style.maxHeight = "200px"; 
        this.#getBadgesContainer().classList.add("d-flex", "flex-wrap", "justify-content-center")
        
        // Evento para ocultar el this.#getOptionsContainer() con los elementos filtrados
        document.addEventListener("click", function (event) {
            if (!settings.optionsContainer.contains(event.target) && event.target !== settings.searchInput) {
                settings.optionsContainer.style.display = "none";  // Ocultar lista si se hace clic fuera
                selectedIndex = -1
            }
        });

        let selectedIndex = -1; // Indice de la opción seleccionada

        const handleEvent = () => {
            if(this.#getItems().length <= 0){
                const span = document.createElement("div")
                span.classList.add("p-2", "text-center", "user-select-none", "fw-semibold")
                span.textContent = "Sin datos para seleccionar"
                this.#getOptionsContainer().innerHTML = ""
                this.#getOptionsContainer().appendChild(span)
                this.#getOptionsContainer().style.display = "block"
                return;
            } 
            
            const query = this.#getSearchInput().value.toLowerCase();
            let filteredResults = this.#getItems()
            if (query) {
                filteredResults = this.#getItems().filter(item =>item.value.toLowerCase().includes(query.toLowerCase()) );
            }
            showResults(filteredResults); // Mostrar los resultados al dar foco o escribir
        }

        this.#getSearchInput().addEventListener("focus", handleEvent);
        this.#getSearchInput().addEventListener("input", handleEvent);

        // Manejar teclas de flecha y tabulación
        this.#getSearchInput().addEventListener("keydown", (event) => {
            const items = document.querySelectorAll(".autocomplete-item");

            // Tecla de abajo (flecha hacia abajo)
            if (event.key === "ArrowDown") {
                if (selectedIndex < items.length - 1) {
                    selectedIndex++;
                    updateSelected(items);
                } else {
                    selectedIndex = -1
                    updateSelected(items)
                }
            }

            // Tecla de arriba (flecha hacia arriba)
            if (event.key === "ArrowUp") {
                if (selectedIndex >= 0) {
                    selectedIndex--;
                    updateSelected(items);
                } else {
                    selectedIndex = items.length - 1
                    updateSelected(items)
                }
            }

            // Tecla Tab
            if (event.key === "Tab") {
                if (selectedIndex < items.length - 1) {
                    selectedIndex++;
                    updateSelected(items);
                    event.preventDefault(); // Prevenir el comportamiento predeterminado del tab
                } else {
                    this.#getOptionsContainer().style.display = "none";
                }
            }

            // Enter o click en opción
            if (event.key === "Enter" && selectedIndex >= 0) {

                const itemSelected = items[selectedIndex]
                let textContent = itemSelected.textContent
                const subValue = itemSelected.dataset.subvalue
                if(subValue){
                    textContent = itemSelected.textContent.replace(subValue, "");
                }
                
                const item = {
                    id: !isNaN(+itemSelected.dataset.id) ? +itemSelected.dataset.id : itemSelected.dataset.id, 
                    value: !isNaN(+textContent) ? +textContent : textContent, 
                    ...(subValue && {subValue: !isNaN(+subValue) ? +subValue : subValue})}
                beforeBadge(item)
            }
        });

        // Función para resaltar la opción seleccionada
        const updateSelected = (items) => {
            if(items.length <= 0) {
                return
            }

            let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--vz-primary').trim()
            items.forEach(item => {item.style.color = ""; item.style.backgroundColor = "";})
            

            // Aplicar ese valor al fondo del elemento
            if (selectedIndex >= 0) {
                items[selectedIndex].style.color = "#fff"
                items[selectedIndex].style.backgroundColor = primaryColor
                scrollIntoViewIfNeeded(items[selectedIndex]) // Asegurar que el elemento sea visible
            }
        }

        // Función para desplazar el contenedor para que el elemento seleccionado sea visible
        const scrollIntoViewIfNeeded = (element) => {
            const container = this.#getOptionsContainer();
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;

            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.offsetHeight;

            if (elementTop < containerTop) {
                container.scrollTop = elementTop; // Desplaza hacia arriba
            } else if (elementBottom > containerBottom) {
                container.scrollTop = elementBottom - container.offsetHeight; // Desplaza hacia abajo
            }
        }
        
        const beforeBadge = (itemSelected) => {
            selectedIndex = -1 // Reiniciar indice de la lista
            this.#getSearchInput().value = itemSelected.value  // Poner el valor seleccionado en el inputSearch
            this.#getOptionsContainer().style.display = "none"  // Ocultar la lista
            this.#createBadge(itemSelected)
        }

        const showResults = (results) => {
            // Limpiar resultados anteriores
            selectedIndex = -1
            this.#getOptionsContainer().innerHTML = "";
            this.#getOptionsContainer().style.display = "block";  // Mostrar la lista si hay resultados

            if (results.length > 0) {
                results.forEach(result => {
                    const div = document.createElement("div");
                    div.classList.add("p-2", "autocomplete-item");
                    div.style.cursor = "pointer";
                    div.setAttribute("data-id", result.id)
                    result.subValue && div.setAttribute("data-subValue", result.subValue)

                    // Buscar el texto en el this.#getSearchInput() y envolver las coincidencias en <strong> para resaltar
                    const query = this.#getSearchInput().value.toLowerCase();
                    const highlightedResult = result.value.replace(
                        new RegExp(query, 'gi'),
                        match => `<b>${match}</b>`
                    );

                    const subValue = !result.subValue ? "" : result.subValue
                    const span = document.createElement("span")
                    span.textContent = subValue
                    span.classList.add("badge", "text-bg-primary", "ms-1")

                    // Usar innerHTML para insertar el HTML generado (con negritas)
                    div.innerHTML = highlightedResult
                    result.subValue && div.appendChild(span) // Agregar span si es que el sub value esta definido

                    div.addEventListener("click", () => {
                        beforeBadge(result)
                    });

                    this.#getOptionsContainer().appendChild(div);
                });
            } else {
                const div = document.createElement("div")
                div.classList.add("p-2")
                div.style.userSelect = "none"
                const b = document.createElement("b")
                b.textContent = `${this.#getSearchInput().value}`
                div.innerHTML = `No se encontraron resultados para `;
                div.appendChild(b)
                this.#getOptionsContainer().appendChild(div);
            }
        }
    }
}