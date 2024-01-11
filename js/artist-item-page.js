import {
  CHOSEN_ARTIST_NAME_SESSION_KEY,
  ITEMS_SESSION_KEY,
  SELECTED_ITEM_TO_EDIT,
  EDIT_OR_ADD_MODE,
  getItemsFromLocalStorage,
} from "./constants.js";

export const getItemsForArtist = async () => {
  const artist = localStorage.getItem(CHOSEN_ARTIST_NAME_SESSION_KEY);
  const items = getItemsFromLocalStorage();

  let filterItems = items.filter((item) => item.artist === artist);

  const artistName = document.getElementById("artist-name");
  artistName.innerText = artist;

  let menuToggle = document.getElementById("menu-toggle");
  let liMenu = document.querySelector(".li-menu");
  let liItems = document.getElementById("items");
  liItems.style.cursor = "pointer";

  menuToggle.addEventListener("click", () => {
    if (liMenu.style.display === "none" || liMenu.style.display === "") {
      liMenu.style.display = "flex";
      liMenu.style.justifyContent = "space-around";
      liMenu.style.alignItems = "center";
      liMenu.style.zIndex = "9999";
      liMenu.style.position = "absolute";
      liMenu.style.width = "414px";
    } else {
      liMenu.style.display = "none";
    }
  });
  const homeBtn = document.getElementById("home");
  const itemsBtn = document.getElementById("items");
  const auctionBtn = document.getElementById("auction");
  homeBtn.addEventListener("click", () => {
    window.location.hash = "#artists";
  });
  itemsBtn.addEventListener("click", () => {
    window.location.hash = "#artist/items";
  });
  auctionBtn.addEventListener("click", () => {
    window.location.hash = "#auction";
  });

  renderCards(filterItems);
};

