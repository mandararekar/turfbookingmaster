// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBmg30thfZaorv-Ak0ynQ8zAkdF6UEAd_s",
    authDomain: "turfbookingsystem-221ff.firebaseapp.com",
    projectId: "turfbookingsystem-221ff",
    storageBucket: "turfbookingsystem-221ff.appspot.com",
    messagingSenderId: "1065656553446",
    appId: "1:1065656553446:web:c7f3e736f2c9395a559027",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 📌 Turf Owner Registration
document.getElementById("ownerRegisterForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("ownerName").value;
    const email = document.getElementById("ownerEmail").value;
    const contact = document.getElementById("ownerContact").value;
    const password = document.getElementById("ownerPassword").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save owner details in Firestore
        await setDoc(doc(db, "turf_owners", user.uid), {
            name,
            email,
            contact,
            uid: user.uid
        });

        alert("Registration Successful!");
        window.location.href = "turf_owner_login.html"; // Redirect to login
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// 📌 Turf Owner Login with Role Check
document.getElementById("ownerLoginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("ownerEmailLogin").value;
    const password = document.getElementById("ownerPasswordLogin").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 🔍 Check if the user exists in Firestore's "turf_owners" collection
        const ownerDoc = await getDoc(doc(db, "turf_owners", user.uid));

        if (ownerDoc.exists()) {
            alert("Login Successful! Redirecting...");
            window.location.href = "turf_owner_dashboard.html"; // Redirect to Dashboard
        } else {
            alert("Access Denied: You are not registered as a Turf Owner.");
            await signOut(auth); // Logout unauthorized user
        }
    } catch (error) {
        alert("Login Failed: " + error.message);
    }
});
