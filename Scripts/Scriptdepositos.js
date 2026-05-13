document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-depositos');
    const limpiarBtn = document.getElementById('limpiar-btn');
    const depositarBtn = document.getElementById('depositar-btn');
    const montoInput = document.getElementById('monto');
    const resultadoMsg = document.getElementById('resultado-msg');
    const regresarBtn = document.getElementById('regresar-btn');
    const currentUser = localStorage.getItem('currentUser');

    function marcarMensaje(texto, color) {
        resultadoMsg.textContent = texto;
        resultadoMsg.style.color = color;
    }

    function generarReferenciaUnica(transacciones = []) {
        const referencias = new Set((transacciones || []).map(tx => tx.referencia).filter(Boolean));
        let referencia;
        do {
            referencia = '';
            for (let i = 0; i < 12; i++) {
                referencia += Math.floor(Math.random() * 10);
            }
        } while (referencias.has(referencia));
        return referencia;
    }

    limpiarBtn.onclick = function(e) {
        e.preventDefault();
        form.reset();
        marcarMensaje('', '');
    };

    depositarBtn.onclick = function(e) {
        e.preventDefault();
        marcarMensaje('', '');

        const montoStr = montoInput.value.replace(',', '.').trim();
        if (!montoStr || !/^(?!0+(?:\.0+)?$)\d+(?:[\.,]\d{1,2})?$/.test(montoStr)) {
            marcarMensaje('Ingrese un monto válido para depositar.', 'red');
            return;
        }

        const monto = parseFloat(montoStr);
        if (isNaN(monto) || monto <= 0) {
            marcarMensaje('El monto debe ser mayor a 0.', 'red');
            return;
        }

        if (!currentUser) {
            marcarMensaje('No se encontró usuario activo. Inicie sesión.', 'red');
            return;
        }

        const userKey = 'user_' + currentUser;
        const userData = JSON.parse(localStorage.getItem(userKey)) || {};
        userData.saldo = +(Number(userData.saldo || 0) + monto).toFixed(2);
        if (!Array.isArray(userData.transacciones)) {
            userData.transacciones = [];
        }
        userData.transacciones.push({
            fecha: new Date().toLocaleString('es-VE'),
            tipo: 'Depósito',
            monto: monto,
            descripcion: 'Depósito simulado',
            referencia: generarReferenciaUnica(userData.transacciones)
        });

        localStorage.setItem(userKey, JSON.stringify(userData));
        marcarMensaje('Depósito realizado con éxito.', 'green');
        form.reset();
    };

    regresarBtn.onclick = function(e) {
        e.preventDefault();
        window.location.href = 'Pantallainicial.html';
    };
});