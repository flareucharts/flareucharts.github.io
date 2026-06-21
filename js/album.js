console.log("Album JS Loaded");

// ambil slug dari URL
const pathParts = window.location.pathname.split("/");

// ambil bagian terakhir URL
const slug = pathParts[pathParts.length - 1];

const album = ALBUMS.find(a => a.slug === slug);

if (!album) {
  document.body.innerHTML = "<h1>Album not found</h1>";
}

document.getElementById("albumTitle").innerText = album.title;
document.getElementById("albumArtist").innerText = album.artist;
document.getElementById("albumCover").src = `../../images/albums/${album.cover}`;

const tracklist = document.getElementById("tracklist");

tracklist.innerHTML = "";

album.tracklist.forEach((t, i) => {
  tracklist.innerHTML += `
    <div class="track">
      <span>${i + 1}.</span> ${t}
    </div>
  `;
});