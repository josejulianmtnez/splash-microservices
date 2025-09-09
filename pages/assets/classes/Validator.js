/**
 * Class Validator
 * clase encargada de validar los datos ingresados en los formularios de sedes
 */
export class Validator {
    #OK = "success"
    #WARN = "warning"
    #ERR = "error"

    #WARN_MSG = "Advertencia"
    #ERR_MSG = "Error"
    #OK_MSG = "Registrado"

    /**
     * Verifica si el valor de alguna llave este vacía.
     * Se le puede incluir en valor equivalente a nulo que se quiera excluir
     * para la validación
     * 
     * @param {Object} data - datos de la sede
     * @param {Object} excep - valor de excepción
     * @returns {boolean}
     */
    isObjAnyEmptyValue(obj) {
        for (const key in obj) {
            if (
                obj[key] === undefined ||
                obj[key] === "" ||
                Number.isNaN(obj[key])
            ) {
                return true
            }
        }
        return false
    }

    /**
     * Verifica si el valor es `null`, `undefined`, `NaN` o `""`
     * 
     * @param {any} value - valor a verificar
     * @returns {boolean} boolean
     */
    isEmpty(value) {
        return value === null ||
            value === undefined ||
            value === "" ||
            Number.isNaN(value)
    }

    /**
     * Verifica si el nombre de la sede es válido
     * 
     * @param {string} sede - nombre de la sede 
     * @returns {boolean}
     */
    _isValidSedeName(sede) {
        return /^[A-Za-z0-9 \.-áéíóúÁÉÍÓÚñÑ]+$/.test(sede)
    }

    /**
     * En los `<input type="text">` elimina los caracteres que cumplan con la expresión regular durante el evento `input`
     * 
     * @param {HTMLElement} input - input del formulario
     * @param {RegExp} re - expresión regular
     */
    purgeCharsInInput(input, re) {
        input.addEventListener("input", () => {
            input.value.charAt(0) === ' ' ? input.value = '' : input.value;
            input.value = input.value.replace(/ {2,}/g, ' ')
            input.value = input.value.replace(re ,"")
        })
    }

    /**
     * Devuelve el número correspondiente al día de la semana ingresado
     * (El dia debe estar escrito con letra capital y acentos)
     * 
     * @param {string} day 
     * @returns {number | undefined}
     */
    dayToNum(day) {
        const x = {
            "Lunes": 1,
            "Martes": 2,
            "Miércoles": 3,
            "Jueves": 4,
            "Viernes": 5,
            "Sábado": 6,
            "Domingo": 7
        }

        return x[day]
    }

    /**
     * Devuelve el día de la semana correspondiente al número ingresado
     * 
     * @param {Number} num 
     * @returns {string | undefined}
     */
    numToDay(num) {
        const x = {
            1: "Lunes",
            2: "Martes",
            3: "Miércoles",
            4: "Jueves",
            5: "Viernes",
            6: "Sábado",
            7: "Domingo"
        }

        return x[num]
    }

    /**
     * Devuelve el tipo de días que son los ingresados de acuerdo a las siguientes banderas
     * 
     * - `0`: Ninguno de los dos días es válido
     * - `1`: Uno o ambos días son entre semana
     * - `2`: Uno o ambos días son fin de semana
     * - `3`: Son días de diferente tipo
     * 
     * @param {Number} n1 - número del primer día
     * @param {Number} n2 - número del segundo día
     * @returns {Number} 0 | 1 | 2 | 3
     */
    whatKindOfDaysAre(n1, n2) {
        const n1f = 1 <= n1 && n1 <= 5 ? 1 : 6 <= n1 && n1 <= 7 ? 2 : 0
        const n2f = 1 <= n2 && n2 <= 5 ? 1 : 6 <= n2 && n2 <= 7 ? 2 : 0
    
        if (n1f == 0 && n2f == 0) return 0
        if ((n1f == 0 && n2f == 1) || (n1f == 1 && n2f == 0) || (n1f == 1 && n2f == 1)) return 1
        if ((n1f == 0 && n2f == 2) || (n1f == 2 && n2f == 0) || (n1f == 2 && n2f == 2)) return 2
        if ((n1f == 1 && n2f == 2) || (n1f == 2 && n2f == 1)) return 3
    }

