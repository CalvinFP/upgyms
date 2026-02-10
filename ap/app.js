console.log("Script cargado correctamente");

document.addEventListener("DOMContentLoaded", function() {
    // Array de nombres a mostrar
    var names = [ 
        "Bormujos - Parque Universidad",
        "Málaga - Velazquez",
        "Reus - Daily Reus",
        "Vinarós - Parque Mediterraneo"
        // Agrega más nombres si es necesario
    ];


    var nameIndex = 0; // Índice para seguir el nombre actual

    // Función para cambiar el nombre y aplicar el efecto de fundido
    function changeNameWithFade() {
        var nameSpan = document.getElementById("name");

        // Desvanece gradualmente el texto actual
        nameSpan.style.opacity = 0;

        setTimeout(function() {
            // Cambia el texto
            nameSpan.textContent = names[nameIndex];

            // Incrementa el índice o vuelve a 0 si llega al final del array
            nameIndex = (nameIndex + 1) % names.length;

            // Desvanece gradualmente el nuevo texto
            nameSpan.style.opacity = 1;
        }, 1000); // Tiempo de espera antes de cambiar el texto (en milisegundos)
    }

    // Llama a la función inicialmente
    changeNameWithFade();

    // Llama a la función cada 5 segundos para cambiar el nombre
    setInterval(changeNameWithFade, 5000); // Cambia cada 5 segundos (en milisegundos)
});

const countdown =() =>{
    const countDate = new Date('Feb 13, 2026 18:00:00').getTime();
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

    //DIAS
    if(textDay <= 9){    
        document.querySelector('.day').innerText = 0 + textDay.toString();
    } else {
        document.querySelector('.day').innerText = textDay;
    }
    //HORAS
    if(textHour <= 9){
        document.querySelector('.hour').innerText = 0 + textHour.toString();
    } else {
        document.querySelector('.hour').innerText = textHour;
    }
    //MINUTOS
    if(textMinute <= 9){
        document.querySelector('.minute').innerText = 0 + textMinute.toString();
    } else {
        document.querySelector('.minute').innerText = textMinute;
    }
    //SEGUNDOS
    if(textSecond <= 9){
        document.querySelector('.second').innerText = 0 + textSecond.toString();
    } else {
        document.querySelector('.second').innerText = textSecond;
    }
    
    //cuando llega a 0
    //if(gap < 10000){}
};

countdown();
setInterval(countdown, 1000);



