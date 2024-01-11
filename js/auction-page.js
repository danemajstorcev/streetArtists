import {
  AUCTIONING_TIMER,
  BIDDING_HISTORY,
  CHOSEN_ARTIST_NAME_SESSION_KEY,
  DISABLE_BUTTON,
  HIGHEST_BID,
  ITEMS_SESSION_KEY,
  getItemsFromLocalStorage,
} from "./constants.js";

export const populateContentVistiorAuctionPage = () => {
  let items = getItemsFromLocalStorage();
  const currentAuctioningItems = items.filter((item) => item.isAuctioning);
  const currentAuctioningItem = currentAuctioningItems[0];

  const highestBid = document.querySelector("#highestBid");
  const biddingInput = document.querySelector("#biddingInput");
  const biddingBtn = document.querySelector("#biddingBtn");
  const biddingHistory = document.querySelector("#biddingHistory");

  const contentImg = document.querySelector(".content img");
  const contentTitle = document.querySelector(".content h4");

  contentImg.src = currentAuctioningItem.image;
  contentTitle.textContent = currentAuctioningItem.title;

  if (localStorage.getItem(HIGHEST_BID)) {
    highestBid.innerHTML = localStorage.getItem(HIGHEST_BID);
  }

  biddingInput.min = currentAuctioningItem.price / 2;
  biddingInput.value = currentAuctioningItem.price / 2;

  let storedBiddingHistory = localStorage.getItem(BIDDING_HISTORY);
  if (storedBiddingHistory) {
    biddingHistory.innerHTML = storedBiddingHistory;
  }

  if (localStorage.getItem(CHOSEN_ARTIST_NAME_SESSION_KEY)) {
    biddingBtn.disabled = true;
  }

  if (localStorage.getItem(DISABLE_BUTTON) === "true") {
    biddingBtn.disabled = true;
  }

  biddingBtn.addEventListener("click", function () {
    const tr = document.createElement("tr");
    biddingHistory.append(tr);

    highestBid.textContent = biddingInput.value;

    const td = document.createElement("td");
    td.innerHTML += `${biddingInput.value}`;
    tr.append(td);

    const formData = new FormData();
    formData.set("amount", biddingInput.value);

    fetch("https://projects.brainster.tech/bidding/api", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isBidding) {
          const td = document.createElement("td");
          tr.append(td);
          td.innerHTML += `${data.bidAmount}`;
          highestBid.textContent = data.bidAmount;
          localStorage.setItem(HIGHEST_BID, highestBid.textContent);

          biddingInput.min = data.bidAmount;
          biddingInput.value = data.bidAmount;

          const biddingHistoryHtml = biddingHistory.innerHTML;
          localStorage.setItem(BIDDING_HISTORY, biddingHistoryHtml);
        } else {
          const td = document.createElement("td");
          tr.append(td);
          td.innerHTML += "I give up!";
          biddingBtn.disabled = true;
          localStorage.setItem(DISABLE_BUTTON, "true");
          localStorage.setItem(HIGHEST_BID, highestBid.textContent);

          const biddingHistoryHtml = biddingHistory.innerHTML;
          localStorage.setItem(BIDDING_HISTORY, biddingHistoryHtml);
        }
      });
  });

  function clearAuction() {
    let currentId = currentAuctioningItem.id;

    let updatedItems = items.map((item) => {
      if (item.id === currentId) {
        return {
          ...item,
          priceSold: Number(highestBid.textContent),
          dateSold: new Date(),
          isAuctioning: false,
        };
      }
      return item;
    });

    localStorage.setItem(ITEMS_SESSION_KEY, JSON.stringify(updatedItems));
  }

  initAuctionTimer(clearAuction);
};

function initAuctionTimer(whenDone) {
  let time;
  if (localStorage.getItem(AUCTIONING_TIMER)) {
    time = localStorage.getItem(AUCTIONING_TIMER);
  } else {
    time = 120;
  }

  const contentTimer = document.querySelector(".content h2");
  const biddingBtn = document.querySelector("#biddingBtn");
  contentTimer.textContent = formatTime(time);

  const intervalId = setInterval(() => {
    time -= 1;
    localStorage.setItem(AUCTIONING_TIMER, time);
    contentTimer.textContent = formatTime(time);

    if (time == 0) {
      clearInterval(intervalId);
      whenDone();
      localStorage.removeItem(AUCTIONING_TIMER);
      localStorage.removeItem(HIGHEST_BID);
      localStorage.removeItem(BIDDING_HISTORY);
      localStorage.removeItem(DISABLE_BUTTON);
      biddingInput.disabled = true;
      biddingBtn.disabled = true;
    }
  }, 1000);

  biddingBtn.addEventListener("click", () => {
    time = time + 60;
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
