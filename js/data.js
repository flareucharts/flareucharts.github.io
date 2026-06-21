console.log("Data Loaded");

// helper bikin slug otomatis
function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

window.ALBUMS = [
  {
    title: "YOUTH ERROR",
    artist: "FLARE U",
    releaseDate: "2026-05-13",
    cover: "youth-error.png",
    tracklist: [
      "WAY 2 U",
      "Hyper",
      "우니까 (Don't cry)",
      "MIRACLE",
      "WOO-HOO",
      "놀이터 (Playground)"
    ]
  },
  {
    title: "Sweet Dream (Japan Edition)",
    artist: "CHUEI LI YU",
    releaseDate: "2026-03-18",
    cover: "sweet-dream-jp.png",
    tracklist: [
      "Flower pot"
    ]
  },
  {
    title: "Sweet Dream",
    artist: "CHUEI LI YU",
    releaseDate: "2025-12-03",
    cover: "sweet-dream.png",
    tracklist: [
      "UxYOUxU",
      "Fresh",
      "Hello My Friend"
    ]
  }
];

// inject slug otomatis ke semua album
window.ALBUMS = window.ALBUMS.map(album => ({
  ...album,
  slug: makeSlug(album.title)
}));
