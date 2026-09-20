/* =========================
   FLARE U GLOBAL
   SERVICE WORKER
========================= */

const CACHE_NAME = "flare-u-global-v4";


/* =========================
   INSTALL
========================= */

self.addEventListener("install", event => {

    console.log(
        "🔥 FLARE U Service Worker installed."
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
       Network request.
       Firebase/API tetap mengambil
       data terbaru dari network.
    */

});


/* =========================
   PUSH
========================= */

self.addEventListener("push", event => {

    event.waitUntil(

        (async () => {

            let payload = {};

            try {

                if (event.data) {

                    payload =
                        event.data.json();

                }

            } catch (error) {

                console.warn(
                    "⚠️ FLARE U: Invalid push payload.",
                    error
                );

                return;

            }


            /* =========================
               PAYLOAD
            ========================= */

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
                payload.title ||
                "FLARE U GLOBAL";


            /* =========================
               BODY
            ========================= */

            const body =
                notification.body ||
                data.body ||
                payload.body ||
                "FLARE U GLOBAL has a new update.";


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
               URL
            ========================= */

            const url =
                data.url ||
                payload.url ||
                notification.click_action ||
                "https://flareuglobal.com/";


            /* =========================
               UNIQUE TAG
            ========================= */

            /*
               IMPORTANT:

               Jangan gunakan satu tag global.

               Setiap notification harus
               mempunyai tag berbeda supaya
               notification sebelumnya tidak
               digantikan.
            */

            const tag =
                data.tag ||
                payload.tag ||
                (
                    "flare-u-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 8)
                );


            /* =========================
               NOTIFICATION OPTIONS
            ========================= */

            const options = {

                body: body,

                icon: icon,

                badge: badge,

                tag: tag,

                renotify: true,

                data: {
                    url: url
                }

            };


            /* =========================
               SHOW
            ========================= */

            console.log(
                "🔔 FLARE U SHOW NOTIFICATION:",
                {
                    title,
                    body,
                    tag,
                    url
                }
            );


            await self.registration
                .showNotification(
                    title,
                    options
                );

        })()

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
            "https://flareuglobal.com/";


        event.waitUntil(

            clients.matchAll({

                type: "window",

                includeUncontrolled: true

            })

            .then(clientList => {

                /* =========================
                   EXISTING FLARE U WINDOW
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

                            return client
                                .navigate(url)
                                .then(() =>
                                    client.focus()
                                );

                        }

                        return client.focus();

                    }

                }


                /* =========================
                   OPEN NEW WINDOW
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