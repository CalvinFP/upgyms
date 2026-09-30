// =====================================================
// APERTURAS FITNESS PARK
// -----------------------------------------------------
// Esto es lo ÚNICO que tienes que tocar.
// Añadir un club = añadir una línea. El orden da igual,
// se ordenan solos por fecha.
//
//  nombre: como quieres que salga en pantalla
//  fecha:  "AAAA-MM-DDTHH:MM"
//  lat/lon: para el mapa. En Google Maps, clic derecho
//           sobre el club y copias los dos números.
//
// Si dos clubes abren el mismo día y hora, salen juntos.
// En el mapa solo salen los que aún no han abierto.
// =====================================================

var aperturas = [
  // --- Ya abiertos ---
  { nombre: "A Coruña - Torreiro",              fecha: "2026-09-17T18:00", lat: 43.36, lon: -8.41 },
  { nombre: "Granada - Juan Pablo II",          fecha: "2026-09-18T18:00", lat: 37.19, lon: -3.61 },
  { nombre: "Lleida - Pere Cabrera",            fecha: "2026-09-18T18:00", lat: 41.62, lon: 0.62 },

  // --- Próximas aperturas ---
  { nombre: "Valencia - L'Eliana",              fecha: "2026-10-30T18:00", lat: 39.57, lon: -0.53 },
  { nombre: "La Línea - La Alcaidesa",          fecha: "2026-11-12T18:00", lat: 36.24, lon: -5.33 },
  { nombre: "Sabadell - Parc",                  fecha: "2026-11-19T18:00", lat: 41.55, lon: 2.11 },
  { nombre: "Portugalete",                      fecha: "2026-11-27T18:00", lat: 43.32, lon: -3.02 },
  { nombre: "Valladolid - Vallsur",             fecha: "2026-11-27T18:00", lat: 41.63, lon: -4.73 },
  { nombre: "Puerto de Santa María - El Paseo", fecha: "2026-12-03T18:00", lat: 36.60, lon: -6.23 },
  { nombre: "Murcia - La Noria",                fecha: "2026-12-04T18:00", lat: 38.03, lon: -1.20 },
  { nombre: "Gran Canaria - Carvajal",          fecha: "2026-12-04T18:00", lat: 27.99, lon: -15.39 },
  { nombre: "Carcaixent",                       fecha: "2026-12-11T18:00", lat: 39.12, lon: -0.45 },
  { nombre: "Finestrat",                        fecha: "2026-12-16T18:00", lat: 38.56, lon: -0.19 },
  { nombre: "Esplugues - Finestrelles",         fecha: "2026-12-17T18:00", lat: 41.38, lon: 2.10 },
  { nombre: "Illescas - Señorío Plaza",         fecha: "2026-12-18T18:00", lat: 40.12, lon: -3.84 },
  { nombre: "Alhaurín de la Torre",             fecha: "2027-01-01T18:00", lat: 36.66, lon: -4.56 },
];

// =====================================================
// AVISOS INTERNOS (franja amarilla de abajo)
// Si pones desde/hasta, solo sale en ese rato. Sin fechas, sale siempre.
// Si hay varios activos, van cambiando cada AVISO_SEGUNDOS.
// =====================================================
var AVISOS = [
  // { texto: "Reunión de equipo a las 12:00 en la sala grande", desde: "2026-10-01T09:00", hasta: "2026-10-01T12:00" },
];
var AVISO_SEGUNDOS = 10;

// Modo noche: fuera de este horario la pantalla baja el brillo
var HORARIO_OFICINA = { inicio: "07:30", fin: "20:00" };
var NOCHE_FINDE = true; // sábado y domingo todo el día en modo noche

// Protección de pantalla: cada X minutos todo se mueve unos píxeles
var PROTECCION_MINUTOS = 3;
var PROTECCION_PIXELES = 8;

