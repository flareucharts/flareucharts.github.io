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

renderVote();

function renderVote() {

    const container = document.querySelector(".vote-list");

    container.innerHTML = voteData.map(vote => `

        <div class="vote-card ${vote.theme}">

            <div class="vote-header">

                <div class="vote-status">

                    <span class="status ${vote.status}">
                        Ongoing
                    </span>

                    <span class="countdown">
                        ${vote.countdown}
                    </span>

                </div>

                <img
                    src="images/apps/upick.webp"
                    class="vote-logo"
                    alt="Upick"
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