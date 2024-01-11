import { ARTISTS_SESSION_KEY, CHOSEN_ARTIST_NAME_SESSION_KEY } from "./constants.js";

export const fetchArtists = async () => {
  let response = await fetch("https://jsonplaceholder.typicode.com/users");
  let artists = await response.json();
  return artists;
};

let select;

export const artistsForLandingPage = async() => {
  let artists = await fetchArtists();
  if (artists) {
    localStorage.setItem(ARTISTS_SESSION_KEY,JSON.stringify(artists))
    artists.forEach((artist) => {
      const option = document.createElement("option");
      option.value = artist.name;
      option.textContent = artist.name;
      option.style.background = "#edd5bb";
      document.getElementById("selectArtists").append(option);
    });
  }

  select = document.getElementById("selectArtists");
  select.addEventListener("change", handleSelectChange, false);
}

const handleSelectChange = () => {
  let selectedOption = select.value;
  if (selectedOption) {
    localStorage.setItem(CHOSEN_ARTIST_NAME_SESSION_KEY, selectedOption);
    window.location.href = "#artists";
  }
};