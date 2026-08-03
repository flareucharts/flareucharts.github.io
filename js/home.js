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

  const track = document.querySelector(".upsche-track");

track.innerHTML = upcoming.map(item => {

    const date = new Date(item.date);

    return `
    <div class="upsche-slider">

        <div class="upsche-date">
            <span class="upsche-day">${date.getDate()}</span>

            <span class="upsche-month">
            ${date.toLocaleString("en-US",{
                month:"short"
            }).toUpperCase()}
            </span>

            <span class="upsche-dot">•</span>

            <span class="upsche-time">
            ${item.time}${item.tz ? ` ${item.tz}` : ""}
            </span>
        </div>

        <div class="upsche-title">
            ${item.cat} ${item.title}
        </div>

    </div>
    `;

}).join("");


document.getElementById("upsche-count").textContent =
`1 / ${upcoming.length}`;

if(upcoming.length > 1){

    const firstSlide = track.children[0].cloneNode(true);
    track.appendChild(firstSlide);

    // AUTO SLIDE
    let currentSlide = 0;

    setInterval(()=>{
        ...
    },5000);

}

const firstSlide = track.children[0].cloneNode(true);
track.appendChild(firstSlide);

// AUTO SLIDE
let currentSlide = 0;

setInterval(()=>{

    currentSlide++;

    track.scrollTo({
        left: track.clientWidth * currentSlide,
        behavior:"smooth"
    });


    if(currentSlide === upcoming.length){

        setTimeout(()=>{

            track.style.scrollBehavior = "auto";
            track.scrollLeft = 0;
            track.style.scrollBehavior = "smooth";

            currentSlide = 0;

        },600);

    }


    document.getElementById("upsche-count").textContent =
    `${currentSlide + 1 > upcoming.length ? 1 : currentSlide + 1} / ${upcoming.length}`;


},5000);


}