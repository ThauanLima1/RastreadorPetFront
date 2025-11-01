
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "./FirebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector(".registerForm");
    
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const user = document.getElementById("user").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("ConfirmPassword").value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;

                await updateProfile(firebaseUser, { displayName: user });
                
                console.error("Deu bom:", firebaseUser);
                window.location.href = "./homePage.html";
            } catch (error) {
                console.error("Deu ruim:", error);
            }
        });
    }
});