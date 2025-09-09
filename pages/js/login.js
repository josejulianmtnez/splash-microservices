"use strict";

const loginForm = document.getElementById("loginForm");
// Funcion flecha, sin nombre pero que recibe un parametro

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita el envio del formulario
    const formData = new FormData(loginForm);
    try {
        // Fetch hace una peticion desde el navegador
        const response = await fetch("/api/login/", {
            method: "POST",
            headers: {
                // Que informacion le envio al servidor
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formData.get("username"),
                password: formData.get("password"),
            })
        });
        const data = await response.json();
        if (data.length != 0) {
            // La sesion la guarda en el navegador en un cookie, ver respuesta del backend
            sessionStorage.setItem("userId", data[0].id);
            window.location.href = "/dashboard";
        } else {
            alert("Credenciales incorrectas");
        }
    } catch (error) {
        console.error("Error en login:", error.message);
        alert("Error en login: " + error.message);
    }
});
