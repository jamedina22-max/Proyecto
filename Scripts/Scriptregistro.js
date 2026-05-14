//Script para el registro de usuarios, validación de datos, generación de número de cuenta único y almacenamiento en localStorage.
document.addEventListener('DOMContentLoaded', function() {
    // Toggles para contraseñas
    const togglePasswordReg = document.getElementById('toggle-password-reg');
    const toggleConfirmPasswordReg = document.getElementById('toggle-confirm-password-reg');
    const passwordInputReg = document.getElementById('password');
    const confirmPasswordInputReg = document.getElementById('confirm-password');
    const iconoPasswordReg = document.getElementById('icono-password-reg');
    const iconoConfirmPasswordReg = document.getElementById('icono-confirm-password-reg');
    const modo = localStorage.getItem('modo') || 'claro';
    if (iconoPasswordReg) iconoPasswordReg.src = modo === 'oscuro' ? 'Assets/ocultaroscuro.png' : 'Assets/ocultarclaro.png';
    if (iconoConfirmPasswordReg) iconoConfirmPasswordReg.src = modo === 'oscuro' ? 'Assets/ocultaroscuro.png' : 'Assets/ocultarclaro.png';

    if (togglePasswordReg) {
        togglePasswordReg.addEventListener('click', function(e) {
            e.preventDefault();
            const isPassword = passwordInputReg.type === 'password';
            passwordInputReg.type = isPassword ? 'text' : 'password';
        });
    }
    if (toggleConfirmPasswordReg) {
        toggleConfirmPasswordReg.addEventListener('click', function(e) {
            e.preventDefault();
            const isPassword = confirmPasswordInputReg.type === 'password';
            confirmPasswordInputReg.type = isPassword ? 'text' : 'password';
        });
    }
    const registroForm = document.querySelector('.register-box form');
    const preguntasForm = document.getElementById('security-questions-form');
    const modal = document.getElementById('security-questions-modal');

    // Generar número de cuenta único de 8 dígitos
    function generarNumeroCuentaUnico() {
        let numero;
        let existe = true;
        while (existe) {
            numero = '';
            for (let i = 0; i < 8; i++) {
                numero += Math.floor(Math.random() * 10);
            }
            // Revisar si ya existe en algún usuario
            existe = false;
            for (let key in localStorage) {
                if (key.startsWith('user_')) {
                    try {
                        const user = JSON.parse(localStorage.getItem(key));
                        if (user && user.accountNumber === numero) {
                            existe = true;
                            break;
                        }
                    } catch (e) {}
                }
            }
        }
        return numero;
    }

    // Validación y mostrar modal
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm-password').value;
        const cedula = document.getElementById('cedula').value.trim();
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (password !== confirm) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        if (!cedula || isNaN(cedula) || cedula.length < 7 || cedula.length > 9) {
            alert('La cédula debe ser un número válido de 7 a 9 dígitos.');
            return;
        }
        // Mostrar modal de preguntas
        modal.style.display = 'flex';
    });

    // Guardar datos y redirigir
    preguntasForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Datos principales
        const userData = {
            fullname: document.getElementById('fullname').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            cedula: document.getElementById('cedula').value.trim(),
            password: document.getElementById('password').value,
            questions: [],
            accountNumber: generarNumeroCuentaUnico(),
            saldo: 12450.00
        };
        // Preguntas y respuestas
        const selects = preguntasForm.querySelectorAll('select');
        const inputs = preguntasForm.querySelectorAll('input[type="text"]');
        for (let i = 0; i < 3; i++) {
            userData.questions.push({
                question: selects[i].value,
                answer: inputs[i].value
            });
        }
        // Guardar en localStorage (por username)
        localStorage.setItem('user_' + userData.username, JSON.stringify(userData));
        // Redirigir a Iniciosesion.html
        window.location.href = 'index.html';
    });
});
