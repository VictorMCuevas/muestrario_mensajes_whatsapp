require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors()); // Permite solicitudes desde el frontend

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_ID;

// ============= RUTAS DE API =============

// Endpoint para enviar mensaje tipo plantilla
app.post("/api/template", async (req, res) => {
    const phone = req.body.phone;

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: phone,
                type: "template",
                template: {
                    // name:"mensaje_predeterminado",
                    name: "mensaje_de_prueba",
                    language: {
                        code: "es"
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        
        res.json(response.data);
        console.log(response.data)
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: "error sending message" });
    }
});

// Endpoint para enviar mensaje de texto
app.post("/api/texto", async (req, res) => {
    const phone = req.body.phone;
    const mensaje = req.body.texto;

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: phone,
                type: "text",
                text: {
                    preview_url: false,
                    body: mensaje
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: "error sending message" });
    }
});

//Endopoint para envio de mensajes interactivos
app.post("/api/interactivo", async(req,res)=>{
    const phone = req.body.phone;
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: phone,
                type: "interactive",
                interactive: {
                    type: "list",
                    header: {
                        type : "text",
                        text: "Menú interactivo"
                    },
                    body: {
                        text: "¿Cómo podemos ayudarte?"
                    },
                    footer:{
                        text: "Aplicación en pruebas"
                    },

                    action:{
                        button: "Opciones",
                        sections: [
                            {
                                title: "Agenda",
                                rows:[
                                    {
                                        id: "reservar_cita",
                                        title: "Reservar cita",
                                        description: "Reserva una cita con nosotros"
                                    },
                                    {
                                        id: "modifica_cita",
                                        title: "Modifica cita",
                                        description: "Modifica una cita ya fijada"
                                    },
                                    {
                                        id: "anular_cita",
                                        title: "Anula cita",
                                        description: "Anular una cita ya fijada"
                                    },

                                ]
                            },
                            {
                                title: "Catálogo",
                                rows:[
                                    {
                                        id: "ver_catalogo",
                                        title: "Ver catálogo",
                                        description: "Echa un ojo a nuestro catálogo"
                                    },
                                ]
                            },
                            {
                                title: "Contacto",
                                rows:[
                                    {
                                        id: "mostrar_direccion",
                                        title: "Solicitar dirección",
                                        description: "Conoce nuestra dirección y visítanos"
                                    },
                                    {
                                        id: "solicitar_llamada",
                                        title: "Contacto telefónico",
                                        description: "Uno de nuestros operadores se pondrá en contacto via telefónica"
                                    },

                                ]
                            }
                        ]
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: "error sending message" });
    }

});

//Endopoint para envio de mensajes con respuestas
app.post("/api/botonesrespuesta", async(req,res)=>{
    const phone = req.body.phone;
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual", 
                to: phone,
                type: "interactive",
                interactive: {
                    type: "button",
                    header: {
                        type : "image",
                        image: {
                            link:"https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png"
                        }
                    },
                    body: {
                        text: "¿Cómo podemos ayudarte?"
                    },
                    footer:{
                        text: "Aplicación en pruebas"
                    },

                    action:{
                         buttons:[
                            {
                                type:"reply",
                                reply: {
                                    id: "btn-cita",
                                    title: "Obtener cita"
                                }
                            },
                            {
                                type:"reply",
                                reply: {
                                    id: "btn-catalogo",
                                    title: "Obtener catálogo"
                                }
                            },
                            {
                                type:"reply",
                                reply: {
                                    id: "btn-contacto",
                                    title: "Datos de contacto"
                                }
                            },
                         ]
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: "error sending message" });
    }

});

//Endopoint para envio de mensajes con dirección
app.post("/api/direccion", async(req,res)=>{
    const phone = req.body.phone;
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual", 
                to: phone,
                type: "location",
                location: {
                    latitude:"42.59933862260805",
                    longitude:"-5.567296128345739",
                    name:"Catedral de León",
                    address: "Pl. de Regla, s/n, 24003 León" 
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: "error sending message" });
    }
})

//Endpoint para envio de URL
app.post("/api/url", async(req,res)=>{
    const phone = req.body.phone;
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual", 
                to: phone,
                type: "interactive",
                interactive: {
                    type: "cta_url",
                     header:{
                        type: "image",
                        image: {
                            link:"https://victormcuevas.github.io/images/logo.png"
                            // link:"https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png"
                        }
                     },
                     body:{
                        text: "Para conocer todos los detalles sobre nuestro servicio, haz clic en el botón de abajo y visita nuestra página web.\n \nSi tienes alguna duda, también puedes responder a este mensaje y te ayudaremos."
                     },
                     action:{
                        name: "cta_url",
                        parameters:{
                            display_text:"Mi portfolio",
                            url:"https://victormcuevas.github.io/"
                        }
                     },
                     footer:{
                        text: "https://victormcuevas.github.io/"
                     }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json(error.response?.data || { error: "error sending message" });
    }
})

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "Backend running" });
});

// ============= INICIAR SERVIDOR =============
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en puerto ${PORT}`);
    console.log(`Accede a http://localhost:${PORT}`);
});
