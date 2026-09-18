import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import { db } from "./firebase.js";


/* =========================
   CONSTANT
========================= */

const LAST_READ_KEY =
    "flareU_lastReadUpdate";


/* =========================
   SET RED DOT
========================= */

function setUpdateUnread(isUnread) {

    const sidebarDot =
        document.querySelector(
            ".update-unread-dot"
        );

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


        const updates =
            Object.entries(data)
                .map(([key, value]) => ({
                    id: key,
                    ...value
                }))
                .filter(update =>
                    update &&
                    update.id
                );


        /* =========================
           SORT NEWEST FIRST
        ========================= */

        updates.sort(
            (a, b) =>
                Number(b.addedAt || 0) -
                Number(a.addedAt || 0)
        );


        if (!updates.length) {

            setUpdateUnread(false);

            return;
        }


        /* =========================
           CHECK UNREAD
        ========================= */

        const latestUpdate =
            updates[0];

        const readId =
            localStorage.getItem(
                LAST_READ_KEY
            );

        const isUnread =
            latestUpdate.id !== readId;

        setUpdateUnread(
            isUnread
        );


        /* =========================
           RENDER
        ========================= */

        renderUpdates(
            updates
        );

        localStorage.setItem(
        LAST_READ_KEY,
        latestUpdate.id
        );

setUpdateUnread(false);


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
        document.getElementById(
            "updateList"
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

        item.dataset.updateId =
            update.id;


        item.innerHTML = `

            <button
                type="button"
                class="updated-item-toggle"
                aria-expanded="false"
            >

                <div class="updated-item-info">

                    <span class="updated-item-title">
                        ${escapeHTML(
                            update.title || ""
                        )}
                    </span>

                    <span class="updated-item-date">
                        ${formatDate(
                            update.addedAt
                        )}
                    </span>

                </div>


                <svg
                    class="updated-chevron"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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

                ${renderUpdateContent(
                    update
                )}

            </div>

        `;


        list.appendChild(
            item
        );

    });


    setupAccordion();

}


/* =========================
   CONTENT TYPE
========================= */

function renderUpdateContent(update) {

    const type =
        String(
            update.type || "web"
        )
        .toLowerCase()
        .trim();


    const link =
        String(
            update.link || ""
        )
        .trim();


    /* =========================
       X
    ========================= */

    if (type === "x") {

        return `

            <div class="updated-x-post">

                <blockquote
                    class="twitter-tweet"
                >

                    <a
                        href="${escapeAttribute(
                            link
                        )}"
                    ></a>

                </blockquote>

            </div>

        `;
    }


    /* =========================
       YOUTUBE
    ========================= */

    if (type === "youtube") {

        return `

            <div class="updated-youtube">

                <iframe
                    src="${escapeAttribute(
                        getYoutubeEmbed(link)
                    )}"
                    title="${escapeAttribute(
                        update.title || "YouTube"
                    )}"
                    frameborder="0"
                    allowfullscreen
                ></iframe>

            </div>

        `;
    }


    /* =========================
       IMAGE
    ========================= */

    if (type === "image") {

        return `

            <div class="updated-image">

                <img
                    src="${escapeAttribute(
                        link
                    )}"
                    alt="${escapeAttribute(
                        update.title || ""
                    )}"
                    loading="lazy"
                >

            </div>

        `;
    }


    /* =========================
       VIDEO
    ========================= */

    if (type === "video") {

        return `

            <div class="updated-video">

                <video
                    src="${escapeAttribute(
                        link
                    )}"
                    controls
                    playsinline
                ></video>

            </div>

        `;
    }


    /* =========================
       TEXT
    ========================= */

    if (type === "text") {

        return `

            <div class="updated-text">

                ${escapeHTML(
                    update.content || link
                )}

            </div>

        `;
    }


    /* =========================
       WEB
    ========================= */

    return `

        <div class="updated-web">

            <a
                href="${escapeAttribute(
                    link
                )}"
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


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

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


                /* =========================
                   CLOSE OTHER ITEMS
                ========================= */

                items.forEach(
                    otherItem => {

                        if (
                            otherItem === item
                        ) return;


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
                        ) return;


                        otherToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        otherContent.hidden =
                            true;

                    }
                );


                /* =========================
                   TOGGLE CURRENT
                ========================= */

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


                    /* =========================
                       LOAD X WIDGET
                    ========================= */

                    if (
                        window.twttr &&
                        window.twttr.widgets
                    ) {

                        window.twttr.widgets.load(
                            content
                        );

                    }

                }

            }
        );

    });

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadUpdates();

    }
);