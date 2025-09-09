/**
 * Class Drawer
 * clase encargada de dibujar elementos dinamicos comunes
 */
export class Drawer {
    /**
     * Retorna un `<tr>` con los elementos pasados como argumentos.
     * Si el elemento a agregar es un `<td>` lo agrega directamente,
     * en otro caso por cada elemento crea un `<td>` con el contenido
     * el cual puede ser una etiqueta `html` o un `string`
     * 
     * @param  {...(HTMLElement | string)} items - elementos a dibujar en el <tr>
     * @returns {HTMLTableRowElement} `<tr>` fila con los elementos pasados como argumentos
     */
    drawTR(...items) {
        const tr = document.createElement("tr");
        items.forEach(item => {
            let td;
            // si ya es un <td>
            if (item instanceof HTMLElement && item.tagName === "TD") {
                td = item;
            } else {
                // si es otro html o un string
                td = document.createElement("td");
                if (typeof item === "string" || typeof item === "number") {
                    td.textContent = item;
                } else if (item instanceof HTMLElement) {
                    td.appendChild(item);
                } else {
                    console.error("Elemento no válido:", item);
                    return;
                }
            }
            tr.appendChild(td);
        });
        return tr;
    }
}