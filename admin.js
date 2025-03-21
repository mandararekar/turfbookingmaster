// ✅ Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔥 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBmg30thfZaorv-Ak0ynQ8zAkdF6UEAd_s",
    authDomain: "turfbookingsystem-221ff.firebaseapp.com",
    databaseURL: "https://turfbookingsystem-221ff-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "turfbookingsystem-221ff",
    storageBucket: "turfbookingsystem-221ff.appspot.com",
    messagingSenderId: "1065656553446",
    appId: "1:1065656553446:web:c7f3e736f2c9395a559027"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 📌 **Add or Update Turf**
document.getElementById("addTurfForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const turfId = document.getElementById("turfId").value; // Hidden field for updates
    const turfName = document.getElementById("turfName").value;
    const turfOwner = document.getElementById("turfOwner").value;
    const turfPrice = document.getElementById("turfPrice").value;
    const turfLocation = document.getElementById("turfLocation").value;
    const turfDescription = document.getElementById("turfDescription").value;
    const ownerContact = document.getElementById("ownerContact").value;
    const openingTime = document.getElementById("openingTime").value;
    const closingTime = document.getElementById("closingTime").value;

    if (!turfName || !turfOwner || !turfPrice || !turfLocation || !ownerContact || !openingTime || !closingTime) {
        alert("All fields are required!");
        return;
    }

    const turfRef = turfId ? ref(db, "turfs/" + turfId) : push(ref(db, "turfs"));

    const turfData = {
        id: turfRef.key,
        turfName,
        turfOwner,
        turfPrice,
        turfLocation,
        turfDescription,
        ownerContact,
        openingTime,
        closingTime
    };

    set(turfRef, turfData).then(() => {
        alert(turfId ? "Turf updated successfully!" : "Turf added successfully!");
        document.getElementById("addTurfForm").reset();
        fetchTurfs();
    }).catch(error => alert("Error: " + error.message));
});

// 📌 **Fetch & Display Turfs**
function fetchTurfs() {
    const turfList = document.getElementById("turfList");
    if (!turfList) return;

    onValue(ref(db, "turfs"), (snapshot) => {
        turfList.innerHTML = "";

        if (!snapshot.exists()) {
            turfList.innerHTML = `<tr><td colspan="8" class="text-center py-4">No Turfs Available</td></tr>`;
            return;
        }

        snapshot.forEach((childSnapshot) => {
            const turf = childSnapshot.val();

            const row = `
                <tr class="border-b">
                    <td class="px-4 py-2">${turf.turfName}</td>
                    <td class="px-4 py-2">${turf.turfOwner}</td>
                    <td class="px-4 py-2">₹${turf.turfPrice}</td>
                    <td class="px-4 py-2">${turf.turfLocation}</td>
                    <td class="px-4 py-2">${turf.openingTime} - ${turf.closingTime}</td>
                    <td class="px-4 py-2">${turf.ownerContact}</td>
                    <td class="px-4 py-2">
                        <button class="bg-blue-500 text-white px-2 py-1 rounded edit-btn" data-id="${turf.id}">Edit</button>
                        <button class="bg-red-500 text-white px-2 py-1 rounded delete-btn" data-id="${turf.id}">Delete</button>
                    </td>
                </tr>
            `;

            turfList.innerHTML += row;
        });

        attachEventListeners();
    });
}
fetchTurfs();

// 📌 **Attach Event Listeners for Edit & Delete**
function attachEventListeners() {
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            const turfId = this.dataset.id;
            if (confirm("Are you sure you want to delete this turf?")) {
                remove(ref(db, "turfs/" + turfId)).then(() => {
                    alert("Turf deleted successfully!");
                    fetchTurfs();
                }).catch(error => alert("Error deleting turf: " + error.message));
            }
        });
    });

    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            const turfId = this.dataset.id;
            onValue(ref(db, "turfs/" + turfId), (snapshot) => {
                if (snapshot.exists()) {
                    const turf = snapshot.val();
                    document.getElementById("turfId").value = turf.id;
                    document.getElementById("turfName").value = turf.turfName;
                    document.getElementById("turfOwner").value = turf.turfOwner;
                    document.getElementById("turfPrice").value = turf.turfPrice;
                    document.getElementById("turfLocation").value = turf.turfLocation;
                    document.getElementById("turfDescription").value = turf.turfDescription;
                    document.getElementById("ownerContact").value = turf.ownerContact;
                    document.getElementById("openingTime").value = turf.openingTime;
                    document.getElementById("closingTime").value = turf.closingTime;
                }
            }, { onlyOnce: true });
        });
    });
}

// 📌 **Fetch & Display All Bookings (Updated)**
// 📌 ✅ Fetch & Display All Bookings (Corrected for Actual Format)
function fetchBookings() {
    const bookingList = document.getElementById("bookingList");
    if (!bookingList) return;

    onValue(ref(db, "bookings"), (snapshot) => {
        bookingList.innerHTML = "";

        if (!snapshot.exists()) {
            bookingList.innerHTML = `<tr><td colspan="4" class="text-center py-4">No bookings available.</td></tr>`;
            return;
        }

        snapshot.forEach((bookingSnapshot) => {
            const booking = bookingSnapshot.val();

            const turfName = booking.turfName || "N/A";
            const userName = booking.userName || "N/A";
            const bookingTime = booking.bookingTime || "N/A";

            let formattedDate = "Invalid Date";
            let formattedTime = "Invalid Time";
            if (bookingTime !== "N/A") {
                const dateObj = new Date(bookingTime);
                formattedDate = dateObj.toLocaleDateString();
                formattedTime = dateObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            }

            const row = `
                <tr class="border-b">
                    <td class="px-4 py-2">${userName}</td>
                    <td class="px-4 py-2">${turfName}</td>
                    <td class="px-4 py-2">${formattedDate}</td>
                    <td class="px-4 py-2">${formattedTime}</td>
                </tr>
            `;
            bookingList.innerHTML += row;
        });
    });
}

fetchBookings();

// 📌 **Logout**
document.getElementById("logoutBtn").addEventListener("click", function () {
    alert("Logged out successfully!");
    window.location.href = "index.html";
});
