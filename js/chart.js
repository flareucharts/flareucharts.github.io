/* =========================================================
   FLARE U CHART
   DATA SOURCE: GitHub Repository JSON
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
    ===================================================== */

    let chartData = {

        current: {
            pills: [],
            sources: []
        },

        kchart: {
            pills: [],
            sections: {}
        },

        global: {
            pills: [],
            sections: {}
        },

        album: {
            pills: [],
            sections: {}
        },

        mv: {
            pills: [],
            videos: []
        }

    };


    /* =====================================================
       STATE
    ===================================================== */

    let currentCategory = "current";

    let currentPill = 0;

    let dropdownOpen = false;


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
       FORMAT TIME
    ===================================================== */

    function formatSnapshotTime(value){

        if (!value) return "";

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return value;
        }

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

        const get = type =>
            parts.find(
                p => p.type === type
            )?.value || "";

        return `${get("year")}.${get("month")}.${get("day")} ${get("hour")}:${get("minute")} (KST)`;

    }


    /* =====================================================
       LOAD MELON REALTIME
    ===================================================== */

    async function loadMelonRealtime(){

        try {

            /*
             * Cache bust supaya GitHub Pages tidak
             * menggunakan JSON lama.
             */

            const url =
                `/data/melon_realtime.json?t=${Date.now()}`;

            const response =
                await fetch(url, {
                    cache: "no-store"
                });

            if (!response.ok){

                throw new Error(
                    `HTTP ${response.status}`
                );

            }

            const history =
                await response.json();


            /* ---------------------------------------------
               VALIDATE
            --------------------------------------------- */

            if (
                !history ||
                !Array.isArray(history.snapshots)
            ){

                throw new Error(
                    "Invalid melon_realtime.json format"
                );

            }


            /* ---------------------------------------------
               GET LATEST SNAPSHOT
            --------------------------------------------- */

            const latest =
                history.snapshots[
                    history.snapshots.length - 1
                ];


            if (
                !latest ||
                !Array.isArray(latest.songs)
            ){

                throw new Error(
                    "No snapshot data found"
                );

            }


            /* ---------------------------------------------
               CONVERT TO CHART FORMAT
            --------------------------------------------- */

            const songs =
                latest.songs.map(song => {

                    return {

                        rank:
                            song.rank,

                        change:
                            song.rank_change,

                        artist:
                            history.artist || "RESCENE (리센느)",

                        title:
                            song.title,

                        cover:
                            song.cover,

                        likes:
                            song.likes

                    };

                });


            /* ---------------------------------------------
               CURRENT → MELON
            --------------------------------------------- */

            chartData.current = {

                pills: [],

                sources: [

                    {

                        name:
                            "Melon Real-time",

                        time:
                            formatSnapshotTime(
                                latest.snapshot_time
                            ),

                        songs:
                            songs

                    }

                ]

            };


            console.log(
                "Melon realtime loaded:",
                latest
            );


        } catch (error){

            console.error(
                "Failed to load Melon realtime:",
                error
            );

            chartData.current = {

                pills: [],

                sources: []

            };

        }

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
            chartData[currentCategory];

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
                        song.likes !== undefined &&
                        song.likes !== null
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
            chartData.current;


        if (
            !data ||
            !data.sources ||
            !data.sources.length
        ){

            feed.innerHTML = `
                <div class="chart-empty">
                    No current chart data available.
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
            chartData[currentCategory];

        if (!data){

            feed.innerHTML = "";

            return;

        }


        const selected =
            data.pills[currentPill];

        const section =
            data.sections?.[selected];


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

        feed.innerHTML = `
            <div class="chart-empty">
                Album sales data will be connected next.
            </div>
        `;

    }


    /* =====================================================
       RENDER MV
    ===================================================== */

    function renderMV(){

        feed.innerHTML = `
            <div class="chart-empty">
                MV data will be connected next.
            </div>
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

        if (!chartData[category]){

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
       INITIAL LOAD
    ===================================================== */

    async function init(){

        /*
         * Load real data dulu.
         */

        await loadMelonRealtime();


        /*
         * URL parameter
         */

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
            chartData[category]
        ){

            currentCategory =
                category;


            if (
                source &&
                chartData[category].pills
            ){

                const index =
                    chartData[category]
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

        } else {

            selectCategory("current");

        }

    }


    init();

});