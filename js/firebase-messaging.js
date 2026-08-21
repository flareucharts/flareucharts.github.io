import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging.js";

import { db, firebaseApp } from "./firebase.js";


/* =========================
   FIREBASE CLOUD MESSAGING
========================= */

const messaging =
  getMessaging(firebaseApp);


/* =========================
   VAPID KEY
========================= */

const VAPID_KEY =
  "PASTE_VAPID_KEY_HERE";


/* =========================
   GET PUSH TOKEN
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
      "FCM token error:",
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
      "🔔 FOREGROUND NOTIFICATION:",
      payload
    );

  }
);