// =====================================================
// PRUEBAS DE HOY: para ver los extras funcionando.
// Cuando acaba (fin), la página se recarga y vuelve a la normalidad.
// Para quitarlas del todo: PRUEBAS_ACTIVAS = false
// =====================================================
var PRUEBAS_ACTIVAS = false;
var PRUEBA = {
  apertura: "2026-09-29T19:45",                         // club de prueba
  celebracionMinutos: 2,                                // "¡Ya abierto!" 2 min
  aviso: ["2026-09-29T19:30", "2026-09-29T19:47"],      // aviso de prueba
  noche: ["2026-09-29T19:47", "2026-09-29T19:50"],      // modo noche
  proteccion: ["2026-09-29T19:50", "2026-09-29T19:53"], // protección (exagerada para que se vea)
  fin: "2026-09-29T19:53",
};

// Calendario de abajo: cuántas fechas se ven
var ABIERTOS_VISIBLES = 1; // fechas ya abiertas (a la izquierda de HOY)
var PROXIMOS_VISIBLES = 3; // próximas fechas (a la derecha de HOY)
var PROXIMOS_VISIBLES_VERTICAL = 3; // igual, en pantallas verticales (hay menos sitio)

// Contadores de arriba a la derecha, a fecha de CONTADOS_HASTA.
// Los clubes de la lista que abran DESPUÉS de esa fecha se suman solos.
var ABIERTOS_TOTALES = 110; // "Totales": todos los clubes abiertos
var ABIERTOS_AÑO = 31;      // "Abiertos 2026": los abiertos este año
var CONTADOS_HASTA = "2026-09-29";

// Extras de la tarjeta
var CELEBRACION_HASTA = "10:30"; // "¡Ya abierto!" se ve hasta esta hora del día siguiente
var ULTIMOS_DIAS = 7;       // con menos de estos días, la tarjeta se ilumina


// =====================================================
// A PARTIR DE AQUÍ NO HACE FALTA TOCAR NADA
// Escrito "a la antigua" (sin trucos modernos) para que
// funcione en cualquier TV, aunque su navegador sea viejo.
// =====================================================

var SEGUNDO = 1000;
var MINUTO = SEGUNDO * 60;
var HORA = MINUTO * 60;
var DIA = HORA * 24;

function $(id) { return document.getElementById(id); }
function dos(n) { n = Math.max(0, n); return n < 10 ? "0" + n : String(n); }
function cada(lista, fn) { for (var i = 0; i < lista.length; i++) fn(lista[i], i); }
function filtrar(lista, fn) { var r = []; cada(lista, function (x) { if (fn(x)) r.push(x); }); return r; }
function clase(el, nombre, poner) {
  if (poner) el.classList.add(nombre); else el.classList.remove(nombre);
}

// "2026-10-30T18:00" -> hora local de la TV (sin sorpresas de zona horaria)
function leerFecha(texto) {
  var p = texto.split(/[-T:]/);
  return new Date(+p[0], +p[1] - 1, +p[2], +(p[3] || 0), +(p[4] || 0)).getTime();
}

// ---------- 0) Pruebas ----------
function enRato(rato, ahora) { return ahora >= leerFecha(rato[0]) && ahora < leerFecha(rato[1]); }
var pruebas = PRUEBAS_ACTIVAS && Date.now() < leerFecha(PRUEBA.fin);
if (pruebas) {
  aperturas.push({ nombre: "Prueba - Oficina", fecha: PRUEBA.apertura, lat: 41.39, lon: 2.17, prueba: true });
  AVISOS.push({ texto: "Esto es un aviso interno de prueba", desde: PRUEBA.aviso[0], hasta: PRUEBA.aviso[1] });
}

// ---------- 1) Ordenar y agrupar por fecha ----------
var clubes = [];
cada(aperturas, function (a) {
  clubes.push({ nombre: a.nombre, lat: a.lat, lon: a.lon, prueba: !!a.prueba, ts: leerFecha(a.fecha) });
});
clubes.sort(function (a, b) { return a.ts - b.ts; });

