/*
  CARTA DE POSTRES Y PASTAS
  ==========================
  Este es el único archivo que necesitas tocar para cambiar productos,
  precios, descripciones o fotos. El diseño se actualiza solo.

  Cada producto tiene estos campos:
    nombre       Texto tal como aparece en la carta.
    precio       Número en soles, sin "S/". Ejemplo: 12 o 4.5
                 Si todavía no sabes el precio, pon null y la web
                 mostrará "Precio por confirmar".
    descripcion  Texto opcional. Déjalo en "" si no hay.
    foto         Ruta de la foto, por ejemplo "img/productos/cortado.webp".
                 Déjalo en "" y se mostrará un espacio ilustrado.
    fotoReferencial  Pon true si la foto NO es de tu producto real
                 (por ejemplo, una imagen de internet). La web le pondrá
                 la etiqueta "Foto referencial".
    destacado    Pon true para que aparezca en "Destacados".
                 Si ningún producto tiene true, esa sección no se muestra.

  Para agregar un producto, copia una línea completa { ... }, pégala
  debajo y cambia los datos. Cuida que cada línea termine en coma.
*/

window.CARTA = {
  negocio: {
    nombre: "Postres y pastas",
    bienvenida: "Un abrazo de oso en cada taza",
    subtitulo: "Café, postres y pastas para quedarse un ratito más.",
    moneda: "S/",

    // Número de WhatsApp con código de país, sin "+", espacios ni guiones.
    // Ejemplo para Perú: "51987654321". Vacío = el botón no aparece.
    whatsapp: "",
    mensajeWhatsapp: "Hola, vengo de la carta digital.",

    // Dirección pública de la carta cuando esté publicada (para el QR).
    urlPublica: "https://postresypastas.github.io/"
  },

  categorias: [
    {
      id: "cafe",
      nombre: "Café",
      icono: "taza",
      productos: [
        { nombre: "Cortado", precio: 8, descripcion: "", foto: "", destacado: false },
        { nombre: "Latte", precio: 10, descripcion: "", foto: "", destacado: false },
        { nombre: "Mocca", precio: 10, descripcion: "", foto: "", destacado: false },
        { nombre: "Cappuccino", precio: 13, descripcion: "", foto: "", destacado: false },
        { nombre: "Cappuccino pistacho", precio: 13, descripcion: "", foto: "", destacado: false },
        { nombre: "Cappuccino nutella", precio: 12, descripcion: "", foto: "", destacado: false },
        { nombre: "Iced late", precio: 12, descripcion: "", foto: "", destacado: false },
        { nombre: "Iced late Nutella /pistacho/lotus", precio: 13, descripcion: "", foto: "", destacado: false },
        { nombre: "Espresso", precio: 8, descripcion: "", foto: "", destacado: false }
      ]
    },
    {
      id: "bebidas",
      nombre: "Bebidas",
      icono: "vaso",
      productos: [
        { nombre: "Agua", precio: 4, descripcion: "", foto: "", destacado: false },
        { nombre: "Infusiones La Fidelia", precio: 8, descripcion: "Lucuma, frutos rojos, menta", foto: "", destacado: false },
        { nombre: "Gaseosas", precio: 4, descripcion: "", foto: "", destacado: false },
        { nombre: "Jugo de fresa", precio: 9, descripcion: "", foto: "", destacado: false },
        { nombre: "Jugo de piña", precio: 9, descripcion: "", foto: "", destacado: false },
        { nombre: "Batido de fresa", precio: 12, descripcion: "", foto: "", destacado: false }
      ]
    },
    {
      id: "pasteleria",
      nombre: "Pastelería",
      icono: "torta",
      productos: [
        { nombre: "Torta de chocolate", precio: 19, descripcion: "", foto: "", destacado: false },
        { nombre: "Torta chocomanjar", precio: 19, descripcion: "", foto: "", destacado: false },
        { nombre: "T. Chocolate C/ fresa", precio: 22, descripcion: "", foto: "", destacado: false },
        { nombre: "Pye de limon", precio: 17, descripcion: "", foto: "", destacado: false },
        { nombre: "Crema volteada", precio: 15, descripcion: "", foto: "", destacado: false },
        { nombre: "Galleta chispas", precio: 10, descripcion: "", foto: "", destacado: false },
        { nombre: "GalletaC/ nutella", precio: 12, descripcion: "", foto: "", destacado: false },
        { nombre: "Torta de alfajor", precio: 19, descripcion: "", foto: "", destacado: false },
        { nombre: "Torta alfajor C/fresa", precio: 20, descripcion: "", foto: "", destacado: false },
        { nombre: "Tres leches", precio: 17, descripcion: "", foto: "", destacado: false },
        { nombre: "torta de zanahoria", precio: 15, descripcion: "", foto: "", destacado: false }
      ]
    },
    {
      id: "galletas",
      nombre: "Galletas",
      icono: "galleta",
      productos: [
        { nombre: "Chispas de chocolate", precio: 10, descripcion: "", foto: "", destacado: false },
        { nombre: "Nutella", precio: 12, descripcion: "", foto: "", destacado: false },
        { nombre: "Bon o bon", precio: 12, descripcion: "", foto: "", destacado: false },
        { nombre: "Lotus", precio: 12, descripcion: "", foto: "", destacado: false },
        { nombre: "Pistacho", precio: 12, descripcion: "", foto: "", destacado: false }
      ]
    },
    {
      id: "crepes",
      nombre: "Crepes",
      icono: "crepe",
      productos: [
        { nombre: "Clásico c/ manjar de olla", precio: 19, descripcion: "", foto: "", destacado: false },
        { nombre: "Clásico c/Fudge de olla", precio: 19, descripcion: "", foto: "", destacado: false },
        { nombre: "Manjar y fresas", precio: 20, descripcion: "", foto: "", destacado: false },
        { nombre: "fudge y fresas", precio: 20, descripcion: "", foto: "", destacado: false },
        { nombre: "Manjar y frambuesa", precio: 22, descripcion: "", foto: "", destacado: false },
        { nombre: "Fudge y frambuesa", precio: 22, descripcion: "", foto: "", destacado: false },
        { nombre: "Pistacho con manjar de pistacho", precio: 21, descripcion: "", foto: "", destacado: false },
        { nombre: "Nutella", precio: 21, descripcion: "", foto: "", destacado: false },
        { nombre: "Manjar De Lucuma", precio: 20, descripcion: "", foto: "", destacado: false },
        { nombre: "Helado chispas", precio: 20, descripcion: "", foto: "", destacado: false },
        { nombre: "Crema de pistacho y frambuesa", precio: 22, descripcion: "", foto: "", destacado: false }
      ]
    },
    {
      id: "salado",
      nombre: "Salado",
      icono: "salado",
      productos: [
        { nombre: "Capresse foccacia", precio: 17, descripcion: "", foto: "", destacado: false },
        { nombre: "S. Mixto C/ papas lays", precio: 10, descripcion: "", foto: "", destacado: false },
        { nombre: "Lasagna de carne", precio: 22, descripcion: "", foto: "", destacado: false },
        { nombre: "Sandwich con pollo", precio: 12, descripcion: "", foto: "", destacado: false },
        { nombre: "Sandwich con pavo", precio: 16, descripcion: "", foto: "", destacado: false },
        { nombre: "Empanada de carne", precio: 12, descripcion: "", foto: "", destacado: false }
      ]
    }
  ]
};
