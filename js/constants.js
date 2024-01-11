export const CHOSEN_ARTIST_NAME_SESSION_KEY = "artist";
export const ARTISTS_SESSION_KEY = "artists";
export const ITEMS_SESSION_KEY = "items";
export const SELECTED_ITEM_TO_EDIT = "selectedItemToEdit";
export const EDIT_OR_ADD_MODE = "mode";
export const HIGHEST_BID = "highestBid";
export const BIDDING_HISTORY = "biddingHistory";
export const DISABLE_BUTTON = "disabled";
export const AUCTIONING_TIMER = "auctioningTimer";

export const getItemsFromLocalStorage = () => {
  const getItems = localStorage.getItem(ITEMS_SESSION_KEY);
  return JSON.parse(getItems);
};
