const luPartyTrigger =
  document.getElementById("luPartyTrigger");

const luPartyWindow =
  document.getElementById("luPartyWindow");

const luPartyClose =
  document.getElementById("luPartyClose");


/* OPEN LISTENING PARTY */

luPartyTrigger.addEventListener("click", function () {

  luPartyTrigger.style.display = "none";

  luPartyWindow.style.display = "block";

});


/* CLOSE LISTENING PARTY */

luPartyClose.addEventListener("click", function () {

  luPartyWindow.style.display = "none";

  luPartyTrigger.style.display = "flex";

});