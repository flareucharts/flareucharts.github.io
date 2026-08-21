import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging.js";

import { app } from "./firebase.js";


/* =========================
   FIREBASE MESSAGING
========================= */

const messaging =
    getMessaging(app);


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

        const registration =
            await navigator.serviceWorker.ready;


        const token =
            await getToken(
                messaging,
                {
                    vapidKey: VAPID_KEY,

                    serviceWorkerRegistration:
                        registration
                }
            );


        if (!token) {

            console.warn(
                "FCM token was not generated."
            );

            return null;
        }


        console.log(
            "🔥 FCM TOKEN:",
            token
        );


        return token;

    }

    catch (error) {

        console.error(
            "❌ FCM token error:",
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
            "🔔 FCM MESSAGE:",
            payload
        );

    }
);