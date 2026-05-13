// Script para Transferencia a Otros Bancos
document.addEventListener('DOMContentLoaded', function() {
    const cuentaDebitar = document.getElementById('cuenta-debitar');
    const form = document.getElementById('form-otrosbancos');
    const limpiarBtn = document.getElementById('limpiar-btn');
    const transferirBtn = document.getElementById('transferir-btn');
    const montoInput = document.getElementById('monto');
    const saldoError = document.getElementById('saldo-error');
    const regresarBtn = document.getElementById('regresar-btn');

    // Mostrar cuenta del usuario
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
        if (userData && userData.accountNumber) {
            cuentaDebitar.innerHTML = '';
            const opt = document.createElement('option');
            opt.value = userData.accountNumber;
            opt.textContent = userData.accountNumber;
            cuentaDebitar.appendChild(opt);
        }
    }

    // Limpiar formulario
    limpiarBtn.onclick = function(e) {
        e.preventDefault();
        form.reset();
        saldoError.textContent = '';
    };

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

    // Transferir
    transferirBtn.onclick = function(e) {
        e.preventDefault();
        saldoError.textContent = '';
        // Validar que todos los campos estén llenos
        const campos = [
            cuentaDebitar.value,
            document.getElementById('banco').value,
            document.getElementById('instrumento').value.trim(),
            document.getElementById('nombre').value.trim(),
            document.getElementById('tipo').value,
            document.getElementById('documento').value.trim(),
            montoInput.value.trim(),
            document.getElementById('concepto').value.trim()
        ];
        if (campos.some(v => !v)) {
            saldoError.textContent = 'Debe completar todos los campos';
            return;
        }
        // Validar monto: solo números positivos, máximo dos decimales
        let montoStr = montoInput.value.replace(',', '.').trim();
        if (!/^(?!0+(?:\.0+)?$)\d+(?:[\.,]\d{1,2})?$/.test(montoStr)) {
            saldoError.textContent = 'Monto inválido';
            return;
        }
        const monto = parseFloat(montoStr);
        if (isNaN(monto) || monto <= 0) {
            saldoError.textContent = 'Monto inválido';
            return;
        }
        if (currentUser) {
            const userKey = 'user_' + currentUser;
            const userData = JSON.parse(localStorage.getItem(userKey));
            if (userData.saldo < monto) {
                saldoError.textContent = 'Saldo insuficiente';
                return;
            }
            userData.saldo = +(userData.saldo - monto).toFixed(2);
            // Registrar transacción
            if (!Array.isArray(userData.transacciones)) userData.transacciones = [];
            userData.transacciones.push({
                fecha: new Date().toLocaleString('es-VE'),
                tipo: 'Transferencia a otros bancos',
                monto: monto,
                descripcion: `${document.getElementById('nombre').value.trim()} (${document.getElementById('banco').value}) - ${document.getElementById('concepto').value.trim()}`,
                referencia: generarReferenciaUnica(userData.transacciones)
            });
            localStorage.setItem(userKey, JSON.stringify(userData));
            form.reset();
            saldoError.textContent = 'Transferencia realizada con éxito';
        }
    };

    // Regresar
    regresarBtn.onclick = function(e) {
        e.preventDefault();
        window.location.href = '../Pantallainicial.html';
    };
});
