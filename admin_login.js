// 🔹 Firebase Imports (MUST be at the top)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmg30thfZaorv-Ak0ynQ8zAkdF6UEAd_s",
    authDomain: "turfbookingsystem-221ff.firebaseapp.com",
    databaseURL: "https://turfbookingsystem-221ff-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "turfbookingsystem-221ff",
    storageBucket: "turfbookingsystem-221ff.appspot.com",
    messagingSenderId: "1065656553446",
    appId: "1:1065656553446:web:c7f3e736f2c9395a559027",
    measurementId: "G-QLE84ZLL0F"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Ensure DOM is fully loaded before running script
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("adminLoginForm");
    
    if (!loginForm) {
        console.error("❌ Form element with ID 'adminLoginForm' not found!");
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // 🚀 Prevent form from reloading the page

        const username = document.getElementById("adminUsername").value.trim();
        const password = document.getElementById("adminPassword").value.trim();

        try {
            // ✅ Fetch stored admin credentials from Firestore
            const adminRef = doc(db, "admin", "admin");
            const adminSnap = await getDoc(adminRef);

            if (adminSnap.exists()) {
                const adminData = adminSnap.data();
                if (username === adminData.username && password === adminData.password) {
                    console.log("✅ Admin login successful! Redirecting...");
                    
                    // ✅ Ensure the browser redirects correctly
                    setTimeout(() => {
                        window.location.href = "admin.html";  // Redirect to admin page
                    }, 500); // Short delay to ensure smooth transition
                } else {
                    console.error("❌ Invalid Credentials!");
                    showErrorMessage();
                }
            } else {
                console.error("❌ Admin data not found in Firestore!");
                showErrorMessage();
            }
        } catch (error) {
            console.error("❌ Firebase Error:", error);
            showErrorMessage();
        }
    });

    function showErrorMessage() {
        const errorMsg = document.getElementById("errorMsg");
        if (errorMsg) {
            errorMsg.classList.remove("hidden");
        }
    }
});
