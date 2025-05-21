function mostrarActividad(id) {
    document.getElementById("introduccion").style.display = "none";
    document.getElementById(id).style.display = "block";
}

const recordBtn = document.getElementById("recordBtn");
const status = document.getElementById("status");
const resultado = document.getElementById("resultado");
const textoEsperado = document.getElementById("texto").innerText;

let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener("click", async () => {
    if (!navigator.mediaDevices) {
        alert("Tu navegador no soporta grabación de audio.");
        return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];
    status.textContent = "🎤 Grabando... habla ahora.";

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        status.textContent = "⏳ Procesando...";

        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
            // Cambiar la URL aquí para apuntar al backend correcto
            const response = await fetch("http://127.0.0.1:5000/evaluar", {
    method: "POST",
    body: formData,
    mode: "cors"
});
            const data = await response.json();

            if (data && data.transcripcion) {
                resultado.innerHTML = `
                    <span class="text-success">Transcripción: "${data.transcripcion}"</span><br>
                    <span class="text-primary">Puntaje: ${data.puntaje}/100</span>
                `;
                status.textContent = "✅ Evaluación completada";
            } else {
                resultado.textContent = "Error al procesar audio.";
            }
        } catch (error) {
            resultado.textContent = "❌ Error al enviar el audio: " + error;
        }
    };

    mediaRecorder.start();

    // Detener grabación automáticamente después de 5 segundos
    setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
    }, 5000);
});

