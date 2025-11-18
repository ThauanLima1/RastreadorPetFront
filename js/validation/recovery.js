import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../config/FirebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("recuperarSenha");
  const modal = document.getElementById("modalRecovery");
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("closeModal");
  const recoveryBtn = document.querySelector(".recuperar");
  const recoveryInput = document.querySelector(".modal-content input");

  openBtn?.addEventListener("click", () => {
    modal.style.display = "block";
    overlay.style.display = "block";
  });

  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
    overlay.style.display = "none";
    recoveryInput.value = "";
  });

  recoveryBtn?.addEventListener("click", async () => {
    const email = recoveryInput.value.trim();

    if (!email) {
      alert("Digite um e-mail válido!");
      return;
    }

    try {
      recoveryBtn.disabled = true;
      recoveryBtn.textContent = "Enviando...";

      await sendPasswordResetEmail(auth, email);

      alert("E-mail de recuperação enviado!");
      modal.style.display = "none";
      overlay.style.display = "none";
      recoveryInput.value = "";

    } catch (error) {
      console.error(error);

      if (error.code === "auth/user-not-found") {
        alert("Este e-mail não está cadastrado.");
      } else if (error.code === "auth/invalid-email") {
        alert("Formato de e-mail inválido.");
      } else if (error.code === "auth/too-many-requests") {
        alert("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        alert("Erro ao enviar e-mail de recuperação.");
      }
    } finally {
      recoveryBtn.disabled = false;
      recoveryBtn.textContent = "Recuperar";
    }
  });
});
