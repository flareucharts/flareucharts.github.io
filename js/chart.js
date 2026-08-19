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

    const chart = document.getElementById("chart");

    if (!chart) return;


    const mainTabs = [
        ...chart.querySelectorAll(".chart-main-tab")
    ];

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
            platform: "Melon",
            icon: "/images/icons/melon.png",
            file: "melon_top100.json"
        },

        {
            id: "melon_hot100_100",
            name: "Melon HOT100 (100days)",
            platform: "Melon",
            icon: "/images/icons/melon.png",
            file: "melon_hot100_100days.json"
        },

        {
            id: "melon_hot100_30",
            name: "Melon HOT100 (30days)",
            platform: "Melon",
            icon: "/images/icons/melon.png",
            file: "melon_hot100_30days.json"
        },

        {
            id: "melon_realtime",
            name: "Melon Real-time",
            platform: "Melon",
            icon: "/images/icons/melon.png",
            file: "melon_realtime.json"
        },

        {
            id: "bugs_realtime",
            name: "Bugs Real-time",
            platform: "Bugs",
            icon: "/images/icons/bugs.png",
            file: "bugs_realtime.json"
        },

        {
            id: "genie_top200",
            name: "Genie TOP200",
            platform: "Genie",
            icon: "/images/icons/genie.png",
            file: "genie_top200.json"
        },

        {
            id: "flo_realtime",
            name: "FLO Real-time",
            platform: "FLO",
            icon: "/images/icons/flo.png",
            file: "flo_realtime.json"
        },

        {
            id: "vibe_domestic",
            name: "VIBE Domestic",
            platform: "VIBE",
            icon: "/images/icons/vibe.png",
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


    let currentCategory = "kchart";

    let currentPill = 0;

    let dropdownOpen = false;


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


        const number = Number(value);


        if (Number.isNaN(number)) {

            return escapeHTML(value);

        }


        return number.toLocaleString("id-ID");

    }


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatSnapshotTime(value) {

        if (!value) return "";


        const date = new Date(value);


        if (Number.isNaN(date.getTime())) {

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


        const get = type =>
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

            return {

                ...config,

                available: false,
                snapshot: null,
                previousSnapshot: null,
                songs: []

            };

        }


        const data =
            await response.json();


        if (
            !data ||
            !Array.isArray(data.snapshots)
        ) {

            return {

                ...config,

                available: false,
                snapshot: null,
                previousSnapshot: null,
                songs: []

            };

        }


        /*
         * Snapshot terbaru
         */

        const snapshots =
            data.snapshots;


        const latest =
            snapshots.length
                ? snapshots[
                    snapshots.length - 1
                ]
                : null;


        /*
         * Snapshot sebelumnya
         */

        const previous =
            snapshots.length >= 2
                ? snapshots[
                    snapshots.length - 2
                ]
                : null;


        /*
         * JSON ada tetapi belum
         * memiliki snapshot.
         */

        if (!latest) {

            return {

                ...config,

                available: false,
                snapshot: null,
                previousSnapshot: null,
                songs: []

            };

        }


        return {

            ...config,

            available:
                Array.isArray(
                    latest.songs
                ) &&
                latest.songs.length > 0,

            platform:
                data.platform ||
                latest.platform ||
                config.platform,

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

            /*
             * CURRENT
             */
            snapshot:
                latest,

            /*
             * PREVIOUS
             */
            previousSnapshot:
                previous,

            /*
             * CURRENT SONGS
             */
            songs:
                Array.isArray(
                    latest.songs
                )
                    ? latest.songs
                    : []

        };


    } catch (error) {

        console.warn(
            `${config.name}: gagal memuat JSON`
        );


        return {

            ...config,

            available: false,
            snapshot: null,
            previousSnapshot: null,
            songs: []

        };

    }

}


    /* =====================================================
       LOAD ALL
    ===================================================== */

    async function loadAllCharts() {

        const results =
            await Promise.all(
                JSON_FILES.map(
                    config =>
                        loadJSON(config)
                )
            );


        /*
         * Semua collector masuk KChart.
         */

        chartData = {

            kchart: results,

            global: [],
            japan: [],
            cum: []

        };

    }


    /* =====================================================
       DROPDOWN
    ===================================================== */

    function closeDropdown() {

        dropdownOpen = false;

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

        mainTabs.forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.category ===
                currentCategory
            );

        });

    }


    /* =====================================================
       RENDER PILLS
    ===================================================== */

    function renderPills() {

        pills.innerHTML = "";


        /*
         * KChart memiliki 4 sub-pill.
         */

        if (
            currentCategory ===
            "kchart"
        ) {

            const labels = [
                "Current",
                "Daily",
                "Weekly",
                "Monthly"
            ];


            labels.forEach(
                (label, index) => {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "chart-pill";


                    button.textContent =
                        label;


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


            pillsWrap.classList.remove(
                "hidden"
            );


            return;

        }


        pillsWrap.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       UPDATE PILLS
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
   PREVIOUS RANK
===================================================== */

function getPreviousRank(
    song,
    previousSnapshot
) {

    if (
        !previousSnapshot ||
        !Array.isArray(
            previousSnapshot.songs
        )
    ) {

        return null;

    }


    const previousSong =
        previousSnapshot.songs.find(
            previous => {

                /*
                 * Prioritas:
                 * track_id
                 */

                if (
                    song.track_id &&
                    previous.track_id
                ) {

                    return (
                        String(
                            song.track_id
                        ) ===
                        String(
                            previous.track_id
                        )
                    );

                }


                /*
                 * Fallback:
                 * title + artist
                 */

                return (
                    String(
                        previous.title || ""
                    ).trim()
                    .toLowerCase()
                    ===
                    String(
                        song.title || ""
                    ).trim()
                    .toLowerCase()
                    &&
                    String(
                        previous.artist || ""
                    ).trim()
                    .toLowerCase()
                    ===
                    String(
                        song.artist || ""
                    ).trim()
                    .toLowerCase()
                );

            }
        );


    if (!previousSong) {

        return null;

    }


    const rank =
        Number(
            previousSong.rank
        );


    return Number.isFinite(rank)
        ? rank
        : null;

}


    /* =====================================================
       RANK CHANGE
    ===================================================== */

    /* =====================================================
   RANK STATUS
===================================================== */

function renderRankStatus(
    song,
    previousSnapshot
) {

    const currentRank =
        Number(song?.rank);


    if (!Number.isFinite(currentRank)) {

        return "";

    }


    const previousRank =
        getPreviousRank(
            song,
            previousSnapshot
        );


    /*
     * Tidak ada di snapshot sebelumnya
     * = NEW
     */

    if (previousRank === null) {

        return `
            <span class="chart-rank-change new">
                NEW
            </span>
        `;

    }


    /*
     * Rank membaik
     *
     * Contoh:
     * 5 → 3 = ↑ 2
     */

    if (currentRank < previousRank) {

        const change =
            previousRank - currentRank;


        return `
            <span class="chart-rank-change up">
                ↑ ${formatNumber(change)}
            </span>
        `;

    }


    /*
     * Rank turun
     *
     * Contoh:
     * 3 → 5 = ↓ 2
     */

    if (currentRank > previousRank) {

        const change =
            currentRank - previousRank;


        return `
            <span class="chart-rank-change down">
                ↓ ${formatNumber(change)}
            </span>
        `;

    }


    /*
     * Tidak berubah
     *
     * Contoh:
     * 5 → 5 = —
     */

    return `
        <span class="chart-rank-change same">
            —
        </span>
    `;

}


    /* =====================================================
       RENDER SONG
    ===================================================== */

    function renderSong(
    song,
    previousSnapshot
) {

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

                    ${renderRankStatus(
    song,
    previousSnapshot
)}

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
       SONG LIST
    ===================================================== */

    function renderSongList(
    songs,
    previousSnapshot
) {

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
    .map(song =>
        renderSong(
            song,
            previousSnapshot
        )
    )
    .join("")
}

            </div>

        `;

    }


    /* =====================================================
       EMPTY
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
       PLATFORM HEADER
    ===================================================== */

    function renderPlatformHeader(
        source
    ) {

        const icon =
            source.icon || "";


        return `

            <div class="chart-platform">

                ${
                    icon
                        ?
                        `
                            <img
                                class="chart-platform-icon"
                                src="${escapeHTML(icon)}"
                                alt=""
                                loading="lazy"
                                onerror="
                                    this.style.display='none';
                                "
                            >
                        `
                        :
                        ""
                }


                <span>
                    ${escapeHTML(source.name)}
                </span>

            </div>

        `;

    }


    /* =====================================================
       CURRENT
    ===================================================== */

    function renderCurrent() {

        const sources =
            chartData.kchart || [];


        if (!sources.length) {

            renderEmpty();

            return;

        }


        feed.innerHTML =
            sources
                .map(source => {

                    const snapshot =
                        source.snapshot;


                    const time =
                        formatSnapshotTime(
                            snapshot?.snapshot_time
                        );


                    const songs =
                        source.songs || [];


                    return `

                        <section
                            class="chart-section"
                        >

                            <div
                                class="chart-section-title"
                            >

                                ${renderPlatformHeader(
                                    source
                                )}


                                ${
                                    time
                                        ?
                                        `
                                            <span
                                                class="chart-time"
                                            >
                                                ${escapeHTML(
                                                    time
                                                )}
                                            </span>
                                        `
                                        :
                                        ""
                                }

                            </div>


                            ${renderSongList(
    songs,
    source.previousSnapshot
)}

                        </section>

                    `;

                })
                .join("");

    }


    /* =====================================================
       DAILY / WEEKLY / MONTHLY
    ===================================================== */

    function renderPeriod(
        period
    ) {

        /*
         * Collector saat ini baru menyediakan
         * Current snapshot.
         *
         * Jadi Daily / Weekly / Monthly
         * tetap disiapkan tetapi belum
         * mengambil data historis.
         */

        renderEmpty(
            `${period} chart data available soon.`
        );

    }


    /* =====================================================
       KCHART
    ===================================================== */

    function renderKChart() {

        switch (currentPill) {

            case 0:

                renderCurrent();

                break;


            case 1:

                renderPeriod(
                    "Daily"
                );

                break;


            case 2:

                renderPeriod(
                    "Weekly"
                );

                break;


            case 3:

                renderPeriod(
                    "Monthly"
                );

                break;


            default:

                renderCurrent();

        }

    }


    /* =====================================================
       OTHER MAIN TABS
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
       FEED
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
       SELECT MAIN CATEGORY
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


        currentPill = 0;


        closeDropdown();

        updateMainTabs();

        renderPills();

        renderFeed();

    }


    /* =====================================================
       MAIN TAB CLICK
    ===================================================== */

    mainTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                selectCategory(
                    tab.dataset.category
                );

            }
        );

    });


    /* =====================================================
       INIT
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
            params.get("category");


        /*
         * Default:
         * KChart
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


        updateMainTabs();

        renderPills();

        renderFeed();

    }


    /* =====================================================
       START
    ===================================================== */

    init();

});