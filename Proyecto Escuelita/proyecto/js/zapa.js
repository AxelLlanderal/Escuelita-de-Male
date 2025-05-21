let signos = ['!', '¡', '?', '¿'];
let actividadActual = 1;
let resultadosPorActividad = [];

function mostrarActividad(id) {
    document.getElementById("introduccion").style.display = "none";

    let actividades = document.querySelectorAll('.actividad');
    actividades.forEach(act => act.classList.remove('visible'));
    
    document.getElementById(id).classList.add('visible');
}
// its a new day, its a new life, its a new dawwn for meeeeeee
//and i feeeeeling soooo gooood
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
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


function allowDrop(event) {
    event.preventDefault();
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".boton-signo").forEach(btn => {
      btn.addEventListener("click", () => {
        let actual = btn.textContent.trim();
        let index = signos.indexOf(actual);
        let siguiente = signos[(index + 1) % signos.length];
        btn.textContent = siguiente;
      });
    });
  });
  
  function revisarSignos() {
    
    const actividad = document.getElementById(`actividad${actividadActual}`);
    const botones = actividad.querySelectorAll(".boton-signo");
  
    let aciertos = 0;
    let errores = 0;
  
    botones.forEach(btn => {
      let actual = btn.textContent.trim();
      let correcto = btn.dataset.correcto;
  
      if (actual === correcto) {
        aciertos++;
      } else {
        errores++;
      }
    });
  
    resultadosPorActividad.push({ aciertos, errores });
  
    avanzarActividad();
  }
  