/* =========================
   FLARE U GLOBAL
   SERVICE WORKER
========================= */

const CACHE_NAME = "flare-u-global-v2";


/* =========================
   INSTALL
========================= */

self.addEventListener("install", event => {

    console.log(
        "FLARE U Service Worker installed."
    );

    self.skipWaiting();

});


/* =========================
   ACTIVATE
========================= */

self.addEventListener("activate", event => {

    event.waitUntil(
        self.clients.claim()
    );

});


/* =========================
   FETCH
========================= */

self.addEventListener("fetch", event => {

    /*
       Request tetap mengambil
       data dari network.

       Tidak ada cache paksa.
    */

});


/* =========================
   PUSH NOTIFICATION
========================= */

self.addEventListener("push", event => {

    let rawData = {};

    try {

        if (event.data) {
            rawData = event.data.json();
        }

    } catch (error) {

        console.warn(
            "FLARE U: Push payload is not JSON."
        );

        rawData = {
            body: event.data
                ? event.data.text()
                : ""
        };

    }


    /* =========================
       NORMALIZE FCM DATA
    ========================= */

    const fcmData =
        rawData.data || rawData;


    const notification =
        rawData.notification || {};


    /* =========================
       TITLE
    ========================= */

    const title =
        notification.title ||
        fcmData.title ||
        rawData.title ||
        "FLARE U GLOBAL";


    /* =========================
       BODY
    ========================= */

    const body =
        notification.body ||
        fcmData.body ||
        rawData.body ||
        "FLARE U GLOBAL has a new update.";


    /* =========================
       ICON
    ========================= */

    const icon =
        notification.icon ||
        fcmData.icon ||
        rawData.icon ||
        "/images/fglogo.jpg";


    /* =========================
       BADGE
    ========================= */

    const badge =
        notification.badge ||
        fcmData.badge ||
        rawData.badge ||
        "/images/notiflogo.png";


    /* =========================
       URL
    ========================= */

    const url =
        fcmData.url ||
        rawData.url ||
        notification.click_action ||
        "/";


    /* =========================
       TAG
    ========================= */

    const tag =
        fcmData.tag ||
        rawData.tag ||
        ("flare-u-" + Date.now());


    /* =========================
       LOG
    ========================= */

    console.log(
        "FLARE U PUSH DATA:",
        JSON.stringify(rawData)
    );

    console.log(
        "TITLE:",
        title
    );

    console.log(
        "BODY:",
        body
    );

    console.log(
        "TAG:",
        tag
    );


    /* =========================
       NOTIFICATION OPTIONS
    ========================= */

    const options = {

        body: body,

        icon: icon,

        badge: badge,

        data: {

            url: url,

            tag: tag

        },

        tag: tag,

        renotify: true,

        vibrate: [
            200,
            100,
            200
        ]

    };


    /* =========================
       SHOW NOTIFICATION
    ========================= */

    event.waitUntil(

        self.registration.showNotification(
            title,
            options
        )

    );

});


/* =========================
   NOTIFICATION CLICK
========================= */

self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();


        const url =
            event.notification.data?.url ||
            "/";


        event.waitUntil(

            clients.matchAll({

                type: "window",

                includeUncontrolled: true

            })

            .then(clientList => {


                /* =========================
                   USE EXISTING FLARE U TAB
                ========================= */

                for (
                    const client
                    of clientList
                ) {

                    if (
                        client.url.includes(
                            "flareuglobal.com"
                        )
                    ) {

                        if (
                            "navigate"
                            in client
                        ) {

                            client.navigate(url);

                        }

                        if (
                            "focus"
                            in client
                        ) {

                            return client.focus();

                        }

                    }

                }


                /* =========================
                   OPEN FLARE U
                ========================= */

                if (
                    clients.openWindow
                ) {

                    return clients.openWindow(
                        url
                    );

                }

            })

        );

    }
);