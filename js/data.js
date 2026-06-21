console.log("Data Loaded");

function makeSlug(title){
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/(^-|-$)/g,"");
}

window.discography = [
  {
    albumType: "1st Mini Album",
    title: "YOUTH ERROR",
    artist: "FLARE U",
    releaseDate: "2026-05-13",
    cover: "youth-error.png",
    spotify: "",
    apple: "",
    youtubeMusic: "",
    melon: "",
    genie: "",
    bugs: "",
    tracks: "WAY 2 U|Hyper|우니까 (Don't cry)|MIRACLE|WOO-HOO|놀이터 (Playground)"
  },

  {
    albumType: "Single Album",
    title: "Sweet Dream (Japan Edition)",
    artist: "CHUEI LI YU",
    releaseDate: "2026-03-18",
    cover: "sweet-dream-jp.png",
    spotify: "",
    apple: "",
    youtubeMusic: "",
    melon: "",
    genie: "",
    bugs: "",
    tracks: "Flower pot"
  },

  {
    albumType: "Single Album",
    title: "Sweet Dream",
    artist: "CHUEI LI YU",
    releaseDate: "2025-12-03",
    cover: "sweet-dream.png",
    spotify: "",
    apple: "",
    youtubeMusic: "",
    melon: "",
    genie: "",
    bugs: "",
    tracks: "UxYOUxU|Fresh|안녕 My Friend"
  }
];

window.discography = window.discography.map(a => ({
  ...a,
  slug: makeSlug(a.title)
}));