const appLogos = {
    "Upick": "/images/apps/upick.webp",
    "Mnet Plus": "/images/apps/mnetplus.webp",
    "Mubeat": "/images/apps/mubeat.png",
    "Kooky": "/images/apps/kooky.png",
    "Idol Champ": "/images/apps/idolchamp.png",
    "Coogoong": "/images/apps/coogoong.jpg",
    "Higher": "/images/apps/higher.png",
    "LiNC": "/images/apps/linc.png",
    "Muniverse": "/images/apps/muniverse.png",
    "BigC": "/images/apps/bigc.jpg",
    "Podoal": "/images/apps/podoal.png",
    "Fandora": "/images/apps/fandora.png",
    "DuckAd": "/images/apps/duckad.png"
};

function getAppLogo(appName) {

    if (!appName) return null;

    const cleanName =
        String(appName).trim().toLowerCase();

    const key =
        Object.keys(appLogos).find(
            name =>
                name.trim().toLowerCase() === cleanName
        );

    return key
        ? "https://flareucharts.github.io" + appLogos[key]
        : null;
}


/* =========================
   DOMINANT COLOR
========================= */

function getDominantColor(imageSrc) {

    return new Promise((resolve) => {

        const img = new Image();

        img.crossOrigin = "Anonymous";

        img.onload = function () {

            const canvas =
                document.createElement("canvas");

            const ctx =
                canvas.getContext("2d");

            canvas.width = 50;
            canvas.height = 50;

            ctx.drawImage(
                img,
                0,
                0,
                50,
                50
            );

            const data =
                ctx.getImageData(
                    0,
                    0,
                    50,
                    50
                ).data;

            let r = 0;
            let g = 0;
            let b = 0;
            let count = 0;

            for (
                let i = 0;
                i < data.length;
                i += 4
            ) {

                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];
                const alpha = data[i + 3];

                if (alpha < 100) continue;

                if (
                    red > 235 &&
                    green > 235 &&
                    blue > 235
                ) continue;

                r += red;
                g += green;
                b += blue;

                count++;
            }

            if (!count) {
                resolve("rgb(245, 245, 245)");
                return;
            }

            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);

            resolve(
                `rgb(${r}, ${g}, ${b})`
            );
        };

        img.onerror = function () {
            resolve("rgb(245, 245, 245)");
        };

        img.src = imageSrc;
    });
}


let allVotes = [];
let currentStatus = "all";
let currentArtist = "all";


function formatVoteDate(dateValue) {

    if (!dateValue) return "";

    const parts =
        String(dateValue).trim().split(" ");

    if (parts.length < 2) {
        return String(dateValue);
    }

    const dateParts =
        parts[0].split("/");

    if (dateParts.length !== 3) {
        return String(dateValue);
    }

    const day =
        dateParts[0].padStart(2, "0");

    const month =
        dateParts[1].padStart(2, "0");

    const year =
        dateParts[2];

    const timeParts =
        parts[1].split(":");

    const hour =
        Number(timeParts[0]);

    const minute =
        timeParts[1] || "00";

    return `${year}.${month}.${day} ${hour}:${minute}`;
}

/* =========================
   RENDER VOTE
========================= */

function renderVote(votes) {

    const container =
        document.querySelector(".vote-list");

    if (!container) {

        console.error(
            "vote-list tidak ditemukan"
        );

        return;
    }

    const cards =
        votes.map(vote => {

            const logo =
                getAppLogo(vote.app);

            const startDate =
    formatVoteDate(vote.startDate);

const endDate =
    formatVoteDate(vote.endDate);

            return `

                <div
                    class="vote-card"
                    style="--app-color: rgb(245, 245, 245);"
                >

                    <div class="vote-header">

                        <div class="vote-status">

    <span
        class="status ${vote.status || ""}"
    >
        ${vote.status || ""}
    </span>

   ${
    ["ongoing", "upcoming"].includes(
        String(vote.status || "").toLowerCase()
    )
    ? `
        <span
            class="countdown"
            data-start="${vote.startTimestamp}"
            data-end="${vote.endTimestamp}"
        >
            00:00:00
        </span>
      `
    : ""
}

</div>

                        ${
                            logo
                            ? `
                                <img
                                    src="${logo}"
                                    class="vote-logo"
                                    alt="${vote.app || ""}"
                                >
                            `
                            : ""
                        }

                    </div>


                    <div class="vote-body">

                        <div class="vote-app">
                            ${vote.app || ""}
                        </div>

                        <h3>
                            ${vote.title || ""}
                        </h3>

                    </div>


                    <div class="vote-footer">

                        <div>

                            <small>
                                Period
                            </small>

                            <p>
    ${startDate}
    ~
    ${endDate}
    (KST)
</p>

                        </div>


                        <a
                            href="${vote.link || "#"}"
                            class="vote-now"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Vote now
                        </a>

                    </div>

                </div>

            `;
        });


    container.innerHTML =
        cards.join("");

updateCountdowns();


    /* =========================
       APPLY DOMINANT COLOR
    ========================= */

    votes.forEach((vote, index) => {

        const logo =
            getAppLogo(vote.app);

        if (!logo) return;

        const card =
            container.children[index];

        if (!card) return;

        getDominantColor(logo)
            .then(color => {

                card.style.setProperty(
                    "--app-color",
                    color
                );

            });

    });


    updateCountdowns();
}

