<</-----DISCOGRAPHY----->>

const container = document.getElementById("latest-albums");

const latestAlbums = [...albums]
  .sort((a, b) =>
    new Date(b.releaseDate.replaceAll(".", "-")) -
    new Date(a.releaseDate.replaceAll(".", "-"))
  )
  .slice(0, 3);

container.innerHTML = "";

latestAlbums.forEach(album => {
  container.innerHTML += `
    <a href="./discography/album/?slug=${album.slug}" class="music-card">

      <img src="./images/albums/${album.cover}" class="music-cover">

      <div class="music-title">${album.title}</div>
      <div class="music-sub">${album.artist}</div>

    </a>
  `;
});