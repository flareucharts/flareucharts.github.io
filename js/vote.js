import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import { db } from "./firebase.js";

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

window.getAppLogo = getAppLogo;

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
let currentStatus = "ongoing";
let currentArtist = "all";
let currentSort = "ending";


function formatVoteDate(dateValue) {

    if (!dateValue) return "";


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {
        return String(dateValue);
    }


    /* =========================
       KST (UTC+9)
    ========================= */

    const parts =
        new Intl.DateTimeFormat(
            "en-GB",
            {
                timeZone: "Asia/Seoul",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }
        ).formatToParts(date);


    const get =
        type =>
            parts.find(
                p => p.type === type
            )?.value || "";


    const year = get("year");
    const month = get("month");
    const day = get("day");
    const hour = Number(get("hour"));
    const minute = get("minute");


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
            filtered.filter(vote => {

                const artist =
                    String(vote.artist || "")
                        .trim()
                        .toLowerCase();

                return artist === currentArtist;

            });

    }


    /* SORT */

    if (currentSort === "ending") {

        filtered.sort((a, b) =>
            Number(a.endTimestamp || 0) -
            Number(b.endTimestamp || 0)
        );

    }

    else if (currentSort === "newest") {

        filtered.sort((a, b) =>
            Number(b.startTimestamp || 0) -
            Number(a.startTimestamp || 0)
        );

    }

    else if (currentSort === "oldest") {

        filtered.sort((a, b) =>
            Number(a.startTimestamp || 0) -
            Number(b.startTimestamp || 0)
        );

    }

    else if (currentSort === "az") {

        filtered.sort((a, b) =>
            String(a.title || "")
                .localeCompare(
                    String(b.title || "")
                )
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

/* =========================
   ARTIST DROPDOWN
========================= */

const artistBtn =
    document.querySelector(".artist-btn");

const artistDropdown =
    document.querySelector(".artist-dropdown");

const artistOptions =
    document.querySelectorAll(".artist-option");


if (artistBtn && artistDropdown) {

    artistBtn.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            /* tutup sort */
            if (dropdown) {
                dropdown.classList.remove("active");
            }

            /* buka/tutup artist */
            artistDropdown.classList.toggle("active");

        }
    );


    /* klik pilihan artist */

    artistOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                artistOptions.forEach(item =>
                    item.classList.remove("active")
                );

                option.classList.add("active");


                /* ambil data artist */

                currentArtist =
                    option.dataset.artist
                        .trim()
                        .toLowerCase();


                /* ubah tulisan button */

                artistBtn.childNodes[0].textContent =
                    option.textContent.trim() + " ";


                /* tutup dropdown */

                artistDropdown.classList.remove(
                    "active"
                );


                /* render ulang */

                filterVotes();

            }
        );

    });


    /* klik luar dropdown */

    document.addEventListener(
        "click",
        () => {

            artistDropdown.classList.remove(
                "active"
            );

        }
    );

}



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

        /* tutup artist */
        if (artistDropdown) {
            artistDropdown.classList.remove("active");
        }

        /* buka/tutup sort */
        dropdown.classList.toggle("active");

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
                    item.classList.remove("active")
                );

                option.classList.add("active");


                const text =
                    option.textContent.trim();


                sortBtnText.textContent =
                    text + " ";


                /* TENTUKAN SORT */

                if (text === "Ending Soon") {

                    currentSort = "ending";

                }

                else if (text === "Newest") {

                    currentSort = "newest";

                }

                else if (text === "Oldest") {

                    currentSort = "oldest";

                }

                else if (text === "A–Z") {

                    currentSort = "az";

                }


                dropdown.classList.remove(
                    "active"
                );


                filterVotes();

            }
        );

    });

}

/* =========================
   LOAD VOTES FROM FIREBASE
========================= */

async function loadVotes() {

    const container =
        document.querySelector(".vote-list");


    /* =========================
       LOADING
    ========================= */

    if (container) {

        container.innerHTML = `
            <div class="vote-loading">

                <div class="loading-spinner"></div>

                <span>
                    Loading votes...
                </span>

            </div>
        `;

    }


    try {

        const votesRef =
            ref(db, "votes");

        const snapshot =
            await get(votesRef);


        if (!snapshot.exists()) {

            console.warn(
                "No vote data found in Firebase."
            );

            if (container) {

                container.innerHTML = `
                    <div class="vote-error">
                        No vote data found.
                    </div>
                `;

            }

            return;
        }


        const firebaseData =
            snapshot.val();


        /* =========================
           CONVERT FIREBASE DATA
        ========================= */

        const votes =
            Object.entries(firebaseData)
                .map(([id, vote]) => {

                    const startTimestamp =
                        new Date(
                            vote.startDate
                        ).getTime();

                    const endTimestamp =
                        new Date(
                            vote.endDate
                        ).getTime();


                    const now =
                        Date.now();


                    let status;


                    if (now < startTimestamp) {

                        status = "upcoming";

                    }

                    else if (now <= endTimestamp) {

                        status = "ongoing";

                    }

                    else {

                        status = "ended";

                    }


                    return {

                        id,

                        artist:
                            vote.artist || "",

                        app:
                            vote.app || "",

                        title:
                            vote.voteTitle || "",

                        startDate:
                            vote.startDate || "",

                        endDate:
                            vote.endDate || "",

                        startTimestamp,

                        endTimestamp,

                        link:
                            vote.link || "",

                        status

                    };

                });


        console.log(
            "FIREBASE VOTE DATA:",
            votes
        );


        /* =========================
           SAVE DATA
        ========================= */

        allVotes = votes;

        window.allVotes = votes;


        /* =========================
           SEND DATA TO HOME
        ========================= */

        document.dispatchEvent(
            new CustomEvent(
                "votesLoaded",
                {
                    detail: votes
                }
            )
        );


        /* =========================
           RENDER VOTE PAGE
        ========================= */

        if (container) {

            filterVotes();

        }


    } catch (error) {

        console.error(
            "Failed to load votes from Firebase:",
            error
        );


        if (container) {

            container.innerHTML = `
                <div class="vote-error">
                    Failed to load votes.
                </div>
            `;

        }

    }

}


/* =========================
   START
========================= */

loadVotes();