document.addEventListener("DOMContentLoaded", function () {
    let ajolote = document.getElementById("ajolote");
    let musicaFondo = new Audio("audio/intro.mp3"); 

    musicaFondo.loop = true;

    document.addEventListener("click", function iniciarMusica() {
        musicaFondo.play().catch(error => console.error("Error al reproducir la música:", error));
        document.removeEventListener("click", iniciarMusica);
    });

    ajolote.classList.add("flotando");

    ajolote.addEventListener("click", function () {
        ajolote.classList.add("vibrate");

        setTimeout(() => {
            ajolote.classList.remove("vibrate");
        }, 200);

        clickCount++;
    });

});

let ajolote = document.getElementById("ajolote");
let position = 0;
let direction = 1;

function moverAjolote() {
    if (position >= 30) direction = -1;
    if (position <= -30) direction = 1;

    position += direction;
    ajolote.style.transform = `translateX(-140px) translateY(${position}px)`;

    requestAnimationFrame(moverAjolote);
}

moverAjolote();