/* =========================
   LIVE COUNTDOWN
========================= */

function updateCountdowns() {

    const countdowns =
        document.querySelectorAll(
            ".countdown"
        );

    const now =
        Date.now();

    countdowns.forEach(countdown => {

        const start =
            Number(
                countdown.dataset.start
            );

        const end =
            Number(
                countdown.dataset.end
            );

        const card =
            countdown.closest(".vote-card");

        if (!card) return;

        const statusElement =
            card.querySelector(".status");

        const status =
            statusElement
                ? statusElement.textContent
                    .trim()
                    .toLowerCase()
                : "";


        let target;
        let prefix;


        /* =========================
           ONGOING
        ========================= */

        if (status === "ongoing") {

            target = end;
            prefix = "Ends in ";

        }


        /* =========================
           UPCOMING
        ========================= */

        else if (status === "upcoming") {

            target = start;
            prefix = "Starts in ";

        }


        /* =========================
           ENDED
        ========================= */

        else {

            countdown.textContent = "";
            return;

        }


        if (!Number.isFinite(target)) {

            countdown.textContent = "";
            return;

        }


        const diff =
            target - now;


        if (diff <= 0) {

            countdown.textContent =
                "00:00:00";

            return;

        }


        const days =
            Math.floor(
                diff / 86400000
            );

        const hours =
            Math.floor(
                (diff % 86400000) /
                3600000
            );

        const minutes =
            Math.floor(
                (diff % 3600000) /
                60000
            );

        const seconds =
            Math.floor(
                (diff % 60000) /
                1000
            );


        countdown.textContent =
            prefix +
            `${days}d ` +
            `${String(hours).padStart(2, "0")}:` +
            `${String(minutes).padStart(2, "0")}:` +
            `${String(seconds).padStart(2, "0")}`;

    });
}

setInterval(
    updateCountdowns,
    1000
);


/* =========================
   FILTER
========================= */

function filterVotes() {

    let filtered =
        [...allVotes];


    /* STATUS */

    if (currentStatus !== "all") {

        filtered =
            filtered.filter(vote =>
                String(vote.status || "")
                    .trim()
                    .toLowerCase() ===
                currentStatus
            );

    }


    /* ARTIST */

    if (currentArtist !== "all") {

        filtered =
            filtered.filter(vote =>
                String(vote.artist || "")
                    .trim()
                    .toLowerCase() ===
                currentArtist
            );

    }


    renderVote(filtered);
}


/* =========================
   STATUS FILTER
========================= */

const statusFilters =
    document.querySelectorAll(
        ".status-filter"
    );

statusFilters.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            statusFilters.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            currentStatus =
                button.dataset.status;

            filterVotes();

        }
    );

});

/* =========================
   ARTIST FILTER
========================= */

const artistFilters =
    document.querySelectorAll(
        ".artist-pill"
    );

artistFilters.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            artistFilters.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            currentArtist =
                button.textContent
                    .trim()
                    .toLowerCase();

            filterVotes();

        }
    );

});




/* =========================
   SORT DROPDOWN
========================= */

const sortBtn =
    document.querySelector(".sort-btn");

const dropdown =
    document.querySelector(".sort-dropdown");

const sortOptions =
    document.querySelectorAll(".sort-option");


if (sortBtn && dropdown) {

    const sortBtnText =
        sortBtn.childNodes[0];


    sortBtn.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            dropdown.classList.toggle(
                "active"
            );

        }
    );


    document.addEventListener(
        "click",
        () => {

            dropdown.classList.remove(
                "active"
            );

        }
    );


    dropdown.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

        }
    );


    sortOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                sortOptions.forEach(item =>
                    item.classList.remove(
                        "active"
                    )
                );


                option.classList.add(
                    "active"
                );


                sortBtnText.textContent =
                    option.textContent.trim() +
                    " ";


                dropdown.classList.remove(
                    "active"
                );

            }
        );

    });

}


/* =========================
   LOAD VOTES
========================= */

function loadVotes() {

    const container =
        document.querySelector(
            ".vote-list"
        );

    if (!container) {

        console.error(
            "vote-list tidak ditemukan"
        );

        return;
    }


    /* LOADING */

    container.innerHTML = `
        <div class="vote-loading">

            <div class="loading-spinner"></div>

            <span>
                Loading votes...
            </span>

        </div>
    `;


    fetch(
        "https://script.google.com/macros/s/AKfycbwzj_Z803mGAjpNHEUAAq5NFlDyZEV4Rzm2sipYNVxO2xski0LreN1D_kms9Jx9UQ3ASQ/exec"
    )

    .then(res =>
        res.json()
    )

    .then(data => {

        console.log(
            "VOTE DATA:",
            data
        );


        if (!data.votes) {

            container.innerHTML = `
                <div class="vote-error">
                    No vote data found.
                </div>
            `;

            return;
        }


        allVotes =
            data.votes;


        console.log(
            "FIRST VOTE:",
            allVotes[0]
        );


        filterVotes();

    })

    .catch(error => {

        console.error(
            "Failed to load votes:",
            error
        );


        container.innerHTML = `
            <div class="vote-error">
                Failed to load votes.
            </div>
        `;

    });

}


/* =========================
   START
========================= */

loadVotes();