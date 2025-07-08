// auth.js

// Generate unique Cobraz address
function generateCobrazAddress() {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = 'CBZ-';
  for (let i = 0; i < 8; i++) {
    if (i > 0 && i % 4 === 0) result += '-';
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Handle Google Sign-In
async function handleGoogleSignIn() {
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    const userRef = db.collection("users").doc(user.uid);
    const docSnapshot = await userRef.get();

    if (!docSnapshot.exists) {
      await userRef.set({
        username: user.displayName || 'User',
        email: user.email,
        cobrazBalance: 100,
        cobrazAddress: generateCobrazAddress(),
        joinDate: new Date(),
        isAdmin: false
      });
    }

    window.location.href = '/dashboard.html';
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed: " + error.message);
  }
}

// Initialize auth state monitoring
function initAuthState() {
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log("Logged in as:", user.email);
    } else {
      console.log("Not logged in");
    }
  });
}

// Initialize events
document.addEventListener("DOMContentLoaded", () => {
  initAuthState();
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", handleGoogleSignIn);
  }
});
