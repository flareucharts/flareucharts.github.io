console.log("Discography JS Loaded");

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

const container = document.getElementById("discography");

container.innerHTML = "";

albums.forEach(album => {
  container.innerHTML += `
    <a href="./album/?slug=${album.slug}" class="album-card">

      <img src="../images/albums/${album.cover}" alt="${album.title}">

      <div class="album-info">
        <div class="album-title">${album.title}</div>
        <div class="album-artist">${album.artist}</div>
        <div class="album-date">${formatDate(album.releaseDate)}</div>
      </div>

    </a>
  `;
});