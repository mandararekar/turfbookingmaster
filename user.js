document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.querySelector(".menu");
    const navLinks = document.querySelector(".nav-links");

    // ✅ Only add event listener if menu button exists
    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("hidden");
        });
    }

    // ✅ Enhance button click UX (Optional)
    const buttons = document.querySelectorAll(".btn-blue");
    buttons.forEach(btn => {
        btn.addEventListener("mousedown", () => {
            btn.style.transform = "scale(0.95)";
        });
        btn.addEventListener("mouseup", () => {
            btn.style.transform = "scale(1)";
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "scale(1)";
        });
    });
});