    /**
     * Valida los datos ingresados en el formulario de agregar sede
     * 
     * @param {Object} data - datos de la sede proveniente del formulario
     * @param {Array<Object>} sedes - sedes existentes
     * @returns {Object} { type: string, title: string, message: string }
     */ 
    insertSede(data, sedes) {
        if (this.isEmpty(data.diaInicio) && this.isEmpty(data.diaCierre)) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "Seleccione los días de inicio y cierre."
            }
        }

        const kindDay = this.whatKindOfDaysAre(this.dayToNum(data.diaInicio), this.dayToNum(data.diaCierre))
        if (kindDay == 1) {
            delete data.horaInicioFinSemana
            delete data.horaCierreFinSemana

        } else if (kindDay == 2) {
            delete data.horaInicioSemana
            delete data.horaCierreSemana
        }

        if (this.isObjAnyEmptyValue(data)) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "Complete todos los campos."
            }
        }

        if (this.dayToNum(data.diaInicio) > this.dayToNum(data.diaCierre)) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "El día de inicio no puede ser mayor al día de cierre."
            }
        }

        if (sedes.find(s => s.sede === data.sede && s.estatus === "Activo")) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "La sede ya existe y está activa."
            }
        }

        /**
         * ┌──────────────────┐
         * │    ERRORES    │
         * └──────────────────┘
         */

        if (!this._isValidSedeName(data.sede)) {
            return {
                type: this.#ERR,
                title: this.#ERR_MSG,
                message: "Nombre de sede inválido. Solo se permiten letras, números, espacios, \".\", \"-\" y acentos."
            }
        }

        if (
            data.horaInicioSemana >= data.horaCierreSemana ||
            data.horaInicioFinSemana >= data.horaCierreFinSemana
        ) {
            return {
                type: this.#ERR,
                title: this.#ERR_MSG,
                message: "La hora de inicio no puede ser mayor o igual a la hora de cierre."
            }
        }

        return {
            type: this.#OK,
            title: this.#OK_MSG,
            message: "Sede registrada correctamente."
        }
    }

    /**
     * Valida los datos ingresados en el formulario de actualizar sede
     * 
     * @param {Object} data - datos de la sede proveniente del formulario
     * @param {Array<Object>} sedes - sedes existentes
     * @returns {Object} { type: string, title: string, message: string }
     */
    updateSede(data, sedes) {
        if (this.isEmpty(data.diaInicio) && this.isEmpty(data.diaCierre)) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "Seleccione los días de inicio y cierre."
            }
        }

        const kindDay = this.whatKindOfDaysAre(this.dayToNum(data.diaInicio), this.dayToNum(data.diaCierre))
        if (kindDay == 1) {
            delete data.horaInicioFinSemana
            delete data.horaCierreFinSemana

        } else if (kindDay == 2) {
            delete data.horaInicioSemana
            delete data.horaCierreSemana
        }
        
        if (this.isObjAnyEmptyValue(data)) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "Complete todos los campos."
            }
        }

        if (this.dayToNum(data.diaInicio) > this.dayToNum(data.diaCierre)) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "El día de inicio no puede ser mayor al día de cierre."
            }
        }

        if (sedes.find(s => {
            return (
                s.sede === data.sede &&
                s.dia_inicio === data.diaInicio &&
                s.dia_cierre === data.diaCierre &&
                s.hora_inicio_semana === data.horaInicioSemana &&
                s.hora_cierre_semana === data.horaCierreSemana &&
                s.hora_inicio_fin_semana === data.horaInicioFinSemana &&
                s.hora_cierre_fin_semana === data.horaCierreFinSemana
            )
        })) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "La información es la misma."
            }
        }

        if (sedes.find(s => {
            return (
                s.sede === data.sede &&
                s.estatus === "Activo" &&
                s.id_sede !== data.idSede
            )
        })) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: `La sede ${data.sede} ya existe y esta activa.`
            }
        }

        /**
         * ┌──────────────────┐
         * │    ERRORES    │
         * └──────────────────┘
         */

        if (!this._isValidSedeName(data.sede)) {
            return {
                type: this.#ERR,
                title: this.#ERR_MSG,
                message: "Error: Nombre de sede inválido. Solo se permiten letras, números, espacios, \".\", \"-\" y acentos."
            }
        }

        if (
            data.horaInicioSemana >= data.horaCierreSemana ||
            data.horaInicioFinSemana >= data.horaCierreFinSemana
        ) {
            return {
                type: this.#ERR,
                title: this.#ERR_MSG,
                message: "Horas inválidas."
            }
        }

        return {
            type: this.#OK,
            title: "Editado",
            message: `La sede ${data.sede} fue editada con éxito.`
        }
    }




    

    /**
     * Muestra una alerta tipo popover en un elemento HTML específico.
     * 
     * @param {HTMLElement} element - El elemento HTML donde se mostrará la alerta (por ejemplo, un botón o div).
     * @param {String} content - El contenido de la alerta que se mostrará.
     * @param {String} placement - La posición de la alerta en relación con el elemento. [top | bottom | right | left]
     * @param {String} type - El tipo de alerta. [info | warning | error | success] 
     *  
     */

    popoverAlert = (element, content, placement, type) => {
        const backPopover = bootstrap.Popover.getInstance(element);
        let title;
    
        if (backPopover) {
            popover.dispose(); // Eliminar la instancia del popover
        }
    
        !content ? content = 'Mensaje' : content
        !type ? type = 'warning' : type
        !placement ? placement = 'top' : placement
        
        if(type == 'warning'){
            title = "Advertencia"
        } else if(type == 'error'){
            title = "Error"
        } else if(type == 'success'){
            title = "Éxito"
        } else if(type == 'info'){
            title = "Información"
        }
    
        
        element.setAttribute('data-bs-content', content)
        element.setAttribute('data-bs-toggle', 'popover')
        element.setAttribute('data-bs-custom-class', `popover-${type}`)
        element.setAttribute('data-bs-title', title)
        element.setAttribute('data-bs-placement', placement)
        element.setAttribute('data-bs-trigger', 'focus')
    
        // Si no existe la instancia, creamos el popover y lo mostramos
        const popover = new bootstrap.Popover(element);
        popover.show();
    
        const clickHandler = () => {
            element.removeAttribute('data-bs-content')
            element.removeAttribute('data-bs-trigger')
            element.removeAttribute('data-bs-custom-class')
            element.removeAttribute('data-bs-title')
            element.removeAttribute('data-bs-placement')
            // Obtener todos los elementos con un popover
            const popoverElements = document.querySelectorAll('[data-bs-toggle="popover"]');
    
            // Recorrer todos los elementos y eliminar sus popovers
            popoverElements.forEach(elementPop => {
                const popover = bootstrap.Popover.getInstance(elementPop);
                if (popover && element !== elementPop) {
                    popover.hide(); // Eliminar la instancia del popover
                }
            });
            element.removeEventListener('click', clickHandler);
        };
        element.addEventListener('click', clickHandler);
    }

    resetPopovers = () => {
        // Obtener todos los elementos con un popover
        const popoverElements = document.querySelectorAll('[data-bs-toggle="popover"]');
    
        // Recorrer todos los elementos y eliminar sus popovers
        popoverElements.forEach(element => {
            const popover = bootstrap.Popover.getInstance(element);
            if (popover) {
                element.removeAttribute('data-bs-toggle')
                popover.dispose(); // Eliminar la instancia del popover
            }
        });
    }

    insertVacante(data, vacantes) {
        // campos incompletos
        if (this.isObjAnyEmptyValue(data)) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "Complete todos los campos requeridos."
            }
        }

        // sede o area no seleccionada
        if (data.id_sede <= 0 || data.id_area <= 0) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "Seleccione una sede y un área."
            }
        }

        // registro duplicado
        for (const v of vacantes) {
            if (v.nombre_puesto === data.nombre_puesto &&
                v.habilidades === data.habilidades &&
                v.experiencia === data.experiencia &&
                v.educacion === data.educacion &&
                v.fecha_apertura_vacante === data.fecha_apertura_vacante &&
                v.fecha_cierre_vacante === data.fecha_cierre_vacante &&
                v.numero_posiciones === data.numero_posiciones
            ) {
                return {
                    type: this.#WARN,
                    title: this.#WARN_MSG,
                    message: "La vacante ya existe."
                }
            }
        }

        // vacante identica en el mismo lugar
        for (const v of vacantes) {
            if (v.id_sede === data.id_sede &&
                v.id_area === data.id_area &&
                v.nombre_puesto == data.nombre_puesto
            ) {
                return {
                    type: this.#WARN,
                    title: this.#WARN_MSG,
                    message: "Ya existe la vacante para la misma sede y área."
                }
            }
        }
        
        // fecha de cierre no puede ser menor o igual a la de apertura
        if (data.fechaAperturaVacante >= data.fechaCierreVacante) {
            return {
                type: this.#WARN,
                title: this.#WARN_MSG,
                message: "La fecha de cierre no puede ser menor o igual a la de apertura."
            }
        }

        // confirmacion 
        return {
            type: this.#OK,
            title: this.#OK_MSG,
            message: "Vacante registrada correctamente."
        }
    }
}