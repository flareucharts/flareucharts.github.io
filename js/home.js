console.log("Home JS Loaded");

const container = document.getElementById("discographyScroll");

const top3 = [...window.discography]
  .sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate))
  .slice(0, 3);

container.innerHTML = "";

top3.forEach(album => {
  container.innerHTML += `
    <a href="./albums/index.html?slug=${album.slug}" class="music-card">

      <img src="./images/albums/${album.cover}" class="music-cover">

      <div class="music-title">${album.title}</div>
      <div class="music-sub">${album.artist}</div>

    </a>
  `;
});