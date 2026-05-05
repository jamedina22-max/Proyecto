document.addEventListener('DOMContentLoaded', function() {
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
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (password !== confirm) {
            alert('Las contraseñas no coinciden.');
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
        window.location.href = 'Iniciosesion.html';
    });
});
