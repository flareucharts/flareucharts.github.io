console.log("Home JS Loaded");

const container = document.getElementById("discographyScroll");

const top3 = [...window.discography]
  .sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate))
  .slice(0, 5);

container.innerHTML = "";

top3.forEach(album => {
  container.innerHTML += `
    <a href="./discography/album/index.html?slug=${album.slug}" class="music-card">
      <img src="./images/albums/${album.cover}" class="music-cover">
      <div class="music-title">${album.title}</div>
      <div class="music-sub">${album.artist}</div>
    </a>
  `;
});

// =========================
// UPCOMING SCHEDULE
// =========================

document.addEventListener("scheduleLoaded", renderUpcoming);

function renderUpcoming() {

  if (!window.allSchedule.length) return;

const loading = document.querySelector(".upsche-loading");
if (loading) {
    loading.remove(); // atau loading.style.display = "none";
}

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = window.allSchedule
    .filter(item => {
      const d = new Date(item.date);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!upcoming.length) return;

  const item = upcoming[0];
  const date = new Date(item.date);

  document.querySelector(".upsche-date").innerHTML = `
  <span class="day">${date.getDate()}</span>
  <span class="month">${date.toLocaleString("en-US", {
    month: "short"
  }).toUpperCase()}</span>

  <span class="dot">•</span>

  <span class="time">
    ${item.time}${item.tz ? ` ${item.tz}` : ""}
  </span>
`;
  document.querySelector(".upsche-title").textContent =
    `${item.cat} ${item.title}`;

  document.getElementById("upsche-count").textContent =
    `1 / ${upcoming.length}`;
}