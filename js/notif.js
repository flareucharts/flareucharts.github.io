/* =========================
   NOTIFICATION PROMPT
========================= */

const notificationPrompt =
  document.getElementById("notificationPrompt");

const enableNotifications =
  document.getElementById("enableNotifications");

const notificationContent =
  notificationPrompt?.querySelector(".notification-content");


/* =========================
   HIDE PROMPT
========================= */

function hideNotificationPrompt() {

  if (!notificationPrompt) return;

  notificationPrompt.classList.remove("show");

}


/* =========================
   SHOW PROMPT
========================= */

function showNotificationPrompt() {

  if (!notificationPrompt) return;

  /* Browser tidak support */

  if (!("Notification" in window)) {

    hideNotificationPrompt();
    return;

  }


  /* Hanya boleh muncul di HOME */

  const home =
    document.getElementById("home");

  if (
    !home ||
    !home.classList.contains("active")
  ) {

    hideNotificationPrompt();
    return;

  }


  /* Permission sudah diberikan / ditolak */

  if (
    Notification.permission !== "default"
  ) {

    hideNotificationPrompt();
    return;

  }


  notificationPrompt.classList.add("show");

}


/* =========================
   UPDATE PROMPT
========================= */

let notificationTimer = null;

function updateNotificationPrompt() {

  if (!notificationPrompt) return;


  /* Batalkan timer sebelumnya */

  if (notificationTimer) {

    clearTimeout(notificationTimer);
    notificationTimer = null;

  }


  /* Browser tidak support */

  if (!("Notification" in window)) {

    hideNotificationPrompt();
    return;

  }


  /* Permission sudah selesai */

  if (
    Notification.permission !== "default"
  ) {

    hideNotificationPrompt();
    return;

  }


  /* Harus HOME */

  const home =
    document.getElementById("home");

  if (
    !home ||
    !home.classList.contains("active")
  ) {

    hideNotificationPrompt();
    return;

  }


  /* Tampilkan setelah 2.5 detik */

  notificationTimer = setTimeout(() => {

    const currentHome =
      document.getElementById("home");

    if (
      currentHome &&
      currentHome.classList.contains("active") &&
      Notification.permission === "default"
    ) {

      showNotificationPrompt();

    }

  }, 2500);

}


/* =========================
   ENABLE NOTIFICATIONS
========================= */

if (enableNotifications) {

  enableNotifications.addEventListener(
    "click",
    async (event) => {

      /* Jangan dianggap klik luar */

      event.stopPropagation();


      if (!("Notification" in window)) {

        alert(
          "Notifications are not supported by this browser."
        );

        return;

      }


      try {

        const permission =
          await Notification.requestPermission();


        console.log(
          "Notification permission:",
          permission
        );


        /* =========================
           GRANTED
        ========================= */

        if (permission === "granted") {

          hideNotificationPrompt();


          try {

            const module =
              await import(
                "./firebase-messaging.js"
              );


            const token =
              await module.enablePushNotifications();


            console.log(
              "🔥 FCM TOKEN:",
              token
            );

          }

          catch (error) {

            console.error(
              "❌ Failed to enable FCM:",
              error
            );

          }

        }


        /* =========================
           DENIED
        ========================= */

        else if (
          permission === "denied"
        ) {

          hideNotificationPrompt();

        }

      }

      catch (error) {

        console.error(
          "Notification permission error:",
          error
        );

      }

    }
  );

}


/* =========================
   CLICK OUTSIDE CARD
========================= */

document.addEventListener(
  "click",
  (event) => {

    if (!notificationPrompt) return;


    /* Prompt sedang tidak tampil */

    if (
      !notificationPrompt.classList.contains("show")
    ) {

      return;

    }


    /*
      Kalau klik di dalam card,
      JANGAN tutup.
    */

    if (
      notificationContent &&
      notificationContent.contains(event.target)
    ) {

      return;

    }


    /*
      Selain card = tutup.
      Termasuk:
      - background prompt
      - area Home
      - area page lain
      - navbar
      - tombol lain
      - luar card
    */

    hideNotificationPrompt();

  },
  true
);


/* =========================
   PAGE CHANGE
========================= */

function checkNotificationPage() {

  const home =
    document.getElementById("home");


  if (
    !home ||
    !home.classList.contains("active")
  ) {

    hideNotificationPrompt();

    if (notificationTimer) {

      clearTimeout(notificationTimer);
      notificationTimer = null;

    }

  }

}


/* =========================
   INITIAL CHECK
========================= */

window.addEventListener(
  "load",
  () => {

    updateNotificationPrompt();

  }
);


/* =========================
   MONITOR NAVIGATION
========================= */

document.addEventListener(
  "click",
  () => {

    setTimeout(() => {

      checkNotificationPage();

    }, 50);

  }
);


/* =========================
   CHECK WHEN TAB BECOMES ACTIVE
========================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState === "visible"
    ) {

      updateNotificationPrompt();

    }

  }
);
