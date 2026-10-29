/*
  Carta digital de Postres y pastas.
  Lee los productos de data/carta.js y arma la página.
  Para cambiar productos o precios no hace falta tocar este archivo.
*/
(function () {
  "use strict";

  const $ = (sel, raiz) => (raiz || document).querySelector(sel);
  const $$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const panel = $("[data-panel]");
  const datos = window.CARTA;

  if (!datos || !Array.isArray(datos.categorias) || !datos.categorias.length) {
    panel.innerHTML = '<p class="aviso">No se pudo cargar la carta. Revisa el archivo data/carta.js: puede faltar una coma, una llave o unas comillas.</p>';
    return;
  }

  const negocio = datos.negocio || {};
  const categorias = datos.categorias;
  const moneda = negocio.moneda || "S/";

  /* ---------- Ilustraciones para los productos sin foto ---------- */
  const ICONOS = {
    taza: '<path d="M15 28h30v9a15 15 0 0 1-30 0z"/><path d="M45 31h3.5a6.5 6.5 0 0 1 0 13H44"/><path d="M10 57h42"/><path d="M24 20c-3-3 3-6 0-10M33 20c-3-3 3-6 0-10"/>',
    vaso: '<path d="M19 20h26l-3.4 33.4a3 3 0 0 1-3 2.6H25.4a3 3 0 0 1-3-2.6z"/><path d="M20.6 33c3.8 2 7.6 2 11.4 0s7.6-2 11.4 0"/><path d="M33 20l5-12h7"/><circle cx="46" cy="20" r="6"/><path d="M46 14v12M40 20h12"/>',
    torta: '<path d="M10 36 46 22l8 8z"/><path d="M10 36v16l44-6V30"/><path d="M10 44.5 54 38.5"/><circle cx="37" cy="24" r="4.5"/><path d="M38.5 19.8c.8-3.4 3-5.6 6-6.4"/>',
    galleta: '<path d="M52.3 26.6A21 21 0 1 1 39.2 12.3a6 6 0 0 0 6.5 7 6 6 0 0 0 6.6 7.3z"/><circle class="relleno" cx="25" cy="27" r="2.6"/><circle class="relleno" cx="36" cy="38" r="2.6"/><circle class="relleno" cx="23" cy="41" r="2.6"/><circle class="relleno" cx="38" cy="27" r="2.2"/><circle class="relleno" cx="30" cy="47" r="2.2"/>',
    crepe: '<ellipse cx="32" cy="50" rx="27" ry="7"/><path d="M15 47h31a31 31 0 0 0-31-31z"/><path d="M15 47 37 25"/><path d="M22 36c4-3 7 2 11-1s6-6 10-3"/>',
    salado: '<path d="M6 46a26 24 0 0 1 52 0z"/><path d="M13 46a19 17 0 0 1 38 0"/><path d="M13.9 40.1L8.9 35.2M16.6 34.8L13.4 28.6M20.8 30.6L19.6 23.7M26.1 27.9L27.1 21.0M32.0 27.0L35.1 20.7M37.9 27.9L42.8 22.9M43.2 30.6L49.4 27.4M47.4 34.8L54.3 33.6M50.1 40.1L57.0 41.1"/>'
  };
  const TONOS = {
    taza: "var(--manjar)", vaso: "var(--pistacho)", torta: "var(--algodon)",
    galleta: "var(--manjar)", crepe: "var(--algodon)", salado: "var(--pistacho)"
  };

  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));

  function precioTexto(precio) {
    if (typeof precio !== "number" || isNaN(precio)) return "";
    return moneda + " " + (Number.isInteger(precio) ? precio : precio.toFixed(2));
  }

  function fotoHTML(p, cat) {
    if (p.foto) {
      return '<img src="' + esc(p.foto) + '" alt="' + esc(p.nombre) + '" loading="lazy" decoding="async">' +
        (p.fotoReferencial ? '<span class="sello">Foto referencial</span>' : "");
    }
    return '<svg class="foto-vacia" viewBox="0 0 64 64" aria-hidden="true">' + (ICONOS[cat.icono] || ICONOS.taza) + "</svg>";
  }

  /* ---------- Índice de productos ---------- */
  const indice = {};
  categorias.forEach((cat) => {
    (cat.productos || []).forEach((p, i) => { indice[cat.id + "-" + i] = { p: p, cat: cat }; });
  });

  function tarjetaHTML(id, i, conCategoria) {
    const { p, cat } = indice[id];
    const precio = precioTexto(p.precio);
    return '<li style="--i:' + i + '">' +
      '<button class="tarjeta" type="button" data-producto="' + id + '" aria-haspopup="dialog">' +
        '<span class="tarjeta__foto" style="--tono:' + (TONOS[cat.icono] || "var(--algodon)") + '">' + fotoHTML(p, cat) + "</span>" +
        (conCategoria ? '<span class="tarjeta__categoria">' + esc(cat.nombre) + "</span>" : "") +
        '<span class="tarjeta__nombre">' + esc(p.nombre) + "</span>" +
        (precio
          ? '<span class="tarjeta__precio">' + precio + "</span>"
          : '<span class="tarjeta__precio tarjeta__precio--pendiente">Precio por confirmar</span>') +
        (p.descripcion ? '<span class="tarjeta__desc">' + esc(p.descripcion) + "</span>" : "") +
      "</button></li>";
  }

  /* ---------- Contador de visitas (Google Analytics) ---------- */
  const idAnaliticas = String(negocio.googleAnalytics || "").trim();
  if (/^G-[A-Z0-9]+$/i.test(idAnaliticas)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", idAnaliticas);
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(idAnaliticas);
    document.head.appendChild(script);
  }

  /* ---------- Textos del negocio y WhatsApp ---------- */
  $$("[data-texto]").forEach((el) => {
    const valor = negocio[el.getAttribute("data-texto")];
    if (valor) el.textContent = valor;
  });
  if (negocio.nombre) document.title = "Carta | " + negocio.nombre;

  const numero = String(negocio.whatsapp || "").replace(/\D/g, "");
  if (numero.length >= 8) {
    const enlace = "https://wa.me/" + numero + (negocio.mensajeWhatsapp ? "?text=" + encodeURIComponent(negocio.mensajeWhatsapp) : "");
    $$("[data-whatsapp]").forEach((a) => { a.href = enlace; a.hidden = false; });
  }

  /* ---------- Destacados ---------- */
  const destacados = Object.keys(indice).filter((id) => indice[id].p.destacado === true);
  if (destacados.length) {
    $("[data-fila-destacados]").innerHTML = destacados.map((id, i) => tarjetaHTML(id, i, true)).join("");
    $("[data-destacados]").hidden = false;
  }

  /* ---------- Categorías ---------- */
  const lista = $("[data-lista-categorias]");
  panel.id = "panel-carta";
  lista.innerHTML = categorias.map((c, i) =>
    '<button class="chip" type="button" role="tab" id="tab-' + esc(c.id) + '" aria-controls="panel-carta" aria-selected="false" tabindex="-1" data-cat="' + i + '">' + esc(c.nombre) + "</button>"
  ).join("");
  const chips = $$(".chip", lista);
  let actual = -1;

  function mostrar(i, opciones) {
    const cat = categorias[i];
    actual = i;
    chips.forEach((chip, j) => {
      const elegido = j === i;
      chip.setAttribute("aria-selected", String(elegido));
      chip.tabIndex = elegido ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", "tab-" + cat.id);

    const ids = (cat.productos || []).map((_, k) => cat.id + "-" + k);
    const n = ids.length;
    const siguiente = categorias[(i + 1) % categorias.length];
    const textoSiguiente = i + 1 < categorias.length ? "Seguir con " + siguiente.nombre : "Volver a " + siguiente.nombre;

    panel.innerHTML =
      '<header class="panel__cabecera">' +
        '<h2 class="panel__titulo">' + esc(cat.nombre) + "</h2>" +
        '<p class="panel__cuenta">' + n + (n === 1 ? " producto" : " productos") + "</p>" +
      "</header>" +
      '<ul class="rejilla">' + ids.map((id, k) => tarjetaHTML(id, k)).join("") + "</ul>" +
      (categorias.length > 1
        ? '<button class="boton boton--suave panel__siguiente" type="button" data-ir-categoria="' + ((i + 1) % categorias.length) + '">' + esc(textoSiguiente) + "</button>"
        : "");

    panel.removeAttribute("data-entrando");
    void panel.offsetWidth; // reinicia la animación de entrada
    panel.setAttribute("data-entrando", "");

    // centra la categoría elegida dentro de la barra, sin mover la página
    const chip = chips[i];
    if (lista.scrollWidth > lista.clientWidth) {
      lista.scrollTo({
        left: chip.offsetLeft - (lista.clientWidth - chip.offsetWidth) / 2,
        behavior: sinMovimiento ? "auto" : "smooth"
      });
    }

    if (opciones && opciones.desplazar) {
      const arriba = panel.getBoundingClientRect().top;
      if (arriba < 0 || arriba > window.innerHeight * 0.45) {
        panel.scrollIntoView({ behavior: sinMovimiento ? "auto" : "smooth", block: "start" });
      }
    }
  }

  lista.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) mostrar(Number(chip.dataset.cat), { desplazar: true });
  });

  // flechas del teclado para moverse entre categorías
  lista.addEventListener("keydown", (e) => {
    const teclas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let destino = null;
    if (e.key in teclas) destino = (actual + teclas[e.key] + chips.length) % chips.length;
    if (e.key === "Home") destino = 0;
    if (e.key === "End") destino = chips.length - 1;
    if (destino === null) return;
    e.preventDefault();
    mostrar(destino);
    chips[destino].focus();
  });

  panel.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-ir-categoria]");
    if (boton) {
      const destino = Number(boton.dataset.irCategoria);
      mostrar(destino);
      panel.scrollIntoView({ behavior: sinMovimiento ? "auto" : "smooth", block: "start" });
      chips[destino].focus({ preventScroll: true });
    }
  });

  mostrar(0);

  /* ---------- Volver al inicio ---------- */
  const portada = $(".portada");
  $("[data-arriba]").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: sinMovimiento ? "auto" : "smooth" });
    if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entradas) => {
      document.body.classList.toggle("en-portada", entradas[0].isIntersecting);
    }, { threshold: 0.35 }).observe(portada);
  }

  /* ---------- Ventana de detalle ---------- */
  const detalle = $("[data-detalle]");
  const hoja = $("[data-hoja]");
  const contenido = $("[data-contenido]");
  let cerrando = false;
  let conHistoria = false;
  let focoAnterior = null;

  function abrirDetalle(id) {
    const item = indice[id];
    if (!item || detalle.open) return;
    const { p, cat } = item;
    const precio = precioTexto(p.precio);

    const foto = $("[data-detalle-foto]");
    foto.style.setProperty("--tono", TONOS[cat.icono] || "var(--algodon)");
    foto.innerHTML = fotoHTML(p, cat);
    $("[data-detalle-categoria]").textContent = cat.nombre;
    $("[data-detalle-nombre]").textContent = p.nombre;

    const precioEl = $("[data-detalle-precio]");
    precioEl.textContent = precio || "Precio por confirmar";
    precioEl.classList.toggle("detalle__precio--pendiente", !precio);

    const desc = $("[data-detalle-desc]");
    desc.textContent = p.descripcion || "";
    desc.hidden = !p.descripcion;

    const nota = $("[data-detalle-nota]");
    nota.textContent = !p.foto ? "Foto del producto próximamente."
      : p.fotoReferencial ? "Foto referencial: el producto puede verse distinto." : "";
    nota.hidden = !nota.textContent;

    focoAnterior = document.activeElement;
    contenido.scrollTop = 0;
    detalle.showModal();
    document.documentElement.classList.add("con-detalle");
    void hoja.offsetWidth; // permite que la transición de apertura se vea
    detalle.setAttribute("data-abierto", "");

    try {
      history.pushState({ detalle: true }, "");
      conHistoria = true;
    } catch (err) {
      conHistoria = false;
    }
  }

  function cerrarDetalle() {
    if (!detalle.open || cerrando) return;
    cerrando = true;
    conHistoria = false;
    detalle.removeAttribute("data-abierto");
    hoja.style.transform = "";
    setTimeout(() => {
      detalle.close();
      cerrando = false;
      document.documentElement.classList.remove("con-detalle");
      if (focoAnterior && focoAnterior.focus) focoAnterior.focus({ preventScroll: true });
    }, sinMovimiento ? 0 : 280);
  }

  // Si se abrió con historial, el botón "atrás" del celular también cierra la ventana
  function pedirCierre() {
    if (conHistoria && history.state && history.state.detalle) history.back();
    else cerrarDetalle();
  }

  window.addEventListener("popstate", () => { if (detalle.open) cerrarDetalle(); });
  detalle.addEventListener("cancel", (e) => { e.preventDefault(); pedirCierre(); });
  detalle.addEventListener("click", (e) => {
    if (e.target.closest("[data-cerrar]") || e.target === detalle || e.target.hasAttribute("data-cerrar-fuera")) {
      pedirCierre();
    }
  });

  document.addEventListener("click", (e) => {
    const tarjeta = e.target.closest("[data-producto]");
    if (tarjeta) abrirDetalle(tarjeta.dataset.producto);
  });

  // Deslizar hacia abajo para cerrar (pantallas táctiles)
  let inicioY = null;
  let recorrido = 0;
  hoja.addEventListener("touchstart", (e) => {
    if (contenido.scrollTop > 0 || e.touches.length > 1) { inicioY = null; return; }
    inicioY = e.touches[0].clientY;
    recorrido = 0;
    hoja.style.transition = "none";
  }, { passive: true });
  hoja.addEventListener("touchmove", (e) => {
    if (inicioY === null) return;
    if (contenido.scrollTop > 0) { inicioY = null; hoja.style.transition = ""; hoja.style.transform = ""; return; }
    recorrido = e.touches[0].clientY - inicioY;
    if (recorrido > 0) {
      e.preventDefault();
      hoja.style.transform = "translateY(" + recorrido + "px)";
    } else {
      recorrido = 0;
      hoja.style.transform = "";
    }
  }, { passive: false });
  const soltar = () => {
    if (inicioY === null) return;
    inicioY = null;
    hoja.style.transition = "";
    if (recorrido > 110) pedirCierre();
    else hoja.style.transform = "";
  };
  hoja.addEventListener("touchend", soltar);
  hoja.addEventListener("touchcancel", soltar);
})();
