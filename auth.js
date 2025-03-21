// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Your Firebase Configuration
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
const db = getFirestore(app);

// Register User Function
window.registerUser = async function() {
    const name = document.getElementById("name").value;
    const contact = document.getElementById("contact").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !contact || !email || !password) {
        alert("Please fill all fields!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            contact: contact,
            email: email,
            uid: user.uid
        });

        alert("Registration Successful!");
        window.location.href = "login.html"; // Redirect to Login
    } catch (error) {
        alert(error.message);
    }
};
