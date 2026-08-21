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

    let data = {};

    try {

        if (event.data) {

            data = event.data.json();

        }

    } catch (error) {

        console.warn(
            "FLARE U: Push payload is not JSON."
        );

        data = {

            body:
                event.data
                    ? event.data.text()
                    : ""

        };

    }


    /* =========================
       READ FCM PAYLOAD
    ========================= */

    const notification =
        data.notification || {};


    const title =
        notification.title ||
        data.title ||
        "FLARE U GLOBAL";


    const body =
        notification.body ||
        data.body ||
        "FLARE U GLOBAL has a new update.";


    const icon =
        notification.icon ||
        data.icon ||
        "/images/fglogo.jpg";


    const badge =
        notification.badge ||
        data.badge ||
        "/images/notiflogo.png";


    const url =
        data.url ||
        data.data?.url ||
        notification.click_action ||
        "/";


    /* =========================
       NOTIFICATION OPTIONS
    ========================= */

    const options = {

        body: body,


        icon: icon,


        badge: badge,


        data: {

            url: url

        },


        tag:
            data.tag ||
            "flare-u-global",


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