console.log("Script cargado correctamente");

document.addEventListener("DOMContentLoaded", function () {

  // === APERTURAS OFICIALES (en orden) ===
  const aperturas = [
    { name: "Gines - Avenida Europa",                    fecha: "Aug 28, 2026 18:00:00" },
    { name: "Leganés - Parquesur",                       fecha: "Sep 3, 2026 18:00:00" },
    { name: "Villanueva de la Serena - Carretera Don Benito", fecha: "Sep 4, 2026 18:00:00" },
    { name: "Granada - Juan Pablo II",
            "Lleida - Pere Cabrera",                   
            "A Coruña - Torreiro",                       fecha: "Sep 18, 2026 18:00:00" }
  ];

  const elTitulo = document.querySelector(".test h1");
  const elName   = document.getElementById("name");
  const elDay    = document.querySelector(".day");
  const elHour   = document.querySelector(".hour");
  const elMin    = document.querySelector(".minute");
  const elSec    = document.querySelector(".second");

  let actual = -1;
  let siguientes = [];
  let nameIndex = 0;

  const ts = (a) => new Date(a.fecha).getTime();
  const fmt = (v) => String(Math.max(0, v)).padStart(2, "0");

  function seleccionarActual() {
    aperturas.sort((a, b) => ts(a) - ts(b));      // por si añades una desordenada
    const now = Date.now();
    actual = aperturas.findIndex(a => ts(a) > now);

    if (actual === -1) {
      elTitulo.textContent = "¡Muy pronto!";
      siguientes = [];
    } else {
      elTitulo.textContent = aperturas[actual].name;
      siguientes = aperturas.slice(actual + 1).map(a => a.name);
    }

    nameIndex = 0;
    cambiarNombre();
  }

  function cambiarNombre() {
    elName.style.opacity = 0;
    setTimeout(function () {
      if (siguientes.length === 0) {
        elName.textContent = "-";
      } else {
        elName.textContent = siguientes[nameIndex];
        nameIndex = (nameIndex + 1) % siguientes.length;
      }
      elName.style.opacity = 1;
    }, 600);
  }

  function countdown() {
    if (actual === -1) {
      elDay.innerText = elHour.innerText = elMin.innerText = elSec.innerText = "00";
      return;
    }

    const gap = ts(aperturas[actual]) - Date.now();

    if (gap <= 0) {           // llegó a 0 -> salta a la siguiente
      seleccionarActual();
      return countdown();
    }

    const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
    elDay.innerText  = fmt(Math.floor(gap / day));
    elHour.innerText = fmt(Math.floor((gap % day) / hour));
    elMin.innerText  = fmt(Math.floor((gap % hour) / minute));
    elSec.innerText  = fmt(Math.floor((gap % minute) / second));
  }

  seleccionarActual();
  countdown();
  setInterval(countdown, 1000);
  setInterval(cambiarNombre, 5000);

  // REFRESH A LAS 07:00
  (function programarRefresh7AM() {
    const ahora = new Date();
    const proximo = new Date();
    proximo.setHours(7, 0, 0, 0);
    if (ahora >= proximo) proximo.setDate(proximo.getDate() + 1);
    setTimeout(() => window.location.reload(), proximo - ahora);
  })();
});
