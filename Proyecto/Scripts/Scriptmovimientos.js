// Script para mostrar todas las transacciones del usuario en Movimientos.html

document.addEventListener('DOMContentLoaded', function() {
    const tabla = document.getElementById('tabla-movimientos');
    const currentUser = localStorage.getItem('currentUser');
    if (!tabla || !currentUser) return;
    const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
    let transacciones = [];
    if (userData && Array.isArray(userData.transacciones)) {
        transacciones = userData.transacciones;
    }
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';
    if (transacciones.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 4;
        celda.textContent = 'No hay movimientos registrados.';
        celda.style.textAlign = 'center';
        fila.appendChild(celda);
        tbody.appendChild(fila);
    } else {
        // Mostrar de más reciente a más antiguo
        [...transacciones].reverse().forEach(tx => {
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
});
