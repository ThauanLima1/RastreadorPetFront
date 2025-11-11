import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../config/FirebaseConfig.js";
import { visibility } from "../domUtils/visibility.js";


document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Usuário logado:", user);

        window.location.href = "./homePage.html";

      } catch (error) {
        console.error("Deu ruim:", error);
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

const eye = document.getElementById('eye');
const passwordField = document.getElementById('password');
if (eye && passwordField) {
  visibility(eye, passwordField, null);
}

