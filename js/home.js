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

const listenBtn =
  document.getElementById("listenBtn");

const homePlaySheet =
  document.getElementById("homePlaySheet");


/* =========================
   BANNER CONFIG
========================= */

const bannerConfig = {

  title: "WAY 2 U",

  subtitle:
    "Official MV Out Now!",

  albumSlug:
    "youth-error",

  watchUrl:
    "https://youtu.be/dyxmlYXdxUs"

};


/* =========================
   FIND RELATED ALBUM
========================= */

const bannerAlbum =
  window.discography.find(
    album =>
      album.slug?.trim().toLowerCase() ===
      bannerConfig.albumSlug.trim().toLowerCase()
  );


/* =========================
   SET LISTEN LINKS
========================= */

if (bannerAlbum) {

  document.getElementById(
    "homeSpotifyLink"
  ).href =
    bannerAlbum.spotify || "#";


  document.getElementById(
    "homeAppleLink"
  ).href =
    bannerAlbum.apple || "#";


  document.getElementById(
    "homeYoutubeMusicLink"
  ).href =
    bannerAlbum.youtubeMusic || "#";


  document.getElementById(
    "homeMelonLink"
  ).href =
    bannerAlbum.melon || "#";


  document.getElementById(
    "homeGenieLink"
  ).href =
    bannerAlbum.genie || "#";


  document.getElementById(
    "homeBugsLink"
  ).href =
    bannerAlbum.bugs || "#";

}


/* =========================
   OPEN LISTEN SHEET
========================= */

if (listenBtn && homePlaySheet) {

  listenBtn.addEventListener(
    "click",
    () => {

      homePlaySheet.classList.add("show");

    }
  );

}


/* =========================
   CLOSE LISTEN SHEET
========================= */

document.addEventListener(
  "click",
  event => {

    if (
      homePlaySheet &&
      !homePlaySheet.contains(event.target) &&
      !listenBtn.contains(event.target)
    ) {

      homePlaySheet.classList.remove("show");

    }

  }
);

// =========================
// UPCOMING SCHEDULE
// =========================

document.addEventListener(
    "scheduleLoaded",
    renderUpcoming
);

let upcomingScheduleTimer = null;

