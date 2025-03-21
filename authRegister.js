import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Assume nameField is the input field for the user's name
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", () => {
    const name = nameField.value;
    const email = emailField.value;
    const password = passwordField.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // ✅ Update the user's display name
            return updateProfile(user, { displayName: name });
        })
        .then(() => {
            alert("Registration successful!");
            window.location.href = "user-login.html"; // Redirect after registration
        })
        .catch((error) => {
            console.error("Error registering user:", error);
        });
});
