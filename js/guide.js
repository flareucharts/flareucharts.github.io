/* =========================================================
   FLARE U GUIDE
========================================================= */
console.log("GUIDE JS LOADED");

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
        guide.querySelector("#guide-pills");

    const dropdown =
        guide.querySelector("#guide-pills-dropdown");

    const feed =
        guide.querySelector("#guide-feed");

    const pillsWrap =
        guide.querySelector(".guide-pills-wrap");


    /* =====================================================
       DATA
    ===================================================== */

    const GUIDE_DATA = {

        "music-show": {

            pills: [
                "Overview",
                "Voting Schedule",
                "The Show",
                "Show Champion",
                "M Countdown",
                "Music Bank",
                "Music Core",
                "Inkigayo"
            ],

            sections: {
                "Overview": [
                    "../images/guide/criteria.png"
                ],

                "Voting Schedule": [
                    "../images/guide/votesche.png",
                    "../images/guide/votestage.png"
                ],

                "The Show": [
                    "./images/guide/theshow2.png",
                    "./images/guide/theshow3.png",
                    "./images/guide/theshow.png"
                ],
            }

        },

        "vote": {

            pills: [
                "BIGC",
                "Idol Champ",
                "Mnet Plus",
                "Coogoong",
                "Mubeat",
                "Muniverse",
                "LiNC",
                "Higher",
                "DuckAd",
                "Upick", 
                "Kooky"
            ],

            sections: {
                "BIGC": [
                    "../images/guide/bigc1.png",
                    "../images/guide/bigc2.png", 
                    "../images/guide/bigc3.png"
                ],

                "Idol Champ": [
                    "../images/guide/ichamp1.png",
                    "../images/guide/ichamp2.png"
                ],

                "Mnet Plus": [
                    "../images/guide/mnet1.png"
                ],

                "Coogoong": [
                    "../images/guide/coogoong1.png",
                    "../images/guide/coogoong2.png"
                ],

                "Mubeat": [
                    "../images/guide/mubeat1.png",
                    "../images/guide/mubeat2.png"
                ],

                "Muniverse": [
                    "../images/guide/muniverse1.png",
                    "../images/guide/muniverse2.png"
                ],

                "LiNC": [
                    "../images/guide/linc1.png",
                    "../images/guide/linc2.png"
                ],

                "Higher": [
                    "../images/guide/higher1.png",
                    "../images/guide/higher2.png"
                ],

                "DuckAd": [
                    "../images/guide/duckad1.png",
                    "../images/guide/duckad2.png",
                    "../images/guide/duckad3.png",
                    "../images/guide/duckad4.png"
                ],

                "Kooky": [
                    "../images/guide/kooky1.png",
                    "../images/guide/kooky2.png"
                ],

        
          }

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

                "Spotify": [
                    "../images/guide/spotify1.png",
                    "../images/guide/spotify2.png"
                ],

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

    let dropdownOpen =
        false;


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

document.addEventListener("click", event => {

    if (!dropdownOpen) return;

    if (
        pillsWrap &&
        !pillsWrap.contains(event.target)
    ){

        closeDropdown();

    }

});


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


        data.pills.forEach(
            (name, index) => {

                const button =
                    document.createElement("button");


                button.type =
                    "button";


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
                                selected ||
                                currentCategory
                            )}
                        </h2>

                    </div>


                    <div class="guide-empty">

                        Guide for

                        <strong>
                            ${escapeHTML(
                                selected ||
                                currentCategory
                            )}
                        </strong>

                        will be added soon.

                    </div>

                </section>

            `;

            return;

        }


        /* =================================================
           GUIDE IMAGE CAROUSEL
        ================================================= */

        feed.innerHTML = `

            <section class="guide-section">

                <div class="guide-section-title">

                    <h2>
                       ${escapeHTML(
                                selected ||
                                currentCategory
                            )}
                    </h2>
                  <button
            class="guide-share"
            type="button"
            aria-label="Share guide">

            <svg
                viewBox="0 0 24 24"
                aria-hidden="true">

                <path
                    d="M18 8a3 3 0 1 0-2.83-4A3 3 0 0 0 15 5.76l-6.91 3.8a3 3 0 1 0 0 4.88L15 18.24A3 3 0 1 0 16 16a3 3 0 0 0-.17.98l-6.91-3.8a3 3 0 0 0 0-2.36l6.91-3.8A3 3 0 0 0 18 8Z">
                </path>

            </svg>

        </button>
                </div>


                <div class="guide-image-carousel">

                    <span class="guide-image-counter">
                        1/${images.length}
                    </span>


                    <div class="guide-image-track">

                        ${images.map(
                            (src, index) => `

                            <img
                                class="guide-image"
                                src="${src}"
                                alt="${escapeHTML(
                                    selected
                                )} Guide ${
                                    index + 1
                                }"
                                loading="${
                                    index === 0
                                        ? "eager"
                                        : "lazy"
                                }"
                                onerror="
                                    this.outerHTML =
                                    '<div class=&quot;guide-image-fallback&quot;>Image ${
                                        index + 1
                                    }<br>not found</div>'
                                "
                            >

                        `).join("")}

                    </div>

                </div>

            </section>

        `;

const shareButton =
    feed.querySelector(".guide-share");

if (shareButton){

    shareButton.addEventListener("click", async () => {

        const url =
    `${window.location.origin}/guide?category=${encodeURIComponent(currentCategory)}&guide=${encodeURIComponent(selected)}`;

        if (navigator.share){

            await navigator.share({
                title: "FLARE U GUIDE",
                url: url
            });

        }else{

            await navigator.clipboard.writeText(url);

            alert("Guide link copied!");

        }

    });

}

        /* =================================================
           IMAGE SWIPE + COUNTER
        ================================================= */

        const track =
            feed.querySelector(
                ".guide-image-track"
            );


        const counter =
            feed.querySelector(
                ".guide-image-counter"
            );


        if (track && counter){

            track.addEventListener(
                "scroll",
                () => {

                    const width =
                        track.clientWidth;


                    if (!width) return;


                    const index =
                        Math.round(
                            track.scrollLeft /
                            width
                        );


                    counter.textContent =
                        `${Math.min(
                            index + 1,
                            images.length
                        )}/${images.length}`;

                },
                {
                    passive:true
                }
            );

        }

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

    const params = new URLSearchParams(
    window.location.search
);

const category =
    params.get("category");

const guideName =
    params.get("guide");


if (
    category &&
    GUIDE_DATA[category]
){

    currentCategory = category;

    const index =
        GUIDE_DATA[category].pills.indexOf(
            guideName
        );

    currentPill =
        index >= 0 ? index : 0;

    updateMainTabs();
    renderPills();
    renderFeed();

}else{

    selectCategory("music-show");

}

});