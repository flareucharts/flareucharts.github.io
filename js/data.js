console.log("Data Loaded");

function makeSlug(title){
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/(^-|-$)/g,"");
}

window.discography = [
{
    albumType: "1st Mini Album-JP",
    title: "YOUTH ERROR (Japan Edition)",
    artist: "FLARE U",
    releaseDate: "2026-09-09",
    cover: "youth-error-jp.png",
    spotify: "https://open.spotify.com/album/554ZAVXkeiPlgSpcpf0Mnj?si=pxyQuaqdTOaJ2YRfr0ORzA&utm_source=copy-link&sci=spotify%3Acard-config%3A66azMI3PFHmTRdB74rnyzt",
    apple: "https://music.apple.com/id/album/youth-error-ep/6768207932?ls",
    youtubeMusic: "https://music.youtube.com/playlist?list=OLAK5uy_mUvfh7t0kp-TJIJKC2YMxlmhvzvdkrD4Y&si=nrXho9TOMybLu-ow",
    melon: "https://kko.to/ts58UOQR0G",
    genie: "http://genie.co.kr/BNDGX7",
    bugs: "https://music.bugs.co.kr/album/4147378",
    tracks: "???|WAY 2 U -Japanese ver.-|Hyper -Japanese ver.-|Don't Cry -Japanese ver.-|WAY 2 U|Hyper|Don't Cry|MIRACLE|WOO-HOO|Playground",
    video: "https://youtu.be/dyxmlYXdxUs"
  },

  {
    albumType: "1st Mini Album",
    title: "YOUTH ERROR",
    artist: "FLARE U",
    releaseDate: "2026-05-13",
    cover: "youth-error.png",
    spotify: "",
    apple: "",
    youtubeMusic: "",
    melon: "",
    genie: "",
    bugs: "",
    tracks: "WAY 2 U|Hyper|우니까 (Don't cry)|MIRACLE|WOO-HOO|놀이터 (Playground)",
    video: "https://youtu.be/dyxmlYXdxUs"
  },

  {
    albumType: "Single Album",
    title: "Sweet Dream (Japan Edition)",
    artist: "CHUEI LI YU",
    releaseDate: "2026-03-18",
    cover: "sweet-dream-jp.png",
    spotify: "",
    apple: "",
    youtubeMusic: "",
    melon: "",
    genie: "",
    bugs: "",
    tracks: "Flower pot|UxYOUxU|Fresh|Hello My Friend",
    video: "https://youtu.be/ZoI7nREAwPw"
  },

  {
    albumType: "Single Album",
    title: "Sweet Dream",
    artist: "CHUEI LI YU",
    releaseDate: "2025-12-03",
    cover: "sweet-dream.png",
    spotify: "",
    apple: "",
    youtubeMusic: "",
    melon: "",
    genie: "",
    bugs: "",
    tracks: "UxYOUxU|Fresh|안녕 My Friend",
    video: "https://youtu.be/HjsyPgCO5Vk"
  }
];

window.discography = window.discography.map(a => {
  if (!a.slug) {
    a.slug = makeSlug(a.title);
  }
  return a;
});


// =========================
// SCHEDULE DATA
// =========================

window.allSchedule = [];

fetch("https://script.google.com/macros/s/AKfycbwzj_Z803mGAjpNHEUAAq5NFlDyZEV4Rzm2sipYNVxO2xski0LreN1D_kms9Jx9UQ3ASQ/exec")
  .then(res => res.json())
  .then(data => {
    window.allSchedule = data.schedule || [];

    console.log("Schedule Loaded:", window.allSchedule);

    document.dispatchEvent(
      new CustomEvent("scheduleLoaded")
    );
  })
  .catch(err => console.error(err));