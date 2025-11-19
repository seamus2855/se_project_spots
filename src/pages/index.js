import "./index.css";
import Api from "../utils/Api.js";
// Note: validation helpers may live in ../scripts/validate.js — this file previously re-exported enableValidation.
// If you have a validate.js with resetValidation/settings, you can import them here.
import { resetValidation, settings } from "../scripts/validate.js";
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e073259d-746e-4484-91c0-1fb71a5ff4fb",
    "Content-Type": "application/json",
  },
});

let currentUserId = null;

const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostButton = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostTitleInput = newPostForm.querySelector("#card-title-input");
const newPostLinkInput = newPostForm.querySelector("#card-link-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewImageCaption = previewModal.querySelector(".modal__caption");

const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

/**
 Create a card DOM element, wire up event handlers and return element.
 * Uses the currentUserId to show/hide delete button and mark liked state.
 */
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeButtonEl = cardElement.querySelector(".card__like-button");
  const deleteButtonEl = cardElement.querySelector(".card__delete-button");
  const likeCounterEl = cardElement.querySelector(".card__like-count");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  likeCounterEl.textContent = Array.isArray(data.likes) ? data.likes.length : 0;

  // mark liked by current user
  const isLiked = Array.isArray(data.likes) && data.likes.some((u) => u._id === currentUserId);
  if (isLiked) likeButtonEl.classList.add("card__like-button_active");

  // show delete if current user is the owner
  if (!data.owner || data.owner._id !== currentUserId) {
    deleteButtonEl.style.display = "none";
  }
  
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewImageCaption.textContent = data.name;
    openModal(previewModal);
  });

  likeButtonEl.addEventListener("click", () => {
    const currentlyLiked = likeButtonEl.classList.contains("card__like-button_active");
    // toggle on server
    api
      .changeLikeCardStatus(data._id, !currentlyLiked)
      .then((updatedCard) => {
        // update like counter and toggle class
        const likesCount = Array.isArray(updatedCard.likes) ? updatedCard.likes.length : 0;
        likeCounterEl.textContent = likesCount;
        if (updatedCard.likes.some((u) => u._id === currentUserId)) {
          likeButtonEl.classList.add("card__like-button_active");
        } else {
          likeButtonEl.classList.remove("card__like-button_active");
        }
      })
      .catch((err) => {
        console.error("Failed to change like status:", err);
      });
  });

  deleteButtonEl.addEventListener("click", () => {
    // confirm deletion (optional)
    if (!confirm("Delete this card?")) return;
    api
      .removeCard(data._id)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => {
        console.error("Failed to delete card:", err);
      });
  });

  return cardElement;
}

/* ---------- Submit handlers ---------- */

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarInput.value.trim();
  if (!avatarUrl) return;

  // Api.js uses setUserAvatar({ avatar })
  api
    .setUserAvatar({ avatar: avatarUrl })
    .then((updatedUser) => {
      // update avatar in UI
      if (profileAvatarEl) {
        profileAvatarEl.src = updatedUser.avatar;
      }
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
    });
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const name = editProfileNameInput.value.trim();
  const about = editProfileDescriptionInput.value.trim();

  if (!name || !about) return;

  api
    .setUserInfo({ name, about })
    .then((updatedUser) => {
      profileNameEl.textContent = updatedUser.name;
      profileDescriptionEl.textContent = updatedUser.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error("Failed to update profile:", err);
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const name = newPostTitleInput.value.trim();
  const link = newPostLinkInput.value.trim();

  if (!name || !link) return;

  api
    .addCard({ name, link })
    .then((createdCard) => {
      const cardEl = getCardElement(createdCard);
      // add to top
      cardsList.prepend(cardEl);
      closeModal(newPostModal);
      newPostForm.reset();
    })
    .catch((err) => {
      console.error("Failed to add new card:", err);
    });
}

/* ---------- Modal helpers ---------- */

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

/* ---------- Wire up buttons & forms ---------- */

editProfileBtn.addEventListener("click", function () {
  // populate form from current profile
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  // If you have a resetValidation function, call it here (optional)
  if (typeof resetValidation === "function") resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});
editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));
editProfileForm.addEventListener("submit", handleEditProfileSubmit);

avatarModalBtn.addEventListener("click", () => openModal(avatarModal));
avatarForm.addEventListener("submit", handleAvatarSubmit);

newPostButton.addEventListener("click", function () {
  newPostForm.reset();
  if (typeof resetValidation === "function") resetValidation(newPostForm, settings);
  openModal(newPostModal);
});
newPostCloseButton.addEventListener("click", () => closeModal(newPostModal));
newPostForm.addEventListener("submit", handleNewPostSubmit);

previewModalCloseButton.addEventListener("click", () => closeModal(previewModal));

/* ---------- Initial load: get user + cards ---------- */

api
  .getAppInfo()
  .then(([userData, cardData]) => {
    // Set current user ID
    currentUserId = userData._id;

    // Set profile info
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;

    // Render cards
    cardData.forEach((card) => {
      cardsList.append(getCardElement(card));
    });
  })
  .catch((err) => {
    console.error("Failed to load app info:", err);
  });
