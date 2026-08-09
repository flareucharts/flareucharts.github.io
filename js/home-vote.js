/* =========================
   HOME — ONGOING VOTE
========================= */

function renderOngoingVote(votes) {

    const track =
        document.querySelector(".onvote-track");

    const loading =
        document.querySelector(".onvote-loading");

    if (!track) return;


    /* =========================
       FILTER ONGOING
    ========================= */

    const ongoingVotes =
        (votes || []).filter(vote =>
            String(vote.status || "")
                .trim()
                .toLowerCase() === "ongoing"
        );


    /* =========================
       REMOVE LOADING
    ========================= */

    if (loading) {
        loading.remove();
    }


    /* =========================
       NO ONGOING VOTE
    ========================= */

    if (!ongoingVotes.length) {

        track.innerHTML = `
            <div class="onvote-slider">

                <div class="onvote-title">
                    No ongoing vote
                </div>

            </div>
        `;

        return;
    }


    /* =========================
       RENDER CARDS
    ========================= */

    track.innerHTML =
        ongoingVotes.map((vote, index) => {

            const logo =
                getAppLogo(vote.app);

            return `
                <div
                    class="onvote-slider"
                    data-index="${index}"
                >

                    <!-- TOP -->
                    <div class="onvote-top">

                        <span
                            class="onvote-ending"
                            data-end="${vote.endTimestamp}"
                        >
                            Ends in 00:00:00
                        </span>

                        <span class="onvote-count">
                            ${index + 1}/${ongoingVotes.length}
                        </span>

                    </div>


                    <!-- TITLE -->
                    <div class="onvote-title">
                        ${vote.title || ""}
                    </div>


                    <!-- BOTTOM -->
                    <div class="onvote-bottom">

                        ${
                            logo
                            ? `
                                <img
                                    src="${logo}"
                                    class="onvote-logo"
                                    alt="${vote.app || ""}"
                                >
                            `
                            : ""
                        }

                        <a
                            href="${vote.link || "#"}"
                            class="onvote-now"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Vote now
                        </a>

                    </div>

                </div>
            `;

        }).join("");


    /* =========================
       INITIAL COUNTDOWN
    ========================= */

    updateHomeVoteCountdowns();


    /* =========================
       APP CARD COLOR
    ========================= */

    ongoingVotes.forEach((vote, index) => {

        const logo =
            getAppLogo(vote.app);

        if (!logo) return;


        const card =
            track.querySelector(
                `.onvote-slider[data-index="${index}"]`
            );

        if (!card) return;


        getDominantColor(logo)
            .then(color => {

                card.style.setProperty(
                    "--app-color",
                    color
                );

            });

    });


    /* =========================
       AUTO SLIDE
    ========================= */

    if (ongoingVotes.length > 1) {

        const firstSlide =
            track.children[0].cloneNode(true);

        track.appendChild(firstSlide);


        let currentSlide = 0;


        setInterval(() => {

            currentSlide++;


            track.scrollTo({

                left:
                    track.clientWidth *
                    currentSlide,

                behavior: "smooth"

            });


            /* =========================
               LOOP BACK
            ========================= */

            if (
                currentSlide ===
                ongoingVotes.length
            ) {

                setTimeout(() => {

                    track.style.scrollBehavior =
                        "auto";

                    track.scrollLeft = 0;

                    track.style.scrollBehavior =
                        "smooth";

                    currentSlide = 0;

                }, 600);

            }

        }, 5000);

    }

}


/* =========================
   HOME VOTE COUNTDOWN
========================= */

function updateHomeVoteCountdowns() {

    const countdowns =
        document.querySelectorAll(
            ".onvote-ending[data-end]"
        );


    const now =
        Date.now();


    countdowns.forEach(countdown => {

        const end =
            Number(
                countdown.dataset.end
            );


        if (!Number.isFinite(end)) {

            countdown.textContent =
                "Ends in --";

            return;

        }


        const diff =
            end - now;


        /* =========================
           ENDED
        ========================= */

        if (diff <= 0) {

            countdown.textContent =
                "Ended";

            return;

        }


        /* =========================
           CALCULATE TIME
        ========================= */

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


        /* =========================
           DISPLAY
        ========================= */

        countdown.textContent =
            "Ends in " +
            `${days}d ` +
            `${String(hours).padStart(2, "0")}:` +
            `${String(minutes).padStart(2, "0")}:` +
            `${String(seconds).padStart(2, "0")}`;

    });

}


/* =========================
   LIVE COUNTDOWN
========================= */

setInterval(
    updateHomeVoteCountdowns,
    1000
);


/* =========================
   RECEIVE VOTE DATA
========================= */

document.addEventListener(
    "votesLoaded",
    function (event) {

        renderOngoingVote(
            event.detail || []
        );

    }
);