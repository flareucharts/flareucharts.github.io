console.log("Home JS Loaded");

const container = document.getElementById("discographyScroll");

const top3 = [...window.discography]
  .sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate))
  .slice(0, 5);

container.innerHTML = "";

top3.forEach(album => {
  container.innerHTML += `
    <a href="./discography/album/index.html?slug=${album.slug}" class="music-card">
      <img src="./images/albums/${album.cover}" class="music-cover">
      <div class="music-title">${album.title}</div>
      <div class="music-sub">${album.artist}</div>
    </a>
  `;
});

// =========================
// UPCOMING SCHEDULE
// =========================

document.addEventListener("scheduleLoaded", renderUpcoming);

function renderUpcoming() {

  if (!window.allSchedule.length) return;

const loading = document.querySelector(".upsche-loading");
if (loading) {
    loading.remove(); // atau loading.style.display = "none";
}

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = window.allSchedule
    .filter(item => {
      const d = new Date(item.date);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!upcoming.length) return;

const track = document.querySelector(".upsche-track");

if (!track) return;

track.innerHTML = upcoming.map(item => {

    const date = new Date(item.date);

    return `
    <div class="upsche-slider">

        <div class="upsche-date">
            <span class="upsche-day">${date.getDate()}</span>

            <span class="upsche-month">
            ${date.toLocaleString("en-US",{
                month:"short"
            }).toUpperCase()}
            </span>

            <span class="upsche-dot">•</span>

            <span class="upsche-time">
            ${item.time}${item.tz ? ` ${item.tz}` : ""}
            </span>
        </div>

        <div class="upsche-title">
            ${item.cat} ${item.title}
        </div>

    </div>
    `;

}).join("");


document.getElementById("upsche-count").textContent =
`1 / ${upcoming.length}`;


if(upcoming.length > 1){

    const firstSlide = track.children[0].cloneNode(true);
    track.appendChild(firstSlide);

    let currentSlide = 0;

    setInterval(()=>{

        currentSlide++;

        track.scrollTo({
            left: track.clientWidth * currentSlide,
            behavior:"smooth"
        });


        if(currentSlide === upcoming.length){

            setTimeout(()=>{

                track.style.scrollBehavior = "auto";
                track.scrollLeft = 0;
                track.style.scrollBehavior = "smooth";

                currentSlide = 0;

            },600);

        }


        document.getElementById("upsche-count").textContent =
        `${currentSlide + 1 > upcoming.length ? 1 : currentSlide + 1} / ${upcoming.length}`;


    },5000);
}

}


/* =========================
   HOME — ONGOING VOTE
========================= */

let homeVoteSliderInterval = null;

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
       CLEAR OLD SLIDER
    ========================= */

    if (homeVoteSliderInterval) {
        clearInterval(homeVoteSliderInterval);
        homeVoteSliderInterval = null;
    }


    track.innerHTML = "";


    /* =========================
       NO ONGOING VOTE
    ========================= */

    if (!ongoingVotes.length) {

        track.innerHTML = `
            <div
                class="onvote-slider"
                style="
                    --app-color: rgb(245, 245, 245);
                    background:
                        linear-gradient(
                            135deg,
                            #f5f5f5,
                            #ffffff
                        );
                "
            >

                <div class="onvote-title">
                    No ongoing vote
                </div>

            </div>
        `;

        return;
    }


    /* =========================
       RENDER SLIDES
    ========================= */

    ongoingVotes.forEach((vote, index) => {

        const logo =
            getAppLogo(vote.app);


        const slide =
            document.createElement("div");

        slide.className =
            "onvote-slider";

        slide.dataset.index =
            index;


        /*
         * DEFAULT COLOR
         */
        slide.style.setProperty(
            "--app-color",
            "rgb(245, 245, 245)"
        );


        slide.innerHTML = `

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

        `;


        track.appendChild(slide);


        /* =========================
           GET APP COLOR
        ========================= */

        if (logo) {

            getDominantColor(logo)
                .then(color => {

                    /*
                     * SIMPAN WARNA UTAMA
                     */
                    slide.style.setProperty(
                        "--app-color",
                        color
                    );

                })
                .catch(error => {

                    console.error(
                        "Failed to get app color:",
                        error
                    );

                });

        }

    });


    /* =========================
       UPDATE COUNTDOWN
    ========================= */

    updateHomeVoteCountdowns();


    /* =========================
       AUTO SLIDE
    ========================= */

    if (ongoingVotes.length > 1) {

        /*
         * Clone slide pertama
         * untuk infinite loop
         */
        const firstSlide =
            track.children[0].cloneNode(true);

        track.appendChild(firstSlide);


        let currentSlide = 0;


        homeVoteSliderInterval =
            setInterval(() => {

                currentSlide++;


                track.scrollTo({

                    left:
                        track.clientWidth *
                        currentSlide,

                    behavior: "smooth"

                });


                /*
                 * Kembali ke slide pertama
                 */
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


        if (diff <= 0) {

            countdown.textContent =
                "Ended";

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


/* =========================
   FALLBACK
   Kalau data sudah loaded
========================= */

if (
    Array.isArray(window.allVotes) &&
    window.allVotes.length
) {

    renderOngoingVote(
        window.allVotes
    );

}