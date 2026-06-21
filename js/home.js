<</-----DISCOGRAPHY----->>

console.log("Home JS Loaded");

const formatDate = (d) => d.replaceAll("-", ".");

const albums = [
  {
    slug: "youth-error",
    title: "YOUTH ERROR",
    artist: "FLARE U",
    releaseDate: "2026-05-13",
    cover: "youth-error.png"
  },
  {
    slug: "sweet-dream-jp",
    title: "Sweet Dream (Japan Edition)",
    artist: "CHUEI LI YU",
    releaseDate: "2027-03-18",
    cover: "sweet-dream-jp.png"
  },
  {
    slug: "sweet-dream",
    title: "Sweet Dream",
    artist: "CHUEI LI YU",
    releaseDate: "2025-12-03",
    cover: "sweet-dream.png"
  }
];

const top3 = [...albums]
  .sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate))
  .slice(0, 3);

const container = document.getElementById("discographyScroll");

container.innerHTML = "";

top3.forEach(album => {
  container.innerHTML += `
    <a href="./discography/album/?slug=${album.slug}" class="music-card">

      <img src="./images/albums/${album.cover}" class="music-cover">

      <div class="music-title">${album.title}</div>
      <div class="music-sub">${album.artist}</div>
      <div class="music-sub">${formatDate(album.releaseDate)}</div>

    </a>
  `;
});