import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "./FirebaseConfig.js";

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


//modal
const openBtn = document.getElementById("recuperarSenha");
const modal = document.getElementById("modalRecovery");
const overlay = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("closeModal");

openBtn.addEventListener("click", () => {
  modal.style.display = "block";
  overlay.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  overlay.style.display = "none";
});

//Funnção olho senha
const olho = document.getElementById('eye');
const senha = document.getElementById('password');

olho.addEventListener("click",  () => {
    const isPassword = senha.getAttribute("type") === "password";
    const type = senha.getAttribute("type") === "password" ? "text" : "password";
    senha.setAttribute("type", type);
    olho.style.color = isPassword ? '#4285f4' : '#3c4043';
});