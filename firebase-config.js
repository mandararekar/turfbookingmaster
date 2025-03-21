// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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


// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);  // ✅ Ensure this is exported

// ✅ Export correctly
export { auth, db };
