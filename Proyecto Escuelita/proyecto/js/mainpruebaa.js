document.addEventListener("DOMContentLoaded", function () {
    let ajolote = document.getElementById("ajolote");
    let clickCount = 0;
    let explosionImg = "img/explosion.gif";
    let lapidaImg = "img/lapida.webp"; 
    let sonidoExplosion = new Audio("audio/fune.mp3"); 
    let musicaFondo = new Audio("audio/intro.mp3"); 

    musicaFondo.loop = true;

    /*document.addEventListener("click", function iniciarMusica() {
        musicaFondo.play().catch(error => console.error("Error al reproducir la música:", error));
        document.removeEventListener("click", iniciarMusica);
    });*/

    ajolote.classList.add("flotando");

    ajolote.addEventListener("click", function () {
        ajolote.classList.add("vibrate");

        setTimeout(() => {
            ajolote.classList.remove("vibrate");
        }, 200);

        clickCount++;

        if (clickCount === 7) {
            alert("¡El ajolote se convirtió en una Xalamandra por el estrés 😰!");
            ajolote.src = "img/xala.png";
        }

        if (clickCount === 21) {
            ajolote.src = explosionImg;
            ajolote.style.animation = "none";
            ajolote.style.transform = "none"; 
            ajolote.style.left = "-1%";
        
            sonidoExplosion.play();
            musicaFondo.pause();
        
            setTimeout(() => {
                ajolote.src = lapidaImg;
            }, 900);
        }
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