/* =========================================================
   FLARE U — HOME CURRENT CHART
   SONG: PRETTY GIRL

   SOURCE:
   /data/*.json

   HOMEPAGE ONLY SHOWS:
   - Snapshot time
   - Rank
   - Rank change

   If song is not charting:
   - Rank = —
   - No "No chart data available"
========================================================= */

console.log("HOME CHART JS LOADED");


document.addEventListener("DOMContentLoaded", () => {

    const homeChart =
        document.querySelector(".home-chart");

    if (!homeChart) return;


    /* =====================================================
       CONFIG
    ===================================================== */

    const TARGET_TITLE = "Pretty Girl";

    const TARGET_ARTIST = "RESCENE (리센느)";


    const CHARTS = [

        {
            id: "melon_top100",
            file: "melon_top100.json",
            platform: "Melon",
            chart: "TOP100"
        },

        {
            id: "melon_hot100_100",
            file: "melon_hot100_100days.json",
            platform: "Melon",
            chart: "HOT100 (100d)"
        },

        {
            id: "melon_hot100_30",
            file: "melon_hot100_30days.json",
            platform: "Melon",
            chart: "HOT100 (30d)"
        },

        {
            id: "melon_realtime",
            file: "melon_realtime.json",
            platform: "Melon",
            chart: "Real-time"
        },

        {
            id: "bugs_realtime",
            file: "bugs_realtime.json",
            platform: "Bugs",
            chart: "Real-time"
        },

        {
            id: "genie_top200",
            file: "genie_top200.json",
            platform: "Genie",
            chart: "TOP200"
        },

        {
            id: "flo_realtime",
            file: "flo_realtime.json",
            platform: "FLO",
            chart: "Real-time"
        },

        {
            id: "vibe_domestic",
            file: "vibe_domestic.json",
            platform: "VIBE",
            chart: "Domestic"
        }

    ];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const titleElement =
        homeChart.querySelector(
            "#home-chart-title"
        );

    const dateElement =
        homeChart.querySelector(
            "#home-chart-date"
        );

    const items =
        [
            ...homeChart.querySelectorAll(
                ".home-chart-item"
            )
        ];


    /* =====================================================
       TITLE
    ===================================================== */

    if (titleElement) {

        titleElement.textContent =
            `“${TARGET_TITLE}” Current Chart`;

    }


    /* =====================================================
       NORMALIZE
    ===================================================== */

    function normalize(value) {

        return String(value ?? "")
            .trim()
            .toLowerCase();

    }


    /* =====================================================
       FIND TARGET SONG
    ===================================================== */

    function findSong(songs) {

        if (!Array.isArray(songs)) {
            return null;
        }


        return songs.find(song => {

            const title =
                normalize(song?.title);

            const artist =
                normalize(song?.artist);


            const titleMatch =
                title ===
                normalize(TARGET_TITLE);


            const artistMatch =
                !artist ||
                artist ===
                normalize(TARGET_ARTIST);


            return (
                titleMatch &&
                artistMatch
            );

        }) || null;

    }


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatSnapshotTime(value) {

        if (!value) return "—";


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);

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
            `${get("minute")} KST`
        );

    }


    /* =====================================================
       CHANGE
    ===================================================== */

    function getChange(song) {

        if (!song) {

            return {
                text: "",
                className: ""
            };

        }


        /*
         * NEW
         *
         * Jika sebelumnya tidak punya ranking.
         */

        const previousRank =
            song?.previous_rank;


        if (
            previousRank === null ||
            previousRank === undefined ||
            previousRank === "" ||
            Number(previousRank) <= 0
        ) {

            return {
                text: "NEW",
                className: "new"
            };

        }


        const change =
            song?.rank_change;


        if (
            change === null ||
            change === undefined ||
            change === ""
        ) {

            return {
                text: "",
                className: ""
            };

        }


        const number =
            Number(change);


        if (Number.isNaN(number)) {

            return {
                text: "",
                className: ""
            };

        }


        if (number > 0) {

            return {
                text: `↑ ${number}`,
                className: "up"
            };

        }


        if (number < 0) {

            return {
                text: `↓ ${Math.abs(number)}`,
                className: "down"
            };

        }


        return {
            text: "—",
            className: "same"
        };

    }


    /* =====================================================
       UPDATE ITEM
    ===================================================== */

    function updateItem(
        item,
        song
    ) {

        if (!item) return;


        const rankElement =
            item.querySelector(
                ".rank-wrap strong"
            );


        const changeElement =
            item.querySelector(
                ".rank-wrap small"
            );


        /*
         * SONG TIDAK MASUK CHART
         */

        if (!song) {

            if (rankElement) {

                rankElement.textContent =
                    "—";

            }


            if (changeElement) {

                changeElement.textContent =
                    "";

                changeElement.className =
                    "";

            }


            return;

        }


        /*
         * RANK
         */

        if (rankElement) {

            rankElement.textContent =
                song.rank ?? "—";

        }


        /*
         * CHANGE
         */

        const change =
            getChange(song);


        if (changeElement) {

            changeElement.textContent =
                change.text;

            changeElement.className =
                change.className;

        }

    }


    /* =====================================================
       LOAD JSON
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
                    config,
                    snapshot: null,
                    song: null
                };

            }


            const data =
                await response.json();


            if (
                !data ||
                !Array.isArray(
                    data.snapshots
                )
            ) {

                return {
                    config,
                    snapshot: null,
                    song: null
                };

            }


            const snapshot =
                data.snapshots.length
                    ? data.snapshots[
                        data.snapshots.length - 1
                    ]
                    : null;


            if (!snapshot) {

                return {
                    config,
                    snapshot: null,
                    song: null
                };

            }


            const song =
                findSong(
                    snapshot.songs
                );


            return {
                config,
                snapshot,
                song
            };


        } catch (error) {

            console.warn(
                `Home chart gagal memuat ${config.file}`,
                error
            );


            return {
                config,
                snapshot: null,
                song: null
            };

        }

    }


    /* =====================================================
       RENDER
    ===================================================== */

    async function renderHomeChart() {

        const results =
            await Promise.all(
                CHARTS.map(
                    config =>
                        loadChart(config)
                )
            );


        /*
         * Snapshot time
         *
         * Ambil snapshot terbaru dari
         * data chart yang berhasil dimuat.
         */

        const validSnapshots =
            results
                .filter(
                    result =>
                        result.snapshot
                );


        if (validSnapshots.length) {

            validSnapshots.sort(
                (a, b) => {

                    return (
                        new Date(
                            b.snapshot.snapshot_time
                        ) -
                        new Date(
                            a.snapshot.snapshot_time
                        )
                    );

                }
            );


            if (dateElement) {

                dateElement.textContent =
                    formatSnapshotTime(
                        validSnapshots[0]
                            .snapshot
                            .snapshot_time
                    );

            }

        } else {

            if (dateElement) {

                dateElement.textContent =
                    "—";

            }

        }


        /*
         * Update 8 chart items.
         */

        results.forEach(
            (result, index) => {

                updateItem(
                    items[index],
                    result.song
                );

            }
        );

    }


    /* =====================================================
       START
    ===================================================== */

    renderHomeChart();

});