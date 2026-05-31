<script>
const sheetURL =
"https://script.google.com/macros/s/AKFYCBxxxxxxxxxxxxxxxx/exec";

fetch(sheetURL)
.then(res => res.json())
.then(data => {

  const container =
    document.getElementById("discography");

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

})
.catch(error => {

  document.getElementById("discography")
    .innerHTML =
      "<div class='loading'>Failed to load albums</div>";

  console.error(error);

});
</script>