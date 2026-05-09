document.addEventListener('DOMContentLoaded', function () {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'Iniciosesion.html';
        return;
    }

    const userKey = 'user_' + currentUser;
    const storedUser = localStorage.getItem(userKey);
    if (!storedUser) {
        window.location.href = 'Iniciosesion.html';
        return;
    }

    const user = JSON.parse(storedUser);
    const fullnameInput = document.getElementById('fullname');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email-perfil');
    const phoneInput = document.getElementById('phone-perfil');
    const welcomeText = document.getElementById('profile-welcome');
    const profileForm = document.getElementById('profile-form');
    const passwordForm = document.getElementById('form-password');
    const logoutBtn = document.getElementById('logout-btn');
    const profileMessage = document.getElementById('profile-message');
    const passwordMessage = document.getElementById('password-message');

    fullnameInput.value = user.fullname || '';
    usernameInput.value = user.username || currentUser;
    emailInput.value = user.email || '';
    phoneInput.value = user.phone || '';
    welcomeText.textContent = `Hola, ${user.fullname.split(' ')[0] || user.username}`;

    function showMessage(element, message, type = 'success') {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 4200);
    }

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!email || !phone) {
            showMessage(profileMessage, 'Completa todos los campos para actualizar.', 'error');
            return;
        }

        // Mostrar modal de seguridad antes de actualizar
        mostrarModalSeguridad(function () {
            user.email = email;
            user.phone = phone;
            localStorage.setItem(userKey, JSON.stringify(user));
            showMessage(profileMessage, 'Datos actualizados correctamente.');
        });
    });

    // --- Modal de seguridad para actualización de datos ---
    function mostrarModalSeguridad(callback) {
        const modal = document.getElementById('seguridad-modal');
        const content = document.getElementById('seguridad-content');
        let selectedQuestion = null;
        let correctAnswer = null;

        // Elegir una pregunta aleatoria del usuario
        if (!user.questions || !user.questions.length) {
            alert('No tienes preguntas de seguridad registradas.');
            return;
        }
        const idx = Math.floor(Math.random() * user.questions.length);
        selectedQuestion = user.questions[idx].question;
        correctAnswer = user.questions[idx].answer;

        content.innerHTML = `
            <h3>Verificación de seguridad</h3>
            <p><strong>Pregunta de seguridad:</strong></p>
            <p>${selectedQuestion}</p>
            <input type="text" id="seguridad-respuesta" placeholder="Respuesta" required>
            <button id="verificar-seguridad">Verificar respuesta</button>
            <button id="cerrar-seguridad" class="cancelar-btn">Cancelar</button>
            <p id="seguridad-mensaje-error"></p>
        `;
        modal.classList.add('activo');

        document.getElementById('verificar-seguridad').onclick = function () {
            const answer = document.getElementById('seguridad-respuesta').value.trim();
            const mensaje = document.getElementById('seguridad-mensaje-error');
            if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
                modal.classList.remove('activo');
                if (typeof callback === 'function') callback();
            } else {
                mensaje.textContent = 'Respuesta incorrecta. Intenta de nuevo.';
                mensaje.style.display = 'block';
            }
        };
        document.getElementById('cerrar-seguridad').onclick = function () {
            modal.classList.remove('activo');
        };
        // Cerrar modal si se hace click fuera del contenido
        modal.onclick = function (e) {
            if (e.target === modal) modal.classList.remove('activo');
        };
    }

    passwordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const newPass = document.getElementById('new-pass').value.trim();
        const confirmPass = document.getElementById('confirm-pass').value.trim();

        if (newPass.length < 6) {
            showMessage(passwordMessage, 'La contraseña debe tener al menos 6 caracteres.', 'error');
            return;
        }
        if (newPass !== confirmPass) {
            showMessage(passwordMessage, 'Las contraseñas no coinciden.', 'error');
            return;
        }

        // Mostrar modal de seguridad antes de actualizar contraseña
        mostrarModalSeguridad(function () {
            user.password = newPass;
            localStorage.setItem(userKey, JSON.stringify(user));
            showMessage(passwordMessage, 'Contraseña actualizada correctamente.');
            passwordForm.reset();
        });
    });

    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        window.location.href = 'sesionfinalizada.html';
    });
});