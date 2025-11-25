import "./index.css";
import Api from "../utils/Api.js";
import { resetValidation, settings } from "../scripts/validate.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e073259d-746e-4484-91c0-1fb71a5ff4fb",
    "Content-Type": "application/json",
  },
});

let selectedCardId = null;
let selectedCardElement = null;

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
const avatarClose = avatarModal.querySelector(".modal__close-btn");

const deleteModal = document.querySelector("#delete-modal");
const deleteCardForm = deleteModal.querySelector("form");
const deleteCancelButton = deleteModal.querySelector(".modal__cancel-btn");
const deleteCloseButton = deleteModal.querySelector(".modal__close-btn");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const isLikedButtonEl = cardElement.querySelector(".card__like-button");
  const deleteButtonEl = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // FIX: Initialize like counter display

  // Mark liked by current user
  const isLiked = data.isLiked;

  if (isLiked) isLikedButtonEl.classList.add("card__like-button_active");

  // Show delete button only if current user is the owner

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewImageCaption.textContent = data.name;
    openModal(previewModal);
  });

  isLikedButtonEl.addEventListener("click", () => {
    const currentlyLiked = isLikedButtonEl.classList.contains(
      "card__like-button_active"
    );

    api
      .changeLikeCardStatus(data._id, !currentlyLiked)
      .then((updatedCard) => {
        // FIX: Update like counter with the updated card data

        if (updatedCard.isLiked) {
          isLikedButtonEl.classList.add("card__like-button_active");
        } else {
          isLikedButtonEl.classList.remove("card__like-button_active");
        }
      })
      .catch((err) => {
        console.error("Failed to change like status:", err);
      });
  });

  deleteButtonEl.addEventListener("click", () => {
    openModal(deleteModal);
    selectedCardId = data._id;
    selectedCardElement = cardElement;
  });

  return cardElement;
}

/* ---------- Submit handlers ---------- */
function deleteCardSubmit(evt) {
  evt.preventDefault();
  evt.submitter.textContent = "Deleting...";

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCardElement.remove();
      selectedCardId = null;
      selectedCardElement = null;
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error("Failed to delete card:", err);
    })
    .finally(() => (evt.submitter.textContent = "Delete"));
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarInput.value.trim();
  if (!avatarUrl) return;

  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;

  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api
    .setUserAvatar({ avatar: avatarUrl })
    .then((updatedUser) => {
      if (profileAvatarEl) {
        profileAvatarEl.src = updatedUser.avatar;
      }
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const name = editProfileNameInput.value.trim();
  const about = editProfileDescriptionInput.value.trim();

  if (!name || !about) return;

  const submitButton = editProfileForm.querySelector(".modal__submit-btn");
  const originalText = submitButton.textContent;

  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api
    .setUserInfo({ name, about })
    .then((updatedUser) => {
      profileNameEl.textContent = updatedUser.name;
      profileDescriptionEl.textContent = updatedUser.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error("Failed to update profile:", err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const name = newPostTitleInput.value.trim();
  const link = newPostLinkInput.value.trim();

  if (!name || !link) return;

  const submitButton = newPostForm.querySelector(".modal__submit-btn");
  const originalText = submitButton.textContent;

  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api
    .addCard({ name, link })
    .then((createdCard) => {
      const cardEl = getCardElement(createdCard);
      cardsList.prepend(cardEl);
      closeModal(newPostModal);
      newPostForm.reset();
    })
    .catch((err) => {
      console.error("Failed to add new card:", err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
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
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  if (typeof resetValidation === "function") {
    resetValidation(editProfileForm, settings);
  }
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal)
);
editProfileForm.addEventListener("submit", handleEditProfileSubmit);

avatarModalBtn.addEventListener("click", () => openModal(avatarModal));
avatarForm.addEventListener("submit", handleAvatarSubmit);
avatarClose.addEventListener("click", () => closeModal(avatarModal));

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", () => closeModal(newPostModal));
newPostForm.addEventListener("submit", handleNewPostSubmit);
deleteCardForm.addEventListener("submit", deleteCardSubmit);
deleteCancelButton.addEventListener("click", () => closeModal(deleteModal));
deleteCloseButton.addEventListener("click", () => closeModal(deleteModal));
previewModalCloseButton.addEventListener("click", () =>
  closeModal(previewModal)
);

/* ---------- Initial load: get user + cards ---------- */

api
  .getAppInfo()
  .then(([cardData, userData]) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;

    cardData.forEach((card) => {
      cardsList.append(getCardElement(card));
    });
  })
  .catch((err) => {
    console.error("Failed to load app info:", err);
  });

/* ---------- Close modals on overlay click ---------- */

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});
