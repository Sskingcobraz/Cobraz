import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Handle Google Sign-In
const handleGoogleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if user exists in Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // Create new user document
            await db.collection('users').doc(user.uid).set({
                username: user.displayName || 'User',
                email: user.email,
                cobrazBalance: 0,
                cobrazAddress: generateCobrazAddress(),
                joinDate: new Date(),
                isAdmin: false
            });
        }
        
        // Redirect to dashboard
        window.location.href = '/dashboard.html';
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        alert('Sign in failed: ' + error.message);
    }
};

// Generate Cobraz address
const generateCobrazAddress = () => {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = 'CBZ-';
    for (let i = 0; i < 8; i++) {
        if (i > 0 && i % 4 === 0) result += '-';
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Initialize auth state listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
            window.location.href = '/dashboard.html';
        }
    }
});

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    const googleSignInBtn = document.getElementById('googleSignIn');
    const googleSignInHeroBtn = document.getElementById('googleSignInHero');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (googleSignInBtn) googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    if (googleSignInHeroBtn) googleSignInHeroBtn.addEventListener('click', handleGoogleSignIn);
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
});
