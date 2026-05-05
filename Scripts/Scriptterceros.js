// Script para menú de transferencias y lógica de Terceros.html

document.addEventListener('DOMContentLoaded', function() {
    // --- Pantallainicial.html: menú de transferencias ---
    const transferBtn = document.getElementById('transferencias-btn');
    const menu = document.getElementById('transferencias-menu');
    if (transferBtn && menu) {
        transferBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            // Posicionar menú debajo del botón
            const rect = transferBtn.getBoundingClientRect();
            menu.style.left = rect.left + 'px';
            menu.style.top = (rect.bottom + window.scrollY) + 'px';
        });
        document.addEventListener('click', function() {
            menu.style.display = 'none';
        });
        document.getElementById('cuentas-terceros-btn').onclick = function(e) {
            e.stopPropagation();
            window.location.href = 'Transferencias/Terceros.html';
        };
        document.getElementById('cuentas-otros-bancos-btn').onclick = function(e) {
            e.stopPropagation();
            window.location.href = 'Transferencias/Otrosbancos.html';
        };
    }

    // --- Terceros.html: lógica de formulario ---
    if (window.location.pathname.includes('Terceros.html')) {
        const cuentaDebitar = document.getElementById('cuenta-debitar');
        const form = document.getElementById('form-terceros');
        const limpiarBtn = document.getElementById('limpiar-btn');
        const transferirBtn = document.getElementById('transferir-btn');
        const montoInput = document.getElementById('monto');
        const cuentaDestinoInput = document.getElementById('cuenta-destino');
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

        // Transferir
        transferirBtn.onclick = function(e) {
            e.preventDefault();
            saldoError.textContent = '';
            // Validar que todos los campos estén llenos
            const campos = [
                cuentaDebitar.value,
                cuentaDestinoInput.value.trim(),
                montoInput.value.trim(),
                document.getElementById('concepto').value.trim()
            ];
            if (campos.some(v => !v)) {
                saldoError.textContent = 'Debe completar todos los campos';
                return;
            }
            const monto = parseFloat(montoInput.value.replace(',', '.'));
            if (isNaN(monto) || monto <= 0) {
                saldoError.textContent = 'Monto inválido';
                return;
            }
            if (!/^\d{8}$/.test(cuentaDestinoInput.value)) {
                saldoError.textContent = 'La cuenta destino debe tener 8 dígitos';
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
                localStorage.setItem(userKey, JSON.stringify(userData));
                form.reset();
                saldoError.textContent = 'Transferencia realizada con éxito';
                setTimeout(() => { saldoError.textContent = ''; }, 2000);
            }
        };

        // Regresar
        regresarBtn.onclick = function(e) {
            e.preventDefault();
            window.location.href = '../Pantallainicial.html';
        };
    }
});
