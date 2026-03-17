# Proyecto: Control de Misiones Espaciales 🚀

Este es el repositorio para la aplicación de **Control de Misiones Espaciales**, un sistema para gestionar planetas, naves, astronautas, misiones y experimentos (CRUD completo) conectado a una base de datos MySQL en la nube (ej. PlanetScale).

El proyecto se divide en dos partes:
- `/client`: Frontend desarrollado en React.js (Vite).
- `/server`: Backend desarrollado en Node.js (Express.js).

---

## 🛠 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado en tu computadora:

1. [Node.js](https://nodejs.org/) (versión 18 o superior).
2. [Git](https://git-scm.com/) (opcional, para clonar el repositorio).
3. Una base de datos MySQL (local o en la nube como PlanetScale) con la estructura SQL requerida.

---

## ⚙️ Configuración del Entorno (Variables)

Debido a que el backend necesita conectarse a una base de datos, debes crear un archivo de configuración para tus credenciales. 

1. Ve a la carpeta `server/`.
2. Crea un archivo llamado **`.env`** en la carpeta principal del backend.
3. Copia el siguiente contenido dentro de tu archivo `.env` y reemplaza el enlace de la base de datos con tu URL local o tu conexión de PlanetScale:

```env
# URL de conexión a tu Base de Datos MySQL (Ej. PlanetScale)
DATABASE_URL="mysql://usuario:contraseña@servidor.aws.connect.psdb.cloud/nombre_base_datos?ssl={"rejectUnauthorized":true}"
PORT=5000
```
> ⚠️ **IMPORTANTE:** ¡NUNCA subas tu archivo `.env` a GitHub! Ya se encuentra excluido por seguridad en los archivos `.gitignore` que están configurados en ambas carpetas.

---

## 🏃 Cómo ejecutar el proyecto de forma local

Para que la aplicación funcione, necesitas levantar **ambos** servidores al mismo tiempo (el backend y el frontend) usando dos pestañas en tu terminal.

### Paso 1: Levantar el Backend (Servidor)

Abre una terminal y ejecuta los siguientes comandos:

```bash
# 1. Entra a la carpeta del servidor
cd server

# 2. Instala las dependencias necesarias
npm install

# 3. Inicia el servidor (usando nodemon para modo desarrollo)
npm run dev

# O si tienes un script diferente, simplemente usa: node app.js
```
Deberías ver un mensaje en consola diciendo que el servidor está corriendo en el puerto 5000 (o el que hayas configurado) y que la conexión a la base de datos fue exitosa.

---

### Paso 2: Levantar el Frontend (Cliente)

Abre **otra pestaña o ventana de terminal** y ejecuta:

```bash
# 1. Entra a la carpeta del cliente
cd client

# 2. Instala las dependencias necesarias (React, Vite, Axios, etc.)
npm install

# 3. Inicia el servidor de desarrollo de Vite
npm run dev
```

La terminal te mostrará una URL local, por lo general `http://localhost:5173`. 
Presiona `Ctrl + Clic` en esa URL (o cópiala y pégala) en tu navegador web.

---

## 🗄️ Información sobre la Base de Datos

Si estás iniciando el proyecto desde cero en una nueva base de datos, asegúrate de ejecutar el **Script SQL de inicialización** para crear las tablas necesarias (`planets`, `ships`, `astronauts`, `missions`, `experiments`).

Asegúrate de que las API REST (las llamadas de Axios en el frontend) de `client/src/services/api.js` estén apuntando correctamente a la ruta local `http://localhost:5000` si te encuentras en ambiente de desarrollo.

---

## ✨ Estructura del Proyecto y Navegación

El **Dashboard Principal** en el frontend te redirigirá a 5 vistas principales donde puedes ver, crear, editar y eliminar registros (CRUD):

- `/planets` -> Gestión de Planetas y destinos.
- `/ships` -> Inventario de Naves Espaciales.
- `/astronauts` -> Directorio de la Tripulación y personal activo.
- `/missions` -> Gestor de Operaciones (Vincula Naves y Planetas).
- `/experiments` -> Ensayos y analíticas vinculadas a las Misiones.

¡Disfruta gestionando tu flota intergaláctica! 🌌
