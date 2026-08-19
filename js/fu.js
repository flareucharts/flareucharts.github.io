/* =========================
   FLARE U DAY COUNTER
   START: 13 MAY 2026
   13 MAY = DAY 1
   BASED ON KST (UTC+9)
========================= */

function updateFUDayCounter() {

  // Current date based on Korea Standard Time
  const nowKST = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Seoul"
    })
  );

  // Starting date
  // 13 May 2026 = Day 1
  const startDate = new Date(2026, 4, 13);


  // Only compare dates
  nowKST.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);


  // Calculate difference
  const difference = Math.floor(
    (nowKST - startDate) /
    (1000 * 60 * 60 * 24)
  );


  // Starting date counts as Day 1
  const dayNumber = difference + 1;


  // Prevent negative number
  const finalDay = Math.max(dayNumber, 1);


  // 001 → 002 → ... → 099 → 100 → 101
  document.getElementById("fuDayCount").textContent =
    String(finalDay).padStart(3, "0");
}


// Run immediately
updateFUDayCounter();


// Check every minute
// This makes it update automatically after 00:00 KST.
setInterval(updateFUDayCounter, 60 * 1000);