export const renderCards = (filterItems) => {
  const cards = document.getElementById("cards");

  filterItems.forEach((item) => {
    function formatDate(itemCreatedDate) {
      const date = new Date(itemCreatedDate);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("en-gb", options);
    }
    const formattedDate = formatDate(item.dateCreated);

    let div = document.createElement("div");
    div.innerHTML = `
      <img class="card-img-top" src="${item.image}" alt="Card image cap" style='width: 100%; height: 150px; object-fit: cover'/>
      <div class="card-body" style='padding: 15px'>
      <div class="card-main-info">
      <div class = 'left-side-img-card'><h3>${item.title}</h3>
      <span>${formattedDate}</span></div>

        <span class = "price">${item.price} $</span>
      </div>
      <p>${item.description}</p>

    </div>`;

    div.style.backgroundColor = "#FCEBD5";
    cards.append(div);

    const currentItemId = item.id;

    let buttonsSection = document.createElement("div");

    let sendToAuctionButton = document.createElement("button");
    sendToAuctionButton.innerText = "Send to Auction";
    sendToAuctionButton.style.fontFamily = "roboto";
    sendToAuctionButton.style.fontSize = "12px";
    sendToAuctionButton.style.fontWeight = "700px";
    sendToAuctionButton.style.color = "#F8F8F8";
    sendToAuctionButton.style.backgroundColor = "#1B59AC";
    sendToAuctionButton.style.padding = "6.5px 17.5px";
    sendToAuctionButton.style.boxShadow =
      "0px 1px 1px 0px rgba(0, 0, 0, 0.25);";
    sendToAuctionButton.style.borderRadius = "2px";
    sendToAuctionButton.classList.add("send-to-auction-button");

    if (item.isAuctioning) {
      sendToAuctionButton.disabled = "true";
      sendToAuctionButton.style.color = "grey";
    }

    sendToAuctionButton.addEventListener("click", () => {
      let items = getItemsFromLocalStorage();
      const updatedItems = items.map((item) => {
        if (item.id === currentItemId) {
          return {
            ...item,
            isAuctioning: !item.isAuctioning,
          };
        }
        return item;
      });

      localStorage.setItem(ITEMS_SESSION_KEY, JSON.stringify(updatedItems));

      sendToAuctionButton.disabled = "true";
      sendToAuctionButton.style.color = "grey";

      const allSendButtons = document.querySelectorAll(
        ".send-to-auction-button"
      );
      allSendButtons.forEach((button) => {
        if (button !== sendToAuctionButton) {
          button.disabled = true;
          button.style.color = "grey";
        }
      });
    });

    let publishUnpublishButton = document.createElement("button");
    publishUnpublishButton.innerText = "Publish";
    publishUnpublishButton.style.fontFamily = "roboto";
    publishUnpublishButton.style.fontSize = "12px";
    publishUnpublishButton.style.fontWeight = "700px";

    publishUnpublishButton.style.padding = "6.5px 17.5px";
    publishUnpublishButton.style.boxShadow =
      "0px 1px 1px 0px rgba(0, 0, 0, 0.25);";
    publishUnpublishButton.style.borderRadius = "2px";

    if (item.isPublished) {
      publishUnpublishButton.innerText = "Unpublish";
      publishUnpublishButton.style.color = "#F8F8F8";
      publishUnpublishButton.style.backgroundColor = "#1BAC6F";
    } else {
      publishUnpublishButton.innerText = "Publish";
      publishUnpublishButton.style.color = "#5A5A5A";
      publishUnpublishButton.style.backgroundColor = "#E5E5E5";
    }

    publishUnpublishButton.addEventListener("click", () => {
      let items = getItemsFromLocalStorage();
      const updatedItems = items.map((item) => {
        if (item.id === currentItemId) {
          return {
            ...item,
            isPublished: !item.isPublished,
          };
        }
        return item;
      });

      localStorage.setItem(ITEMS_SESSION_KEY, JSON.stringify(updatedItems));

      const updatedItem = updatedItems.find(
        (item) => item.id === currentItemId
      );

      if (updatedItem.isPublished) {
        publishUnpublishButton.innerText = "Unpublish";
        publishUnpublishButton.style.color = "#F8F8F8";
        publishUnpublishButton.style.backgroundColor = "#1BAC6F";
      } else {
        publishUnpublishButton.innerText = "Publish";
        publishUnpublishButton.style.color = "#5A5A5A";
        publishUnpublishButton.style.backgroundColor = "#E5E5E5";
      }
    });

    let modal = document.getElementById("myModal");
    let cancel = document.querySelector(".close");
    let confirm = document.querySelector(".confirm");

    let removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.style.fontFamily = "roboto";
    removeButton.style.fontSize = "12px";
    removeButton.style.fontWeight = "700px";
    removeButton.style.color = "#FCEBD5";
    removeButton.style.backgroundColor = "#D44C2E";
    removeButton.style.padding = "6.5px 17.5px";
    removeButton.style.boxShadow = "0px 1px 1px 0px rgba(0, 0, 0, 0.25);";
    removeButton.style.borderRadius = "2px";

    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.style.fontFamily = "roboto";
    editButton.style.fontSize = "12px";
    editButton.style.fontWeight = "700px";
    editButton.style.color = "#A16A5E";
    editButton.style.backgroundColor = "#FCEBD5";
    editButton.style.padding = "6.5px 17.5px";
    editButton.style.boxShadow = "0px 1px 1px 0px rgba(0, 0, 0, 0.25);";
    editButton.style.borderRadius = "2px";

    buttonsSection.append(
      sendToAuctionButton,
      publishUnpublishButton,
      removeButton,
      editButton
    );

    div.appendChild(buttonsSection);
    buttonsSection.style.backgroundColor = "#A16A5E";
    buttonsSection.style.display = "flex";
    buttonsSection.style.justifyContent = "space-between";
    buttonsSection.style.padding = "10px 17px";

    removeButton.addEventListener("click", () => {
      modal.style.display = "block";

      cancel.addEventListener("click", () => {
        modal.style.display = "none";
      });

      confirm.addEventListener("click", () => {
        let getItems = localStorage.getItem(ITEMS_SESSION_KEY);
        let items = JSON.parse(getItems);

        let removeCurrentItem = items.filter(
          (item) => item.id !== currentItemId
        );

        localStorage.setItem(
          ITEMS_SESSION_KEY,
          JSON.stringify(removeCurrentItem)
        );
        div.remove();

        modal.style.display = "none";
      });
    });

    editButton.addEventListener("click", () => {
      localStorage.setItem(SELECTED_ITEM_TO_EDIT, JSON.stringify(item));
      localStorage.setItem(EDIT_OR_ADD_MODE, "EDIT");
      window.location.hash = "#artist/edit-item";
    });
  });
};

export const addNewItem = async () => {
  const addNew = document.querySelector("#addNew");

  addNew.style.margin = "30px";
  addNew.addEventListener("click", () => {
    localStorage.setItem("mode", "ADD");
    window.location.hash = "#artist/edit-item";
  });
};
