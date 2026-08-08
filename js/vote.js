const appLogos = {
    "Upick": "images/apps/upick.webp",
    "Mnet Plus": "images/apps/mnetplus.webp",
    "Mubeat": "images/apps/mubeat.png",
    "Kooky": "images/apps/kooky.png",
    "Idol Champ": "images/apps/idolchamp.png",
    "Coogoong": "images/apps/coogoong.jpg",
    "Higher": "images/apps/higher.png",
    "LiNC": "images/apps/linc.png",
    "Muniverse": "images/apps/muniverse.png",
    "BigC": "images/apps/bigc.jpg",
    "Podoal": "images/apps/podoal.png",
    "Fandora": "images/apps/fandora.png",
    "DuckAd": "images/apps/duckad.png"
};

function getAppLogo(appName) {

    if (!appName) return null;

    const cleanName =
        String(appName).trim().toLowerCase();

    const key =
        Object.keys(appLogos).find(
            name =>
                name.trim().toLowerCase() ===
                cleanName
        );

    return key
        ? appLogos[key]
        : null;
}


/* =========================
   DOMINANT COLOR
========================= */

function getDominantColor(imageSrc) {

    return new Promise((resolve) => {

        const img = new Image();

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

/* =========================
   RENDER VOTE
========================= */

async function renderVote(votes) {

    const container =
        document.querySelector(".vote-list");

    if (!container) {

        console.error(
            "vote-list tidak ditemukan"
        );

        return;
    }


    const cards =
        await Promise.all(

            votes.map(async vote => {

console.log(
    "APP:",
    JSON.stringify(vote.app),
    "LOGO:",
    getAppLogo(vote.app)
);

                const logo =
    getAppLogo(vote.app);

console.log("APP =", vote.app);
console.log("LOGO =", logo);
console.log("FULL PATH =", new URL(logo, document.baseURI).href);

                let color =
                    "rgb(245, 245, 245)";


                if (logo) {

                    try {

                        color =
                            await getDominantColor(
                                logo
                            );

                    } catch (error) {

                        console.error(
                            "Gagal mengambil warna logo:",
                            vote.app,
                            error
                        );

                    }

                }


                return `

                    <div
                        class="vote-card"
                        style="--app-color: ${color};"
                    >

                        <div class="vote-header">

                            <div class="vote-status">

                                <span
                                    class="status ${vote.status}"
                                >
                                    ${vote.status}
                                </span>

                                ${
                                    vote.countdown
                                    ? `
                                    <span class="countdown">
                                        ${vote.countdown}
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
                                    alt="${vote.app}"
                                >
                                `
                                : ""
                            }

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

                                <small>
                                    Period
                                </small>

                                <p>
                                    ${vote.startDate}
                                    -
                                    ${vote.endDate}
                                </p>

                            </div>


                            <a
                                href="${vote.link}"
                                class="vote-now"
                                target="_blank"
                            >
                                Vote now
                            </a>

                        </div>

                    </div>

                `;
            })
        );


    container.innerHTML =
        cards.join("");
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
                    option.textContent.trim() + " ";


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
        document.querySelector(".vote-list");

    if (!container) {
        console.error("vote-list tidak ditemukan");
        return;
    }

    // LOADING
    container.innerHTML = `
        <div class="vote-loading">
            <div class="loading-spinner"></div>
            <span>Loading votes...</span>
        </div>
    `;

    fetch(
        "https://script.google.com/macros/s/AKfycbwzj_Z803mGAjpNHEUAAq5NFlDyZEV4Rzm2sipYNVxO2xski0LreN1D_kms9Jx9UQ3ASQ/exec"
    )

    .then(res => res.json())

    .then(data => {

        console.log("VOTE DATA:", data);

        if (!data.votes) {

            console.error(
                "Vote data tidak ditemukan!",
                data
            );

            container.innerHTML = `
                <div class="vote-error">
                    No vote data found.
                </div>
            `;

            return;
        }

        renderVote(data.votes);

    })

    .catch(error => {

        console.error(
            "Gagal mengambil vote:",
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