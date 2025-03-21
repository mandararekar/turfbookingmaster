// Import Firebase SDK (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBmg30thfZaorv-Ak0ynQ8zAkdF6UEAd_s",
  authDomain: "turfbookingsystem-221ff.firebaseapp.com",
  databaseURL: "https://turfbookingsystem-221ff-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "turfbookingsystem-221ff",
  storageBucket: "turfbookingsystem-221ff.appspot.com",
  messagingSenderId: "1065656553446",
  appId: "1:1065656553446:web:c7f3e736f2c9395a559027"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form submit listener
document.addEventListener("DOMContentLoaded", () => {
  const userContactForm = document.getElementById("userContactForm");

  userContactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = document.getElementById("userName").value;
    const userEmail = document.getElementById("userEmail").value;
    const userMessage = document.getElementById("userMessage").value;

    try {
      await addDoc(collection(db, "userContacts"), {
        name: userName,
        email: userEmail,
        message: userMessage,
        timestamp: serverTimestamp()
      });

      alert("Message sent successfully!");
      userContactForm.reset();
    } catch (error) {
      console.error("Error saving message: ", error);
      alert("An error occurred. Please try again.");
    }
  });
});
