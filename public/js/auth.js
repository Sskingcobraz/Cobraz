document.addEventListener('DOMContentLoaded', () => {
  // Auth state observer
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        window.location.href = '/dashboard.html';
      }
    } else {
      // User is signed out
      if (!['/index.html', '/'].includes(window.location.pathname)) {
        window.location.href = '/index.html';
      }
    }
  });

  // Modal elements
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const authModal = document.getElementById('authModal');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const getStartedBtn = document.getElementById('getStartedBtn');
  const closeButtons = document.querySelectorAll('.close');
  const authFormContainer = document.getElementById('authFormContainer');
  const logoutBtn = document.getElementById('logoutBtn');

  // Show modals
  if (loginBtn) loginBtn.addEventListener('click', () => showLoginForm());
  if (signupBtn) signupBtn.addEventListener('click', () => showSignupForm());
  if (getStartedBtn) getStartedBtn.addEventListener('click', () => showSignupForm());

  // Close modals
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (loginModal) loginModal.style.display = 'none';
      if (signupModal) signupModal.style.display = 'none';
      if (authModal) authModal.style.display = 'none';
    });
  });

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === loginModal) loginModal.style.display = 'none';
    if (event.target === signupModal) signupModal.style.display = 'none';
    if (event.target === authModal) authModal.style.display = 'none';
  });

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut().then(() => {
        window.location.href = '/index.html';
      });
    });
  }

  // Show login form
  function showLoginForm() {
    authFormContainer.innerHTML = `
      <h2>Login</h2>
      <form id="loginForm">
        <input type="email" id="loginEmail" placeholder="Email" required>
        <input type="password" id="loginPassword" placeholder="Password" required>
        <button type="submit" class="glow-btn">Login</button>
      </form>
      <p style="margin-top: 1rem;">Don't have an account? <a href="#" id="switchToSignup">Sign up</a></p>
    `;
    
    document.getElementById('switchToSignup').addEventListener('click', (e) => {
      e.preventDefault();
      showSignupForm();
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          if (authModal) authModal.style.display = 'none';
        })
        .catch(error => {
          alert(error.message);
        });
    });

    if (authModal) authModal.style.display = 'block';
  }

  // Show signup form
  function showSignupForm() {
    authFormContainer.innerHTML = `
      <h2>Create Account</h2>
      <form id="signupForm">
        <input type="text" id="signupUsername" placeholder="Username" required>
        <input type="email" id="signupEmail" placeholder="Email" required>
        <input type="password" id="signupPassword" placeholder="Password" required>
        <button type="submit" class="glow-btn">Create Account</button>
      </form>
      <p style="margin-top: 1rem;">Already have an account? <a href="#" id="switchToLogin">Login</a></p>
    `;
    
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
      e.preventDefault();
      showLoginForm();
    });

    document.getElementById('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('signupUsername').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          
          // Create user document
          return db.collection('users').doc(user.uid).set({
            username: username,
            email: email,
            cobrazBalance: 0,
            cobrazAddress: generateCobrazAddress(),
            joinDate: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            isAdmin: false
          });
        })
        .then(() => {
          if (authModal) authModal.style.display = 'none';
        })
        .catch(error => {
          alert(error.message);
        });
    });

    if (authModal) authModal.style.display = 'block';
  }

  // Generate Cobraz address
  function generateCobrazAddress() {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = 'CBZ-';
    for (let i = 0; i < 8; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
});
