/* =========================
   FLARE U GLOBAL
   SERVICE WORKER
========================= */

const CACHE_NAME = "flare-u-global-v1";


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
       Untuk sekarang request tetap
       mengambil data dari network.

       Firebase, JSON, gambar, CSS,
       dan halaman tidak dicache
       secara paksa.
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

        data = {

            title: "FLARE U GLOBAL",

            body:
                event.data
                    ? event.data.text()
                    : "You have a new update."

        };

    }


    const title =
        data.title ||
        "FLARE U GLOBAL";


    const options = {

        body:
            data.body ||
            "You have a new update.",


        icon:
            data.icon ||
            "/images/fglogo.jpg",


        badge:
            data.badge ||
            "/images/fglogo.jpg",


        data: {

            url:
                data.url ||
                "/"

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