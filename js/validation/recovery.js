import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../config/FirebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector(".registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const userInput = document.getElementById("user");
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const confirmPasswordInput = document.getElementById("confirmPassword");

            if (!userInput || !emailInput || !phoneInput || !confirmPasswordInput) {
                alert("Erro interno: campos não encontrados.");
                return;
            }

            const user = userInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!user || user.length < 3) {
                alert("Informe um nome de usuário válido (mínimo 3 caracteres).");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Informe um e-mail válido.");
                return;
            }

            // const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
            // if (!phoneRegex.test(phone)) {
            //     alert("Informe um telefone válido no formato (XX) XXXXX-XXXX.");
            //     return;
            // }

            if (password.length < 6) {
                alert("A senha deve ter no mínimo 6 caracteres.");
                return;
            }

            if (password !== confirmPassword) {
                alert("As senhas não coincidem.");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;

                await updateProfile(firebaseUser, { displayName: user });

                console.log("Cadastro realizado com sucesso:", firebaseUser);
                window.location.href = "../pages/map.html";
            } catch (error) {
                console.error("Erro ao registrar:", error);
                alert("Erro ao registrar: " + error.message);
            }
        });
    }
});