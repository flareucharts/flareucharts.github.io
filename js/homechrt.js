console.log("HOME CHART JS LOADED");


document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const dateElement =
        document.getElementById("home-chart-date");

    const grid =
        document.getElementById("home-chart-grid");

    if (!dateElement || !grid) {

        console.warn(
            "Home chart elements tidak ditemukan."
        );

        return;

    }


    /* =====================================================
       CONFIG
    ===================================================== */

    const TARGET_SONG = "WAY 2 U";


    const CHARTS = [

        {
            file: "melon_top100.json",
            platform: "Melon",
            chart: "TOP100"
        },

        {
            file: "melon_hot100_100days.json",
            platform: "Melon",
            chart: "HOT100 (100d)"
        },

        {
            file: "melon_hot100_30days.json",
            platform: "Melon",
            chart: "HOT100 (30d)"
        },

        {
            file: "melon_realtime.json",
            platform: "Melon",
            chart: "Real-time"
        },

        {
            file: "bugs_realtime.json",
            platform: "Bugs",
            chart: "Real-time"
        },

        {
            file: "genie_top200.json",
            platform: "Genie",
            chart: "TOP200"
        },

        {
            file: "flo_realtime.json",
            platform: "FLO",
            chart: "Real-time"
        },

        {
            file: "vibe_domestic.json",
            platform: "VIBE",
            chart: "Domestic"
        }

    ];


    /* =====================================================
       FORMAT SNAPSHOT TIME
    ===================================================== */

    function formatSnapshotTime(value) {

        if (!value) return "—";


        const date =
            new Date(value);


        if (Number.isNaN(date.getTime())) {

            return "—";

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
            `${get("minute")} KST`
        );

    }


    /* =====================================================
       RANK CHANGE
    ===================================================== */

    function formatRankChange(change) {

        if (
            change === null ||
            change === undefined ||
            change === ""
        ) {

            return "";

        }


        const number =
            Number(change);


        if (Number.isNaN(number)) {

            return "";

        }


        if (number > 0) {

            return `
                <small class="up">
                    ↑ ${number}
                </small>
            `;

        }


        if (number < 0) {

            return `
                <small class="down">
                    ↓ ${Math.abs(number)}
                </small>
            `;

        }


        return `
            <small class="same">
                —
            </small>
        `;

    }


    /* =====================================================
       FIND TITLE SONG
    ===================================================== */

    function findSong(songs) {

        if (!Array.isArray(songs)) {

            return null;

        }


        return songs.find(song => {

            const title =
                String(song?.title || "")
                    .trim()
                    .toLowerCase();


            return title ===
                TARGET_SONG
                    .toLowerCase();

        }) || null;

    }


    /* =====================================================
       LOAD ONE CHART
    ===================================================== */

    async function loadChart(config) {

        try {

            const response =
                await fetch(
                    `/data/${config.file}?t=${Date.now()}`,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                return {

                    ...config,
                    snapshot: null,
                    song: null

                };

            }


            const data =
                await response.json();


            if (
                !data ||
                !Array.isArray(data.snapshots) ||
                !data.snapshots.length
            ) {

                return {

                    ...config,
                    snapshot: null,
                    song: null

                };

            }


            const snapshot =
                data.snapshots[
                    data.snapshots.length - 1
                ];


            const song =
                findSong(
                    snapshot?.songs
                );


            return {

                ...config,
                snapshot,
                song

            };


        } catch (error) {

            console.warn(
                `Home chart gagal memuat ${config.file}`,
                error
            );


            return {

                ...config,
                snapshot: null,
                song: null

            };

        }

    }


    /* =====================================================
       UPDATE RANK
    ===================================================== */

    function updateRank(card, result) {

        if (!card) return;


        const rankStrong =
            card.querySelector(
                ".rank-wrap strong"
            );

        const rankWrap =
            card.querySelector(
                ".rank-wrap"
            );


        if (!rankStrong || !rankWrap) return;


        /* ================================================
           SONG TIDAK MASUK CHART
        ================================================ */

        if (!result.song) {

            rankStrong.textContent = "—";


            const oldChange =
                rankWrap.querySelector(
                    ".home-rank-change"
                );


            if (oldChange) {
                oldChange.remove();
            }


            return;

        }


        /* ================================================
           RANK
        ================================================ */

        rankStrong.textContent =
            result.song.rank ?? "—";


        /* ================================================
           RANK CHANGE
        ================================================ */

        const oldChange =
            rankWrap.querySelector(
                ".home-rank-change"
            );


        if (oldChange) {

            oldChange.remove();

        }


        const changeHTML =
            formatRankChange(
                result.song.rank_change
            );


        if (changeHTML) {

            const temp =
                document.createElement("div");


            temp.innerHTML = changeHTML;


            const change =
                temp.firstElementChild;


            if (change) {

                change.classList.add(
                    "home-rank-change"
                );

                rankWrap.appendChild(
                    change
                );

            }

        }

    }


    /* =====================================================
       MAP HTML CARD → CHART CONFIG
    ===================================================== */

    function getCards() {

        return [
            ...grid.querySelectorAll(
                ".home-chart-card"
            )
        ];

    }


    /* =====================================================
       UPDATE ALL CARDS
    ===================================================== */

    function updateCards(results) {

        const cards =
            getCards();


        results.forEach(
            (result, index) => {

                const column =
                    index < 4
                        ? cards[0]
                        : cards[1];


                if (!column) return;


                const itemIndex =
                    index < 4
                        ? index
                        : index - 4;


                const item =
                    column.querySelectorAll(
                        ".home-chart-item"
                    )[itemIndex];


                updateRank(
                    item,
                    result
                );

            }
        );

    }


    /* =====================================================
       UPDATE SNAPSHOT DATE
    ===================================================== */

    function updateDate(results) {

        const validTimes =
            results
                .map(
                    result =>
                        result.snapshot?.snapshot_time
                )
                .filter(Boolean)
                .map(value => {

                    const date =
                        new Date(value);

                    return {
                        raw: value,
                        time:
                            date.getTime()
                    };

                })
                .filter(
                    item =>
                        !Number.isNaN(
                            item.time
                        )
                );


        if (!validTimes.length) {

            dateElement.textContent =
                "—";

            return;

        }


        /*
         * Ambil snapshot paling baru
         * dari semua platform.
         */

        validTimes.sort(
            (a, b) =>
                b.time - a.time
        );


        dateElement.textContent =
            formatSnapshotTime(
                validTimes[0].raw
            );

    }


    /* =====================================================
       LOAD HOME CHART
    ===================================================== */

    async function loadHomeChart() {

        /*
         * Sementara loading.
         * Card tetap ada.
         */

        dateElement.textContent =
            "Loading...";


        const results =
            await Promise.all(
                CHARTS.map(
                    config =>
                        loadChart(config)
                )
            );


        updateCards(
            results
        );


        updateDate(
            results
        );


        console.log(
            "🔥 HOME chart:",
            results
        );

    }


    /* =====================================================
       START
    ===================================================== */

    loadHomeChart();

});