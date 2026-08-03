// =========================
// Artist Filter
// =========================

const artistPills = document.querySelectorAll(".artist-pill");
const voteCards = document.querySelectorAll(".vote-card");

artistPills.forEach(pill => {

    pill.addEventListener("click", () => {

        // Active
        artistPills.forEach(btn => btn.classList.remove("active"));
        pill.classList.add("active");

        const selectedArtist = pill.dataset.artist;

        voteCards.forEach(card => {

            if (
                selectedArtist === "all" ||
                card.dataset.artist === selectedArtist
            ) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }

        });

    });

});

// =========================
// SORT DROPDOWN
// =========================

const sortBtn = document.querySelector(".sort-btn");
const sortDropdown = document.querySelector(".sort-dropdown");
const sortOptions = document.querySelectorAll(".sort-option");

// Open / Close
sortBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    sortDropdown.classList.toggle("show");
    sortBtn.classList.toggle("open");
});

// Close ketika klik di luar
document.addEventListener("click", () => {
    sortDropdown.classList.remove("show");
    sortBtn.classList.remove("open");
});

// Jangan tutup saat klik di dalam dropdown
sortDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
});

// Active option
sortOptions.forEach(option => {

    option.addEventListener("click", () => {

        sortOptions.forEach(item =>
            item.classList.remove("active")
        );

        option.classList.add("active");

        // Ganti teks tombol
        sortBtn.innerHTML = `
            ${option.textContent}
            <span>⌄</span>
        `;

        // Tutup dropdown
        sortDropdown.classList.remove("show");
        sortBtn.classList.remove("open");

        // Nanti di sini isi fungsi sorting
        // sortVote(option.textContent);

    });

});