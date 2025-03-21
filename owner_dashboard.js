// ✅ Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const db = getDatabase(app);

const bookingList = document.getElementById("bookingList");
const searchInput = document.getElementById("searchInput");

let bookings = []; // 🔁 Store all bookings globally here

// ✅ Fetch bookings from Firebase
function fetchBookings() {
  onValue(ref(db, "bookings"), (snapshot) => {
    bookings = []; // clear previous

    if (!snapshot.exists()) {
      renderBookings(); // will show "no bookings"
      return;
    }

    snapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val();

      const bookingTime = booking.bookingTime || null;
      let formattedDate = "Invalid Date";
      let formattedTime = "Invalid Time";

      if (bookingTime) {
        const dateObj = new Date(bookingTime);
        formattedDate = dateObj.toLocaleDateString();
        formattedTime = dateObj.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }

      bookings.push({
        userName: booking.userName || "N/A",
        turfName: booking.turfName || "N/A",
        date: formattedDate,
        time: formattedTime
      });
    });

    renderBookings(); // 🟢 Show all on load
  });
}

// ✅ Render filtered bookings
function renderBookings(searchQuery = "") {
  bookingList.innerHTML = "";

  const matching = [];
  const nonMatching = [];

  bookings.forEach(booking => {
    const isMatch = booking.turfName.toLowerCase().includes(searchQuery.toLowerCase());
    if (isMatch) matching.push(booking);
    else nonMatching.push(booking);
  });

  const finalList = [...matching, ...nonMatching];

  if (finalList.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4" class="text-center py-4 border border-black">No bookings found.</td>`;
    bookingList.appendChild(row);
    return;
  }

  finalList.forEach(booking => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border border-black px-4 py-2">${booking.userName}</td>
      <td class="border border-black px-4 py-2">${booking.turfName}</td>
      <td class="border border-black px-4 py-2">${booking.date}</td>
      <td class="border border-black px-4 py-2">${booking.time}</td>
    `;
    bookingList.appendChild(row);
  });
}

// 🔍 Search handler
searchInput.addEventListener("input", (e) => {
  renderBookings(e.target.value);
});

// 🟢 Start it all
fetchBookings();
