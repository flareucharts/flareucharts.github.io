/* =========================================================
   HOME — PRETTY GIRL CURRENT CHART
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const dateEl =
        document.getElementById("home-chart-date");

    const grid =
        document.getElementById("home-chart-grid");


    if (!dateEl || !grid) {
        return;
    }


    /* =====================================================
       CONFIG
    ===================================================== */

    const CHARTS = [

        {
            file: "melon_top100.json",
            key: "melon_top100"
        },

        {
            file: "melon_hot100_100days.json",
            key: "melon_hot100_100"
        },

        {
            file: "melon_hot100_30days.json",
            key: "melon_hot100_30"
        },

        {
            file: "melon_realtime.json",
            key: "melon_realtime"
        },

        {
            file: "bugs_realtime.json",
            key: "bugs_realtime"
        },

        {
            file: "genie_top200.json",
            key: "genie_top200"
        },

        {
            file: "flo_realtime.json",
            key: "flo_realtime"
        },

        {
            file: "vibe_domestic.json",
            key: "vibe_domestic"
        }

    ];


    /* =====================================================
       FIND ROW
    ===================================================== */

    const items =
        grid.querySelectorAll(
            ".home-chart-item"
        );


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(value) {

        if (!value) {
            return "—";
        }


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
       FIND PRETTY GIRL
    ===================================================== */

    function findPrettyGirl(songs) {

        if (!Array.isArray(songs)) {
            return null;
        }


        return songs.find(song => {

            const title =
                String(
                    song?.title || ""
                )
                .trim()
                .toLowerCase();


            return title === "pretty girl";

        }) || null;

    }


    /* =====================================================
       RENDER RANK CHANGE
    ===================================================== */

    function renderChange(
        rankWrap,
        change
    ) {

        const old =
            rankWrap.querySelector(
                ".home-rank-change"
            );


        if (old) {
            old.remove();
        }


        /*
         * Tidak ada rank change.
         */

        if (
            change === null ||
            change === undefined ||
            change === ""
        ) {
            return;
        }


        const number =
            Number(change);


        if (Number.isNaN(number)) {
            return;
        }


        const element =
            document.createElement("small");


        element.classList.add(
            "home-rank-change"
        );


        /* =========================
           RANK NAIK
        ========================= */

        if (number > 0) {

            element.classList.add("up");

            element.textContent =
                `↑ ${number}`;

        }


        /* =========================
           RANK TURUN
        ========================= */

        else if (number < 0) {

            element.classList.add("down");

            element.textContent =
                `↓ ${Math.abs(number)}`;

        }


        /* =========================
           TETAP
        ========================= */

        else {

            element.classList.add("same");

            element.textContent = "—";

        }


        rankWrap.appendChild(
            element
        );

    }


    /* =====================================================
       RENDER RESULT
    ===================================================== */

    function renderResult(
        index,
        song
    ) {

        const item =
            items[index];


        if (!item) {
            return;
        }


        const rankWrap =
            item.querySelector(
                ".rank-wrap"
            );


        if (!rankWrap) {
            return;
        }


        const rank =
            rankWrap.querySelector(
                "strong"
            );


        if (!rank) {
            return;
        }


        /*
         * DEFAULT
         *
         * Kalau Pretty Girl tidak
         * masuk chart → —
         */

        rank.textContent = "—";


        renderChange(
            rankWrap,
            null
        );


        /*
         * Pretty Girl tidak ada.
         */

        if (!song) {
            return;
        }


        /*
         * Pretty Girl ada.
         */

        rank.textContent =
            song.rank ?? "—";


        renderChange(
            rankWrap,
            song.rank_change
        );

    }


    /* =====================================================
       LOAD ONE JSON
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
                    snapshot: null,
                    song: null
                };

            }


            const snapshots =
                data.snapshots;


            const snapshot =
                snapshots.length
                    ? snapshots[
                        snapshots.length - 1
                    ]
                    : null;


            if (!snapshot) {

                return {
                    snapshot: null,
                    song: null
                };

            }


            const song =
                findPrettyGirl(
                    snapshot.songs
                );


            return {
                snapshot,
                song
            };


        } catch (error) {

            console.warn(
                `Gagal memuat ${config.file}`,
                error
            );


            return {
                snapshot: null,
                song: null
            };

        }

    }


    /* =====================================================
       LOAD ALL
    ===================================================== */

    async function loadHomeChart() {

        const results =
            await Promise.all(
                CHARTS.map(
                    config =>
                        loadChart(config)
                )
            );


        /* =================================================
           SNAPSHOT TIME
        ================================================= */

        const snapshot =
            results.find(
                result =>
                    result.snapshot
            )?.snapshot;


        if (
            snapshot?.snapshot_time
        ) {

            dateEl.textContent =
                formatTime(
                    snapshot.snapshot_time
                );

        }
        else {

            dateEl.textContent = "—";

        }


        /* =================================================
           RANKS
        ================================================= */

        results.forEach(
            (result, index) => {

                renderResult(
                    index,
                    result.song
                );

            }
        );

    }


    /* =====================================================
       START
    ===================================================== */

    loadHomeChart();

});