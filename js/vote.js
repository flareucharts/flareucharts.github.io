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