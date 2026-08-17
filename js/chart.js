/* =========================================================
   FLARE U CHART
   DATA SOURCE:
   GitHub Repository /data/*.json

   MAIN TABS:
   - KChart
   - Global Chart
   - Japan Chart
   - Cumulative

   KCHART SUB PILLS:
   - Current
   - Daily
   - Weekly
   - Monthly

   CURRENT:
   - Melon TOP100
   - Melon HOT100 30 Days
   - Melon HOT100 100 Days
   - Melon Real-time
   - Bugs Real-time
   - Genie TOP200
   - FLO Real-time
   - VIBE
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
       ICON
    ===================================================== */

    const CHART_LOGOS = {

        melon:
            "images/icons/melon.png",

        bugs:
            "images/icons/bugs.png",

        genie:
            "images/icons/genie.png",

        flo:
            "images/icons/flo.png",

        vibe:
            "images/icons/vibe.png"

    };


    /* =====================================================
       CURRENT SOURCES
    ===================================================== */

    const CURRENT_SOURCES = [

        {
            id: "melon_top100",
            name: "Melon TOP100",
            platform: "melon",
            file: "melon_top100.json"
        },

        {
            id: "melon_hot100_30",
            name: "Melon HOT100 (30 Days)",
            platform: "melon",
            file: "melon_hot100_30days.json"
        },

        {
            id: "melon_hot100_100",
            name: "Melon HOT100 (100 Days)",
            platform: "melon",
            file: "melon_hot100_100days.json"
        },

        {
            id: "melon_realtime",
            name: "Melon Real-time",
            platform: "melon",
            file: "melon_realtime.json"
        },

        {
            id: "bugs_realtime",
            name: "Bugs Real-time",
            platform: "bugs",
            file: "bugs_realtime.json"
        },

        {
            id: "genie_top200",
            name: "Genie TOP200",
            platform: "genie",
            file: "genie_top200.json"
        },

        {
            id: "flo_realtime",
            name: "FLO Real-time",
            platform: "flo",
            file: "flo_realtime.json"
        },

        {
            id: "vibe",
            name: "VIBE",
            platform: "vibe",
            file: "vibe_domestic.json",
            required: true
        }

    ];


    /* =====================================================
       KCHART PERIODS
    ===================================================== */

    const KCHART_PILLS = [

        {
            id: "current",
            name: "Current"
        },

        {
            id: "daily",
            name: "Daily"
        },

        {
            id: "weekly",
            name: "Weekly"
        },

        {
            id: "monthly",
            name: "Monthly"
        }

    ];


    /* =====================================================
       PERIOD JSON
    ===================================================== */

    const PERIOD_SOURCES = {

        daily: [

            {
                id: "melon_daily",
                name: "Melon Daily",
                platform: "melon",
                file: "melon_daily.json"
            }

        ],

        weekly: [

            {
                id: "melon_weekly",
                name: "Melon Weekly",
                platform: "melon",
                file: "melon_weekly.json"
            }

        ],

        monthly: [

            {
                id: "melon_monthly",
                name: "Melon Monthly",
                platform: "melon",
                file: "melon_monthly.json"
            }

        ]

    };


    /* =====================================================
       STATE
    ===================================================== */

    let chartData = {

        current: [],

        daily: [],

        weekly: [],

        monthly: [],

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

        if (!value) return "";


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
       LOAD JSON
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
                    `${config.name}: HTTP ${response.status}`
                );

                return {

                    id: config.id,

                    name: config.name,

                    platform: config.platform,

                    snapshot: null,

                    songs: []

                };

            }


            const data =
                await response.json();


            if (
                !data ||
                !Array.isArray(
                    data.snapshots
                ) ||
                !data.snapshots.length
            ) {

                return {

                    id: config.id,

                    name: config.name,

                    platform: config.platform,

                    snapshot: null,

                    songs: []

                };

            }


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

                return {

                    id: config.id,

                    name: config.name,

                    platform: config.platform,

                    snapshot: null,

                    songs: []

                };

            }


            return {

                id:
                    config.id,

                name:
                    config.name,

                platform:
                    config.platform ||
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


            return {

                id: config.id,

                name: config.name,

                platform: config.platform,

                snapshot: null,

                songs: []

            };

        }

    }


    /* =====================================================
       LOAD CURRENT
    ===================================================== */

    async function loadCurrent() {

        const results =
            await Promise.all(
                CURRENT_SOURCES.map(
                    config =>
                        loadJSON(config)
                )
            );


        chartData.current =
            results;

    }


    /* =====================================================
       LOAD PERIOD
    ===================================================== */

    async function loadPeriod(
        period
    ) {

        const configs =
            PERIOD_SOURCES[period] || [];


        if (!configs.length) {

            chartData[period] = [];

            return;

        }


        const results =
            await Promise.all(
                configs.map(
                    config =>
                        loadJSON(config)
                )
            );


        chartData[period] =
            results;

    }


    /* =====================================================
       LOAD ALL
    ===================================================== */

    async function loadAllCharts() {

        console.log(
            "Loading chart JSON..."
        );


        await Promise.all([

            loadCurrent(),

            loadPeriod("daily"),

            loadPeriod("weekly"),

            loadPeriod("monthly")

        ]);


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

            if (!dropdownOpen) return;


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
       MAIN TABS
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

        pills.innerHTML =
            "";


        /*
         * KChart punya 4 sub-pill.
         */

        if (
            currentCategory ===
            "kchart"
        ) {

            pillsWrap.classList.remove(
                "hidden"
            );


            KCHART_PILLS.forEach(
                (pill, index) => {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "chart-pill";


                    button.textContent =
                        pill.name;


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


            return;

        }


        /*
         * Category lain.
         */

        pillsWrap.classList.add(
            "hidden"
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
       RENDER CHANGE
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
        message =
            "No chart data available."
    ) {

        feed.innerHTML = `

            <div class="chart-empty">
                ${escapeHTML(message)}
            </div>

        `;

    }


    /* =====================================================
       RENDER SOURCE HEADER
    ===================================================== */

    function renderSourceHeader(
        source
    ) {

        const logo =
            CHART_LOGOS[
                source.platform
            ] || "";


        const time =
            formatSnapshotTime(
                source.snapshot?.snapshot_time
            );


        const logoHTML =
            logo
            ?
            `
                <img
                    class="chart-source-logo"
                    src="${escapeHTML(logo)}"
                    alt=""
                >
            `
            :
            "";


        return `

            <div class="chart-section-title">

                <div class="chart-source-name">

                    ${logoHTML}

                    <h3>
                        ${escapeHTML(
                            source.name
                        )}
                    </h3>

                </div>


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

        `;

    }


    /* =====================================================
       RENDER CURRENT
    ===================================================== */

    function renderCurrent() {

        const sources =
            chartData.current || [];


        if (!sources.length) {

            renderEmpty(
                "No current chart data available."
            );

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

                    ${sources
                        .map(
                            source => {

                                return `

                                    <div class="current-source">

                                        ${renderSourceHeader(
                                            source
                                        )}

                                        ${renderSongList(
                                            source.songs
                                        )}

                                    </div>

                                `;

                            }
                        )
                        .join("")
                    }

                </div>

            </section>

        `;

    }


    /* =====================================================
       RENDER PERIOD
    ===================================================== */

    function renderPeriod(
        period
    ) {

        const sources =
            chartData[period] || [];


        if (!sources.length) {

            renderEmpty();

            return;

        }


        /*
         * Untuk Daily / Weekly / Monthly,
         * semua source yang tersedia
         * ditampilkan.
         */

        feed.innerHTML = `

            <section class="chart-section">

                <div class="chart-section-title">

                    <h3>
                        ${
                            period
                                .charAt(0)
                                .toUpperCase() +
                            period.slice(1)
                        }
                    </h3>

                </div>


                <div class="current-grid">

                    ${sources
                        .map(
                            source => `

                                <div class="current-source">

                                    ${renderSourceHeader(
                                        source
                                    )}

                                    ${renderSongList(
                                        source.songs
                                    )}

                                </div>

                            `
                        )
                        .join("")
                    }

                </div>

            </section>

        `;

    }


    /* =====================================================
       RENDER KCHART
    ===================================================== */

    function renderKChart() {

        const selected =
            KCHART_PILLS[
                currentPill
            ];


        if (!selected) {

            renderCurrent();

            return;

        }


        if (
            selected.id ===
            "current"
        ) {

            renderCurrent();

            return;

        }


        renderPeriod(
            selected.id
        );

    }


    /* =====================================================
       RENDER OTHER CATEGORY
    ===================================================== */

    function renderOtherCategory() {

        const messages = {

            global:
                "No Global Chart data available.",

            japan:
                "No Japan Chart data available.",

            cum:
                "No cumulative chart data available."

        };


        renderEmpty(
            messages[
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
            !Object.prototype.hasOwnProperty.call(
                chartData,
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

        feed.innerHTML = `

            <div class="chart-empty">
                Loading chart...
            </div>

        `;


        await loadAllCharts();


        const params =
            new URLSearchParams(
                window.location.search
            );


        const category =
            params.get(
                "category"
            );


        /*
         * Main category.
         */

        if (
            category &&
            Object.prototype.hasOwnProperty.call(
                chartData,
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
         * Source parameter lama
         * tetap didukung untuk
         * compatibility.
         */

        const source =
            params.get(
                "source"
            );


        if (
            source &&
            currentCategory ===
            "kchart"
        ) {

            /*
             * Source tidak lagi menentukan
             * pill platform.
             *
             * Current tetap menjadi
             * default.
             */

            currentPill =
                0;

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