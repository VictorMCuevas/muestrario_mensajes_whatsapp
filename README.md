# WhatsApp API Demo

Proyecto de demostración para enviar mensajes de WhatsApp a través de la Meta Cloud API (WhatsApp Business Platform).

Incluye un catálogo interactivo con ejemplos de todos los tipos de mensaje disponibles: plantillas, texto libre, menús interactivos, botones de respuesta, ubicación y enlace CTA.

## Estructura del proyecto

```
ProyectoWhatsapp/
├── whatsapp-backend/    # API Express — envía mensajes a WhatsApp
├── whatsapp-frontend/   # Interfaz en JS vanilla — llama al backend
└── webhook_render/      # Webhook Express — recibe mensajes entrantes
```

## Requisitos previos

- Node.js 18+
- Cuenta en [Meta for Developers](https://developers.facebook.com/)
- Un número de teléfono para pruebas (no tiene que ser de empresa)

---

## 1. Obtener credenciales de Meta

### 1.1 Crear la aplicación en Meta

1. Entra en [developers.facebook.com](https://developers.facebook.com/) e inicia sesión.
2. Haz clic en **Mis apps → Crear app**.
3. Selecciona el tipo **Empresa** y haz clic en **Siguiente**.
4. Ponle un nombre a tu app y haz clic en **Crear app**.

### 1.2 Añadir el producto WhatsApp

1. Dentro de tu app, en el panel izquierdo, busca **Añadir producto**.
2. Localiza **WhatsApp** y haz clic en **Configurar**.
3. Acepta las condiciones de uso de la API de WhatsApp Business.

### 1.3 Obtener el Token de acceso

1. Ve a **WhatsApp → Configuración de la API** en el panel izquierdo.
2. En la sección **Enviar y recibir mensajes**, verás un token temporal generado automáticamente.
3. Copia ese valor — es tu `WHATSAPP_TOKEN`.

> **Importante:** el token temporal caduca cada 24 horas. Para un entorno de producción deberás generar un token permanente desde el Business Manager.

### 1.4 Obtener el Phone Number ID

En la misma pantalla de **Configuración de la API**, debajo del token, verás un selector **De** con un número de teléfono de prueba ya asignado por Meta.

Justo debajo aparece el **ID del número de teléfono** — es tu `PHONE_ID`.

### 1.5 Obtener el App Secret

1. Ve a **Configuración → Básica** en el panel izquierdo.
2. En el campo **Clave secreta de la app**, haz clic en **Mostrar**.
3. Copia ese valor — es tu `APP_SECRET`.

### 1.6 Añadir un número de destino para pruebas

En la sandbox de Meta solo puedes enviar mensajes a números verificados.

1. En **WhatsApp → Configuración de la API**, busca la sección **A**.
2. Haz clic en **Gestionar lista de números de teléfono**.
3. Añade tu número personal y verifica el código que recibirás por WhatsApp.

---

## 2. Instalación

### 2.1 Backend

```bash
cd whatsapp-backend
npm install

# Linux / Mac
cp .env.example .env
# Windows
copy .env.example .env
```

Abre el archivo `.env` y rellena tus credenciales:

```env
WHATSAPP_TOKEN=tu_token_aqui
APP_SECRET=tu_app_secret_aqui
APP_ID=tu_app_id_aqui
PHONE_ID=tu_phone_number_id_aqui
VERIFY_TOKEN=una_palabra_secreta_que_tu_eliges
PORT=8080
```

Arranca el servidor:

```bash
npm run dev
```

El backend quedará disponible en `http://localhost:8080`.

### 2.2 Frontend

No requiere instalación. Abre directamente `whatsapp-frontend/index.html` en el navegador.

El frontend llama al backend en `http://localhost:8080`. Si cambias el puerto, actualiza la variable `URL_SERVER` en `whatsapp-frontend/app.js`.

### 2.3 Webhook (para recibir mensajes entrantes)

```bash
cd webhook_render
npm install

# Linux / Mac
cp .env.example .env
# Windows
copy .env.example .env
```

Abre el `.env` y establece el mismo `VERIFY_TOKEN` que elegiste en el paso anterior:

```env
VERIFY_TOKEN=una_palabra_secreta_que_tu_eliges
PORT=3000
```

---

## 3. Configurar el Webhook

El webhook necesita una URL pública accesible desde internet. La forma más sencilla para pruebas es desplegarlo en [Render](https://render.com) (gratuito).

### 3.1 Desplegar en Render

1. Sube la carpeta `webhook_render` a un repositorio de GitHub.
2. Entra en [render.com](https://render.com) y crea una cuenta.
3. Haz clic en **New → Web Service** y conecta tu repositorio.
4. Configura el servicio:
   - **Build Command:** `npm install`
   - **Start Command:** `node app.js`
5. En la sección **Environment**, añade la variable `VERIFY_TOKEN` con el mismo valor que usaste en el `.env`.
6. Haz clic en **Deploy**. Render te dará una URL pública del tipo `https://tu-app.onrender.com`.

### 3.2 Registrar el webhook en Meta

1. Ve a [developers.facebook.com](https://developers.facebook.com/) → tu app → **WhatsApp → Configuración**.
2. En la sección **Webhook**, haz clic en **Editar**.
3. Rellena los campos:
   - **URL de devolución de llamada:** `https://tu-app.onrender.com/webhook`
   - **Token de verificación:** el mismo valor de `VERIFY_TOKEN`
4. Haz clic en **Verificar y guardar**. Meta hará una petición GET a tu webhook para confirmar que responde correctamente.
5. Una vez verificado, suscríbete al campo **messages** para recibir los mensajes entrantes.

> Si la verificación falla, comprueba que el servicio en Render esté desplegado y activo, y que el `VERIFY_TOKEN` coincida exactamente.

---

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/template` | Enviar un mensaje de plantilla |
| POST | `/api/texto` | Enviar un mensaje de texto plano |
| POST | `/api/interactivo` | Enviar un menú de lista interactivo |
| POST | `/api/botonesrespuesta` | Enviar botones de respuesta rápida |
| POST | `/api/direccion` | Enviar una ubicación en el mapa |
| POST | `/api/url` | Enviar un botón CTA con URL |
| GET  | `/api/health` | Comprobación del estado del servidor |

Todos los endpoints POST aceptan al menos `{ "phone": "34XXXXXXXXX" }` en el cuerpo (formato internacional sin `+`). El endpoint `/api/texto` requiere además el campo `texto`:

```json
{ "phone": "34XXXXXXXXX", "texto": "Tu mensaje aquí" }
```

---

## Variables de entorno

| Variable | Dónde se usa | Descripción |
|----------|--------------|-------------|
| `WHATSAPP_TOKEN` | backend | Token de acceso a la API de Meta |
| `PHONE_ID` | backend | ID del número de teléfono emisor |
| `VERIFY_TOKEN` | webhook | Token personalizado para verificar el webhook |
| `PORT` | backend y webhook | Puerto del servidor (por defecto 8080 / 3000) |
| `APP_SECRET` | — | Clave secreta de la app (reservado, no usado actualmente) |
| `APP_ID` | — | ID de la app de Meta (reservado, no usado actualmente) |

Consulta los archivos `.env.example` de cada subproyecto para más detalle.

> **Nunca subas tu archivo `.env` al repositorio.** Está excluido por el `.gitignore`.
