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

        user.email = email;
        user.phone = phone;
        localStorage.setItem(userKey, JSON.stringify(user));
        showMessage(profileMessage, 'Datos actualizados correctamente.');
    });

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

        user.password = newPass;
        localStorage.setItem(userKey, JSON.stringify(user));
        showMessage(passwordMessage, 'Contraseña actualizada correctamente.');
        passwordForm.reset();
    });

    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        window.location.href = 'sesionfinalizada.html';
    });
});