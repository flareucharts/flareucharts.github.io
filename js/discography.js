console.log("Discography JS Loaded");

const albums = [
  {
    title: "YOUTH ERROR",
    artist: "FLARE U",
    releaseDate: "2026.05.13",
    cover: "youth-error.png"
  },

{
    title: "Sweet Dream (Japan Edition)",
    artist: "CHUEI LI YU",
    releaseDate: "2027.03.18",
    cover: "sweet-dream-jp.png"
  }

  {
    title: "Sweet Dream",
    artist: "CHUEI LI YU",
    releaseDate: "2025.12.03",
    cover: "sweet-dream.png"
  }


];

const container = document.getElementById("discography");

function renderAlbums() {
  container.innerHTML = "";

  albums.forEach(album => {
    container.innerHTML += `
      <div class="album-card">

        <img
          src="../images/albums/${album.cover}"
          alt="${album.title}"
        >

        <div class="album-info">

          <div class="album-title">
            ${album.title}
          </div>

          <div class="album-artist">
            ${album.artist}
          </div>

          <div class="album-date">
            ${album.releaseDate.replaceAll("-", ".")}
          </div>

        </div>

      </div>
    `;
  });
}

renderAlbums();