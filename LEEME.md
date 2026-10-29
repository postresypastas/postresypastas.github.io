# Carta digital de Postres y pastas

Página web de la carta, hecha con HTML, CSS y JavaScript. No necesita instalar programas ni tiene paso de compilación: lo que ves en esta carpeta es lo que se publica.

## Qué hay en la carpeta

```
index.html              La página
data/carta.js           Productos, precios, textos de bienvenida y WhatsApp (lo que vas a editar)
css/estilos.css         Colores, tamaños y diseño
css/fuentes.css         Tipografías Poppins y Lora (licencia libre SIL OFL)
js/app.js               Funcionamiento: categorías, ventana de detalle, botones
img/marca/              Logo, flor y la mascota osito en SVG (sirven también para redes e impresos)
img/carta/              Las 3 fotos que venían en la carta impresa
img/productos/          Aquí van las fotos de cada producto
herramientas/qr.html    Generador del código QR
```

## 1. Ver la página

Haz doble clic en `index.html`. Se abre en tu navegador y funciona igual que publicada. Para verla como en un celular, en Chrome pulsa F12 y luego el ícono de celular (o Ctrl + Shift + M).

## 2. Cambiar productos y precios

Abre `data/carta.js` con un editor de texto (el Bloc de notas sirve; Visual Studio Code es más cómodo porque marca los errores). Cada producto es una línea así:

```js
{ nombre: "Cortado", precio: 8, descripcion: "", foto: "", destacado: false },
```

- Para cambiar un precio, cambia el número. Usa punto para decimales: `4.5`.
- Si un precio no está confirmado, escribe `null` y la web mostrará "Precio por confirmar".
- Para agregar un producto, copia una línea entera, pégala debajo y cambia los datos.
- Para quitarlo, borra la línea completa.
- El orden de las líneas es el orden en la página. Lo mismo con las categorías.

Guarda el archivo y recarga la página. Si la carta aparece vacía con un aviso, casi siempre falta una coma al final de una línea o unas comillas.

## 3. Añadir fotos

1. Toma la foto con buena luz, de preferencia cuadrada.
2. Redúcela a unos 1200 × 1200 píxeles y menos de 300 KB. Puedes usar https://squoosh.app (gratis, en el navegador) y guardarla como WebP o JPG.
3. Ponle un nombre sin espacios ni tildes, por ejemplo `cappuccino-pistacho.webp`, y cópiala a `img/productos/`.
4. En `data/carta.js`, escribe la ruta en el producto:

```js
{ nombre: "Cappuccino pistacho", precio: 13, descripcion: "", foto: "img/productos/cappuccino-pistacho.webp", destacado: false },
```

Si usas una imagen que no es de tu producto (por ejemplo, de internet), agrega `fotoReferencial: true` y la web le pondrá la etiqueta "Foto referencial".

## 4. Destacados

Cambia `destacado: false` por `destacado: true` en los productos que quieras mostrar arriba de la carta. Si ninguno está marcado, esa sección no aparece.

## 5. WhatsApp

En `data/carta.js`, dentro de `negocio`, escribe el número con código de país y sin espacios:

```js
whatsapp: "51987654321",
```

Aparecerán dos botones: uno en la portada y otro al final de la página. Mientras esté vacío, no se muestra nada.

## 6. Publicar la web

La forma más simple es Netlify Drop:

1. Entra a https://app.netlify.com/drop
2. Arrastra la carpeta completa `carta-digital` (la que contiene `index.html`) al recuadro.
3. En unos segundos te da una dirección del tipo `https://nombre-raro-123.netlify.app`.
4. Crea una cuenta gratuita y reclama el sitio. Los sitios que no se reclaman se borran en una hora.
5. En la configuración del sitio puedes cambiar el nombre, por ejemplo `postresypastas.netlify.app`. Hazlo antes de crear el QR.

Para actualizar la carta después: entra a tu sitio en Netlify, ve a la sección de despliegues (Deploys) y arrastra de nuevo la carpeta. La dirección no cambia, así que el QR impreso sigue funcionando.

Otras opciones gratuitas que también sirven: GitHub Pages y Cloudflare Pages.

## 7. Generar el QR definitivo

1. Publica la carta y confirma la dirección final (con el nombre ya cambiado).
2. Copia esa dirección en `urlPublica` dentro de `data/carta.js` (así queda guardada).
3. Abre `herramientas/qr.html` con doble clic. Si guardaste la dirección, el QR aparece solo; si no, pégala en el campo.
4. Descarga el PNG para usarlo en Canva o redes, o el SVG para imprenta.
5. Antes de imprimir, escanéalo con dos celulares distintos.

Este QR apunta directo a tu página y no caduca. Evita los generadores de QR "dinámicos" de internet: muchos redirigen por sus propios servidores y dejan de funcionar cuando termina la prueba gratuita.

## 8. Mascota

Los archivos de `img/marca/` son vectoriales y se pueden agrandar sin perder calidad:

- `osito-taza.svg`: el osito saludando con la taza (portada, redes, soportes de mesa).
- `osito-cara.svg`: solo la cara (ícono, sellos, stickers).
- `osito-asoma.svg`: el osito asomándose con las patitas (bordes de piezas gráficas).
- `logo.svg`: el logo de la carta redibujado en vector a partir de la imagen. Si tienes el archivo original del logo (por ejemplo, en Canva), es mejor reemplazarlo por ese.

Canva acepta archivos SVG para subirlos como elementos.
