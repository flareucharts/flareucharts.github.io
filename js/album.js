console.log("Album JS Loaded");

const formatDate = (d) => d.replaceAll("-", ".");

const albums = {
  "youth-error": {
    title: "YOUTH ERROR",
    artist: "FLARE U",
    releaseDate: "2026-05-13",
    cover: "../images/albums/youth-error.png",
    tracklist: [
      "WAY 2 U",
      "Hyper",
      "우니까 (Don't cry)",
      "MIRACLE",
      "WOO-HOO",
      "놀이터 (Playground)"
    ]
  },

  "sweet-dream-jp": {
    title: "Sweet Dream (Japan Edition)",
    artist: "CHUEI LI YU",
    releaseDate: "2027-03-18",
    cover: "../images/albums/sweet-dream-jp.png",
    tracklist: [
      "Flower pot"
     ]
  },

  "sweet-dream": {
    title: "Sweet Dream",
    artist: "CHUEI LI YU",
    releaseDate: "2025-12-03",
    cover: "../images/albums/sweet-dream.png",
    tracklist: [
      "UxYOUxU",
      "Fresh",
      "Hello My Friend"
    ]
  }
};


// ambil slug dari URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const album = albums[slug];

if (!album) {
  document.body.innerHTML = "<h2>Album not found</h2>";
} else {
  document.getElementById("albumTitle").textContent = album.title;
  document.getElementById("albumArtist").textContent = album.artist;
  document.getElementById("albumCover").src = album.cover;
  document.getElementById("albumDate").textContent = formatDate(album.releaseDate);

  const tracklist = document.getElementById("tracklist");
  tracklist.innerHTML = "";

  album.tracklist.forEach(track => {
    tracklist.innerHTML += `<li>${track}</li>`;
  });
}