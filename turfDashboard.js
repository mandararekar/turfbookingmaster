// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase config
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

// Monitor auth state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Logged-in user detected, fetch user data
        const userRef = doc(db, "turf_owners", user.uid);
        try {
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                document.getElementById("ownerDetails").innerHTML = `
                    <p><strong>Name:</strong> ${userData.name}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                    <p><strong>Contact:</strong> ${userData.contact}</p>
                `;
            } else {
                console.log("No such user!");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }

        // Add Turf functionality
        document.getElementById("turfForm").addEventListener("submit", async (e) => {
            e.preventDefault();

            const turfName = document.getElementById("turfName").value;
            const turfPrice = document.getElementById("turfPrice").value;
            const turfLocation = document.getElementById("turfLocation").value;
            const turfOpeningTime = document.getElementById("turfOpeningTime").value;
            const turfClosingTime = document.getElementById("turfClosingTime").value;

            try {
                // Add Turf Data to Firestore
                await setDoc(doc(db, "turf_owners", user.uid, "turfs", turfName), {
                    name: turfName,
                    price: turfPrice,
                    location: turfLocation,
                    openingTime: turfOpeningTime,
                    closingTime: turfClosingTime,
                    available: true, // Turf availability flag
                });
                alert("Turf added successfully!");
                fetchAndDisplayTurfs(user.uid); // Refresh turfs after adding one
            } catch (error) {
                console.error("Error adding turf:", error);
            }
        });

        // Fetch and display owner's turfs
        fetchAndDisplayTurfs(user.uid);

        // Delegate click events for Edit, Delete, and Toggle buttons
        document.getElementById("turfItems").addEventListener("click", async (e) => {
            const button = e.target;
            const turfId = button.getAttribute("data-turf-id");

            if (!turfId) return; // Only proceed if the button has a turfId attribute

            if (button.classList.contains("edit-btn")) {
                const turfName = button.getAttribute("data-turf-name");
                const turfPrice = button.getAttribute("data-turf-price");
                const turfLocation = button.getAttribute("data-turf-location");
                const turfOpeningTime = button.getAttribute("data-turf-opening-time");
                const turfClosingTime = button.getAttribute("data-turf-closing-time");
                editTurf(turfId, turfName, turfPrice, turfLocation, turfOpeningTime, turfClosingTime);
            } else if (button.classList.contains("delete-btn")) {
                deleteTurf(turfId);
            } else if (button.classList.contains("toggle-btn")) {
                toggleAvailability(turfId);
            }
        });

    } else {
        // Redirect to login page if no user is logged in
        alert("Please log in.");
        window.location.href = "login.html";
    }
});

// Function to fetch and display turfs
async function fetchAndDisplayTurfs(ownerId) {
    const turfItemsContainer = document.getElementById("turfItems");
    turfItemsContainer.innerHTML = ''; // Clear the existing turfs

    const turfCollectionRef = collection(db, "turf_owners", ownerId, "turfs");
    try {
        const querySnapshot = await getDocs(turfCollectionRef);
        querySnapshot.forEach((doc) => {
            const turf = doc.data();
            turfItemsContainer.innerHTML += `
                <div class="turf-item bg-white p-4 rounded-lg shadow-md my-2" id="turf-${doc.id}">
                    <h3 class="text-xl font-semibold">${turf.name}</h3>
                    <p>Price: ${turf.price}</p>
                    <p>Location: ${turf.location}</p>
                    <p>Time: ${turf.openingTime} - ${turf.closingTime}</p>
                    <div class="mt-4 flex space-x-2">
                        <button data-turf-id="${doc.id}" data-turf-name="${turf.name}" data-turf-price="${turf.price}" data-turf-location="${turf.location}" data-turf-opening-time="${turf.openingTime}" data-turf-closing-time="${turf.closingTime}" class="edit-btn px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md">Edit</button>
                        <button data-turf-id="${doc.id}" class="delete-btn px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md">Delete</button>
                        <button data-turf-id="${doc.id}" class="toggle-btn px-4 py-2 text-white ${turf.available ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-500 hover:bg-gray-600'} rounded-md">
                            ${turf.available ? 'Close Turf' : 'Open Turf'}
                        </button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching turfs:", error);
    }
}

// Edit Turf
function editTurf(turfId, name, price, location, openingTime, closingTime) {
    // Populate form fields with the existing data
    document.getElementById("turfName").value = name;
    document.getElementById("turfPrice").value = price;
    document.getElementById("turfLocation").value = location;
    document.getElementById("turfOpeningTime").value = openingTime;
    document.getElementById("turfClosingTime").value = closingTime;

    // Change the form submission to update instead of add
    document.getElementById("turfForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const updatedTurfName = document.getElementById("turfName").value;
            const updatedTurfPrice = document.getElementById("turfPrice").value;
            const updatedTurfLocation = document.getElementById("turfLocation").value;
            const updatedTurfOpeningTime = document.getElementById("turfOpeningTime").value;
            const updatedTurfClosingTime = document.getElementById("turfClosingTime").value;

            await updateDoc(doc(db, "turf_owners", auth.currentUser.uid, "turfs", turfId), {
                name: updatedTurfName,
                price: updatedTurfPrice,
                location: updatedTurfLocation,
                openingTime: updatedTurfOpeningTime,
                closingTime: updatedTurfClosingTime,
            });

            alert("Turf updated successfully!");
            fetchAndDisplayTurfs(auth.currentUser.uid); // Refresh turfs after update
        } catch (error) {
            console.error("Error updating turf:", error);
        }
    }, { once: true });
}

// Delete Turf
async function deleteTurf(turfId) {
    try {
        await deleteDoc(doc(db, "turf_owners", auth.currentUser.uid, "turfs", turfId));
        alert("Turf deleted!");
        document.getElementById(`turf-${turfId}`).remove(); // Remove turf from DOM
    } catch (error) {
        console.error("Error deleting turf:", error);
    }
}

// Toggle Availability (Close/Open)
async function toggleAvailability(turfId) {
    const turfRef = doc(db, "turf_owners", auth.currentUser.uid, "turfs", turfId);
    try {
        const turfSnap = await getDoc(turfRef);
        const currentStatus = turfSnap.data().available;

        await updateDoc(turfRef, { available: !currentStatus });
        alert(`Turf ${currentStatus ? 'closed' : 'opened'} successfully!`);
        fetchAndDisplayTurfs(auth.currentUser.uid); // Refresh turfs after toggle
    } catch (error) {
        console.error("Error toggling availability:", error);
    }
}
