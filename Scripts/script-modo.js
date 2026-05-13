// Script para el botón de modo claro/oscuro
document.addEventListener('DOMContentLoaded', function() {
    const btnModo = document.getElementById('btn-modo');
    if (!btnModo) return;

    const img = btnModo.querySelector('img');
    if (!img) return;

    // Determinar el path base para Assets
    let basePath = window.location.pathname.includes('/Transferencias/') ? '../' : '';

    // Leer estado actual de localStorage, default 'claro'
    let modo = localStorage.getItem('modo') || 'claro';

    function actualizarBoton() {
        if (modo === 'claro') {
            img.src = basePath + 'Assets/modoclaro.png';
            btnModo.style.backgroundColor = 'white';
        } else {
            img.src = basePath + 'Assets/modoscuro.png';
            btnModo.style.backgroundColor = 'black';
        }
    }

    function actualizarIconosPassword() {
        const iconos = document.querySelectorAll('.icono-password');
        iconos.forEach(icono => {
            icono.src = modo === 'oscuro' ? basePath + 'Assets/ocultaroscuro.png' : basePath + 'Assets/ocultarclaro.png';
        });
    }

    // Inicializar
    actualizarBoton();
    actualizarIconosPassword();

    // Aplicar clase dark-mode si es necesario
    if (modo === 'oscuro') {
        document.body.classList.add("dark-mode");
    }

    // Evento click
    btnModo.addEventListener('click', function() {
        modo = modo === 'claro' ? 'oscuro' : 'claro';
        localStorage.setItem('modo', modo);
        actualizarBoton();
        actualizarIconosPassword();

        document.body.classList.toggle("dark-mode");
    
        const estaEnDark = document.body.classList.contains("dark-mode");
        console.log("¿Modo oscuro activo?:", estaEnDark);

    });
});