// ✅ Import Firebase Modules (Works only inside `type="module"`)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, set, push, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ✅ Firebase Config
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
const auth = getAuth(app);
const rtdb = getDatabase(app);

// ✅ Fetch Available Turfs
window.fetchTurfs = function () {
    const turfList = document.getElementById("turfList");
    const turfRef = ref(rtdb, "turfs");

    onValue(turfRef, (snapshot) => {
        turfList.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const turf = childSnapshot.val();
            const turfId = childSnapshot.key;

            turfList.innerHTML += `
                <div class="glass-card p-6 text-black">
                    <h3 class="text-lg font-semibold">${turf.turfName}</h3>
                    <p>Location: ${turf.turfLocation}</p>
                    <p>Price: ₹${turf.turfPrice}</p>
                    <label for="bookingTime-${turfId}" class="block mt-2">Select Time:</label>
                    <input type="datetime-local" id="bookingTime-${turfId}" class="border rounded w-full p-1">
                    <button onclick="bookTurf('${turfId}')" class="modern-btn text-white mt-3">Book Now</button>
                </div>
            `;
        });
    });
};

// ✅ Fetch User Bookings
window.fetchUserBookings = function (userId) {
    const myBookings = document.getElementById("myBookings");
    const bookingsRef = ref(rtdb, `bookings`);

    onValue(bookingsRef, (snapshot) => {
        myBookings.innerHTML = "";
        let foundBookings = false;

        snapshot.forEach((childSnapshot) => {
            const booking = childSnapshot.val();
            if (booking.userId === userId) { // ✅ Filter bookings for the logged-in user
                foundBookings = true;
                myBookings.innerHTML += `
                    <div class="glass-card p-4 text-black">
                        <h3 class="text-lg font-semibold">${booking.turfName}</h3>
                        <p>Booking Time: ${new Date(booking.bookingTime).toLocaleString()}</p>
                    </div>
                `;
            }
        });

        if (!foundBookings) {
            myBookings.innerHTML = `<p class="text-center text-gray-500">No bookings found.</p>`;
        }
    });
};

// ✅ Fetch and Show User Name from Firebase Auth
function showUserInfo(user) {
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");

    if (user.displayName) {
        userNameElement.textContent = user.displayName;
    } else {
        userNameElement.textContent = "User";
    }
    userEmailElement.textContent = user.email;
}

// ✅ Book Turf (Now Saves User's Correct Name)
window.bookTurf = async function (turfId) {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to book a turf.");
        return;
    }

    const bookingTime = document.getElementById(`bookingTime-${turfId}`).value;
    if (!bookingTime) {
        alert("Please select a time.");
        return;
    }

    const turfRef = ref(rtdb, `turfs/${turfId}`);
    const bookingsRef = ref(rtdb, "bookings");

    try {
        // ✅ Fetch Turf Data
        const turfSnapshot = await get(turfRef);
        if (!turfSnapshot.exists()) {
            alert("Turf not found!");
            return;
        }
        const turfData = turfSnapshot.val();

        // ✅ Check if the slot is already booked
        const bookingsSnapshot = await get(bookingsRef);
        let isAlreadyBooked = false;

        bookingsSnapshot.forEach((childSnapshot) => {
            const booking = childSnapshot.val();
            if (booking.turfId === turfId && booking.bookingTime === bookingTime) {
                isAlreadyBooked = true;
            }
        });

        if (isAlreadyBooked) {
            alert("This slot is already booked! Please select another time.");
            return;
        }

        // ✅ Get User's Name
        let userName = user.displayName;
        if (!userName) {
            userName = prompt("Enter your name for booking:");
            if (!userName) {
                alert("Booking canceled! Name is required.");
                return;
            }
            // ✅ Update Firebase Authentication with User's Name
            await updateProfile(user, { displayName: userName });
        }

        // ✅ Generate Unique Booking ID using `push()`
        const newBookingRef = push(bookingsRef);
        await set(newBookingRef, {
            userId: user.uid,
            userName: userName, // ✅ Stores Correct User Name
            turfId: turfId,
            turfName: turfData.turfName,
            bookingTime: bookingTime
        });

        alert("Turf booked successfully!");
        fetchUserBookings(user.uid); // ✅ Refresh User Bookings After Booking
    } catch (error) {
        console.error("❌ Booking failed:", error);
        alert("An error occurred while booking the turf.");
    }
};

// ✅ Logout Function
window.logout = function () {
    auth.signOut().then(() => {
        alert("Logged out successfully!");
        window.location.href = "login.html";
    });
};

// ✅ Load Data After Login
onAuthStateChanged(auth, (user) => {
    if (user) {
        showUserInfo(user); // ✅ Show User Info on Dashboard
        fetchTurfs();
        fetchUserBookings(user.uid);
    } else {
        alert("User not logged in!");
        window.location.href = "login.html";
    }
});