var grupos = [];
cada(clubes, function (c) {
  var ultimo = grupos[grupos.length - 1];
  if (ultimo && ultimo.ts === c.ts) ultimo.nombres.push(c.nombre);
  else grupos.push({ ts: c.ts, nombres: [c.nombre], prueba: c.prueba });
});

// ---------- 2) Textos de fecha (en español, sin depender de la TV) ----------
var DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
var MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];

function fechaLarga(ts) { var d = new Date(ts); return DIAS_SEMANA[d.getDay()] + ", " + d.getDate() + " de " + MESES[d.getMonth()]; }
function fechaCorta(ts) { var d = new Date(ts); return d.getDate() + " " + MESES_CORTOS[d.getMonth()]; }
function horaTexto(ts) { var d = new Date(ts); return dos(d.getHours()) + ":" + dos(d.getMinutes()); }
function mismoDia(a, b) { return new Date(a).toDateString() === new Date(b).toDateString(); }

// Hora "de reloj": cuenta como el reloj de la pared, así el cambio
// de hora (horario de invierno/verano) no descuadra el contador.
function deReloj(ts) { return ts - new Date(ts).getTimezoneOffset() * MINUTO; }
function falta(ts, ahora) { return deReloj(ts) - deReloj(ahora); }
function diasHasta(ts, ahora) { return Math.floor(falta(ts, ahora) / DIA); }

// "Valencia - L'Eliana" -> { ciudad: "Valencia", sitio: "L'Eliana" }
function partes(nombre) {
  var trozos = nombre.split(" - ");
  return { ciudad: trozos[0], sitio: trozos.slice(1).join(" - ") };
}

// ---------- 3) Barra superior: reloj y cifras ----------
var DESDE_CONTEO = leerFecha(CONTADOS_HASTA + "T23:59");

function pintarBarra(ahora) {
  $("hora").textContent = horaTexto(ahora);
  $("hoyFecha").textContent = fechaLarga(ahora);
  var nuevos = filtrar(clubes, function (c) { return c.ts > DESDE_CONTEO && c.ts <= ahora; }).length;
  $("nTotales").textContent = ABIERTOS_TOTALES + nuevos;
  $("nAbiertos").textContent = ABIERTOS_AÑO + nuevos;
  $("nAbiertosTexto").textContent = "Abiertos " + new Date(DESDE_CONTEO).getFullYear();
}

// ---------- 4) Tarjeta ----------
// Modos de la tarjeta:
//  "normal"   -> cuenta atrás
//  "final"    -> quedan menos de ULTIMOS_DIAS: se ilumina
//  "hoy"      -> abre hoy
//  "abierto"  -> acaba de abrir: "¡Ya abierto!" hasta CELEBRACION_HASTA del día siguiente
var TITULOS = {
  normal: "Próxima apertura",
  final: "¡Ya casi! · Próxima apertura",
  hoy: "¡Hoy abrimos!",
  abierto: "Nueva apertura"
};
var tarjetaActual = "";

function modoTarjeta(grupo, ahora) {
  if (!grupo) return "normal";
  if (grupo.ts <= ahora) return "abierto";
  if (mismoDia(grupo.ts, ahora)) return "hoy";
  if (falta(grupo.ts, ahora) < ULTIMOS_DIAS * DIA) return "final";
  return "normal";
}

// Hasta cuándo se ve "¡Ya abierto!": día siguiente a CELEBRACION_HASTA
function finCelebracion(grupo) {
  if (grupo.prueba) return grupo.ts + PRUEBA.celebracionMinutos * MINUTO;
  var fin = new Date(grupo.ts);
  var hm = CELEBRACION_HASTA.split(":");
  fin.setDate(fin.getDate() + 1);
  fin.setHours(+hm[0], +hm[1], 0, 0);
  return fin.getTime();
}

