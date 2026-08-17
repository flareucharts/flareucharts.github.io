/* =========================================================
   FLARE U CHART
   DATA SOURCE:
   GitHub Repository /data/*.json

   MATCHES:
   - HTML: chart-page
   - Main tabs:
       KChart
       Global Chart
       Japan Chart
       Cumulative

   JSON FORMAT:
   {
       "platform": "...",
       "chart": "...",
       "source": "...",
       "artist": "RESCENE (리센느)",
       "updated_at": "...",
       "snapshots": [
           {
               "snapshot_time": "...",
               "date": "...",
               "hour": 16,
               "platform": "...",
               "chart": "...",
               "source": "...",
               "songs": [...]
           }
       ]
   }
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


    if (!pills || !pillsWrap || !feed) {
        console.error(
            "Chart elements tidak lengkap."
        );
        return;
    }


    /* =====================================================
       CONFIG
    ===================================================== */

    const JSON_FILES = [

        {
            id: "melon_top100",
            name: "Melon TOP100",
            category: "kchart",
            file: "melon_top100.json"
        },

        {
            id: "melon_hot100_30",
            name: "Melon HOT100 30D",
            category: "kchart",
            file: "melon_hot100_30days.json"
        },

        {
            id: "melon_hot100_100",
            name: "Melon HOT100 100D",
            category: "kchart",
            file: "melon_hot100_100days.json"
        },

        {
            id: "melon_realtime",
            name: "Melon Real-time",
            category: "kchart",
            file: "melon_realtime.json"
        },

        {
            id: "bugs_realtime",
            name: "Bugs Real-time",
            category: "kchart",
            file: "bugs_realtime.json"
        },

        {
            id: "genie_top200",
            name: "Genie TOP200",
            category: "kchart",
            file: "genie_top200.json"
        },

        {
            id: "flo_realtime",
            name: "FLO Real-time",
            category: "kchart",
            file: "flo_realtime.json"
        },

        {
            id: "vibe_domestic",
            name: "VIBE Domestic",
            category: "kchart",
            file: "vibe_domestic.json"
        }

    ];


    /* =====================================================
       STATE
    ===================================================== */

    let chartData = {

        kchart: [],

        global: [],

        japan: [],

        cum: []

    };


    let currentCategory =
        "kchart";


    let currentPill =
        0;


    let dropdownOpen =
        false;


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

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

    function formatNumber(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "";

        }

        const number =
            Number(value);

        if (
            Number.isNaN(number)
        ) {

            return escapeHTML(value);

        }

        return number.toLocaleString(
            "id-ID"
        );

    }


    /* =====================================================
       FORMAT SNAPSHOT TIME
    ===================================================== */

    function formatSnapshotTime(value) {

        if (!value) {
            return "";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return escapeHTML(value);

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


        const get =
            type =>
                parts.find(
                    part =>
                        part.type === type
                )?.value || "";


        return (
            `${get("year")}.` +
            `${get("month")}.` +
            `${get("day")} ` +
            `${get("hour")}:` +
            `${get("minute")} (KST)`
        );

    }


    /* =====================================================
       LOAD ONE JSON
    ===================================================== */

    async function loadJSON(config) {

        const url =
            `/data/${config.file}?t=${Date.now()}`;


        try {

            const response =
                await fetch(
                    url,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                console.warn(
                    `${config.name}: ` +
                    `HTTP ${response.status}`
                );

                return null;

            }


            const data =
                await response.json();


            if (
                !data ||
                !Array.isArray(
                    data.snapshots
                )
            ) {

                console.warn(
                    `${config.name}: ` +
                    `format JSON tidak valid`
                );

                return null;

            }


            if (
                !data.snapshots.length
            ) {

                console.warn(
                    `${config.name}: ` +
                    `tidak memiliki snapshot`
                );

                return null;

            }


            /*
             * Snapshot terakhir.
             */

            const latest =
                data.snapshots[
                    data.snapshots.length - 1
                ];


            if (
                !latest ||
                !Array.isArray(
                    latest.songs
                )
            ) {

                console.warn(
                    `${config.name}: ` +
                    `snapshot tidak valid`
                );

                return null;

            }


            /*
             * Jangan tampilkan sumber
             * jika RESCENE memang tidak
             * mempunyai lagu di chart tersebut.
             */

            if (
                latest.songs.length === 0
            ) {

                console.log(
                    `${config.name}: ` +
                    `RESCENE tidak ditemukan`
                );

                return null;

            }


            return {

                id:
                    config.id,

                name:
                    config.name,

                category:
                    config.category,

                platform:
                    data.platform ||
                    latest.platform ||
                    "",

                chart:
                    data.chart ||
                    latest.chart ||
                    "",

                source:
                    data.source ||
                    latest.source ||
                    "",

                artist:
                    data.artist ||
                    "RESCENE (리센느)",

                snapshot:
                    latest,

                songs:
                    latest.songs

            };


        } catch (error) {

            console.warn(
                `${config.name}:`,
                error
            );

            return null;

        }

    }


    /* =====================================================
       LOAD ALL DATA
    ===================================================== */

    async function loadAllCharts() {

        console.log(
            "Loading chart JSON..."
        );


        const results =
            await Promise.all(
                JSON_FILES.map(
                    config =>
                        loadJSON(config)
                )
            );


        chartData = {

            kchart:
                results.filter(
                    item =>
                        item &&
                        item.category === "kchart"
                ),

            global: [],

            japan: [],

            cum: []

        };


        console.log(
            "Chart data loaded:",
            chartData
        );

    }


    /* =====================================================
       DROPDOWN
    ===================================================== */

    function closeDropdown() {

        dropdownOpen =
            false;


        pillsWrap.classList.remove(
            "open"
        );

    }


    function toggleDropdown() {

        dropdownOpen =
            !dropdownOpen;


        pillsWrap.classList.toggle(
            "open",
            dropdownOpen
        );

    }


    if (dropdown) {

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

            if (!dropdownOpen) {
                return;
            }


            if (
                !pillsWrap.contains(
                    event.target
                )
            ) {

                closeDropdown();

            }

        }
    );


    /* =====================================================
       UPDATE MAIN TABS
    ===================================================== */

    function updateMainTabs() {

        mainTabs.forEach(
            tab => {

                tab.classList.toggle(
                    "active",
                    tab.dataset.category ===
                    currentCategory
                );

            }
        );

    }


    /* =====================================================
       RENDER PILLS
    ===================================================== */

    function renderPills() {

        const sources =
            chartData[
                currentCategory
            ] || [];


        pills.innerHTML =
            "";


        currentPill =
            Math.min(
                currentPill,
                Math.max(
                    sources.length - 1,
                    0
                )
            );


        /*
         * Tidak ada sumber.
         */

        if (!sources.length) {

            pillsWrap.classList.add(
                "hidden"
            );

            return;

        }


        pillsWrap.classList.remove(
            "hidden"
        );


        sources.forEach(
            (source, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "chart-pill";


                button.textContent =
                    source.name;


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


                pills.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       UPDATE ACTIVE PILL
    ===================================================== */

    function updatePills() {

        [
            ...pills.children
        ].forEach(
            (pill, index) => {

                pill.classList.toggle(
                    "active",
                    index === currentPill
                );

            }
        );

    }


    /* =====================================================
       RENDER RANK CHANGE
    ===================================================== */

    function renderChange(change) {

        if (
            change === null ||
            change === undefined ||
            change === ""
        ) {

            return "";

        }


        const number =
            Number(change);


        if (
            Number.isNaN(number)
        ) {

            return "";

        }


        if (number > 0) {

            return `
                <span class="chart-rank-change up">
                    ↑ ${formatNumber(number)}
                </span>
            `;

        }


        if (number < 0) {

            return `
                <span class="chart-rank-change down">
                    ↓ ${formatNumber(
                        Math.abs(number)
                    )}
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

    function renderSong(song) {

        const rank =
            song?.rank ?? "";


        const title =
            song?.title || "";


        const artist =
            song?.artist ||
            "RESCENE (리센느)";


        const cover =
            song?.cover || "";


        const likes =
            song?.likes;


        const score =
            song?.score;


        const rankChange =
            song?.rank_change;


        const hasLikes =
            likes !== null &&
            likes !== undefined &&
            likes !== "";


        const hasScore =
            score !== null &&
            score !== undefined &&
            score !== "";


        const coverHTML =
            cover
                ?
                `
                    <img
                        class="chart-cover"
                        src="${escapeHTML(cover)}"
                        alt=""
                        loading="lazy"
                        onerror="
                            this.style.visibility='hidden';
                        "
                    >
                `
                :
                `
                    <div class="chart-cover"></div>
                `;


        return `

            <div class="chart-item">

                <div class="chart-rank">

                    <span class="chart-rank-number">
                        ${escapeHTML(rank)}
                    </span>

                    ${renderChange(rankChange)}

                </div>


                ${coverHTML}


                <div class="chart-song-info">

                    <div class="chart-song-title">
                        ${escapeHTML(title)}
                    </div>


                    <div class="chart-artist">
                        ${escapeHTML(artist)}
                    </div>


                    ${
                        hasLikes
                        ?
                        `
                            <div class="chart-likes">
                                ♡ ${formatNumber(likes)}
                            </div>
                        `
                        :
                        ""
                    }


                    ${
                        hasScore
                        ?
                        `
                            <div class="chart-score">
                                Score:
                                ${formatNumber(score)}
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

    function renderSongList(songs) {

        if (
            !Array.isArray(songs) ||
            !songs.length
        ) {

            return `
                <div class="chart-empty">
                    No chart data available.
                </div>
            `;

        }


        return `

            <div class="chart-list">

                ${songs
                    .map(
                        song =>
                            renderSong(song)
                    )
                    .join("")
                }

            </div>

        `;

    }


    /* =====================================================
       RENDER EMPTY
    ===================================================== */

    function renderEmpty(
        message = "No chart data available."
    ) {

        feed.innerHTML = `

            <div class="chart-empty">

                ${escapeHTML(message)}

            </div>

        `;

    }


    /* =====================================================
       RENDER SELECTED SOURCE
    ===================================================== */

    function renderSelectedSource() {

        const sources =
            chartData[
                currentCategory
            ] || [];


        if (!sources.length) {

            renderEmpty(
                currentCategory === "kchart"
                    ?
                    "No KChart data available."
                    :
                    "No chart data available."
            );

            return;

        }


        const source =
            sources[currentPill];


        if (!source) {

            renderEmpty();

            return;

        }


        const snapshot =
            source.snapshot;


        const title =
            source.name;


        const time =
            formatSnapshotTime(
                snapshot?.snapshot_time
            );


        const songs =
            source.songs || [];


        feed.innerHTML = `

            <section class="chart-section">

                <div class="chart-section-title">

                    <h3>
                        ${escapeHTML(title)}
                    </h3>


                    ${
                        time
                        ?
                        `
                            <span class="chart-time">
                                ${escapeHTML(time)}
                            </span>
                        `
                        :
                        ""
                    }

                </div>


                ${renderSongList(songs)}

            </section>

        `;

    }


    /* =====================================================
       RENDER KCHART
    ===================================================== */

    function renderKChart() {

        renderSelectedSource();

    }


    /* =====================================================
       RENDER OTHER CATEGORIES
    ===================================================== */

    function renderOtherCategory() {

        const labels = {

            global:
                "No Global Chart data available.",

            japan:
                "No Japan Chart data available.",

            cum:
                "No cumulative chart data available."

        };


        renderEmpty(
            labels[
                currentCategory
            ] ||
            "No chart data available."
        );

    }


    /* =====================================================
       RENDER FEED
    ===================================================== */

    function renderFeed() {

        if (
            currentCategory ===
            "kchart"
        ) {

            renderKChart();

            return;

        }


        renderOtherCategory();

    }


    /* =====================================================
       SELECT CATEGORY
    ===================================================== */

    function selectCategory(
        category
    ) {

        if (
            !chartData.hasOwnProperty(
                category
            )
        ) {

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

    async function init() {

        /*
         * Tampilkan loading sementara.
         */

        feed.innerHTML = `

            <div class="chart-empty">
                Loading chart...
            </div>

        `;


        await loadAllCharts();


        /*
         * URL parameter.
         *
         * Contoh:
         * ?category=kchart
         */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const category =
            params.get(
                "category"
            );


        const source =
            params.get(
                "source"
            );


        /*
         * Pilih category dari URL
         * jika valid.
         */

        if (
            category &&
            chartData.hasOwnProperty(
                category
            )
        ) {

            currentCategory =
                category;

        } else {

            currentCategory =
                "kchart";

        }


        /*
         * Kalau URL mempunyai source,
         * cari berdasarkan nama source.
         */

        if (
            source &&
            chartData[
                currentCategory
            ]?.length
        ) {

            const index =
                chartData[
                    currentCategory
                ].findIndex(
                    item =>
                        item.id === source ||
                        item.name === source
                );


            if (index >= 0) {

                currentPill =
                    index;

            }

        }


        updateMainTabs();

        renderPills();

        renderFeed();

    }


    /* =====================================================
       START
    ===================================================== */

    init();

});