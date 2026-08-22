import {
  getDatabase,
  ref,
  onValue
} from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import { app } from "./firebase.js";


const db =
  getDatabase(app);


/* =========================
   ELEMENTS
========================= */

const luPartyTrigger =
  document.getElementById(
    "luPartyTrigger"
  );

const luPartyWindow =
  document.getElementById(
    "luPartyWindow"
  );

const luPartyClose =
  document.getElementById(
    "luPartyClose"
  );

const luPartySchedule =
  document.getElementById(
    "luPartySchedule"
  );


/* =========================
   OPEN
========================= */

luPartyTrigger?.addEventListener(
  "click",
  () => {

    luPartyTrigger.style.display =
      "none";

    luPartyWindow.style.display =
      "block";

  }
);


/* =========================
   CLOSE
========================= */

luPartyClose?.addEventListener(
  "click",
  () => {

    luPartyWindow.style.display =
      "none";

    luPartyTrigger.style.display =
      "flex";

  }
);


/* =========================
   FORMAT DATE
========================= */

function formatSchedule(
  dateString,
  time
) {

  /*
    Firebase:
    2026-08-26
  */

  const [year, month, day] =
    dateString
      .split("-")
      .map(Number);


  /*
    TODAY IN KST
  */

  const now =
    new Date();

  const kstToday =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "Asia/Seoul",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit"
      }
    )
    .format(now);


  const eventDate =
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


  /*
    TOMORROW IN KST
  */

  const tomorrow =
    new Date(
      now.getTime() +
      24 * 60 * 60 * 1000
    );

  const kstTomorrow =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "Asia/Seoul",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit"
      }
    )
    .format(tomorrow);


  let label;


  if (
    eventDate === kstToday
  ) {

    label =
      "TODAY";

  }

  else if (
    eventDate === kstTomorrow
  ) {

    label =
      "TOMORROW";

  }

  else {

    label =
      `${day}/${month}`;

  }


  return (
    label +
    " • " +
    time +
    " KST"
  );

}


/* =========================
   FIND NEXT STREAM
========================= */

function findNextStream(
  data
) {

  if (!data) return null;


  const streams =
    Object.values(data)
      .filter(
        item =>
          item.date &&
          item.time
      )
      .map(item => {

        const [year, month, day] =
          item.date
            .split("-")
            .map(Number);

        const [hour, minute] =
          item.time
            .split(":")
            .map(Number);


        /*
          KST EVENT TIME
        */

        const eventTime =
          Date.UTC(
            year,
            month - 1,
            day,
            hour - 9,
            minute
          );


        return {

          ...item,

          timestamp:
            eventTime

        };

      })
      .filter(
        item =>
          item.timestamp >=
          Date.now()
      )
      .sort(
        (a, b) =>
          a.timestamp -
          b.timestamp
      );


  return (
    streams[0] ||
    null
  );

}


/* =========================
   FIREBASE LISTENER
========================= */

onValue(
  ref(
    db,
    "streaming"
  ),

  snapshot => {

    const data =
      snapshot.val();


    const nextStream =
      findNextStream(
        data
      );


    if (
      !nextStream
    ) {

      if (
        luPartySchedule
      ) {

        luPartySchedule.textContent =
          "NO SCHEDULE ♡";

      }

      return;

    }


    if (
      luPartySchedule
    ) {

      luPartySchedule.textContent =
        formatSchedule(
          nextStream.date,
          nextStream.time
        );

    }

  }

);