// Número de club (111, 112...) para la celebración
function numeroDeClub(grupo) {
  if (grupo.ts <= DESDE_CONTEO) return "";
  var antes = filtrar(clubes, function (c) { return c.ts > DESDE_CONTEO && c.ts < grupo.ts; }).length;
  var nums = [];
  cada(grupo.nombres, function (n, i) { nums.push(ABIERTOS_TOTALES + antes + i + 1); });
  if (nums.length === 1) return "Club nº " + nums[0];
  return "Clubes nº " + nums.slice(0, -1).join(", ") + " y " + nums[nums.length - 1];
}

function htmlNombre(nombre) {
  var p = partes(nombre);
  return '<span class="club-ciudad">' + p.ciudad + "</span>" +
    (p.sitio ? '<span class="club-sitio">' + p.sitio + "</span>" : "");
}

function pintarTarjeta(grupo, modo) {
  var claveNueva = (grupo ? grupo.ts : "nada") + modo;
  if (claveNueva === tarjetaActual) return; // solo repinta si cambia algo
  tarjetaActual = claveNueva;
  var club = $("club");

  $("tarjeta").className = "tarjeta modo-" + modo;
  $("tarjetaTitulo").textContent = TITULOS[modo];

  if (!grupo) {
    club.className = "tarjeta-club";
    club.innerHTML = '<span class="club-ciudad">¡Muy pronto!</span>';
    $("fecha").textContent = "";
    $("countdown").style.display = "none";
    return;
  }

  if (grupo.nombres.length === 1) {
    // Un club: ciudad en grande y el sitio debajo
    club.className = "tarjeta-club";
    club.innerHTML = htmlNombre(grupo.nombres[0]);
  } else {
    // Varios clubes el mismo día: una línea por club
    club.className = "tarjeta-club club-varios";
    var html = "";
    cada(grupo.nombres, function (n) { html += '<span class="club-fila">' + htmlNombre(n) + "</span>"; });
    club.innerHTML = html;
  }

  $("fecha").textContent = fechaLarga(grupo.ts);
  $("countdown").style.display = modo === "abierto" ? "none" : "";
  $("celebracion").style.display = modo === "abierto" ? "" : "none";
  var num = modo === "abierto" ? numeroDeClub(grupo) : "";
  $("celebracionNum").textContent = num;
  $("celebracionNum").style.display = num ? "" : "none";
  ajustarTitular();
}

// Si el nombre no cabe en la tarjeta, se reduce hasta que quepa
function ajustarTitular() {
  var club = $("club");
  var tam = club.className.indexOf("club-varios") >= 0 ? 50 : 72;
  club.style.fontSize = tam + "px";
  while (club.scrollWidth > club.clientWidth && tam > 40) {
    tam -= 2;
    club.style.fontSize = tam + "px";
  }
}

// Cambia el número y lanza la animación solo si ha cambiado
function ponerNumero(id, valor) {
  var el = $(id);
  var texto = dos(valor);
  if (el.textContent === texto) return;
  el.textContent = texto;
  el.classList.remove("tic");
  void el.offsetWidth; // reinicia la animación
  el.classList.add("tic");
}

function pintarCuentaAtras(proxima, ahora) {
  if (!proxima) return;
  var gap = Math.max(0, falta(proxima.ts, ahora));
  ponerNumero("dias", Math.floor(gap / DIA));
  ponerNumero("horas", Math.floor((gap % DIA) / HORA));
  ponerNumero("minutos", Math.floor((gap % HORA) / MINUTO));
  ponerNumero("segundos", Math.floor((gap % MINUTO) / SEGUNDO));
}

