/* =========================================================
   FLARE U GUIDE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const guide =
        document.getElementById("guide");

    if (!guide) return;


    const mainTabs =
        [...guide.querySelectorAll(".guide-main-tab")];

    const pills =
        document.getElementById("guide-pills");

    const feed =
        document.getElementById("guide-feed");


    /* =====================================================
       DATA
    ===================================================== */

    const GUIDE_DATA = {

        "music-show": {

            pills: [
                "The Show",
                "Show Champion",
                "M Countdown",
                "Music Bank",
                "Music Core",
                "Inkigayo"
            ],

            sections: {

                "The Show": [
                    "./assets/guide/the-show-general.jpg",
                    "./assets/guide/the-show-create.jpg",
                    "./assets/guide/the-show-vote.jpg"
                ],

                "Show Champion": [
                    "./assets/guide/show-champion-general.jpg",
                    "./assets/guide/show-champion-create.jpg",
                    "./assets/guide/show-champion-vote.jpg"
                ],

                "M Countdown": [
                    "./assets/guide/mcountdown-general.jpg",
                    "./assets/guide/mcountdown-create.jpg",
                    "./assets/guide/mcountdown-vote.jpg"
                ],

                "Music Bank": [
                    "./assets/guide/music-bank-general.jpg",
                    "./assets/guide/music-bank-create.jpg",
                    "./assets/guide/music-bank-vote.jpg"
                ],

                "Music Core": [
                    "./assets/guide/music-core-general.jpg",
                    "./assets/guide/music-core-create.jpg",
                    "./assets/guide/music-core-vote.jpg"
                ],

                "Inkigayo": [
                    "./assets/guide/inkigayo-general.jpg",
                    "./assets/guide/inkigayo-create.jpg",
                    "./assets/guide/inkigayo-vote.jpg"
                ]

            }

        },


        "vote": {

            pills: [
                "Mnet Plus",
                "Idol Champ",
                "Coogoong",
                "Muniverse",
                "Mubeat",
                "LiNC",
                "Higher",
                "Upick",
                "BigC"
            ],

            sections: {}

        },


        "stream": {

            pills: [
                "Spotify",
                "Apple Music",
                "YouTube Music",
                "Melon",
                "Bugs",
                "Genie"
            ],

            sections: {}

        },


        "other": {

            pills: [
                "Shazam",
                "Fan Project",
                "Flare U Global"
            ],

            sections: {}

        }

    };


    /* =====================================================
       STATE
    ===================================================== */

    let currentCategory =
        "music-show";

    let currentPill =
        0;


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value){

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


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
            GUIDE_DATA[currentCategory];

        pills.innerHTML = "";

        if (!data || !data.pills.length){
            return;
        }


        data.pills.forEach((name, index) => {

            const button =
                document.createElement("button");

            button.className =
                "guide-pill";

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

                    updatePills();

                    renderFeed();

                }
            );


            pills.appendChild(button);

        });

    }


    /* =====================================================
       UPDATE ACTIVE PILL
    ===================================================== */

    function updatePills(){

        [...pills.children]
            .forEach((pill, index) => {

                pill.classList.toggle(
                    "active",
                    index === currentPill
                );

            });

    }


    /* =====================================================
       RENDER FEED
    ===================================================== */

    function renderFeed(){

        const data =
            GUIDE_DATA[currentCategory];

        if (!data){

            feed.innerHTML = "";

            return;

        }


        const selected =
            data.pills[currentPill];


        const images =
            data.sections[selected] || [];


        /* =================================================
           EMPTY GUIDE
        ================================================= */

        if (!images.length){

            feed.innerHTML = `

                <section class="guide-section">

                    <div class="guide-section-title">

                        <h2>
                            ${escapeHTML(
                                selected || currentCategory
                            )}
                        </h2>

                    </div>


                    <div class="guide-empty">

                        Guide for
                        <strong>
                            ${escapeHTML(
                                selected || currentCategory
                            )}
                        </strong>

                        will be added soon.

                    </div>

                </section>

            `;

            return;

        }


        /* =================================================
           GUIDE CONTENT
        ================================================= */

        feed.innerHTML = `

            <section class="guide-section">

                <div class="guide-section-title">

                    <h2>
                        GENERAL GUIDE
                    </h2>

                </div>


                <div class="guide-images">

                    ${images.map((src, index) => `

                        <img
                            class="guide-image"
                            src="${src}"
                            alt="${escapeHTML(
                                selected
                            )} Guide ${index + 1}"
                            loading="${index === 0
                                ? "eager"
                                : "lazy"
                            }"
                            onerror="
                                this.outerHTML =
                                '<div class=&quot;guide-image-fallback&quot;>Image ${index + 1}<br>not found</div>'
                            "
                        >

                    `).join("")}

                </div>

            </section>

        `;

    }


    /* =====================================================
       SELECT CATEGORY
    ===================================================== */

    function selectCategory(category){

        if (!GUIDE_DATA[category]){
            return;
        }


        currentCategory =
            category;

        currentPill =
            0;


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
       INITIAL
    ===================================================== */

    selectCategory("music-show");

});