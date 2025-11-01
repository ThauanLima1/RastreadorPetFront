// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBHpzRuJlMyQ-U4zHJxg5XU4Jb8sn3ScY",
  authDomain: "rastreadorpet-1f595.firebaseapp.com",
  projectId: "rastreadorpet-1f595",
  storageBucket: "rastreadorpet-1f595.appspot.com",
  messagingSenderId: "801484788651",
  appId: "1:801484788651:web:ea7a23b01f33bdf181b8ee",
  measurementId: "G-B6MHYV7TX4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function googleAuth() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const usuario = result.user;
      console.log("Usuário logado:", usuario.displayName);
      alert("Bem-vindo, " + usuario.displayName);
      window.location.href = "./homePage.html";
    })
    .catch((error) => {
      console.error("Erro no login:", error);
      alert("Erro ao logar com Google");
    });
}
document.querySelector(".google-btn").addEventListener("click", googleAuth);