// ---------- 5) Mapa ----------
function pintarMapa(proxima, ahora) {
  var svg = $("mapa");
  svg.setAttribute("viewBox", "0 0 " + MAPA.ancho + " " + MAPA.alto);

  var html =
    '<defs>' +
      // Trama de puntitos para dar textura a España
      '<pattern id="trama" width="7" height="7" patternUnits="userSpaceOnUse">' +
        '<circle cx="3.5" cy="3.5" r="1.1" fill="#ffffff" fill-opacity="0.09"></circle>' +
      '</pattern>' +
      // Halo amarillo suave bajo la próxima apertura
      '<radialGradient id="halo">' +
        '<stop offset="0" stop-color="#ffd600" stop-opacity="0.38"></stop>' +
        '<stop offset="1" stop-color="#ffd600" stop-opacity="0"></stop>' +
      '</radialGradient>' +
    '</defs>' +
    '<path class="mapa-tierra" d="' + MAPA.silueta + '"></path>' +
    '<path class="mapa-trama" fill="url(#trama)" d="' + MAPA.silueta + '"></path>' +
    '<path class="mapa-comunidades" d="' + MAPA.comunidades + '"></path>' +
    '<path class="mapa-canarias" d="M4,332 H176 V421"></path>' +
    '<text class="mapa-mar" x="170" y="416" text-anchor="end">CANARIAS</text>';
  var etiqueta = "";
  var siguiente = "";

  // Solo se pintan los clubes que aún no han abierto
  cada(clubes, function (c) {
    if (c.lat == null || c.lon == null || c.ts <= ahora) return;
    var p = MAPA.punto(c.lat, c.lon);
    var esSiguiente = proxima && c.ts === proxima.ts;
    if (!esSiguiente) {
      html += '<circle class="pin-futuro" cx="' + p.x + '" cy="' + p.y + '" r="5"></circle>';
      return;
    }
    // La próxima: punto amarillo con pulso (se pinta al final, encima)
    var izquierda = p.x > MAPA.ancho * 0.62;
    var tx = izquierda ? p.x - 14 : p.x + 14;
    var ancla = izquierda ? "end" : "start";
    siguiente +=
      '<circle cx="' + p.x + '" cy="' + p.y + '" r="34" fill="url(#halo)"></circle>' +
      '<circle class="pin-pulso" cx="' + p.x + '" cy="' + p.y + '" r="8">' +
        '<animate attributeName="r" from="8" to="26" dur="2.2s" repeatCount="indefinite"></animate>' +
        '<animate attributeName="opacity" from="0.9" to="0" dur="2.2s" repeatCount="indefinite"></animate>' +
      "</circle>" +
      '<circle class="pin-siguiente" cx="' + p.x + '" cy="' + p.y + '" r="8"></circle>';
    etiqueta +=
      '<text class="pin-nombre es-siguiente" x="' + tx + '" y="' + (p.y - 2) + '" text-anchor="' + ancla + '">' + c.nombre + "</text>" +
      '<text class="pin-dias" x="' + tx + '" y="' + (p.y + 15) + '" text-anchor="' + ancla + '">' + fechaCorta(c.ts) + "</text>";
  });

  svg.innerHTML = html + siguiente + etiqueta;
}

// ---------- 6) Línea temporal (carril) ----------
function estado(ts, ahora) {
  if (mismoDia(ts, ahora)) return "¡Hoy!";
  var d = diasHasta(ts, ahora);
  return d <= 1 ? "Mañana" : "Faltan " + d + " días";
}

