/* Este archivo debe estar colocado en la carpeta raíz del sitio.
 * 
 * Cualquier cambio en el contenido de este archivo hace que el service
 * worker se reinstale. */

/**
 * Cambia el número de la versión cuando cambia el contenido de los
 * archivos.
 * 
 * El número a la izquierda del punto (.), en este caso <q>1</q>, se
 * conoce como número mayor y se cambia cuando se realizan
 * modificaciones grandes o importantes.
 * 
 * El número a la derecha del punto (.), en este caso <q>00</q>, se
 * conoce como número menor y se cambia cuando se realizan
 * modificaciones menores.
 */
const VERSION = "1.00"

/** Nombre del archivo de cache. */
const CACHE = "ejemploPWA"

/**
 * Archivos requeridos para que la aplicación funcione fuera de
 * línea.
 */
const ARCHIVOS = [
 "favicon.ico",
 "index.html",
 "site.webmanifest",
 "PWA-sencilla/css/estilos.css",
 "PWA-sencilla/img/icono2048.png",
 "PWA-sencilla/img/maskable_icon.png",
 "PWA-sencilla/img/maskable_icon_x128.png",
 "PWA-sencilla/img/maskable_icon_x192.png",
 "PWA-sencilla/img/maskable_icon_x384.png",
 "PWA-sencilla/img/maskable_icon_x48.png",
 "PWA-sencilla/img/maskable_icon_x512.png",
 "PWA-sencilla/img/maskable_icon_x72.png",
 "PWA-sencilla/img/maskable_icon_x96.png",
 "PWA-sencilla/img/screenshot_horizontal.png",
 "PWA-sencilla/img/screenshot_vertical.png",
 "PWA-sencilla/js/configura.js",
 "PWA-sencilla/lib/js/muestraError.js",
 "PWA-sencilla/lib/js/ProblemDetails.js",
 "PWA-sencilla/lib/js/registraServiceWorkerSiEsSoportado.js",
 "/"
]

// Verifica si el código corre dentro de un service worker.
if (self instanceof ServiceWorkerGlobalScope) {
 // Evento al empezar a instalar el servide worker,
 self.addEventListener("install",
  (/** @type {ExtendableEvent} */ evt) => {
   console.log("El service worker se está instalando.")
   evt.waitUntil(llenaElCache())
  })

 // Evento al solicitar información a la red.
 self.addEventListener("fetch", (/** @type {FetchEvent} */ evt) => {
  if (evt.request.method === "GET") {
   evt.respondWith(buscaLaRespuestaEnElCache(evt))
  }
 })

 // Evento cuando el service worker se vuelve activo.
 self.addEventListener("activate",
  () => console.log("El service worker está activo."))
}

async function llenaElCache() {
 console.log("Intentando cargar caché:", CACHE)
 // Borra todos los cachés.
 const keys = await caches.keys()
 for (const key of keys) {
  await caches.delete(key)
 }
 // Abre el caché de este service worker.
 const cache = await caches.open(CACHE)
 // Carga el listado de ARCHIVOS.
 await cache.addAll(ARCHIVOS)
 console.log("Cache cargado:", CACHE)
 console.log("Versión:", VERSION)
}

/** @param {FetchEvent} evt */
async function buscaLaRespuestaEnElCache(evt) {
 // Abre el caché.
 const cache = await caches.open(CACHE)
 const request = evt.request
 /* Busca la respuesta a la solicitud en el contenido del caché, sin
  * tomar en cuenta la parte después del símbolo "?" en la URL. */
 const response = await cache.match(request, { ignoreSearch: true })
 if (response === undefined) {
  /* Si no la encuentra, empieza a descargar de la red y devuelve
   * la promesa. */
  return fetch(request)
 } else {
  // Si la encuentra, devuelve la respuesta encontrada en el caché.
  return response
 }
}