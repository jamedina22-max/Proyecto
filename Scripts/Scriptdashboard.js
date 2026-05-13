// Mostrar número de cuenta y saldo en Pantallainicial.html
document.addEventListener('DOMContentLoaded', function() {
	const accountNumberElem = document.querySelector('.account-number');
	const balanceElem = document.querySelector('.balance-amount');
	const toggleSaldoBtn = document.getElementById('toggle-saldo-btn');
	const iconoSaldo = document.getElementById('icono-saldo');
	const currentUser = localStorage.getItem('currentUser');
	const pagomovilbtn = document.getElementById('pagomovil-btn');
	const depositosbtn = document.getElementById('depositos-btn');
	const movimientosbtn = document.getElementById('movimientos-btn');
	const profileBtn = document.querySelector('.profileBtn');

	let saldoReal = '';
	let saldoVisible = false;

	if (currentUser) {
		const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
		if (userData) {
			// Número de cuenta
			if (accountNumberElem && userData.accountNumber) {
				const cuenta = userData.accountNumber;
				const masked = '**** ' + cuenta.slice(4);
				accountNumberElem.textContent = 'Cuenta Corriente ' + masked;
			}
			// Saldo
			if (balanceElem && typeof userData.saldo !== 'undefined') {
				saldoReal = userData.saldo.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2});
				balanceElem.textContent = '******';
			}
		}
	}

	if (toggleSaldoBtn && iconoSaldo && balanceElem) {
		toggleSaldoBtn.addEventListener('click', function() {
			saldoVisible = !saldoVisible;
			if (saldoVisible) {
				balanceElem.textContent = saldoReal;
			} else {
				balanceElem.textContent = '******';
			}
		});
	}
	pagomovilbtn.addEventListener('click', function() {
		window.location.href = 'Pagomovil.html';
	});
	depositosbtn.addEventListener('click', function() {
		window.location.href = 'Depositos.html';
	});
	movimientosbtn.addEventListener('click', function() {
		window.location.href = 'Movimientos.html';
	});
	if (profileBtn) {
		profileBtn.addEventListener('click', function () {
			window.location.href = 'perfil.html';
		});
	}
	// Mostrar las 3 últimas transacciones
	const tablaUltimas = document.getElementById('ultimas-transacciones');
	if (tablaUltimas) {
		let transacciones = [];
		if (currentUser) {
			const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
			if (userData && Array.isArray(userData.transacciones)) {
				transacciones = userData.transacciones;
			}
		}
		// Ordenar de más reciente a más antiguo
		const transaccionesOrdenadas = [...transacciones].reverse();
		const ultimas = transaccionesOrdenadas.slice(0, 3);
		const tbody = tablaUltimas.querySelector('tbody');
		tbody.innerHTML = '';
		if (ultimas.length === 0) {
			const fila = document.createElement('tr');
			const celda = document.createElement('td');
			celda.colSpan = 4;
			celda.textContent = 'No hay transacciones recientes.';
			celda.style.textAlign = 'center';
			fila.appendChild(celda);
			tbody.appendChild(fila);
		} else {
			ultimas.forEach(tx => {
				const fila = document.createElement('tr');
				fila.innerHTML = `
					<td style="padding:6px;">${tx.fecha || ''}</td>
					<td style="padding:6px;">${tx.tipo || ''}</td>
					<td style="padding:6px;">${tx.monto ? '$' + Number(tx.monto).toLocaleString('es-ES', {minimumFractionDigits:2}) : ''}</td>
					<td style="padding:6px;">${tx.descripcion || ''}</td>
				`;
				tbody.appendChild(fila);
			});
		}
	}
});

