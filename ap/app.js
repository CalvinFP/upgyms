// =====================================================
// APERTURAS FITNESS PARK
// -----------------------------------------------------
// Esto es lo ÚNICO que tienes que tocar.
// Añadir un club = añadir una línea. El orden da igual,
// se ordenan solos por fecha.
// Formato de fecha: "AAAA-MM-DDTHH:MM"
// Si dos clubes abren el mismo día y hora, salen juntos.
// =====================================================

const aperturas = [
  { nombre: "A Coruña - Torreiro",     fecha: "2026-09-17T18:00" },
  { nombre: "Granada - Juan Pablo II", fecha: "2026-09-18T18:00" },
  { nombre: "Lleida - Pere Cabrera",   fecha: "2026-09-18T18:00" },
  { nombre: "Valencia - L'Eliana",     fecha: "2026-10-30T18:00" },
  { nombre: "Línea - La Alcaidesa",    fecha: "2026-11-12T18:00" },
];

// Cuántos clubes ya abiertos se ven en el calendario
const ABIERTOS_VISIBLES = 2;


// =====================================================
// A PARTIR DE AQUÍ NO HACE FALTA TOCAR NADA
// =====================================================

const SEGUNDO = 1000;
const MINUTO = SEGUNDO * 60;
const HORA = MINUTO * 60;
const DIA = HORA * 24;

const $ = (id) => document.getElementById(id);
const dos = (n) => String(Math.max(0, n)).padStart(2, "0");

// ---------- 1) Ordenar y agrupar por fecha ----------
function agruparAperturas(lista) {
  const grupos = [];
  lista
    .map((a) => ({ ...a, ts: new Date(a.fecha).getTime() }))
    .sort((a, b) => a.ts - b.ts)
    .forEach((a) => {
      const existente = grupos.find((g) => g.ts === a.ts);
      if (existente) existente.nombres.push(a.nombre);
      else grupos.push({ ts: a.ts, nombres: [a.nombre] });
    });
  return grupos;
}

const grupos = agruparAperturas(aperturas);

// ---------- 2) Textos de fecha ----------
const fechaLarga = (ts) =>
  new Date(ts).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
const fechaCorta = (ts) =>
  new Date(ts).toLocaleDateString("es-ES", { day: "numeric", month: "short" }).replace(".", "");
const horaTexto = (ts) =>
  new Date(ts).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
const diasHasta = (ts, ahora) => Math.floor((ts - ahora) / DIA);

// ---------- 3) Tarjeta: próxima apertura ----------
let proximaActual = null;

function pintarTarjeta(proxima) {
  if (proxima === proximaActual) return; // solo repinta si cambia de club
  proximaActual = proxima;

  if (!proxima) {
    $("club").innerHTML = "<span>¡Muy pronto!</span>";
    $("fecha").textContent = "";
    $("countdown").style.display = "none";
    return;
  }
  $("club").innerHTML = proxima.nombres.map((n) => `<span>${n}</span>`).join("");
  $("fecha").textContent = `${fechaLarga(proxima.ts)} · ${horaTexto(proxima.ts)} h`;
  $("countdown").style.display = "";
}

// Cambia el número y lanza la animación solo si ha cambiado
function ponerNumero(id, valor) {
  const el = $(id);
  const texto = dos(valor);
  if (el.textContent === texto) return;
  el.textContent = texto;
  el.classList.remove("tic");
  void el.offsetWidth; // reinicia la animación
  el.classList.add("tic");
}

function pintarCuentaAtras(proxima, ahora) {
  if (!proxima) return;
  const gap = Math.max(0, proxima.ts - ahora);
  ponerNumero("dias", Math.floor(gap / DIA));
  ponerNumero("horas", Math.floor((gap % DIA) / HORA));
  ponerNumero("minutos", Math.floor((gap % HORA) / MINUTO));
  ponerNumero("segundos", Math.floor((gap % MINUTO) / SEGUNDO));
}

// ---------- 4) Calendario (carril) ----------
function pintarCarril(abiertos, futuros, ahora) {
  const pista = $("pista");
  pista.querySelectorAll(".parada").forEach((p) => p.remove());

  const paradas = [...abiertos, ...futuros];
  if (!paradas.length) return;

  const tramos = Math.max(1, paradas.length - 1);
  const pos = (i) => (paradas.length === 1 ? 50 : (i / tramos) * 100);

  paradas.forEach((g, i) => {
    const abierto = g.ts <= ahora;
    const siguiente = g === futuros[0];

    const div = document.createElement("div");
    div.className = "parada" + (abierto ? " abierta" : siguiente ? " siguiente" : "");
    div.style.left = pos(i) + "%";
    div.innerHTML = `
      <span class="parada-punto"></span>
      <span class="parada-fecha">${fechaCorta(g.ts)}</span>
      ${g.nombres.map((n) => `<span class="parada-nombre">${n}</span>`).join("")}
      <span class="parada-estado">${abierto ? "Abierto" : `Faltan ${diasHasta(g.ts, ahora)} días`}</span>
    `;
    pista.appendChild(div);
  });

  // Chevron de HOY: entre el último abierto y el siguiente,
  // según el tiempo que ya ha pasado
  let hoy = 0;
  if (abiertos.length && futuros.length) {
    const a = abiertos.length - 1;
    const pasado = (ahora - paradas[a].ts) / (paradas[a + 1].ts - paradas[a].ts);
    hoy = ((a + pasado) / tramos) * 100;
  } else if (!futuros.length) {
    hoy = 100;
  }
  $("relleno").style.width = hoy + "%";
  $("hoy").style.left = hoy + "%";
}

// ---------- 5) Bucle principal: cada segundo ----------
let ultimoMinuto = -1;

function actualizar() {
  const ahora = Date.now();
  const abiertos = grupos.filter((g) => g.ts <= ahora);
  const futuros = grupos.filter((g) => g.ts > ahora);
  const proxima = futuros[0] || null;

  pintarTarjeta(proxima);
  pintarCuentaAtras(proxima, ahora);

  // El calendario solo se repinta una vez por minuto
  const minuto = Math.floor(ahora / MINUTO);
  if (minuto !== ultimoMinuto) {
    ultimoMinuto = minuto;
    pintarCarril(abiertos.slice(-ABIERTOS_VISIBLES), futuros, ahora);
  }
}

// ---------- 6) Confeti de fondo ----------
function crearConfeti() {
  const colores = ["#FFD600", "#FFFFFF", "#E0442B", "#2F7FD8", "#FFD600"];
  const caja = $("confeti");
  for (let i = 0; i < 34; i++) {
    const s = document.createElement("span");
    const size = 7 + ((i * 7) % 8);
    s.style.left = ((i * 37) % 100) + "%";
    s.style.width = s.style.height = size + "px";
    s.style.background = colores[i % colores.length];
    s.style.animationDuration = 14 + ((i * 5) % 12) + "s";
    s.style.animationDelay = -((i * 3.1) % 20) + "s";
    caja.appendChild(s);
  }
}

// ---------- 7) Recargar la página cada día a las 07:00 ----------
function programarRefresh7AM() {
  const ahora = new Date();
  const proximo = new Date();
  proximo.setHours(7, 0, 0, 0);
  if (ahora >= proximo) proximo.setDate(proximo.getDate() + 1);
  setTimeout(() => window.location.reload(), proximo - ahora);
}

// ---------- INICIAR ----------
document.addEventListener("DOMContentLoaded", () => {
  crearConfeti();
  actualizar();
  setInterval(actualizar, SEGUNDO);
  programarRefresh7AM();
});
