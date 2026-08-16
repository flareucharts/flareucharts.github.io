/* =========================================================
   FLARE U CHART
========================================================= */

console.log("CHART JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const chart =
        document.getElementById("chart");

    if (!chart) return;


    const mainTabs =
        [...chart.querySelectorAll(".chart-main-tab")];

    const pills =
        chart.querySelector("#chart-pills");

    const dropdown =
        chart.querySelector("#chart-pills-dropdown");

    const pillsWrap =
        chart.querySelector("#chart-pills-wrap");

    const feed =
        chart.querySelector("#chart-feed");


    /* =====================================================
       DATA
       DUMMY DATA — NANTI DIGANTI FIREBASE
    ===================================================== */

    const CHART_DATA = {

        /* =================================================
           CURRENT
        ================================================= */

        current: {

            pills: [],

            sources: [

                {
                    name: "Melon TOP100",
                    time: "2026.08.17 11:00 (KST)",

                    songs: [

                        {
                            rank: 9,
                            change: 1,
                            artist: "FLARE U",
                            title: "Song Title",
                            cover: "./images/cover-placeholder.jpg",
                            likes: 12543
                        },

                        {
                            rank: 24,
                            change: -2,
                            artist: "Artist B",
                            title: "Another Song",
                            cover: "./images/cover-placeholder.jpg",
                            likes: 8321
                        }

                    ]
                },


                {
                    name: "Spotify Global",
                    time: "2026.08.17",

                    songs: [

                        {
                            rank: 18,
                            change: 3,
                            artist: "FLARE U",
                            title: "Song Title",
                            cover: "./images/cover-placeholder.jpg"
                        }

                    ]
                }

            ]

        },


        /* =================================================
           KCHART
        ================================================= */

        kchart: {

            pills: [
                "Melon",
                "Genie",
                "Bugs",
                "FLO",
                "VIBE"
            ],

            sections: {

                "Melon": {

                    title: "Melon TOP100",
                    time: "2026.08.17 11:00 (KST)",

                    songs: [

                        {
                            rank: 9,
                            change: 1,
                            artist: "FLARE U",
                            title: "Song Title",
                            cover: "./images/cover-placeholder.jpg",
                            likes: 12543
                        },

                        {
                            rank: 27,
                            change: -3,
                            artist: "FLARE U",
                            title: "Another Song",
                            cover: "./images/cover-placeholder.jpg",
                            likes: 8231
                        }

                    ]

                },


                "Genie": {

                    title: "Genie TOP200",
                    time: "2026.08.17 11:00 (KST)",

                    songs: [

                        {
                            rank: 14,
                            change: 2,
                            artist: "FLARE U",
                            title: "Song Title",
                            cover: "./images/cover-placeholder.jpg"
                        }

                    ]

                },


                "Bugs": {

                    title: "Bugs",
                    time: "2026.08.17 11:00 (KST)",

                    songs: [

                        {
                            rank: 7,
                            change: 1,
                            artist: "FLARE U",
                            title: "Song Title",
                            cover: "./images/cover-placeholder.jpg"
                        }

                    ]

                },


                "FLO": {

                    title: "FLO",
                    time: "2026.08.17 11:00 (KST)",

                    songs: [

                        {
                            rank: 12,
                            change: -1,
                            artist: "FLARE U",
                            title: "Song Title",
                            cover: "./images/cover-placeholder.jpg"
                        }

                    ]

                },


                "VIBE": {

                    title: "VIBE",
                    time: "2026.08.17 11:00 (KST)",

                    songs: [

                        {
                            rank: 21,
                            change: 0,
                            artist: "FLARE U",
                            title: "Song Title",
                            cover: "./images/cover-placeholder.jpg"
                        }

                    ]

                }

            }

        },


        /* =================================================
           GLOBAL CHART
        ================================================= */

        global: {

            pills: [
                "Spotify",
                "Apple Music",
                "YouTube Music",
                "TME",
                "Oricon",
                "LINE MUSIC"
            ],

            sections: {

                "Spotify": {

                    title: "Spotify Global",
                    time: "2026.08.17",

                    songs: [

                        {
                            rank: 18,
                            change: 3,
                            artist: "FLARE U",
                            title: "Song Title",
                            cover: "./images/cover-placeholder.jpg"
                        }

                    ]

                },


                "Apple Music": {

                    title: "Apple Music",
                    time: "2026.08.17",

                    songs: []

                },


                "YouTube Music": {

                    title: "YouTube Music",
                    time: "2026.08.17",

                    songs: []

                },


                "TME": {

                    title: "TME",
                    time: "2026.08.17",

                    songs: []

                },


                "Oricon": {

                    title: "Oricon",
                    time: "2026.08.17",

                    songs: []

                },


                "LINE MUSIC": {

                    title: "LINE MUSIC",
                    time: "2026.08.17",

                    songs: []

                }

            }

        },


        /* =================================================
           ALBUM SALES
        ================================================= */

        album: {

            pills: [
                "Hanteo",
                "Circle Chart",
                "Japan Sales"
            ],

            sections: {

                "Hanteo": {

                    title: "Hanteo",
                    time: "2026.08.17",

                    albums: [

                        {
                            rank: 1,
                            title: "FLARE U — 1st Album",
                            cover: "./images/cover-placeholder.jpg",
                            sales: "125,430"
                        }

                    ]

                },


                "Circle Chart": {

                    title: "Circle Chart",
                    time: "2026.08.17",

                    albums: []

                },


                "Japan Sales": {

                    title: "Japan Sales",
                    time: "2026.08.17",

                    albums: []

                }

            }

        },


        /* =================================================
           MV
        ================================================= */

        mv: {

            pills: [],

            videos: [

                {
                    artist: "FLARE U",
                    title: "Song Title",
                    cover: "./images/cover-placeholder.jpg",
                    views: "12.4M",
                    likes: "854K",

                    achievements: [
                        "1M views — 18h 47m",
                        "100K likes — 11h 20m",
                        "Trending in 12 countries"
                    ]
                },


                {
                    artist: "FLARE U",
                    title: "Another Song",
                    cover: "./images/cover-placeholder.jpg",
                    views: "5.8M",
                    likes: "412K",

                    achievements: [
                        "1M views — 21h 03m",
                        "100K likes — 15h 40m",
                        "Trending in 7 countries"
                    ]
                }

            ]

        }

    };


    /* =====================================================
       STATE
    ===================================================== */

    let currentCategory =
        "current";

    let currentPill =
        0;

    let dropdownOpen =
        false;


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value){

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       FORMAT NUMBER
    ===================================================== */

    function formatNumber(value){

        if (
            value === null ||
            value === undefined ||
            value === ""
        ){

            return "";

        }

        return Number(value)
            .toLocaleString("id-ID");

    }


    /* =====================================================
       DROPDOWN
    ===================================================== */

    function closeDropdown(){

        dropdownOpen = false;

        if (pillsWrap){

            pillsWrap.classList.remove("open");

        }

    }


    function toggleDropdown(){

        if (!pillsWrap) return;

        dropdownOpen =
            !dropdownOpen;

        pillsWrap.classList.toggle(
            "open",
            dropdownOpen
        );

    }


    if (dropdown){

        dropdown.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleDropdown();

            }
        );

    }


    document.addEventListener(
        "click",
        event => {

            if (!dropdownOpen) return;

            if (
                pillsWrap &&
                !pillsWrap.contains(event.target)
            ){

                closeDropdown();

            }

        }
    );


    /* =====================================================
       MAIN TABS
    ===================================================== */

    function updateMainTabs(){

        mainTabs.forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.category === currentCategory
            );

        });

    }


    /* =====================================================
       RENDER PILLS
    ===================================================== */

    function renderPills(){

        const data =
            CHART_DATA[currentCategory];

        pills.innerHTML = "";

        if (
            !data ||
            !data.pills ||
            !data.pills.length
        ){

            pillsWrap.classList.add("hidden");

            return;

        }

        pillsWrap.classList.remove("hidden");


        data.pills.forEach(
            (name, index) => {

                const button =
                    document.createElement("button");

                button.type =
                    "button";

                button.className =
                    "chart-pill";

                button.textContent =
                    name;

                button.classList.toggle(
                    "active",
                    index === currentPill
                );


                button.addEventListener(
                    "click",
                    () => {

                        currentPill =
                            index;

                        closeDropdown();

                        updatePills();

                        renderFeed();

                    }
                );


                pills.appendChild(button);

            }
        );

    }


    /* =====================================================
       UPDATE ACTIVE PILL
    ===================================================== */

    function updatePills(){

        [...pills.children]
            .forEach(
                (pill, index) => {

                    pill.classList.toggle(
                        "active",
                        index === currentPill
                    );

                }
            );

    }


    /* =====================================================
       RENDER CHANGE
    ===================================================== */

    function renderChange(change){

        if (
            change === null ||
            change === undefined
        ){

            return "";

        }

        if (change > 0){

            return `
                <span class="chart-rank-change up">
                    ↑ ${formatNumber(change)}
                </span>
            `;

        }

        if (change < 0){

            return `
                <span class="chart-rank-change down">
                    ↓ ${formatNumber(Math.abs(change))}
                </span>
            `;

        }

        return `
            <span class="chart-rank-change same">
                —
            </span>
        `;

    }


    /* =====================================================
       RENDER SONG
    ===================================================== */

    function renderSong(song){

        return `

            <div class="chart-item">

                <div class="chart-rank">

                    <span class="chart-rank-number">
                        ${escapeHTML(song.rank)}
                    </span>

                    ${renderChange(song.change)}

                </div>


                <img
                    class="chart-cover"
                    src="${escapeHTML(song.cover)}"
                    alt=""
                    loading="lazy"
                    onerror="
                        this.style.visibility='hidden';
                    "
                >


                <div class="chart-song-info">

                    <div class="chart-song-title">
                        ${escapeHTML(song.title)}
                    </div>

                    <div class="chart-artist">
                        ${escapeHTML(song.artist)}
                    </div>

                    ${
                        song.likes !== undefined
                        ?
                        `
                        <div class="chart-likes">
                            ♡ ${formatNumber(song.likes)}
                        </div>
                        `
                        :
                        ""
                    }

                </div>

            </div>

        `;

    }


    /* =====================================================
       RENDER SONG LIST
    ===================================================== */

    function renderSongList(section){

        if (
            !section ||
            !section.songs ||
            !section.songs.length
        ){

            return `
                <div class="chart-empty">
                    No chart data available.
                </div>
            `;

        }


        return `

            <div class="chart-list">

                ${section.songs
                    .map(renderSong)
                    .join("")
                }

            </div>

        `;

    }


    /* =====================================================
       RENDER CURRENT
    ===================================================== */

    function renderCurrent(){

        const data =
            CHART_DATA.current;

        if (
            !data ||
            !data.sources ||
            !data.sources.length
        ){

            feed.innerHTML = `
                <div class="chart-empty">
                    No current chart data.
                </div>
            `;

            return;

        }


        feed.innerHTML = `

            <section class="chart-section">

                <div class="chart-section-title">

                    <h3>
                        Current
                    </h3>

                </div>


                <div class="current-grid">

                    ${data.sources.map(source => `

                        <div class="current-source">

                            <div class="current-source-title">

                                <h3>
                                    ${escapeHTML(source.name)}
                                </h3>

                                <span class="current-source-time">
                                    ${escapeHTML(source.time)}
                                </span>

                            </div>

                            ${renderSongList(source)}

                        </div>

                    `).join("")}

                </div>

            </section>

        `;

    }


    /* =====================================================
       RENDER STANDARD CHART
    ===================================================== */

    function renderStandardChart(){

        const data =
            CHART_DATA[currentCategory];

        if (!data){

            feed.innerHTML = "";

            return;

        }


        const selected =
            data.pills[currentPill];

        const section =
            data.sections[selected];


        if (!section){

            feed.innerHTML = `
                <div class="chart-empty">
                    No data available.
                </div>
            `;

            return;

        }


        feed.innerHTML = `

            <section class="chart-section">

                <div class="chart-section-title">

                    <h3>
                        ${escapeHTML(section.title)}
                    </h3>

                    <span class="chart-time">
                        ${escapeHTML(section.time)}
                    </span>

                </div>


                ${renderSongList(section)}

            </section>

        `;

    }


    /* =====================================================
       RENDER ALBUM
    ===================================================== */

    function renderAlbum(){

        const data =
            CHART_DATA.album;

        const selected =
            data.pills[currentPill];

        const section =
            data.sections[selected];


        if (
            !section ||
            !section.albums ||
            !section.albums.length
        ){

            feed.innerHTML = `
                <div class="chart-empty">
                    No album sales data available.
                </div>
            `;

            return;

        }


        feed.innerHTML = `

            <section class="chart-section">

                <div class="chart-section-title">

                    <h3>
                        ${escapeHTML(section.title)}
                    </h3>

                    <span class="chart-time">
                        ${escapeHTML(section.time)}
                    </span>

                </div>


                <div class="chart-list">

                    ${section.albums.map(album => `

                        <div class="chart-item">

                            <div class="chart-rank">

                                <span class="chart-rank-number">
                                    ${escapeHTML(album.rank)}
                                </span>

                            </div>


                            <img
                                class="chart-cover"
                                src="${escapeHTML(album.cover)}"
                                alt=""
                                loading="lazy"
                            >


                            <div class="chart-song-info">

                                <div class="chart-song-title">
                                    ${escapeHTML(album.title)}
                                </div>

                                <div class="chart-likes">
                                    ${escapeHTML(album.sales)} copies
                                </div>

                            </div>

                        </div>

                    `).join("")}

                </div>

            </section>

        `;

    }


    /* =====================================================
       RENDER MV
    ===================================================== */

    function renderMV(){

        const data =
            CHART_DATA.mv;

        if (
            !data ||
            !data.videos ||
            !data.videos.length
        ){

            feed.innerHTML = `
                <div class="chart-empty">
                    No MV data available.
                </div>
            `;

            return;

        }


        feed.innerHTML = `

            <section class="chart-section">

                <div class="chart-section-title">

                    <h3>
                        Music Videos
                    </h3>

                </div>


                <div class="mv-list">

                    ${data.videos.map(video => `

                        <div class="mv-card">

                            <img
                                class="mv-cover"
                                src="${escapeHTML(video.cover)}"
                                alt=""
                                loading="lazy"
                            >


                            <div class="mv-info">

                                <div class="mv-title">
                                    ${escapeHTML(video.title)}
                                </div>

                                <div class="mv-artist">
                                    ${escapeHTML(video.artist)}
                                </div>

                                <div class="mv-stat">
                                    ▶ ${escapeHTML(video.views)}
                                    views
                                </div>

                                <div class="mv-stat">
                                    ♡ ${escapeHTML(video.likes)}
                                    likes
                                </div>


                                ${
                                    video.achievements &&
                                    video.achievements.length
                                    ?
                                    `
                                    <div class="mv-achievement">

                                        ${video.achievements
                                            .map(
                                                achievement =>
                                                    escapeHTML(
                                                        achievement
                                                    )
                                            )
                                            .join("<br>")}

                                    </div>
                                    `
                                    :
                                    ""
                                }

                            </div>

                        </div>

                    `).join("")}

                </div>

            </section>

        `;

    }


    /* =====================================================
       RENDER FEED
    ===================================================== */

    function renderFeed(){

        if (currentCategory === "current"){

            renderCurrent();

            return;

        }


        if (currentCategory === "mv"){

            renderMV();

            return;

        }


        if (currentCategory === "album"){

            renderAlbum();

            return;

        }


        renderStandardChart();

    }


    /* =====================================================
       SELECT CATEGORY
    ===================================================== */

    function selectCategory(category){

        if (!CHART_DATA[category]){

            return;

        }


        currentCategory =
            category;

        currentPill =
            0;


        closeDropdown();

        updateMainTabs();

        renderPills();

        renderFeed();

    }


    /* =====================================================
       MAIN TAB CLICK
    ===================================================== */

    mainTabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    selectCategory(
                        tab.dataset.category
                    );

                }
            );

        }
    );


    /* =====================================================
       INITIAL
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const category =
        params.get("category");

    const source =
        params.get("source");


    if (
        category &&
        CHART_DATA[category]
    ){

        currentCategory =
            category;


        if (
            source &&
            CHART_DATA[category].pills
        ){

            const index =
                CHART_DATA[category]
                    .pills
                    .indexOf(source);


            currentPill =
                index >= 0
                    ? index
                    : 0;

        }


        updateMainTabs();
        renderPills();
        renderFeed();

    }else{

        selectCategory("current");

    }

});