import { itemTypes } from "../data.js";
import { ARTISTS_SESSION_KEY, getItemsFromLocalStorage } from "./constants.js";

const renderCard = (item, index) => {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.style.width = "100%";

  if (index % 2 === 0) {
    cardDiv.classList.add("even-card");
  } else {
    cardDiv.classList.add("odd-card");
  }

  cardDiv.innerHTML = `
  <div class="image-wrapper">
    <img class="card-img-top" src="${item.image}" alt="Card image cap" style='height: 166px; width: 414px; object-fit: cover'/>
    </div>
    <div class="card-body" style='padding: 15px'>
      <div class="card-main-info">
        <h2>${item.artist}</h2>
        <span>${item.price} $</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>

    </div>
  `;
  document.getElementById("cardSection").appendChild(cardDiv);
};

export const itemsListing = (selectedFilters) => {
  const cardSection = document.getElementById("cardSection");
  cardSection.innerHTML = "";

  let items = getItemsFromLocalStorage();

  if (selectedFilters) {
    const filteredItems = items.filter((item) => {
      if (selectedFilters.artist && item.artist !== selectedFilters.artist) {
        return false;
      }

      if (selectedFilters.itemName && item.title !== selectedFilters.itemName) {
        return false;
      }

      if (selectedFilters.minPrice && item.price < selectedFilters.minPrice) {
        return false;
      }

      if (selectedFilters.maxPrice && item.price > selectedFilters.maxPrice) {
        return false;
      }

      if (selectedFilters.type && item.type !== selectedFilters.type) {
        return false;
      }

      return true;
    });

    filteredItems.map((item, index) => {
      if (item.isPublished) {
        renderCard(item, index);
      }
    });
  } else {
    const publishedItems = items.filter((item) => item.isPublished === true);

    publishedItems.map((item, index) => {
      renderCard(item, index);
    });
  }
};

export const filterButton = () => {
  const cardSection = document.querySelector(".card-section");
  const filter = document.querySelector(".filters");
  const filterButton = document.querySelector(".filter-button");

  filterButton.addEventListener("click", () => {
    cardSection.style.display = "none";
    filter.style.display = "block";
    filter.classList.add("animate-slide");
    filterButton.style.display = "none";
  });
};

export const itemTypeDropdown = () => {
  itemTypes.forEach((itemType) => {
    const option = document.createElement("option");
    option.value = itemType;
    option.textContent = itemType;
    document.getElementById("selectItemTypes").append(option);
  });
};

export const checkedButton = () => {
  const checked = document.querySelector(".checked");
  const filter = document.querySelector(".filters");
  const cardSection = document.querySelector(".card-section");
  const filterButton = document.querySelector(".filter-button");
  let itemName = document.getElementById("itemTitle");
  let minPrice = document.getElementById("minPrice");
  let maxPrice = document.getElementById("maxPrice");
  const selectedtype = document.getElementById("selectItemTypes");
  const artist = document.getElementById("selectArtist");

  checked.addEventListener("click", () => {
    itemsListing({
      artist: artist.value,
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
      type: selectedtype.value,
      itemName: itemName.value,
    });
    cardSection.style.display = "block";
    filter.style.display = "none";
    filterButton.style.display = "block";
  });
};

export const artists = async () => {
  const data = localStorage.getItem(ARTISTS_SESSION_KEY);
  const artists = JSON.parse(data);
  if (artists) {
    artists.forEach((artist) => {
      const option = document.createElement("option");
      option.value = artist.name;
      option.textContent = artist.name;
      document.getElementById("selectArtist").append(option);
    });
  }
};

export const closeButton = async () => {
  const closeButton = document.querySelector("#closeButton");
  closeButton.addEventListener("click", () => {
    document.querySelector(".card-section").style.display = "block";
    document.querySelector(".filters").style.display = "none";
    document.querySelector(".filter-button").style.display = "block";
  });
};