function renderUpcoming() {

    if (!Array.isArray(window.allSchedule)) return;

    const loading =
        document.querySelector(".upsche-loading");

    const track =
        document.querySelector(".upsche-track");

    const counter =
        document.getElementById("upsche-count");

    if (!track) return;


    /* =========================
       CLEAR OLD TIMER
    ========================= */

    if (upcomingScheduleTimer) {

        clearInterval(
            upcomingScheduleTimer
        );

        upcomingScheduleTimer = null;

    }


    /* =========================
       REMOVE LOADING
    ========================= */

    if (loading) {
        loading.remove();
    }


    /* =========================
       GET UPCOMING
    ========================= */

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const upcoming =
        window.allSchedule
            .filter(item => {

                const d =
                    new Date(item.date);

                d.setHours(
                    0,
                    0,
                    0,
                    0
                );

                return d >= today;

            })
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    /* =========================
       NO UPCOMING
    ========================= */

    if (!upcoming.length) {

        track.innerHTML = "";

        if (counter) {
            counter.textContent = "";
        }

        return;

    }


    /* =========================
       RENDER
    ========================= */

    track.innerHTML =
        upcoming.map(item => {

            const date =
                new Date(item.date);

            return `
                <div class="upsche-slider">

                    <div class="upsche-date">

                        <span class="upsche-day">
                            ${date.getDate()}
                        </span>

                        <span class="upsche-month">
                            ${date
                                .toLocaleString(
                                    "en-US",
                                    {
                                        month: "short"
                                    }
                                )
                                .toUpperCase()}
                        </span>

                        <span class="upsche-dot">
                            •
                        </span>

                        <span class="upsche-time">
                            ${item.time || ""}
                            ${item.tz
                                ? ` ${item.tz}`
                                : ""}
                        </span>

                    </div>

                    <div class="upsche-title">
                        ${item.cat || ""}
                        ${item.title || ""}
                    </div>

                </div>
            `;

        }).join("");


    /* =========================
       INITIAL COUNTER
    ========================= */

    let currentSlide = 0;

    if (counter) {

        counter.textContent =
            `1/${upcoming.length}`;

    }

/* =========================
   SLIDE
========================= */

if (upcoming.length > 1) {

    const firstSlide =
        track.children[0].cloneNode(true);

    track.appendChild(firstSlide);

    let currentSlide = 0;

    upcomingScheduleTimer =
        setInterval(() => {

            currentSlide++;

            track.scrollTo({
                left:
                    track.clientWidth *
                    currentSlide,
                behavior: "smooth"
            });


            /* =========================
               UPDATE INDICATOR
            ========================= */

            if (counter) {

                const displaySlide =
                    currentSlide >= upcoming.length
                        ? 0
                        : currentSlide;

                counter.textContent =
                    `${displaySlide + 1}/${upcoming.length}`;

            }


            /* =========================
               LOOP BACK
            ========================= */

            if (
                currentSlide ===
                upcoming.length
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
   HOME — ONGOING VOTE
========================= */

function renderOngoingVote(votes) {

    const track =
        document.querySelector(".onvote-track");

    const loading =
        document.querySelector(".onvote-loading");

    const indicator =
        document.querySelector(".onvote-indicator");

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

        if (indicator) {
            indicator.textContent = "";
        }

        return;
    }


    /* =========================
       INITIAL INDICATOR
    ========================= */

    if (indicator) {
        indicator.textContent =
            `1/${ongoingVotes.length}`;
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
                    style="--app-color: rgb(245, 245, 245);"
                >

                    <div class="onvote-top">

                        <span
                            class="onvote-ending"
                            data-end="${vote.endTimestamp}"
                        >
                            Ends in 00:00:00
                        </span>

                    </div>


                    <div class="onvote-title">
                        ${vote.title || ""}
                    </div>


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
       COUNTDOWN
    ========================= */

    updateHomeVoteCountdowns();


    /* =========================
       APP COLOR
    ========================= */

    ongoingVotes.forEach((vote, index) => {

        const logo =
    window.getAppLogo(vote.app);

        if (!logo) return;

        const card =
            track.querySelector(
                `.onvote-slider[data-index="${index}"]`
            );

        if (!card) return;


        window.getDominantColor(logo)
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
           UPDATE INDICATOR
        ========================= */

        if (indicator) {

            const displaySlide =
                currentSlide >= ongoingVotes.length
                    ? 0
                    : currentSlide;

            indicator.textContent =
                `${displaySlide + 1}/${ongoingVotes.length}`;
        }


        /* =========================
           LOOP BACK
        ========================= */

        if (
            currentSlide ===
            ongoingVotes.length
        ) {

            setTimeout(() => {

                track.style.scrollBehavior = "auto";

                track.scrollLeft = 0;

                track.style.scrollBehavior = "smooth";

                currentSlide = 0;

            }, 600);

        }

    }, 5000);

}
}

function updateHomeVoteCountdowns() {

    const countdowns =
        document.querySelectorAll(
            ".onvote-ending[data-end]"
        );

    const now = Date.now();

    countdowns.forEach(countdown => {

        const end =
            Number(countdown.dataset.end);

        if (!Number.isFinite(end)) {

            countdown.textContent = "Ends in --";

            return;
        }

        const diff = end - now;

        if (diff <= 0) {

            countdown.textContent = "Ended";

            return;
        }

        const days =
            Math.floor(diff / 86400000);

        const hours =
            Math.floor(
                (diff % 86400000) / 3600000
            );

        const minutes =
            Math.floor(
                (diff % 3600000) / 60000
            );

        const seconds =
            Math.floor(
                (diff % 60000) / 1000
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
   WAIT FOR GLOBAL VOTE DATA
========================= */

function waitForHomeVotes() {

    if (Array.isArray(window.allVotes)) {

        console.log(
            "🔥 HOME allVotes FOUND:",
            window.allVotes
        );

        renderOngoingVote(
            window.allVotes
        );

        return true;
    }

    return false;
}


/* =========================
   CHECK IMMEDIATELY
========================= */

if (!waitForHomeVotes()) {

    let attempts = 0;

    const voteWaiter = setInterval(() => {

        attempts++;

        if (waitForHomeVotes()) {
            clearInterval(voteWaiter);
        }

        if (attempts >= 100) {

            clearInterval(voteWaiter);

            console.log(
                "⚠️ HOME: window.allVotes tidak ditemukan"
            );

        }

    }, 100);

}

console.log("🔥 GUIDE SECTION REACHED");

const guideScroll =
    document.getElementById("guideScroll");

console.log("🔥 guideScroll:", guideScroll);

if (guideScroll){

    guideScroll.innerHTML = `
        <a href="./guide/?category=music-show"
           class="home-guide-card music-show">
            MUSIC SHOW
        </a>

        <a href="./guide/?category=vote"
           class="home-guide-card vote">
            VOTE
        </a>

        <a href="./guide/?category=stream"
           class="home-guide-card stream">
            STREAM
        </a>

        <a href="./guide/?category=other"
           class="home-guide-card other">
            OTHERS
        </a>
    `;

}