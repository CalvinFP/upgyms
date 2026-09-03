console.log("Script cargado correctamente");

document.addEventListener("DOMContentLoaded", function () {

  // === APERTURAS OFICIALES (en orden) ===
  const aperturas = [
    {
      name: "Gines - Avenida Europa",
      fecha: "Aug 28, 2026 18:00:00"
    },
    {
      name: "Leganés - Parquesur",
      fecha: "Sep 2, 2026 18:00:00"
    },
    {
      name: "Villanueva de la Serena - Carretera Don Benito",
      fecha: "Sep 2, 2026 18:00:00"
    },
    {
      name: "Granada - Juan Pablo II",
      fecha: "Sep 18, 2026 18:00:00"
    },
    {
      name: "Lleida - Pere Cabrera",
      fecha: "Sep 18, 2026 18:00:00"
    },
    {
      name: "A Coruña - Torreiro",
      fecha: "Sep 18, 2026 18:00:00"
    }
  ];

  const elTitulo = document.querySelector(".test h1");
  const elName   = document.getElementById("name");
  const elDay    = document.querySelector(".day");
  const elHour   = document.querySelector(".hour");
  const elMin    = document.querySelector(".minute");
  const elSec    = document.querySelector(".second");

  let grupos = [];
  let actual = -1;
  let siguientes = [];
  let nameIndex = 0;

  const ts = (a) => new Date(a.fecha).getTime();
  const fmt = (v) => String(Math.max(0, v)).padStart(2, "0");


  // =====================================================
  // AGRUPAR APERTURAS QUE TENGAN LA MISMA FECHA
  // =====================================================

  function agruparAperturas() {

    aperturas.sort((a, b) => ts(a) - ts(b));

    grupos = [];

    aperturas.forEach(apertura => {

      const fecha = ts(apertura);

      const grupoExistente = grupos.find(
        grupo => grupo.fecha === fecha
      );

      if (grupoExistente) {
        grupoExistente.nombres.push(apertura.name);
      } else {
        grupos.push({
          fecha: fecha,
          nombres: [apertura.name]
        });
      }

    });
  }


  // =====================================================
  // SELECCIONAR LA PRÓXIMA APERTURA
  // =====================================================

  function seleccionarActual() {

    const now = Date.now();

    actual = grupos.findIndex(
      grupo => grupo.fecha > now
    );

    if (actual === -1) {

      elTitulo.textContent = "¡Muy pronto!";

      siguientes = [];

    } else {

      // Nombres de la próxima fecha
      const nombresActuales = grupos[actual].nombres;

      // Mostrar los nombres uno debajo de otro
      elTitulo.innerHTML = nombresActuales.join("<br>");

      // Todas las aperturas posteriores
      siguientes = [];

      for (let i = actual + 1; i < grupos.length; i++) {
        siguientes.push(...grupos[i].nombres);
      }
    }

    nameIndex = 0;
    cambiarNombre();
  }


  // =====================================================
  // MOSTRAR SIGUIENTES
  // =====================================================

  function cambiarNombre() {

    elName.style.opacity = 0;

    setTimeout(function () {

      if (siguientes.length === 0) {

        elName.textContent = "-";

      } else {

        elName.textContent = siguientes[nameIndex];

        nameIndex =
          (nameIndex + 1) % siguientes.length;
      }

      elName.style.opacity = 1;

    }, 600);
  }


  // =====================================================
  // CUENTA ATRÁS
  // =====================================================

  function countdown() {

    if (actual === -1) {

      elDay.innerText =
      elHour.innerText =
      elMin.innerText =
      elSec.innerText = "00";

      return;
    }

    const gap = grupos[actual].fecha - Date.now();

    // Llegó a 0 → pasar al siguiente grupo
    if (gap <= 0) {

      seleccionarActual();

      return countdown();
    }

    const second = 1000;
    const minute = second * 60;
    const hour   = minute * 60;
    const day    = hour * 24;

    elDay.innerText =
      fmt(Math.floor(gap / day));

    elHour.innerText =
      fmt(Math.floor((gap % day) / hour));

    elMin.innerText =
      fmt(Math.floor((gap % hour) / minute));

    elSec.innerText =
      fmt(Math.floor((gap % minute) / second));
  }


  // =====================================================
  // INICIAR
  // =====================================================

  agruparAperturas();
  seleccionarActual();
  countdown();

  setInterval(countdown, 1000);
  setInterval(cambiarNombre, 5000);


  // =====================================================
  // REFRESH A LAS 07:00
  // =====================================================

  (function programarRefresh7AM() {

    const ahora = new Date();
    const proximo = new Date();

    proximo.setHours(7, 0, 0, 0);

    if (ahora >= proximo) {
      proximo.setDate(
        proximo.getDate() + 1
      );
    }

    setTimeout(
      () => window.location.reload(),
      proximo - ahora
    );

  })();

});
