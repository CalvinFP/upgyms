console.log("Script cargado correctamente");

document.addEventListener("DOMContentLoaded", function () {

    // Próximas aperturas
    const names = [
        "Palma de Mallorca - Aragó",
        "Alicante - Luceros"
    ];

    let nameIndex = 0;

    function changeNameWithFade() {
        const nameSpan = document.getElementById("name");

        nameSpan.style.opacity = 0;

        setTimeout(function () {
            nameSpan.textContent = names[nameIndex];
            nameIndex = (nameIndex + 1) % names.length;
            nameSpan.style.opacity = 1;
        }, 600);
    }

    changeNameWithFade();
    setInterval(changeNameWithFade, 5000);


    // COUNTDOWN
    const countDate = new Date("Jul 13, 2026 18:00:00").getTime();

    function formatTime(value) {
        return String(value).padStart(2, "0");
    }

    function countdown() {
        const now = new Date().getTime();
        const gap = countDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        document.querySelector(".day").innerText = formatTime(textDay);
        document.querySelector(".hour").innerText = formatTime(textHour);
        document.querySelector(".minute").innerText = formatTime(textMinute);
        document.querySelector(".second").innerText = formatTime(textSecond);
    }

    countdown();
    setInterval(countdown, 1000);


    // REFRESH A LAS 07:00
    function programarRefresh7AM() {
        const ahora = new Date();
        const proximoRefresh = new Date();

        proximoRefresh.setHours(7, 0, 0, 0);

        if (ahora >= proximoRefresh) {
            proximoRefresh.setDate(proximoRefresh.getDate() + 1);
        }

        const tiempoHastaRefresh = proximoRefresh - ahora;

        console.log(
            "Refresh programado en",
            Math.round(tiempoHastaRefresh / 1000),
            "segundos"
        );

        setTimeout(function () {
            window.location.reload();
        }, tiempoHastaRefresh);
    }

    programarRefresh7AM();
});
