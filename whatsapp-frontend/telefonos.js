"use strict"

const paises = [
    { name: "Argentina", code: "+54", cldr: "AR" },
    { name: "Canadá", code: "+1", cldr: "CA" },
    { name: "Colombia", code: "+57", cldr: "CO" },
    { name: "Costa Rica", code: "+506", cldr: "CR" },
    { name: "Cuba", code: "+53", cldr: "CU" },
    { name: "Ecuador", code: "+593", cldr: "EC" },
    { name: "El Salvador", code: "+503", cldr: "SV" },
    { name: "España", code: "+34", cldr: "ES" },
    { name: "Estados Unidos", code: "+1", cldr: "US" },
    { name: "Francia", code: "+33", cldr: "FR" },
    { name: "Alemania", code: "+49", cldr: "DE" },
    { name: "Guatemala", code: "+502", cldr: "GT" },
    { name: "Honduras", code: "+504", cldr: "HN" },
    { name: "Italia", code: "+39", cldr: "IT" },
    { name: "Marruecos", code: "+212", cldr: "MA" },
    { name: "México", code: "+52", cldr: "MX" },
    { name: "Mónaco", code: "+377", cldr: "MC" },
    { name: "Nicaragua", code: "+505", cldr: "NI" },
    { name: "Noruega", code: "+47", cldr: "NO" },
    { name: "Países Bajos", code: "+31", cldr: "NL" },
    { name: "Panamá", code: "+507", cldr: "PA" },
    { name: "Paraguay", code: "+595", cldr: "PY" },
    { name: "Perú", code: "+51", cldr: "PE" },
    { name: "Portugal", code: "+351", cldr: "PT" },
    { name: "Puerto Rico", code: "+1", cldr: "PR" },
    { name: "Reino Unido", code: "+44", cldr: "GB" },
    { name: "República Dominicana", code: "+1", cldr: "DO" },
    { name: "Rumania", code: "+40", cldr: "RO" },
    { name: "Rusia", code: "+7", cldr: "RU" },
    { name: "Suecia", code: "+46", cldr: "SE" },
    { name: "Suiza", code: "+41", cldr: "CH" },
    { name: "Turquía", code: "+90", cldr: "TR" },
    { name: "Ucrania", code: "+380", cldr: "UA" },
    { name: "Uruguay", code: "+598", cldr: "UY" },
    { name: "Venezuela", code: "+58", cldr: "VE" }
];

function rellenarNav() {
    let el = document.getElementById('contenedor');
    let nav = document.getElementById('nav')
    let contLogo = document.getElementById('contLogo')

    nav.innerHTML='<a class="py-2 d-none d-md-inline-block text-dark" href="#plantilla">Plantillas</a>'
                +   '<a class="py-2 d-none d-md-inline-block text-dark" href="#texto">Texto</a>'
                +   '<a class="py-2 d-none d-md-inline-block text-dark" href="#interactivo">Mensajes interactivos</a>'
                +   '<a class="py-2 d-none d-md-inline-block text-dark" href="#btnRespuesta">Botones de respuesta</a>'
                +   '<a class="py-2 d-none d-md-inline-block text-dark" href="#ubicacion">Envio ubicación</a>'
                +   '<a class="py-2 d-none d-md-inline-block text-dark" href="#link">Envío link</a>'

    contLogo.classList.add("desplazamientoLogo")
    el.classList.remove("cont")
    nav.classList.remove("navbarNone")
    nav.classList.add("navbar")
    
}


function rellenarCabecera() {
    rellenarNav()
    let divs = document.querySelectorAll(".datosContacto")
    let telefono = document.getElementById("phone").value

    divs.forEach(function (div) {
        div.innerHTML = "";

        let contenedorNum = document.createElement('div')

        contenedorNum.classList = "contenedorNum"


        let p = document.createElement("p");
        let online = document.createElement("p")

        online.classList = "online"
        online.textContent = "En linea"
        p.classList = "telContactoTop";
        p.textContent = telefono;


        contenedorNum.appendChild(p)
        contenedorNum.appendChild(online)
        div.appendChild(contenedorNum);
    });

}


function main() {
    let select = document.getElementById("prefijo")
    let inputTel = document.getElementById("phone")
    let codigoPais = document.getElementById("codigoPais")
    let nombrePais = document.getElementById("nombrePais")

    paises.forEach(pais => {
        const option = document.createElement('option');
        option.value = pais.code;
        //Por defecto, codigo de España
        if (pais.cldr === "ES") {
            option.selected = true
            inputTel.value = pais.code
            codigoPais.value = pais.cldr
            nombrePais.value = pais.name
        }
        option.textContent = `${pais.name} (${pais.code})`;

        option.addEventListener("click", () => {
            inputTel.value = pais.code
            codigoPais.value = pais.cldr
            nombrePais.value = pais.name

        })

        select.appendChild(option);
    });


}

main()