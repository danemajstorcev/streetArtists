import { itemTypes } from "../data.js";
import {
  EDIT_OR_ADD_MODE,
  ITEMS_SESSION_KEY,
  getItemsFromLocalStorage,
  SELECTED_ITEM_TO_EDIT,
  CHOSEN_ARTIST_NAME_SESSION_KEY,
} from "./constants.js";

export const editOrAdd = () => {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const type = document.getElementById("type");
  const price = document.getElementById("price");
  const imageUrl = document.getElementById("imageUrl");
  const addOrEdit = document.getElementById("addOrEdit");
  const cancelButton = document.getElementById("cancelButton");
  const snapShotBtn = document.getElementById("snapshot-btn");
  const modal = document.getElementById("myModal");
  const close = document.querySelector(".close");
  const formContent = document.querySelector(".form-content-wrapper");
  const checkbox = document.getElementById("checkbox");
  const addOrEditText = document.getElementById("add-or-edit-item-text");
  const artistName = document.getElementById("artist-name");
  artistName.innerText = localStorage.getItem(CHOSEN_ARTIST_NAME_SESSION_KEY);
  const captureStreamCanvas = document.querySelector("#captureStream");
  const captureImageBtn = document.querySelector("#captureImageButton");
  const capturedImageImg = document.querySelector("#capturedImage");
  const liveStreamVideo = document.querySelector("#liveStream");

  const homeBtn = document.getElementById("home");
  const itemsBtn = document.getElementById("items");
  const auctionBtn = document.getElementById("auction");

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

  homeBtn.addEventListener("click", () => {
    window.location.hash = "#artists";
  });

  itemsBtn.addEventListener("click", () => {
    window.location.hash = "#artist/items";
  });

  auctionBtn.addEventListener("click", () => {
    window.location.hash = "#auction";
  });

  itemTypes.forEach((itemType) => {
    const option = document.createElement("option");
    option.value = itemType;
    option.textContent = itemType;
    option.style.background = "#a16a5e";
    document.getElementById("type").append(option);
  });

  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  if (localStorage.getItem(EDIT_OR_ADD_MODE) === "EDIT") {
    addOrEdit.innerText = "EDIT";
    addOrEditText.innerText = "Edit item";

    const stopStream = () => {
      const videoStream = liveStreamVideo.srcObject;
      if (!videoStream) {
        return;
      }

      const allTracks = videoStream.getTracks();
      allTracks.forEach((track) => track.stop());
    };

    const item = localStorage.getItem(SELECTED_ITEM_TO_EDIT);
    const itemData = JSON.parse(item);

    title.value = itemData.title;
    description.value = itemData.description;
    type.value = itemData.type;
    price.value = itemData.price;
    imageUrl.value = itemData.image;
    capturedImageImg.src = itemData.image;

    if (capturedImageImg.src) {
      document.querySelector(".snapshot").style.display = "none";
    }

    title.addEventListener("change", (event) => {
      itemData.title = event.target.value;
    });

    description.addEventListener("change", (event) => {
      itemData.description = event.target.value;
    });

    type.addEventListener("change", (event) => {
      itemData.type = event.target.value;
    });

    price.addEventListener("change", (event) => {
      itemData.price = event.target.value;
    });

    imageUrl.addEventListener("change", (event) => {
      itemData.image = event.target.value;
      capturedImageImg.src = event.target.value;
    });

    snapShotBtn.addEventListener("click", () => {
      modal.style.display = "block";
      formContent.style.display = "none";

      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
        })
        .then((stream) => {
          liveStreamVideo.srcObject = stream;
        })
        .catch((err) => {
          console.log(err);
        });

      liveStreamVideo.addEventListener("canplay", () => {
        captureStreamCanvas.width = liveStreamVideo.videoHeight;
        captureStreamCanvas.height = liveStreamVideo.videoHeight;
      });

      captureImageBtn.addEventListener("click", () => {
        capturedImageImg.src = "";
        const ctx = captureStreamCanvas.getContext("2d");
        ctx.drawImage(liveStreamVideo, 0, 0);

        const binaryImage = captureStreamCanvas.toDataURL("image/png");
        capturedImageImg.src = binaryImage;
        stopStream();
        modal.style.display = "none";
        formContent.style.display = "block";
        itemData.image = binaryImage;
        imageUrl.value = binaryImage;
      });
    });

    close.addEventListener("click", () => {
      stopStream();
      modal.style.display = "none";
      formContent.style.display = "block";
    });

    window.addEventListener("click", () => {
      if (event.target == modal) {
        modal.style.display = "none";
        stopStream();
      }
    });
    const items = getItemsFromLocalStorage();

    let updatedItems = items.map((item) => {
      if (item.id === itemData.id) {
        return itemData;
      }
      return item;
    });

    addOrEdit.addEventListener("click", () => {
      if (title.value === "") {
        alert("Please enter a title.");
        return false;
      }
      if (imageUrl.value === "" || capturedImageImg.src === "") {
        alert("Please enter a img url.");
        return false;
      }
      if (type.value === "") {
        alert("Please enter a type.");
        return false;
      }
      if (price.value === "") {
        alert("Please enter a price.");
        return false;
      }
      localStorage.setItem(ITEMS_SESSION_KEY, JSON.stringify(updatedItems));
      window.location.href = "#artist/items";
    });

    cancelButton.addEventListener("click", () => {
      window.location.href = "#artist/items";
    });
  } else {
    addOrEdit.innerText = "ADD";
    addOrEditText.innerText = "Add new item";

    const stopStream = () => {
      const videoStream = liveStreamVideo.srcObject;
      if (!videoStream) {
        return;
      }

      const allTracks = videoStream.getTracks();
      allTracks.forEach((track) => track.stop());
    };

    let items = getItemsFromLocalStorage();

    if (!capturedImageImg.src) {
      capturedImageImg.style.width = "";
    }

    let newItemData = {
      id: items.length - 1,
      title: "",
      description: "",
      type: "",
      image: "",
      price: 0,
      isPublished: false,
      dateCreated: new Date(),
      artist: localStorage.getItem("artist"),
      priceSold: 0,
    };

    snapShotBtn.addEventListener("click", () => {
      modal.style.display = "block";
      formContent.style.display = "none";

      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
        })
        .then((stream) => {
          liveStreamVideo.srcObject = stream;
        })
        .catch((err) => {
          console.log(err);
        });

      liveStreamVideo.addEventListener("canplay", () => {
        captureStreamCanvas.width = liveStreamVideo.videoHeight;
        captureStreamCanvas.height = liveStreamVideo.videoHeight;
      });

      captureImageBtn.addEventListener("click", () => {
        capturedImageImg.src = "";
        const ctx = captureStreamCanvas.getContext("2d");
        ctx.drawImage(liveStreamVideo, 0, 0);

        const binaryImage = captureStreamCanvas.toDataURL("image/png");
        capturedImageImg.src = binaryImage;

        stopStream();
        modal.style.display = "none";
        formContent.style.display = "block";
        newItemData.image = binaryImage;
        imageUrl.value = binaryImage;
        document.querySelector(".snapshot").style.display = "none";
      });
    });

    close.addEventListener("click", () => {
      stopStream();
      modal.style.display = "none";
      formContent.style.display = "block";
    });

    window.addEventListener("click", () => {
      if (event.target == modal) {
        modal.style.display = "none";
        stopStream();
      }
    });

    title.addEventListener("change", (event) => {
      newItemData.title = event.target.value;
    });

    description.addEventListener("change", (event) => {
      newItemData.description = event.target.value;
    });

    type.addEventListener("change", (event) => {
      newItemData.type = event.target.value;
    });

    price.addEventListener("change", (event) => {
      newItemData.price = event.target.value;
    });

    imageUrl.addEventListener("change", (event) => {
      newItemData.image = event.target.value;
      capturedImageImg.src = event.target.value;
    });

    checkbox.addEventListener("change", (event) => {
      newItemData.isPublished = event.target.checked;
    });

    addOrEdit.addEventListener("click", () => {
      if (title.value === "") {
        alert("Please enter a title.");
        return false;
      }
      if (imageUrl.value === "") {
        alert("Please enter a img url.");
        return false;
      }
      if (type.value === "") {
        alert("Please enter a type.");
        return false;
      }
      if (price.value === "") {
        alert("Please enter a price.");
        return false;
      }
      items.push(newItemData);
      localStorage.setItem(ITEMS_SESSION_KEY, JSON.stringify(items));
      window.location.href = "#artist/items";
    });

    cancelButton.addEventListener("click", () => {
      window.location.href = "#artist/items";
    });
  }
};