function pintarCarril(abiertos, futuros, ahora) {
  var pista = $("pista");
  cada(pista.querySelectorAll(".parada"), function (p) { pista.removeChild(p); });

  var paradas = abiertos.concat(futuros);
  if (!paradas.length) return;

  var tramos = Math.max(1, paradas.length - 1);

  cada(paradas, function (g, i) {
    var abierto = g.ts <= ahora;
    var div = document.createElement("div");
    div.className = "parada" + (abierto ? " abierta" : g === futuros[0] ? " siguiente" : "");
    div.style.left = (paradas.length === 1 ? 50 : (i / tramos) * 100) + "%";
    var nombres = "";
    cada(g.nombres, function (n) { nombres += '<span class="parada-nombre">' + n + "</span>"; });
    div.innerHTML =
      '<span class="parada-punto"></span>' +
      '<span class="parada-fecha">' + fechaCorta(g.ts) + "</span>" + nombres +
      '<span class="parada-estado">' + (abierto ? "Abierto" : estado(g.ts, ahora)) + "</span>";
    pista.appendChild(div);
  });

  // Chevron de HOY: entre el último abierto y el siguiente, según el tiempo que ha pasado
  var hoy = 0;
  if (abiertos.length && futuros.length) {
    var a = abiertos.length - 1;
    var pasado = (ahora - paradas[a].ts) / (paradas[a + 1].ts - paradas[a].ts);
    hoy = ((a + pasado) / tramos) * 100;
  } else if (!futuros.length) {
    hoy = 100;
  }
  $("relleno").style.width = hoy + "%";
  $("hoy").style.left = hoy + "%";
}

// ---------- 7) Extras: avisos, modo noche, protección ----------
function minutosDelDia(texto) { var hm = texto.split(":"); return +hm[0] * 60 + +hm[1]; }

function esDeNoche(ahora) {
  if (pruebas && enRato(PRUEBA.noche, ahora)) return true;
  var d = new Date(ahora);
  if (NOCHE_FINDE && (d.getDay() === 0 || d.getDay() === 6)) return true;
  var m = d.getHours() * 60 + d.getMinutes();
  return m < minutosDelDia(HORARIO_OFICINA.inicio) || m >= minutosDelDia(HORARIO_OFICINA.fin);
}

var avisoActual = "";
function pintarAviso(ahora) {
  var activos = filtrar(AVISOS, function (a) {
    return (!a.desde || ahora >= leerFecha(a.desde)) && (!a.hasta || ahora < leerFecha(a.hasta));
  });
  var aviso = activos.length ? activos[Math.floor(ahora / (AVISO_SEGUNDOS * SEGUNDO)) % activos.length].texto : "";
  if (aviso === avisoActual) return;
  avisoActual = aviso;
  $("avisoTexto").textContent = aviso;
  clase(document.body, "con-aviso", !!aviso);
}

var ultimoMovimiento = 0;
var dx = 0, dy = 0;
function protegerPantalla(ahora) {
  var prueba = pruebas && enRato(PRUEBA.proteccion, ahora);
  var intervalo = prueba ? 4 * SEGUNDO : PROTECCION_MINUTOS * MINUTO;
  var px = prueba ? 40 : PROTECCION_PIXELES;
  if (ahora - ultimoMovimiento < intervalo) return;
  ultimoMovimiento = ahora;
  dx = Math.round((Math.random() * 2 - 1) * px);
  dy = Math.round((Math.random() * 2 - 1) * px);
  colocar(true);
}

function pintarExtras(ahora) {
  clase(document.body, "noche", esDeNoche(ahora));
  pintarAviso(ahora);
  protegerPantalla(ahora);
}

// ---------- 8) Bucle principal: cada segundo ----------
var ultimoMinuto = -1;

function actualizar() {
  var ahora = Date.now();
  var abiertos = filtrar(grupos, function (g) { return g.ts <= ahora; });
  var futuros = filtrar(grupos, function (g) { return g.ts > ahora; });
  var proxima = futuros[0] || null;

  // Si un club acaba de abrir, la tarjeta lo celebra un rato
  var ultimo = abiertos[abiertos.length - 1];
  var recien = ultimo && ahora < finCelebracion(ultimo) ? ultimo : null;
  var enTarjeta = recien || proxima;

  pintarTarjeta(enTarjeta, modoTarjeta(enTarjeta, ahora));
  if (!recien) pintarCuentaAtras(proxima, ahora);
  pintarExtras(ahora);

  // Lo demás solo se repinta una vez por minuto
  var minuto = Math.floor(ahora / MINUTO);
  if (minuto !== ultimoMinuto) {
    ultimoMinuto = minuto;
    pintarBarra(ahora);
    pintarMapa(proxima, ahora);
    var vertical = document.body.className.indexOf("vertical") >= 0;
    var nProximos = vertical ? PROXIMOS_VISIBLES_VERTICAL : PROXIMOS_VISIBLES;
    pintarCarril(abiertos.slice(-ABIERTOS_VISIBLES), futuros.slice(0, nProximos), ahora);
  }
}

