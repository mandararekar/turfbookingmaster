// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBmg30thfZaorv-Ak0ynQ8zAkdF6UEAd_s",
    authDomain: "turfbookingsystem-221ff.firebaseapp.com",
    projectId: "turfbookingsystem-221ff",
    storageBucket: "turfbookingsystem-221ff.firebasestorage.app",
    messagingSenderId: "1065656553446",
    appId: "1:1065656553446:web:c7f3e736f2c9395a559027",
    measurementId: "G-QLE84ZLL0F"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to Register User
window.registerUser = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Registration Successful!");
            window.location.href = "login.html"; 
        })
        .catch((error) => {
            alert(error.message);
        });
};

// Function to Login User
window.loginUser = function () {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login Successful!");
            window.location.href = "dashboard.html"; 
        })
        .catch((error) => {
            alert(error.message);
        });
};

// Function to Logout User
window.logoutUser = function () {
    signOut(auth)
        .then(() => {
            alert("Logged Out Successfully!");
            window.location.href = "index.html"; 
        })
        .catch((error) => {
            alert(error.message);
        });
};
