import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "../config/FirebaseConfig.js";

const provider = new GoogleAuthProvider();

const loginWithGoogle = async () => { //<- Função assincrona
    try{
        const result = await signInWithPopup(auth, provider); // <- result é igual objeto que tem um usúario conectado.
        const user = result.user;
        console.log("Usúario logado:" + user);
        window.location.href = "../pages/map.html";
    }catch(error){
        console.error("Deu ruim:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const googleBtn = document.querySelector(".google-btn");
    if (googleBtn) {
        googleBtn.addEventListener("click", loginWithGoogle);
    }
});

export { loginWithGoogle };