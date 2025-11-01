// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

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


export { auth };

