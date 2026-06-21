console.log("Discography JS Loaded");

const container = document.getElementById("discography");

const sorted = [...ALBUMS]
  .sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate));

container.innerHTML = "";

sorted.forEach(album => {
  container.innerHTML += `
    <a href="./albums/${album.slug}" class="album-card">

      <img src="../images/albums/${album.cover}">

      <div class="album-info">
        <div class="album-title">${album.title}</div>
        <div class="album-artist">${album.artist}</div>
        <div class="album-date">${album.releaseDate}</div>
      </div>

    </a>
  `;
});