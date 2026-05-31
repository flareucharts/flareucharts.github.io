const sheetURL =
"https://script.google.com/macros/s/AKFYCBxxxxxxxxxxxx/exec";

fetch(sheetURL)
.then(res => res.json())
.then(data => {

  data.sort(
    (a,b)=>
    new Date(b.releaseDate)
    -
    new Date(a.releaseDate)
  );

  renderDiscography(data);

  renderHomeDiscography(data);

});

function renderDiscography(data){

  const container =
    document.getElementById("discography");

  if(!container) return;

  container.innerHTML = "";

  data.forEach(album => {

    container.innerHTML += `

      <div class="album-card">

        <img
          src="${album.cover}"
          alt="${album.title}"
        >

        <div class="album-info">

          <h3>${album.title}</h3>

          <p>${album.artist}</p>

        </div>

      </div>

    `;

  });

}

function renderHomeDiscography(data){

  const container =
    document.getElementById(
      "homeDiscography"
    );

  if(!container) return;

  const latestAlbums =
    data.slice(0,3);

  container.innerHTML = "";

  latestAlbums.forEach(album => {

    container.innerHTML += `

      <div class="music-card">

        <img
          class="music-cover"
          src="${album.cover}"
        >

        <div class="music-title">
          ${album.title}
        </div>

        <div class="music-sub">
          ${album.artist}
        </div>

      </div>

    `;

  });

}