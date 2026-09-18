import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import { db } from "./firebase.js";


/* =========================
   UPDATE UNREAD
========================= */

function updateUnreadStatus(latestUpdateId) {

    const readId =
        localStorage.getItem(
            "flareU_lastReadUpdate"
        );

    const isUnread =
        latestUpdateId &&
        latestUpdateId !== readId;

    setUpdateUnread(isUnread);
}


/* =========================
   SET RED DOT
========================= */

function setUpdateUnread(isUnread) {

    /*
     * Sidebar dot
     */
    const sidebarDot =
        document.querySelector(
            ".update-unread-dot"
        );

    /*
     * Hamburger dot
     */
    const menuDot =
        document.getElementById(
            "menuUnreadDot"
        );

    if (sidebarDot) {
        sidebarDot.hidden = !isUnread;
    }

    if (menuDot) {
        menuDot.hidden = !isUnread;
    }
}


/* =========================
   LOAD UPDATES
========================= */

async function loadUpdates() {

    try {

        const snapshot =
            await get(
                ref(db, "updates")
            );

        if (!snapshot.exists()) {

            setUpdateUnread(false);

            return;
        }


        const data =
            snapshot.val();


        /*
         * Firebase object → array
         */

        const updates =
            Object.entries(data)
                .map(([key, value]) => ({
                    id: key,
                    ...value
                }));


        /*
         * Sort newest first
         */

        updates.sort(
            (a, b) =>
                new Date(b.addedAt) -
                new Date(a.addedAt)
        );


        if (!updates.length) {

            setUpdateUnread(false);

            return;
        }


        /*
         * Update terbaru
         */

        const latestUpdate =
            updates[0];


        updateUnreadStatus(
            latestUpdate.id
        );


        /*
         * Render
         */

        renderUpdates(updates);


    } catch (error) {

        console.error(
            "Failed to load updates:",
            error
        );

    }
}


/* =========================
   RENDER UPDATES
========================= */

function renderUpdates(updates) {

    const list =
        document.querySelector(
            ".update-list"
        );

    if (!list) return;


    list.innerHTML = "";


    updates.forEach(update => {

        const item =
            document.createElement(
                "article"
            );

        item.className =
            "updated-item";


        item.innerHTML = `

            <button
                type="button"
                class="updated-item-toggle"
                aria-expanded="false"
            >

                <div class="updated-item-info">

                    <span class="updated-item-title">
                        ${update.title || ""}
                    </span>

                    <span class="updated-item-date">
                        ${formatDate(update.addedAt)}
                    </span>

                </div>

                <svg
                    class="updated-chevron"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                >

                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />

                </svg>

            </button>


            <div
                class="updated-item-content"
                hidden
            >

                ${renderUpdateContent(update)}

            </div>

        `;


        list.appendChild(item);

    });


    setupAccordion();
}


/* =========================
   CONTENT TYPE
========================= */

function renderUpdateContent(update) {

    const type =
        (update.type || "web")
            .toLowerCase();


    /* X */

    if (type === "x") {

        return `

            <div class="updated-x-post">

                <blockquote
                    class="twitter-tweet"
                >

                    <a href="${update.link}">
                    </a>

                </blockquote>

            </div>

        `;
    }


    /* YouTube */

    if (type === "youtube") {

        return `

            <div class="updated-youtube">

                <iframe
                    src="${getYoutubeEmbed(update.link)}"
                    title="${update.title || "YouTube"}"
                    frameborder="0"
                    allowfullscreen
                ></iframe>

            </div>

        `;
    }


    /* Image */

    if (type === "image") {

        return `

            <div class="updated-image">

                <img
                    src="${update.link}"
                    alt="${update.title || ""}"
                >

            </div>

        `;
    }


    /* Text */

    if (type === "text") {

        return `

            <div class="updated-text">

                ${update.content || ""}

            </div>

        `;
    }


    /* Default / Web */

    return `

        <div class="updated-web">

            <a
                href="${update.link}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Open update
            </a>

        </div>

    `;
}


/* =========================
   YOUTUBE EMBED
========================= */

function getYoutubeEmbed(url) {

    try {

        const parsed =
            new URL(url);


        let videoId = "";


        if (
            parsed.hostname.includes(
                "youtu.be"
            )
        ) {

            videoId =
                parsed.pathname
                    .replace("/", "");

        } else {

            videoId =
                parsed.searchParams.get(
                    "v"
                );

        }


        return videoId
            ? `https://www.youtube.com/embed/${videoId}`
            : url;


    } catch {

        return url;

    }
}


/* =========================
   DATE FORMAT
========================= */

function formatDate(value) {

    if (!value) return "";


    const date =
        new Date(value);


    if (Number.isNaN(
        date.getTime()
    )) {

        return value;
    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Seoul"
        }
    );

}


/* =========================
   ACCORDION
========================= */

function setupAccordion() {

    const items =
        document.querySelectorAll(
            ".updated-item"
        );


    items.forEach(item => {

        const toggle =
            item.querySelector(
                ".updated-item-toggle"
            );

        const content =
            item.querySelector(
                ".updated-item-content"
            );


        if (!toggle || !content)
            return;


        toggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    toggle.getAttribute(
                        "aria-expanded"
                    ) === "true";


                /*
                 * Close others
                 */

                items.forEach(
                    otherItem => {

                        if (
                            otherItem === item
                        )
                            return;


                        const otherToggle =
                            otherItem.querySelector(
                                ".updated-item-toggle"
                            );

                        const otherContent =
                            otherItem.querySelector(
                                ".updated-item-content"
                            );


                        if (
                            !otherToggle ||
                            !otherContent
                        )
                            return;


                        otherToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        otherContent.hidden =
                            true;

                    }
                );


                /*
                 * Toggle current
                 */

                if (isOpen) {

                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    content.hidden =
                        true;

                } else {

                    toggle.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                    content.hidden =
                        false;

                    /*
                     * X needs to be
                     * rendered after opening
                     */

                    if (
                        window.twttr &&
                        window.twttr.widgets
                    ) {

                        window.twttr.widgets
                            .load(
                                content
                            );

                    }

                }

            }
        );

    });

}


/* =========================
   MARK AS READ
========================= */

function markLatestAsRead() {

    const latest =
        document.querySelector(
            ".updated-item"
        );

    if (!latest) return;


    /*
     * The rendered list is already
     * sorted newest → oldest.
     */

    const latestTitle =
        latest.querySelector(
            ".updated-item-title"
        )?.textContent;


    if (!latestTitle) return;


    /*
     * We use Firebase ID instead
     * of title when available.
     */

    loadLatestIdForRead();

}


async function loadLatestIdForRead() {

    try {

        const snapshot =
            await get(
                ref(db, "updates")
            );


        if (!snapshot.exists())
            return;


        const data =
            snapshot.val();


        const updates =
            Object.entries(data)
                .map(([key, value]) => ({
                    id: key,
                    ...value
                }))
                .sort(
                    (a, b) =>
                        new Date(b.addedAt) -
                        new Date(a.addedAt)
                );


        if (!updates.length)
            return;


        localStorage.setItem(
            "flareU_lastReadUpdate",
            updates[0].id
        );


        setUpdateUnread(false);


    } catch (error) {

        console.error(
            "Failed to mark updates as read:",
            error
        );

    }

}


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadUpdates();

        loadLatestIdForRead();

    }
);