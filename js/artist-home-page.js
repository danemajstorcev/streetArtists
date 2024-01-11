import {
  ARTISTS_SESSION_KEY,
  CHOSEN_ARTIST_NAME_SESSION_KEY,
  getItemsFromLocalStorage,
} from "./constants.js";

export const selectedArtist = async () => {
  const artists = localStorage.getItem(ARTISTS_SESSION_KEY);
  const data = JSON.parse(artists);

  let items = getItemsFromLocalStorage();

  let filteredData = data.filter(
    (artist) =>
      artist.name === localStorage.getItem(CHOSEN_ARTIST_NAME_SESSION_KEY)
  );
  const h1 = document.getElementById("artist-name");
  h1.innerText = filteredData[0].name;

  const artistItems = items.filter(
    (item) => item.artist === filteredData[0].name
  );

  const isAuctioning = artistItems.filter((item) => item.isAuctioning);
  if (isAuctioning.length) {
    document.querySelector(".bid-section").style.display = "block";
    document.querySelector(".current-bid").innerHTML = `$${localStorage.getItem(
      "highestBid"
    )}`;
  } else {
    document.querySelector(".bid-section").style.display = "none";
  }

  const ItemsSold = artistItems.filter((artistItem) => artistItem.dateSold);

  const totalItemsSold = document.getElementById("totalItemsSold");
  totalItemsSold.innerText = ItemsSold.length + "/" + artistItems.length;

  let sum = 0;

  const totalIncome = document.getElementById("totalIncome");
  let totalPrice = artistItems.map((el) => (sum += el.priceSold));

  totalIncome.innerText = `$${totalPrice[totalPrice.length - 1]}`;

  let chartCanvas = document.getElementById("sold-items-chart");
  const filteredChartData = items.filter(
    (artistItem) =>
      artistItem.artist === localStorage.getItem("artist") &&
      Boolean(artistItem.priceSold)
  );

  let drawnChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Amount",
          data: [],
          backgroundColor: "#a16a5e",
          hoverBackgroundColor: "#d44c2e",
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
    },
  });

  let sevenDaysBtn = document.getElementById("seven-days");
  sevenDaysBtn.addEventListener("click", () => {
    updateChart(7, filteredChartData, drawnChart);
    sevenDaysBtn.style.backgroundColor = "#d44c2e";
    fourteenDaysBtn.style.backgroundColor = "#a16a5e";
    thirtyDaysBtn.style.backgroundColor = "#a16a5e";
  });

  let fourteenDaysBtn = document.getElementById("fourteen-days");
  fourteenDaysBtn.addEventListener("click", () => {
    updateChart(14, filteredChartData, drawnChart);
    fourteenDaysBtn.style.backgroundColor = "#d44c2e";
    sevenDaysBtn.style.backgroundColor = "#a16a5e";
    thirtyDaysBtn.style.backgroundColor = "#a16a5e";
  });

  let thirtyDaysBtn = document.getElementById("thirty-days");
  thirtyDaysBtn.addEventListener("click", () => {
    updateChart(30, filteredChartData, drawnChart);
    thirtyDaysBtn.style.backgroundColor = "#d44c2e";
    sevenDaysBtn.style.backgroundColor = "#a16a5e";
    fourteenDaysBtn.style.backgroundColor = "#a16a5e";
  });

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
  const itemsBtn = document.getElementById("items");
  const auctionBtn = document.getElementById("auction");
  itemsBtn.addEventListener("click", () => {
    window.location.hash = "#artist/items";
  });
  auctionBtn.addEventListener("click", () => {
    window.location.hash = "#auction";
  });
};

export function formatDate(dateNumber) {
  const date = new Date(dateNumber);
  return date.toLocaleDateString("en-gb", { day: "numeric" });
}

export function generateDateLabels(daysAgo) {
  const arr = [];

  for (let i = 0; i < daysAgo; i++) {
    const now = new Date();

    const startDate = now.getDate();
    const relevantDate = now.setDate(startDate - i);
    const formattedDate = formatDate(relevantDate);
    arr.push(formattedDate);
  }

  return arr;
}

export function updateChart(daysAgo, filteredChartData, drawnChart) {
  const labels = generateDateLabels(daysAgo);

  const chartData = labels.map((label) => {
    let sum = 0;

    filteredChartData.forEach((el) => {
      const artistItemDateSoldFormatted = formatDate(el.dateSold);
      if (label === artistItemDateSoldFormatted) {
        sum += el.priceSold;
      }
    });
    return sum;
  });

  drawnChart.data.labels = labels;
  drawnChart.data.datasets[0].data = chartData;

  drawnChart.data.datasets[0].backgroundColor = labels.map((label) =>
    label === labels[labels.length - 1] ? "#d44c2e" : "#a16a5e"
  );

  drawnChart.update();
}
