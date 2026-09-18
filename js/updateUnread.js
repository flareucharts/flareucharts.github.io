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
   SET DOT
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
   CHECK UPDATE
========================= */

async function checkUpdateUnread() {

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


        if (!updates.length) {

            setUpdateUnread(false);

            return;
        }


        /* =========================
           NEWEST UPDATE
        ========================= */

        updates.sort(
            (a, b) =>
                Number(b.addedAt || 0) -
                Number(a.addedAt || 0)
        );


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


    } catch (error) {

        console.error(
            "Failed to check update unread:",
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

        checkUpdateUnread();

    }
);


/* =========================
   CHECK WHEN RETURNING TO HOME
========================= */

window.addEventListener(
    "pageshow",
    () => {

        checkUpdateUnread();

    }
);