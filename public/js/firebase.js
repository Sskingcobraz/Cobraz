// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQ3HiYLafcgfKDrVXzeP5tVGd3ephui5M",
    authDomain: "cobraz69.firebaseapp.com",
    projectId: "cobraz69",
    storageBucket: "cobraz69.firebasestorage.app",
    messagingSenderId: "966165847096",
    appId: "1:966165847096:web:7a131aae701d3a752b1acd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Firestore settings
db.settings({
  merge: true
});