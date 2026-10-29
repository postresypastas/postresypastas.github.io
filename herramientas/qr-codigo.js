/*
  Generador de códigos QR (modo byte, versiones 1 a 40).
  Basado en el algoritmo publicado por Project Nayuki (licencia MIT).
  Uso: const qr = QRCodigo.crear("https://...", "M");  // L, M, Q o H
       qr.tamano  -> número de módulos por lado
       qr.oscuro(x, y) -> true si el módulo es oscuro
*/
(function (global) {
  "use strict";

  const NIVELES = { L: { i: 0, bits: 1 }, M: { i: 1, bits: 0 }, Q: { i: 2, bits: 3 }, H: { i: 3, bits: 2 } };

  const ECC_POR_BLOQUE = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  ];
  const BLOQUES = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  ];

  const bit = (x, i) => ((x >>> i) & 1) !== 0;

  function modulosDatos(ver) {
    let r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      const n = Math.floor(ver / 7) + 2;
      r -= (25 * n - 10) * n - 55;
      if (ver >= 7) r -= 36;
    }
    return r;
  }
  const codewordsDatos = (ver, n) => Math.floor(modulosDatos(ver) / 8) - ECC_POR_BLOQUE[n][ver] * BLOQUES[n][ver];

  function multiplicar(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }
  function divisor(grado) {
    const r = new Array(grado).fill(0);
    r[grado - 1] = 1;
    let raiz = 1;
    for (let i = 0; i < grado; i++) {
      for (let j = 0; j < r.length; j++) {
        r[j] = multiplicar(r[j], raiz);
        if (j + 1 < r.length) r[j] ^= r[j + 1];
      }
      raiz = multiplicar(raiz, 0x02);
    }
    return r;
  }
  function resto(datos, div) {
    const r = div.map(() => 0);
    for (const b of datos) {
      const f = b ^ r.shift();
      r.push(0);
      div.forEach((c, i) => { r[i] ^= multiplicar(c, f); });
    }
    return r;
  }

  function crear(texto, nivel) {
    const ecl = NIVELES[nivel] || NIVELES.M;
    const bytes = Array.from(new TextEncoder().encode(texto));

    // versión mínima que alcanza
    let ver = 1;
    for (; ver <= 40; ver++) {
      const cuenta = ver < 10 ? 8 : 16;
      if (4 + cuenta + bytes.length * 8 <= codewordsDatos(ver, ecl.i) * 8) break;
    }
    if (ver > 40) throw new Error("El texto es demasiado largo para un código QR.");

    // flujo de bits
    const bits = [];
    const poner = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    poner(0x4, 4);
    poner(bytes.length, ver < 10 ? 8 : 16);
    bytes.forEach((b) => poner(b, 8));
    const capacidad = codewordsDatos(ver, ecl.i) * 8;
    poner(0, Math.min(4, capacidad - bits.length));
    poner(0, (8 - bits.length % 8) % 8);
    for (let relleno = 0xEC; bits.length < capacidad; relleno ^= 0xEC ^ 0x11) poner(relleno, 8);
    const datos = [];
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      datos.push(b);
    }

    // corrección de errores e intercalado
    const nBloques = BLOQUES[ecl.i][ver];
    const eccLen = ECC_POR_BLOQUE[ecl.i][ver];
    const totales = Math.floor(modulosDatos(ver) / 8);
    const cortos = nBloques - totales % nBloques;
    const largoCorto = Math.floor(totales / nBloques);
    const div = divisor(eccLen);
    const bloques = [];
    for (let i = 0, k = 0; i < nBloques; i++) {
      const dat = datos.slice(k, k + largoCorto - eccLen + (i < cortos ? 0 : 1));
      k += dat.length;
      const ecc = resto(dat, div);
      if (i < cortos) dat.push(0);
      bloques.push(dat.concat(ecc));
    }
    const final = [];
    for (let i = 0; i < bloques[0].length; i++) {
      bloques.forEach((bl, j) => {
        if (i !== largoCorto - eccLen || j >= cortos) final.push(bl[i]);
      });
    }

    // matriz
    const t = ver * 4 + 17;
    const m = Array.from({ length: t }, () => new Array(t).fill(false));
    const fn = Array.from({ length: t }, () => new Array(t).fill(false));
    const fijar = (x, y, osc) => { m[y][x] = osc; fn[y][x] = true; };

    for (let i = 0; i < t; i++) { fijar(6, i, i % 2 === 0); fijar(i, 6, i % 2 === 0); }
    [[3, 3], [t - 4, 3], [3, t - 4]].forEach(([cx, cy]) => {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy;
        if (x >= 0 && x < t && y >= 0 && y < t) fijar(x, y, d !== 2 && d !== 4);
      }
    });
    if (ver > 1) {
      const n = Math.floor(ver / 7) + 2;
      const paso = Math.floor((ver * 8 + n * 3 + 5) / (n * 4 - 4)) * 2;
      const pos = [6];
      for (let p = t - 7; pos.length < n; p -= paso) pos.splice(1, 0, p);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          fijar(pos[i] + dx, pos[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
    function formato(mascara) {
      const d = (ecl.bits << 3) | mascara;
      let r = d;
      for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      const b = ((d << 10) | r) ^ 0x5412;
      for (let i = 0; i <= 5; i++) fijar(8, i, bit(b, i));
      fijar(8, 7, bit(b, 6)); fijar(8, 8, bit(b, 7)); fijar(7, 8, bit(b, 8));
      for (let i = 9; i < 15; i++) fijar(14 - i, 8, bit(b, i));
      for (let i = 0; i < 8; i++) fijar(t - 1 - i, 8, bit(b, i));
      for (let i = 8; i < 15; i++) fijar(8, t - 15 + i, bit(b, i));
      fijar(8, t - 8, true);
    }
    formato(0);
    if (ver >= 7) {
      let r = ver;
      for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
      const b = (ver << 12) | r;
      for (let i = 0; i < 18; i++) {
        const a = t - 11 + i % 3, c = Math.floor(i / 3);
        fijar(a, c, bit(b, i)); fijar(c, a, bit(b, i));
      }
    }

    // ubicar los datos en zigzag
    let i = 0;
    for (let der = t - 1; der >= 1; der -= 2) {
      if (der === 6) der = 5;
      for (let v = 0; v < t; v++) for (let j = 0; j < 2; j++) {
        const x = der - j, sube = ((der + 1) & 2) === 0, y = sube ? t - 1 - v : v;
        if (!fn[y][x] && i < final.length * 8) { m[y][x] = bit(final[i >>> 3], 7 - (i & 7)); i++; }
      }
    }

    const MASCARAS = [
      (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
      (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => (x * y) % 2 + (x * y) % 3 === 0,
      (x, y) => ((x * y) % 2 + (x * y) % 3) % 2 === 0, (x, y) => ((x + y) % 2 + (x * y) % 3) % 2 === 0
    ];
    const aplicar = (k) => {
      for (let y = 0; y < t; y++) for (let x = 0; x < t; x++) if (!fn[y][x] && MASCARAS[k](x, y)) m[y][x] = !m[y][x];
    };

    function penalizacion() {
      let p = 0;
      const linea = (get) => {
        for (let a = 0; a < t; a++) {
          let racha = 1;
          const fila = [];
          for (let b = 0; b < t; b++) {
            fila.push(get(a, b) ? 1 : 0);
            if (b > 0) {
              if (get(a, b) === get(a, b - 1)) { racha++; if (racha === 5) p += 3; else if (racha > 5) p++; }
              else racha = 1;
            }
          }
          const s = fila.join("");
          const patron = /(?=(10111010000|00001011101))/g;
          const coincide = s.match(patron);
          if (coincide) p += 40 * coincide.length;
        }
      };
      linea((y, x) => m[y][x]);
      linea((x, y) => m[y][x]);
      for (let y = 0; y < t - 1; y++) for (let x = 0; x < t - 1; x++) {
        const c = m[y][x];
        if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
      }
      let oscuros = 0;
      m.forEach((f) => f.forEach((c) => { if (c) oscuros++; }));
      const total = t * t;
      p += (Math.ceil(Math.abs(oscuros * 20 - total * 10) / total) - 1) * 10;
      return p;
    }

    let mejor = 0, minimo = Infinity;
    for (let k = 0; k < 8; k++) {
      aplicar(k); formato(k);
      const pen = penalizacion();
      if (pen < minimo) { minimo = pen; mejor = k; }
      aplicar(k);
    }
    aplicar(mejor); formato(mejor);

    return { version: ver, tamano: t, oscuro: (x, y) => m[y][x] };
  }

  global.QRCodigo = { crear: crear };
})(window);
