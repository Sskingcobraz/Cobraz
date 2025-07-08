import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQ3HiYLafcgfKDrVXzeP5tVGd3ephui5M",
  authDomain: "cobraz69.firebaseapp.com",
  projectId: "cobraz69",
  storageBucket: "cobraz69.firebasestorage.app",
  messagingSenderId: "966165847096",
  appId: "1:966165847096:web:7a131aae701d3a752b1acd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
