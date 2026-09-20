import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging.js";

import {
    getDatabase,
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import { app } from "./firebase.js";


console.log(
    "🔥 firebase-messaging.js LOADED"
);

console.log(
    "🔥 Firebase app:",
    app
);


/* =========================
   FIREBASE
========================= */

const messaging =
    getMessaging(app);

const db =
    getDatabase(app);


/* =========================
   VAPID KEY
========================= */

const VAPID_KEY =
    "BK36zAxNcBWkDDb1OXEfBKcAI-GkusvJDAbjA5GpiUCy0o-_iilhs0SxWGlwUw8km8fY3ZWkwTjh1OOpAQdYU0M";


/* =========================
   ENABLE PUSH
========================= */

export async function enablePushNotifications() {

    try {

        if (
            !("Notification" in window)
        ) {

            console.warn(
                "❌ This browser does not support notifications."
            );

            return null;

        }


        if (
            Notification.permission !==
            "granted"
        ) {

            const permission =
                await Notification.requestPermission();

            if (
                permission !== "granted"
            ) {

                console.warn(
                    "❌ Notification permission denied."
                );

                return null;

            }

        }


        const registration =
            await navigator.serviceWorker.ready;


        const token =
            await getToken(
                messaging,
                {
                    vapidKey:
                        VAPID_KEY,

                    serviceWorkerRegistration:
                        registration
                }
            );


        if (!token) {

            console.warn(
                "❌ FCM token was not generated."
            );

            return null;

        }


        console.log(
            "🔥 FCM TOKEN:",
            token
        );


        /* =========================
           SAVE TOKEN
        ========================= */

        const tokenRef =
            push(
                ref(
                    db,
                    "notificationTokens"
                )
            );


        await set(
            tokenRef,
            {
                token: token,

                createdAt:
                    Date.now(),

                active: true
            }
        );


        console.log(
            "✅ FCM TOKEN SAVED"
        );


        return token;

    }

    catch (error) {

        console.error(
            "❌ FCM ERROR:",
            error
        );

        return null;

    }

}


/* =========================
   FOREGROUND MESSAGE
========================= */

onMessage(
    messaging,
    payload => {

        console.log(
            "🔔 FCM FOREGROUND MESSAGE:",
            payload
        );


        const notification =
            payload.notification || {};

        const data =
            payload.data || {};


        /* =========================
           TITLE
        ========================= */

        const title =
            notification.title ||
            data.title ||
            "FLARE U GLOBAL";


        /* =========================
           BODY
        ========================= */

        const body =
            notification.body ||
            data.body ||
            "";


        /* =========================
           URL
        ========================= */

        const url =
            data.url ||
            "https://flareuglobal.com/";


        /* =========================
           TAG
        ========================= */

        const tag =
            data.tag ||
            (
                "flare-u-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8)
            );


        /* =========================
           ICON
        ========================= */

        const icon =
            notification.icon ||
            data.icon ||
            "/images/fglogo.jpg";


        /* =========================
           BADGE
        ========================= */

        const badge =
            notification.badge ||
            data.badge ||
            "/images/notiflogo.png";


        /* =========================
           SHOW
        ========================= */

        if (
            Notification.permission !==
            "granted"
        ) {

            console.warn(
                "⚠️ Notification permission is not granted."
            );

            return;

        }


        const notificationInstance =
            new Notification(
                title,
                {
                    body: body,

                    icon: icon,

                    badge: badge,

                    tag: tag,

                    renotify: true,

                    data: {
                        url: url
                    }
                }
            );


        notificationInstance.onclick =
            () => {

                window.focus();

                window.location.href =
                    url;

            };

    }
);


/* =========================
   TEST FCM
========================= */

window.testFCM = async function () {

    console.log(
        "🔥 TEST FCM START"
    );


    const token =
        await enablePushNotifications();


    console.log(
        "🔥 TEST FCM TOKEN:",
        token
    );

};