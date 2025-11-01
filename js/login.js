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
