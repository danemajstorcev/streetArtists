import {
  CHOSEN_ARTIST_NAME_SESSION_KEY,
  getItemsFromLocalStorage,
} from "./constants.js";

export const deleteArtistFromLocalStorage = () => {
  if (localStorage.getItem(CHOSEN_ARTIST_NAME_SESSION_KEY)) {
    localStorage.removeItem(CHOSEN_ARTIST_NAME_SESSION_KEY);
  }
};

export const artistsImages = async () => {
  const carouselWrapper = document.getElementById("slides-wrapper");

  let items = getItemsFromLocalStorage();

  const leftToRightRow = createRow("left-to-right");
  const rightToLeftRow = createRow("right-to-left");

  items.forEach((item) => {
    if (item.image) {
      const imageContainer = document.createElement("div");
      imageContainer.className = "image-container";

      let img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;

      img.addEventListener("click", () => {
        window.location.href = "#visitor/listing";
      });

      imageContainer.appendChild(img);

      leftToRightRow.appendChild(imageContainer);

      let clonedContainer = imageContainer.cloneNode(true);
      let clonedImg = clonedContainer.querySelector("img");

      clonedImg.addEventListener("click", () => {
        window.location.href = "#visitor/listing";
      });
      rightToLeftRow.appendChild(clonedContainer);
    }
  });

  carouselWrapper.appendChild(leftToRightRow);
  carouselWrapper.appendChild(rightToLeftRow);
};

function createRow(className) {
  const row = document.createElement("div");
  row.className = `row ${className}`;
  return row;
}

let currentIndex = 0;

export const carousel = () => {
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const elements = document.querySelectorAll(".carousel-item");

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + elements.length) % elements.length;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % elements.length;
    updateCarousel();
  });
};

function updateCarousel() {
  const elements = document.querySelectorAll(".carousel-item");

  elements.forEach((el, index) => {
    if (index === currentIndex) {
      el.style.display = "flex";
      el.style.justifyContent = "space-around";
      el.style.alignItems = "center";
    } else {
      el.style.display = "none";
    }
  });
}

export const bannerButton = () => {
  const findMoreButton = document.getElementById("findMore");
  findMoreButton.addEventListener("click", () => {
    window.location.hash = "#visitor/listing";
  });
};
export const auctionButton = () => {
  const auctionbtn = document.getElementById("auction-link");
  auctionbtn.addEventListener("click", () => {
    window.location.hash = "#auction";
  });
};
