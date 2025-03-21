// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBmg30thfZaorv-Ak0ynQ8zAkdF6UEAd_s",
  authDomain: "turfbookingsystem-221ff.firebaseapp.com",
  projectId: "turfbookingsystem-221ff",
  storageBucket: "turfbookingsystem-221ff.appspot.com",
  messagingSenderId: "1065656553446",
  appId: "1:1065656553446:web:c7f3e736f2c9395a559027"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Login Handler
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  const snapshot = await getDocs(collection(db, "turf_owners"));
  let isValid = false;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.email === email && data.password === password) {
      isValid = true;
    }
  });

  if (isValid) {
    window.location.href = "owner_dashboard.html";
  } else {
    errorMsg.classList.remove("hidden");
  }
});
