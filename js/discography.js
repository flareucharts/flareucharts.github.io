fetch(API_URL)
.then(res => res.json())
.then(data => {

  const albums = data.discography
    .sort((a,b)=>
      new Date(b.releaseDate) -
      new Date(a.releaseDate)
    );

  const container =
    document.getElementById("discography");

  container.innerHTML = "";

  albums.forEach(album => {

    container.innerHTML += `
      <div class="album-card">
        <img src="${album.cover}">

        <div class="album-info">
          <div class="album-title">
            ${album.title}
          </div>

          <div class="album-artist">
            ${album.artist}
          </div>

          <div class="album-date">
            ${album.releaseDate.replaceAll("-",".")}
          </div>
        </div>
      </div>
    `;
  });

});