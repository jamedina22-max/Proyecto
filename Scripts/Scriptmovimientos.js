document.addEventListener('DOMContentLoaded', function() {
    const tabla = document.getElementById('tabla-movimientos');
    const currentUser = localStorage.getItem('currentUser');
    const filtroTipo = document.querySelector('#tipo');
    if (!tabla || !currentUser) return;

    const userData = JSON.parse(localStorage.getItem('user_' + currentUser));
    let transacciones = [];
    if (userData && Array.isArray(userData.transacciones)) {
        transacciones = userData.transacciones;
    }

    const tbody = tabla.querySelector('tbody');

    function obtenerReferencia(tx) {
        return tx.referencia || 'Sin referencia';
    }

    function renderTabla(lista) {
        tbody.innerHTML = '';
        if (lista.length === 0) {
            const fila = document.createElement('tr');
            const celda = document.createElement('td');
            celda.colSpan = 5;
            celda.textContent = 'No hay movimientos registrados.';
            celda.style.textAlign = 'center';
            fila.appendChild(celda);
            tbody.appendChild(fila);
            return;
        }

        [...lista].reverse().forEach(tx => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="padding:6px;">${tx.fecha || ''}</td>
                <td style="padding:6px;">${tx.tipo || ''}</td>
                <td style="padding:6px;">${tx.monto ? '$' + Number(tx.monto).toLocaleString('es-ES', {minimumFractionDigits:2}) : ''}</td>
                <td style="padding:6px;">${tx.descripcion || ''}</td>
                <td style="padding:6px;">${obtenerReferencia(tx)}</td>
            `;
            tbody.appendChild(fila);
        });
    }

    function obtenerTransaccionesFiltradas() {
        const filtro = filtroTipo.value;
        if (filtro ==="entradas"){
            return transacciones.filter(tx => tx.tipo === 'Ingreso' || tx.tipo === 'Depósito');
        }
        if (filtro ==="salidas"){
            return transacciones.filter(tx => 
                tx.tipo === "Pago Móvil" ||
                tx.tipo === "Transferencia a terceros" ||
                tx.tipo === "Transferencia a otros bancos"
            );
        }
        return transacciones;
    }

    filtroTipo.addEventListener('change', function() {
        renderTabla(obtenerTransaccionesFiltradas());
    });

    renderTabla(transacciones);
});