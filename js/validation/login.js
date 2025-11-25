import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../config/FirebaseConfig.js";
import { visibility } from "../domUtils/visibility.js";

function clearErrors() {
  document.getElementById("email-error").textContent = "";
  document.getElementById("password-error").textContent = "";
  document.getElementById("general-error").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      clearErrors();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      let hasError = false;

      if (email === "") {
        document.getElementById("email-error").textContent =
          "O campo Email é obrigatório.";
        hasError = true;
      }

      if (password === "") {
        document.getElementById("password-error").textContent =
          "O campo Senha é obrigatório.";
        hasError = true;
      }

      if (hasError) {
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("Usuário logado:", user);

        window.location.href = "../pages/map.html";
       
      } catch (error) {
        console.error("Erro ao fazer login:", error);

        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-credential"
        ) {
          document.getElementById("general-error").textContent =
            "Email ou senha inválidos. Por favor, verifique suas credenciais.";
        } else {
          document.getElementById("general-error").textContent =
            "Ocorreu um erro ao tentar logar. Tente novamente mais tarde.";
        }
      }
    });
  }
});

const openBtn = document.getElementById("recuperarSenha");
const modal = document.getElementById("modalRecovery");
const overlay = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("closeModal");

if (openBtn && modal && overlay && closeBtn) {
  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    overlay.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    overlay.style.display = "none";
  });
}

const eye = document.getElementById("eye");
const passwordField = document.getElementById("password");
if (eye && passwordField) {
  visibility(eye, passwordField, null);
}
