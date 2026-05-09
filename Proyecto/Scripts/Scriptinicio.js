document.addEventListener('DOMContentLoaded', function() {
    const iconoOcultar = document.getElementById('icono-ocultar');
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('spinner-overlay').style.display = 'flex';
        setTimeout(function() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const userData = localStorage.getItem('user_' + username);
            document.getElementById('spinner-overlay').style.display = 'none';
            if (!userData) {
                alert('Usuario no encontrado.');
                return;
            }
            const user = JSON.parse(userData);
            if (user.password !== password) {
                alert('Contraseña incorrecta.');
                return;
            }
            // Guardar usuario logueado
            localStorage.setItem('currentUser', username);
            window.location.href = 'Pantallainicial.html';
        }, 2000);
    });

    const modal = document.getElementById('recuperacion-modal');
    const content = document.getElementById('recuperacion-content');
    let userToRecover = null;
    let selectedQuestion = null;
    let correctAnswer = null;

    // Mostrar modal al hacer click en "¿Olvidaste tu clave?"
    document.querySelector('.forgot-link').addEventListener('click', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        if (!username) {
            alert('Por favor, ingresa tu usuario para recuperar la clave.');
            return;
        }
        const userData = localStorage.getItem('user_' + username);
        if (!userData) {
            alert('Usuario no encontrado.');
            return;
        }
        userToRecover = username;
        const user = JSON.parse(userData);
        // Elegir una pregunta aleatoria
        const idx = Math.floor(Math.random() * user.questions.length);
        selectedQuestion = user.questions[idx].question;
        correctAnswer = user.questions[idx].answer;
        // Mostrar pregunta y campo de respuesta
        content.innerHTML = `
            <h3>Recuperación de cuenta</h3>
            <p><strong>Pregunta de seguridad:</strong></p>
            <p>${selectedQuestion}</p>
            <input type="text" id="security-answer" placeholder="Respuesta" required>
            <button id="verify-answer">Verificar respuesta</button>
            <button id="close-modal" class="cancelar-btn">Cancelar</button>
            <p id="mensaje-error"></p>
        `;
        modal.classList.add('activo');

        document.getElementById('verify-answer').onclick = function() {
            const answer = document.getElementById('security-answer').value.trim();
            const mensaje = document.getElementById('mensaje-error');
            if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
                // Mostrar campos para nueva contraseña
                content.innerHTML = `
                    <h3>Recuperación de cuenta</h3>
                    <p>Respuesta correcta. Ingresa tu nueva contraseña:</p>
                    <input type="password" id="new-password" placeholder="Nueva contraseña" required minlength="6">
                    <input type="password" id="confirm-password" placeholder="Confirmar contraseña" required>
                    <button id="save-new-password">Guardar nueva contraseña</button>
                    <button id="close-modal" class="cancelar-btn">Cancelar</button>
                    <p id="mensaje-error"></p>
                `;
                document.getElementById('save-new-password').onclick = function() {
                    const newPass = document.getElementById('new-password').value;
                    const confirmPass = document.getElementById('confirm-password').value;
                    const mensaje = document.getElementById('mensaje-error');
                    if (newPass.length < 6) {
                        mensaje.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                        mensaje.style.display = 'block';
                        return;
                    }
                    if (newPass !== confirmPass) {
                        mensaje.textContent = 'Las contraseñas no coinciden.';
                        mensaje.style.display = 'block';
                        return;
                    }
                    // Actualizar contraseña en localStorage
                    const userData = localStorage.getItem('user_' + userToRecover);
                    if (userData) {
                        const user = JSON.parse(userData);
                        user.password = newPass;
                        localStorage.setItem('user_' + userToRecover, JSON.stringify(user));
                    }
                    alert('Contraseña actualizada correctamente.');
                    modal.classList.remove('activo');
                };
                document.getElementById('close-modal').onclick = function() {
                    modal.classList.remove('activo');
                };
            } else {
                mensaje.textContent = 'Respuesta incorrecta. Intenta de nuevo.';
                mensaje.style.display = 'block';
            }
        };
        document.getElementById('close-modal').onclick = function() {
            modal.classList.remove('activo');
        };
    });

    // Cerrar modal si se hace click fuera del contenido
    modal.onclick = function(e) {
        if (e.target === modal) modal.classList.remove('activo');
    };
});