// Si algo falla, no se para la pantalla: lo intenta en el siguiente segundo
function actualizarSeguro() {
  try { actualizar(); } catch (e) { if (window.console) console.error(e); }
}

// ---------- 9) Autoajuste a la pantalla ----------
// Se diseña a 1920x1080 (o 1080x1920 en vertical) y se escala
// para que quepa entera en cualquier TV o monitor, sin zoom.
var escala = 1, offX = 0, offY = 0, ultimoTamano = "";

function colocar(suave) {
  var el = document.querySelector(".pantalla");
  if (!el) return;
  var t = "translate(" + (offX + dx) + "px," + (offY + dy) + "px) scale(" + escala + ")";
  var tr = suave ? "transform 3s ease, -webkit-transform 3s ease" : "none";
  el.style.webkitTransition = tr;
  el.style.transition = tr;
  el.style.webkitTransform = t;
  el.style.transform = t;
}

function ajustarPantalla() {
  var w = window.innerWidth || document.documentElement.clientWidth;
  var h = window.innerHeight || document.documentElement.clientHeight;
  if (!w || !h) return; // la TV aún no sabe su tamaño: se reintenta luego
  ultimoTamano = w + "x" + h;
  var vertical = h > w;
  var cambiaFormato = vertical !== (document.body.className.indexOf("vertical") >= 0);
  clase(document.body, "vertical", vertical);
  var ancho = vertical ? 1080 : 1920;
  var alto = vertical ? 1920 : 1080;
  escala = Math.min(w / ancho, h / alto);
  offX = (w - ancho * escala) / 2;
  offY = (h - alto * escala) / 2;
  colocar(false);
  if (cambiaFormato) ultimoMinuto = -1; // repinta el calendario con el nuevo formato
}

function reajustarTodo() {
  ajustarPantalla();
  ultimoMinuto = -1;
  tarjetaActual = "";
  actualizarSeguro();
}

// ---------- 10) Recargar la página cada día a las 07:00 ----------
function programarRefresh7AM() {
  var ahora = new Date();
  var proximo = new Date();
  proximo.setHours(7, 0, 0, 0);
  if (ahora >= proximo) proximo.setDate(proximo.getDate() + 1);
  setTimeout(function () { window.location.reload(); }, proximo - ahora);
}

// ---------- INICIAR ----------
var iniciado = false;
function iniciar() {
  if (iniciado) return;
  iniciado = true;
  ultimoMovimiento = Date.now(); // el primer movimiento, a los PROTECCION_MINUTOS
  reajustarTodo();
  setInterval(actualizarSeguro, SEGUNDO);

  // Se reajusta si cambia el tamaño, al girar, al acabar de cargar
  // y cada 30 s por si la TV cambia su tamaño sin avisar
  window.addEventListener("resize", reajustarTodo);
  window.addEventListener("orientationchange", reajustarTodo);
  window.addEventListener("load", reajustarTodo);
  setTimeout(reajustarTodo, 1500);
  setInterval(function () {
    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    if (w + "x" + h !== ultimoTamano) reajustarTodo();
  }, 30 * SEGUNDO);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(reajustarTodo);

  programarRefresh7AM();
  // Al acabar las pruebas, recarga para volver a la normalidad
  if (pruebas) setTimeout(function () { window.location.reload(); }, leerFecha(PRUEBA.fin) - Date.now() + SEGUNDO);
}

document.addEventListener("DOMContentLoaded", iniciar);
