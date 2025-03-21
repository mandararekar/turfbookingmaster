// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmg30thfZaorv-Ak0ynQ8zAkdF6UEAd_s",
    authDomain: "turfbookingsystem-221ff.firebaseapp.com",
    projectId: "turfbookingsystem-221ff",
    storageBucket: "turfbookingsystem-221ff.appspot.com",
    messagingSenderId: "1065656553446",
    appId: "1:1065656553446:web:c7f3e736f2c9395a559027",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Handle User Login
document.getElementById("userLoginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form default submission

    console.log("Login form submitted!"); // Debugging log

    const email = document.getElementById("userEmailLogin").value;
    const password = document.getElementById("userPasswordLogin").value;
    
    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user.uid); // Debugging log

        // ✅ Check if user exists in Firestore (users collection)
        const userRef = doc(db, "users", userCredential.user.uid); // Check users collection
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // User exists in Firestore
            const userData = userSnap.data();
            console.log("User found in Firestore:", userData); // Debugging log
            
            // ✅ User exists, redirect to the dashboard
            document.getElementById("userLoginMessage").classList.remove("hidden");
            setTimeout(() => {
                window.location.href = "user_dashboard.html"; // Redirect after 2s
            }, 2000);
        } else {
            // User not found in Firestore
            alert("User not found in the database.");
        }
    } catch (error) {
        console.error("Login error:", error.message);
        alert("Invalid email or password. Please try again.");
    }
});
