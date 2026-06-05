"use strict"

const URL_SERVER = "http://localhost:8080"

// const { json } = require("express");


//Envio de mensajes plantilla
function sendTemplate() {

    if (comprobaciones()) {
        let phone = document.getElementById("phone").value;
        envio("/api/template", phone);
    }

}


//Función que sanitiza el texto introducido, eliminando los espacios al comienzo y al final, estrayendo los caracteres en las posiciones
// entre 0 y 1000 y permite solo ciertos caracteres
function sanitizarTexto(texto) {
    return texto
        .trim()
        .slice(0, 1000)
        .replace(/[^\w\s\-.,¿?!áéíóúñ]/g, '');
}

//Envio de mensajes texto
async function sendText() {
    let alerta = document.getElementById("divAlertas")
    if (comprobaciones()) {
        
        try {
            let phone = document.getElementById("phone").value;
            
            const texto = sanitizarTexto(document.getElementById("mensaje").value);


            const response = await fetch(URL_SERVER + "/api/texto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone, texto })
            });
            const data = await response.json();
            if (!response.ok) {
                document.getElementById("mensaje").value = ""
                alerta.classList.add("alert-danger")
                alerta.innerHTML = '<div>Mensaje no enviado</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
            }     
            // }else{
            //     document.getElementById("mensaje").value = ""
            //     alerta.classList.add("alert-danger")
            //     alerta.innerHTML = '<div>Mensaje no enviado enviado</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
            // }


            console.log(data, texto);
        } catch (error) {
            document.getElementById("mensaje").value = ""
            alerta.classList.add("alert-danger")
            alerta.innerHTML = '<div>Error de conexión</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
            console.log("Error en el envío")
        }

    }



}


//Envio de mensajes listas interactivas
function sendInteractive() {

    if (comprobaciones()) {
        let phone = document.getElementById("phone").value;
        envio("/api/interactivo", phone);
    }

}


//Envio de mensajes botones de respuesta
function sendResp() {

    if (comprobaciones()) {
        let phone = document.getElementById("phone").value;
        envio("/api/botonesrespuesta", phone);
    }

}

//Envio de dirección
function sendDir() {

    if (comprobaciones()) {
        let phone = document.getElementById("phone").value;
        envio("/api/direccion", phone);
    }

}

//Envio de URL
function sendUrl() {

    if (comprobaciones()) {
        let phone = document.getElementById("phone").value;
        envio("/api/url", phone);
    } 

}

//Función asincrona que recibe el parámetro uri, con la uri en el servidor a la que enviar la petición

async function envio(uri, phone) {
    try {
        const response = await fetch(URL_SERVER + uri, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone })
        });

        if (!response.ok) {
            alert(`Error: ${response.status} ${response.statusText}`);
            return;
        }

        const data = await response.json();
        // alert("Mensaje enviado")
        console.log(data);
    } catch (e) {
        alert(`Error de conexión`);
        console.error(e);
    }
}


function comprobaciones() {
    let datosCorrectos = true

    if (!comprobarPrefijo() || !comprobarNumero()) {
        datosCorrectos = false
    }

    return datosCorrectos;
}


function comprobarPrefijo() {
    let selectPrefijo = document.getElementById("prefijo")

    if (selectPrefijo.value != "none") {
        return true;
    } else {
        alert("Seleccine un prefijo");
        return false;
    }
}

function comprobarNumero() {

    const { parsePhoneNumber } = window.libphonenumber;
    const phone = document.getElementById("phone").value;
    const codigoPais = document.getElementById("codigoPais").value;
    const nombrePais = document.getElementById("nombrePais").value

    if (!phone || !codigoPais) {
        console.log("Telefono: " + phone)
        console.log("Código pais: " + codigoPais)
        alert("Completa los campos de país y teléfono");
        return false;
    }

    try {
        const resultado = parsePhoneNumber(phone, codigoPais);

        if (resultado?.isValid()) {
            document.getElementById("phone").dataset.numeroValidado = resultado.format("E.164");
            return true;
        } else {
            alert(`Número de teléfono móvil no válido para ${nombrePais}`);
            return false;
        }
    } catch (error) {
        alert("Formato de número incorrecto");
        return false;
    }
}

