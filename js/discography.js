console.log("Discography JS Loaded");

const API_URL =
"https://script.google.com/macros/s/AKfycbwqo3c7Mq7EQjSm5eoidLyQaQ4Q5NudHlBjvkXQlrsZuv7MHBOpS2TqG-rPav-ojj_p5w/exec";

fetch("https://script.google.com/macros/s/AKfycbwqo3c7Mq7EQjSm5eoidLyQaQ4Q5NudHlBjvkXQlrsZuv7MHBOpS2TqG-rPav-ojj_p5w/exec")
.then(res=>res.json())
.then(data=>{

  const container =
    document.getElementById(
      "discography"
    );

  const albums =
    data.discography.sort(
      (a,b)=>
      new Date(b.releaseDate) -
      new Date(a.releaseDate)
    );

  container.innerHTML = "";

  albums.forEach(album=>{

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
            ${album.releaseDate.replaceAll("-",".")}
          </div>

        </div>

      </div>
    `;

  });

});