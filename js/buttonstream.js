import { db } from "./firebase.js";
import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


const luPartyTrigger =
  document.getElementById("luPartyTrigger");

const luPartyWindow =
  document.getElementById("luPartyWindow");

const luPartyClose =
  document.getElementById("luPartyClose");

const luPartyStream =
  document.getElementById("luPartyStream");


/* =========================
   OPEN LISTENING PARTY
========================= */

luPartyTrigger.addEventListener("click", function () {

  luPartyTrigger.style.display = "none";

  luPartyWindow.style.display = "block";

});


/* =========================
   CLOSE LISTENING PARTY
========================= */

luPartyClose.addEventListener("click", function () {

  luPartyWindow.style.display = "none";

  luPartyTrigger.style.display = "flex";

});


/* =========================
   STREAM STATUS
========================= */

const streamRef =
  ref(db, "streaming");

onValue(streamRef, function (snapshot) {

  const data =
    snapshot.val();

  if (!data) {

    luPartyStream.textContent =
      "—";

    return;
  }


  const status =
    data.status || "";

  const time =
    data.time || "";


  if (
    status === "ON-AIR" &&
    time
  ) {

    luPartyStream.textContent =
      `${status} • ${time} KST`;

  }

  else if (
    status === "OFF-AIR"
  ) {

    luPartyStream.textContent =
      "OFF-AIR";

  }

  else {

    luPartyStream.textContent =
      status || "—";

  }

});