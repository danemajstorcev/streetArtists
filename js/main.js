import { selectedArtist } from "./artist-home-page.js";
import { artistsForLandingPage } from "./landing-page.js";
import {
  artistsImages,
  auctionButton,
  bannerButton,
  carousel,
  deleteArtistFromLocalStorage,
} from "./visitor-home-page.js";
import {
  artists,
  checkedButton,
  filterButton,
  itemsListing,
  itemTypeDropdown,
  closeButton,
} from "./visitor-listings.js";
import { items } from "../data.js";
import { addNewItem, getItemsForArtist } from "./artist-item-page.js";
import { editOrAdd } from "./artist-add-new-item.js";
import { populateContentVistiorAuctionPage } from "./auction-page.js";
import { ITEMS_SESSION_KEY } from "./constants.js";

if (!localStorage.getItem(ITEMS_SESSION_KEY)) {
  localStorage.setItem(ITEMS_SESSION_KEY, JSON.stringify(items));
}

const routes = {
  "#artists": {
    template: "/artist-home-page.html",
  },
  "/": {
    template: "/index.html",
  },
  "#visitor": {
    template: "/visitor-home-page.html",
  },
  "#visitor/listing": {
    template: "/visitor-listings.html",
  },
  "#artist/items": {
    template: "/artist-item-page.html",
  },
  "#artist/edit-item": {
    template: "/artist-add-new-item.html",
  },
  "#auction": {
    template: "/auction-page.html",
  },
};

const locationHandler = async () => {
  const route = routes[location.hash] || routes["/"];
  fetch(route.template)
    .then((response) => response.text())
    .then((res) => {
      document.getElementById("content").innerHTML = res;
      switch (location.hash) {
        case "":
          artistsForLandingPage();
          break;
        case "#artists":
          selectedArtist();
          break;
        case "#visitor":
          deleteArtistFromLocalStorage();
          artistsImages();
          carousel();
          bannerButton();
          auctionButton();
          break;
        case "#visitor/listing":
          itemsListing();
          auctionButton();
          filterButton();
          checkedButton();
          itemTypeDropdown();
          artists();
          closeButton();
          break;
        case "#artist/items":
          getItemsForArtist();
          addNewItem();
          break;
        case "#artist/edit-item":
          editOrAdd();
          break;
        case "#auction":
          populateContentVistiorAuctionPage();
          break;
        default:
          break;
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

window.addEventListener("load", locationHandler);
window.addEventListener("hashchange", locationHandler);
