// Mostrar número de cuenta y saldo en Pantallainicial.html
document.addEventListener('DOMContentLoaded', function() {
	const accountNumberElem = document.querySelector('.account-number');
	const balanceElem = document.querySelector('.balance-amount');
	const currentUser = localStorage.getItem('currentUser');
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
				// Formato: $ 12,450.00
				const saldoFormateado = userData.saldo.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2});
				balanceElem.textContent = '$ ' + saldoFormateado;
			}
		}
	}
});
