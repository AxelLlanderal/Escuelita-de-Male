let puntuacion = 0;
let intentoFallido = false;
let actividadActual = 1;
const totalActividades = 8; // Cambia este número al total de actividades que tienes

function mostrarActividad(id) {
    document.getElementById("introduccion").style.display = "none";

    let actividades = document.querySelectorAll('.actividad');
    actividades.forEach(act => act.classList.remove('visible'));
    document.getElementById(id).classList.remove('oculto');
    document.getElementById(id).classList.add('visible');
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let nuevaLetra = document.getElementById(data);
    let espacio = event.target;

    let letraAnterior = espacio.getAttribute("data-letra");
    if (letraAnterior && letraAnterior !== data) {
        document.getElementById(letraAnterior).style.display = "inline-block";
    }

    espacio.textContent = data;
    espacio.setAttribute("data-letra", data);
    nuevaLetra.style.display = "none";

    if (data === espacio.getAttribute("data-correcta")) {
        espacio.setAttribute("data-correcto", "true");
    } else {
        espacio.setAttribute("data-correcto", "false");
    }
}

function verifiRes() {
    const actividadId = `actividad${actividadActual}`;
    const actividad = document.getElementById(actividadId);
    const espacio = actividad.querySelector(".espacio-vacio");
    const medalla = actividad.querySelector(".medalla");

    const correcto = espacio.getAttribute("data-correcto");

    if (correcto === "true") {
        puntuacion += 1;
        intentoFallido = false;

        medalla.classList.remove("oculto");
        medalla.classList.add("animate__animated", "animate__bounceIn");

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        setTimeout(() => {
            medalla.classList.add("oculto");
            avanzarActividad();
        }, 2000);
    } else {
        intentoFallido = true;
        avanzarActividad();
    }
}

function avanzarActividad() {
    const actual = document.getElementById(`actividad${actividadActual}`);
    actual.classList.remove("visible");
    actual.classList.add("oculto");

    actividadActual++;
    const siguiente = document.getElementById(`actividad${actividadActual}`);
    if (siguiente) {
        siguiente.classList.remove("oculto");
        siguiente.classList.add("visible");
    } else {
        mostrarActividadFinal(); 
    }
}

function mostrarActividadFinal() {
    document.querySelectorAll('[id^="actividad"]').forEach(div => div.style.display = "none");
    document.getElementById('actividadFinal').style.display = "block";

    document.getElementById('musicaFinal').play();

    const duration = 5000;
    const end = Date.now() + duration;
    const canvas = document.getElementById('confettiCanvas');
    const confetti = window.confetti.create(canvas, { resize: true });

    (function frame() {
        confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();

    setTimeout(() => {
        mostrarResultadosFinales();
    }, 5000);
}

function mostrarResultadosFinales() {
    document.getElementById('actividadFinal').style.display = "none";
    const resultados = document.getElementById('actividadResultados');
    resultados.style.display = "block";

    const correctas = puntuacion;
    const errores = totalActividades - puntuacion; // Calcula los errores

    document.getElementById("aciertos").textContent = correctas;
    document.getElementById("errores").textContent = errores;
}
