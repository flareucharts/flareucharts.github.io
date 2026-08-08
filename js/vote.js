const appLogos = {
    "Upick": "images/apps/upick.webp",
    "Mnet Plus": "images/apps/mnetplus.webp",
    "Mubeat": "images/apps/mubeat.png",
    "Kooky": "images/apps/kooky.png",
    "Idol Champ": "images/apps/idol-champ.png",
    "Coogoong": "images/apps/coogoong.jpg",
    "Higher": "images/apps/higher.png",
    "LiNC": "images/apps/linc.png",
    "Muniverse": "images/apps/muniverse.png",
    "BigC": "images/apps/bigc.jpg",
    "Podoal": "images/apps/podoal.png",
    "Fandora": "images/apps/fandora.png",
    "DuckAd": "images/apps/duckad.png"
};

const voteData = [
{
    status: "ongoing",
    countdown: "1d 23:30:20",
    app: "Upick",
    title: "LINE MUSIC Daily Vote",
    period: "2026.08.04 - 2026.08.05",
    theme: "pink",
    link: "#"
}
];

function formatCountdown(diff) {

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, "0");

    if (days > 0) {
        return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    if (minutes > 0) {
        return `${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(seconds)}s`;
}

document.addEventListener("DOMContentLoaded", () => {
    renderVote();
});

function renderVote(){

    const container = document.querySelector(".vote-list");

    container.innerHTML = voteData.map(vote => `

        <div class="vote-card ${vote.theme}">

            <div class="vote-header">

    <div class="vote-status">

        <span class="status ${vote.status}">
            ${vote.status === "ongoing" ? "Ongoing" : "Ended"}
        </span>

        <span class="countdown">
            ${vote.countdown}
        </span>

    </div>

    <img
        src="${appLogos[vote.app]}"
        class="vote-logo"
        alt="${vote.app}"
    >

</div>

            <div class="vote-body">

                <div class="vote-app">
                    ${vote.app}
                </div>

                <h3>
                    ${vote.title}
                </h3>

            </div>

            <div class="vote-footer">

                <div>

                    <small>Period</small>

                    <p>${vote.period}</p>

                </div>

                <a href="${vote.link}" class="vote-now">
                    Vote now
                </a>

            </div>

        </div>

    `).join("");

}

const sortBtn = document.querySelector(".sort-btn");
const dropdown = document.querySelector(".sort-dropdown");
const sortOptions = document.querySelectorAll(".sort-option");

if (sortBtn && dropdown) {

    const sortBtnText = sortBtn.childNodes[0];

    sortBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        dropdown.classList.remove("active");
    });

    dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    sortOptions.forEach(option => {

        option.addEventListener("click", () => {

            sortOptions.forEach(item =>
                item.classList.remove("active")
            );

            option.classList.add("active");

            sortBtnText.textContent =
                option.textContent.trim() + " ";

            dropdown.classList.remove("active");

            // nanti sorting data di sini

        });

    });

}