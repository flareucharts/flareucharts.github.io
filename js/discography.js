console.log("Discography JS Loaded");

const formatDate = (d) => d.replaceAll("-", ".");

window.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("discography");

  if (!container) {
    console.error("discography container not found");
    return;
  }

  const sorted = [...window.discography]
    .sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  container.innerHTML = "";

  sorted.forEach(album => {
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

});