window.onload = function () {
    const ajolote = document.getElementById("ajolote");
    if (!ajolote) {
        console.error("No se encontró el elemento con ID 'ajolote'");
        return;
    }

    let clicks = 0;

    ajolote.addEventListener("click", function () {
        clicks++;

        if (clicks < 7) {
            let newX = Math.random() * (window.innerWidth - ajolote.width - 20); 
            let newY = Math.random() * (window.innerHeight - ajolote.height - 20);
            ajolote.style.left = `${newX}px`;
            ajolote.style.top = `${newY}px`;
        } else {
            ajolote.src = "C:/Users/Ricar/Documents/VS/tania p.w/proyecto/img/xala.png";
            alert("¡Oh no! Estresaste al ajolote y evolucionó... ¡UNA XALAMANDRA! 😱");
        }
    });
};