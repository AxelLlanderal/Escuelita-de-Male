let puntuacion = 0;
let intentoFallido = false;
let actividadActual = 1;
let resultadosPorActividad = [];
function mostrarActividad(id) {
    document.getElementById("introduccion").style.display = "none";

    let actividades = document.querySelectorAll('.actividad');
    actividades.forEach(act => act.classList.remove('visible'));
    document.getElementById(id).classList.remove('oculto');
    document.getElementById(id).classList.add('visible');
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
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("resorteraCanvas");
    const ctx = canvas.getContext("2d");

    let selected = null;
    let startX = 0, startY = 0;
    let dragging = false;

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    document.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("palabra")) {
            e.preventDefault();

            const rect = e.target.getBoundingClientRect();
            startX = rect.left + rect.width / 2 + window.scrollX;
            startY = rect.top + rect.height / 2 + window.scrollY;

            selected = e.target;
            dragging = true;
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (dragging && selected) {
            const currentX = e.clientX + window.scrollX;
            const currentY = e.clientY + window.scrollY;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = "#444";
            ctx.lineWidth = 4;
            ctx.stroke();
        }
    });

    document.addEventListener("mouseup", (e) => {
        if (dragging && selected) {
            const actividad = document.getElementById(`actividad${actividadActual}`);
            const espacios = actividad.querySelectorAll(".espacio-vacio");

            const endX = e.clientX;
            const endY = e.clientY;

            espacios.forEach(espacio => {
                const espacioRect = espacio.getBoundingClientRect();

                if (
                    endX >= espacioRect.left &&
                    endX <= espacioRect.right &&
                    endY >= espacioRect.top &&
                    endY <= espacioRect.bottom
                ) {
                    const palabra = selected.getAttribute("data-palabra");
                    espacio.textContent = palabra;

                    if (palabra === espacio.getAttribute("data-correcta")) {
                        espacio.style.backgroundColor = "#c8f7c5"; 
                        puntuacion += 1;
                        intentoFallido = false;
                    } else {
                        espacio.style.backgroundColor = "#f7c5c5"; 
                        intentoFallido = true;
                    }
                }
            });

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dragging = false;
            selected = null;
        }
    });
});

document.querySelectorAll('.palabra').forEach(palabra => {
    palabra.addEventListener('click', () => {
      if (palabraLanzada && palabraLanzada !== palabra) {
        palabraLanzada.style.transform = 'translate(0, 0)';
        palabraLanzada.classList.remove('animar-palabra');
      }
      palabraLanzada = palabra;
      mostrarResorte(palabra);
    });
});

function calificarActividad() {
    const espacios = document.querySelectorAll('.espacio-vacio');
    let buenas = 0;
    let malas = 0;
  
    espacios.forEach(espacio => {
      const respuesta = espacio.textContent.trim();
      const correcta = espacio.dataset.correcta;
      if (respuesta === correcta) {
        buenas++;
      } else if (respuesta !== '' && respuesta !== correcta) {
        malas++;
      }
    });
  
    document.getElementById('resultado').textContent = `✅ Correctas: ${buenas} | ❌ Incorrectas: ${malas}`;
  }

  function revisarActividadActual() {
    const actividad = document.getElementById(`actividad${actividadActual}`);
    const espacios = actividad.querySelectorAll(".espacio-vacio");

    let aciertos = 0;
    let errores = 0;

    espacios.forEach(espacio => {
        const palabra = espacio.textContent.trim();
        const correcta = espacio.getAttribute("data-correcta");

        if (palabra === correcta) {
            aciertos++;
        } else if (palabra !== "") {
            errores++;
        }
    });

    resultadosPorActividad.push({ aciertos, errores });

    avanzarActividad(); 
}