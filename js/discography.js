console.log("Discography JS Loaded");

const API_URL =
"https://script.google.com/macros/s/AKfycbwsYIjF8eJTi54N40LE7pfyT6ZJw5wGTNKK5_2j26qf6T3AsmljVklTc5CReCaz4FbvQg/exec";

fetch("https://script.google.com/macros/s/AKfycbwsYIjF8eJTi54N40LE7pfyT6ZJw5wGTNKK5_2j26qf6T3AsmljVklTc5CReCaz4FbvQg/exec")
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
    <a
      href="./album/?slug=${album.slug}"
      class="album-card"
    >

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

    </a>
  `;

});
});