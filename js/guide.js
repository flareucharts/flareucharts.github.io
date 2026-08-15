/* =========================================================
   FLARE U GUIDE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const guide = document.getElementById("guide");
    if (!guide) return;
    /* =====================================================
       DATA
    ===================================================== */

    const GUIDE_DATA = {
        "music-show": {
            title: "MUSIC SHOW",
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
            title: "VOTE",
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
            title: "STREAM",
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
            title: "OTHER",
            pills: [
                "Shazam",
                "Fan Project",
                "Flare U Global"
            ],
            sections: {}
        }
    };


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const hero =
        guide.querySelector(".guide-hero");

    const carousel =
        document.getElementById("guide-carousel");

    const cards =
        [...guide.querySelectorAll(".guide-category-card")];

    const dots =
        [...document.querySelectorAll("#guide-dots button")];

    const prev =
        document.getElementById("guide-prev");

    const next =
        document.getElementById("guide-next");

    const stickyBar =
        document.getElementById("guide-sticky-bar");

    const mainTabs =
        [...document.querySelectorAll(".guide-main-tab")];

    const pills =
        document.getElementById("guide-pills");

    const feed =
        document.getElementById("guide-feed");


    /* =====================================================
       STATE
    ===================================================== */

    const categories =
        cards.map(card => card.dataset.category);

    let currentIndex = 0;
    let currentPill = 0;

    let startX = 0;
    let startY = 0;
    let dragging = false;

    let scrollTicking = false;


    /* =====================================================
       HELPERS
    ===================================================== */

    function normalizeIndex(index){

        const length = categories.length;

        return (
            (index % length) + length
        ) % length;
    }


    function getCategory(){

        return categories[currentIndex];

    }


    /* =====================================================
       CATEGORY VISUAL
    ===================================================== */

    function updateCategoryVisual(){

        cards.forEach((card, index) => {

            card.classList.toggle(
                "is-active",
                index === currentIndex
            );

            const distance =
                Math.abs(index - currentIndex);

            card.classList.toggle(
                "is-side",
                distance > 0
            );

        });


        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentIndex
            );

        });


        mainTabs.forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.category === getCategory()
            );

        });

    }


    /* =====================================================
       CENTER CARD
    ===================================================== */

    function centerCurrentCard(animate = true){

        const card = cards[currentIndex];

        if (!card) return;


        const carouselRect =
            carousel.getBoundingClientRect();

        const cardRect =
            card.getBoundingClientRect();


        const target =
            card.offsetLeft -
            (carouselRect.width / 2) +
            (cardRect.width / 2);


        carousel.scrollTo({
            left: target,
            behavior: animate ? "smooth" : "auto"
        });

    }


    /* =====================================================
       CATEGORY
    ===================================================== */

    function selectCategory(index, animate = true){

        currentIndex =
            normalizeIndex(index);

        currentPill = 0;

        updateCategoryVisual();

        renderPills();

        renderFeed();

        requestAnimationFrame(() => {
            centerCurrentCard(animate);
        });

    }


    /* =====================================================
       ARROWS
    ===================================================== */

    prev.addEventListener("click", () => {

        selectCategory(currentIndex - 1);

    });


    next.addEventListener("click", () => {

        selectCategory(currentIndex + 1);

    });


    /* =====================================================
       DOTS
    ===================================================== */

    dots.forEach(dot => {

        dot.addEventListener("click", () => {

            selectCategory(
                Number(dot.dataset.index)
            );

        });

    });


    /* =====================================================
       CARD CLICK
    ===================================================== */

    cards.forEach((card, index) => {

        card.addEventListener("click", () => {

            selectCategory(index);

        });

    });


    /* =====================================================
       TOUCH SWIPE — MAIN CAROUSEL
    ===================================================== */

    carousel.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.touches[0];

            startX = touch.clientX;
            startY = touch.clientY;

            dragging = true;

        },
        { passive:true }
    );


    carousel.addEventListener(
        "touchend",
        event => {

            if (!dragging) return;

            dragging = false;

            const touch =
                event.changedTouches[0];

            const diffX =
                startX - touch.clientX;

            const diffY =
                startY - touch.clientY;


            // Ignore mostly vertical gestures
            if (Math.abs(diffX) < Math.abs(diffY)) {
                return;
            }


            if (Math.abs(diffX) < 45) {
                centerCurrentCard();
                return;
            }


            if (diffX > 0){

                selectCategory(
                    currentIndex + 1
                );

            }else{

                selectCategory(
                    currentIndex - 1
                );

            }

        },
        { passive:true }
    );


    /* =====================================================
       MAIN TABS
    ===================================================== */

    mainTabs.forEach(tab => {

        tab.addEventListener("click", () => {

            const index =
                categories.indexOf(
                    tab.dataset.category
                );

            if (index !== -1){
                selectCategory(index);
            }

        });

    });


    /* =====================================================
       PILLS
    ===================================================== */

    function renderPills(){

        const data =
            GUIDE_DATA[getCategory()];

        pills.innerHTML = "";

        if (!data || !data.pills.length){
            return;
        }


        data.pills.forEach((name, index) => {

            const button =
                document.createElement("button");

            button.className = "guide-pill";

            button.textContent = name;

            button.classList.toggle(
                "active",
                index === currentPill
            );

            button.addEventListener(
                "click",
                () => {

                    currentPill = index;

                    [...pills.children]
                        .forEach((pill, pillIndex) => {

                            pill.classList.toggle(
                                "active",
                                pillIndex === currentPill
                            );

                        });

                    renderFeed();

                }
            );

            pills.appendChild(button);

        });

    }


    /* =====================================================
       FEED
    ===================================================== */

    function renderFeed(){

        const data =
            GUIDE_DATA[getCategory()];

        if (!data){
            feed.innerHTML = "";
            return;
        }


        const selected =
            data.pills[currentPill];


        const images =
            data.sections[selected] || [];


        /*
         * Placeholder feed for categories whose images
         * have not been added yet.
         */
        if (!images.length){

            feed.innerHTML = `
                <section class="guide-section">
                    <div class="guide-section-title">
                        <h2>${escapeHTML(selected || data.title)}</h2>
                    </div>

                    <div class="guide-image-carousel">
                        <div class="guide-image-track">
                            <div class="guide-image-fallback">
                                Add your guide images for
                                <strong>${escapeHTML(selected || data.title)}</strong>
                                inside
                                <strong>assets/guide/</strong>.
                            </div>
                        </div>
                    </div>
                </section>
            `;

            return;
        }


        const sectionTitle =
            images.length >= 3
                ? "GENERAL GUIDE"
                : data.title;


        feed.innerHTML = `
            <section class="guide-section">

                <div class="guide-section-title">
                    <h2>${sectionTitle}</h2>
                </div>

                <div class="guide-image-carousel">

                    <span class="guide-image-counter">
                        1/${images.length}
                    </span>

                    <div class="guide-image-track">
                        ${images.map((src, index) => `
                            <img
                                class="guide-image"
                                src="${src}"
                                alt="${escapeHTML(selected)} Guide ${index + 1}"
                                loading="${index === 0 ? "eager" : "lazy"}"
                                onerror="this.outerHTML='<div class=&quot;guide-image-fallback&quot;>Image ${index + 1}<br>not found</div>'"
                            >
                        `).join("")}
                    </div>

                </div>

            </section>
        `;


        const track =
            feed.querySelector(".guide-image-track");

        const counter =
            feed.querySelector(".guide-image-counter");


        if (track && counter){

            track.addEventListener("scroll", () => {

                const width =
                    track.clientWidth;

                if (!width) return;

                const index =
                    Math.round(
                        track.scrollLeft / width
                    );

                counter.textContent =
                    `${Math.min(index + 1, images.length)}/${images.length}`;

            });

        }

    }


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
       SCROLL → SHRINK HERO
    ===================================================== */

    function updateScrollEffect(){

        const rect =
            hero.getBoundingClientRect();

        /*
         * Shrink begins when the hero starts moving
         * toward the top of the viewport.
         */
        const start =
            Math.max(
                0,
                -rect.top
            );

        const distance = 210;

        let progress =
            start / distance;

        progress =
            Math.max(
                0,
                Math.min(1, progress)
            );


        /*
         * The hero itself gets compact.
         */
        hero.style.paddingTop =
            `${38 - (30 * progress)}px`;

        hero.style.paddingBottom =
            `${18 - (10 * progress)}px`;


        /*
         * Cards shrink smoothly.
         */
        cards.forEach((card, index) => {

            const active =
                index === currentIndex;

            const scale =
                active
                    ? 1 - (.18 * progress)
                    : .78 - (.08 * progress);

            card.style.transform =
                `scale(${scale})`;

            card.style.opacity =
                active
                    ? 1
                    : .38 - (.08 * progress);

        });


        /*
         * Compact state.
         */
        if (progress >= .72){

            hero.classList.add("is-compacting");
            stickyBar.classList.add("show");

        }else{

            hero.classList.remove("is-compacting");
            stickyBar.classList.remove("show");

        }


        scrollTicking = false;

    }


    window.addEventListener(
        "scroll",
        () => {

            if (scrollTicking) return;

            scrollTicking = true;

            requestAnimationFrame(
                updateScrollEffect
            );

        },
        { passive:true }
    );


    /* =====================================================
       INITIAL
    ===================================================== */

    selectCategory(0, false);

    requestAnimationFrame(() => {

        centerCurrentCard(false);

        updateScrollEffect();

    });

});
