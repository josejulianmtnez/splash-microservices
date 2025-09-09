/**
 * Clase ExtraFunctions
 * Clase encargado de almacenar funciones que pueden ser ocupadas en varios módulos
 */

class  ExtraFunctions {
    /**
     * La función `getWeeksOfYear` devuelve un array de objetos que representan las semanas de un año específico.
     * Cada objeto contiene el número de semana y el rango de fechas que abarca.
     *
     * Si el parámetro `year` no se proporciona o no es un número entero válido (mayor o igual a 1900),
     * se tomará automáticamente el año actual.
     *
     * @param  {number} [year] - Año en formato numérico entero (opcional).
     * @returns {Array<Object>} Un array de objetos, donde cada objeto representa una semana del año
     *                          con su número y el período de fechas correspondiente.
     */
    getWeeksOfYear(year) {
        const formatDate = (fecha) => {
            const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            //const opciones = { month: "long", day: "numeric" };
            const formatoFecha = new Intl.DateTimeFormat("es-MX", opciones);
            const fechaFormateada = formatoFecha.format(fecha);
            // Extraer el número del día y formatearlo con dos dígitos
            const dia = fecha.getDate();
            const diaFormateado = dia < 10 ? `0${dia}` : dia;

            // Reemplaza el día en el formato de la fecha completa con el día formateado
            const fechaConDiaFormateado = fechaFormateada.replace(dia, diaFormateado);

            // Convierte solo la primera letra del nombre del día a mayúsculas
            const fechaConPrimerLetraMayuscula =
                fechaConDiaFormateado.charAt(0).toUpperCase() +
                fechaConDiaFormateado.slice(1).toLowerCase();
            return fechaConPrimerLetraMayuscula;
        };

        const currentYear = +new Intl.DateTimeFormat("es-MX", {year: "numeric"}).format(new Date());

        year = Math.round(+year) || currentYear;
        year = year >= 1900 ? year : currentYear;

        // Obtener el primer día del año
        const primerDiaAnio = new Date(year, 0, 1);
        const primerLunes = primerDiaAnio.getDay() === 0 ? 1 : 9 - primerDiaAnio.getDay(); // Ajustar para el primer lunes del año
        const fechaInicio = new Date(year, 0, primerLunes);
        const fechas = [];

        let fechaFin;

        // Generar las semanas
        for (let semana = 1; semana <= 53; semana++) {
            // Primer día de la semana (lunes)
            const inicioSemana = new Date(fechaInicio);

            // Último día de la semana (domingo)
            fechaFin = new Date(inicioSemana);
            fechaFin.setDate(inicioSemana.getDate() + 6);

            fechas.push({
                numero_semana: semana,
                plazo_semana: `Sem${semana}. ${formatDate(inicioSemana)} - ${formatDate(fechaFin)}`,
            });

            // Avanzar al siguiente lunes
            fechaInicio.setDate(fechaInicio.getDate() + 7);

            // Si llegamos al final del año, paramos.
            if (fechaInicio.getFullYear() !== year) break;
        }

        return fechas;
    }
}

// Exportar la función de manera condicional
if (typeof module !== "undefined" && module.exports) {
	// Si estamos en Node.js
	module.exports = { ExtraFunctions };
} else if (typeof window !== "undefined") {
	// Si estamos en el navegador
	window.ExtraFunctions = ExtraFunctions;
}
