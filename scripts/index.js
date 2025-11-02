import { enableValidation, validationConfig } from "../scripts/validate.js";
import Api from "../src/utils/Api.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e073259d-746e-4484-91c0-1fb71a5ff4fb",
  },
  "Content-Type": "application/json",
});

api
  .getAppInfo()
  .then(([cards]) => {
    console.log(cards);
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
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
const newPostSubmitButton = newPostModal.querySelector(".modal__submit-btn");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostNameInput = document.querySelector("#post-caption-input");
const newPostImageLinkInput = document.querySelector("#post-image-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewImageCaption = previewModal.querySelector(".modal__caption");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__Form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {}
const cardElement = cardTemplate.cloneNode(true);
const cardTitleEl = cardElement.querySelector(".card__title");
const cardImageEl = cardElement.querySelector(".card__image");

cardImageEl.src = data.link;
cardImageEl.alt = data.name;
cardTitleEl.textContent = data.name;

cardImageEl.addEventListener("click", () => {
  previewImageEl.src = data.link;
  previewImageCaption.textContent = data.name;
  previewImageEl.textContent = data.name;
  resetValidation(cardImageEl, [previewImageEl, previewImageCaption]);
  openModal(previewModal);
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api.editAvatarInfo(avatarInput.value).then((data) => {});

  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  cardLikeButtonEl.addEventListener("click", () => {
    cardLikeButtonEl.classList.toggle("card__like-button_active");
  });

  const cardDeleteButtonEl = cardElement.querySelector(".card__delete-button");
  cardDeleteButtonEl.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

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

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModalBtn);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

newPostButton.addEventListener("click", function () {
  newPostForm.reset();
  resetValidation(newPostForm, settings);
  openModal(newPostModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseButton.addEventListener("click", function () {
  closeModal(previewModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((_data) => {
      profileNameEl.textContent = handleEditProfileSubmit.value;
      profileDescriptionEl.textContent = editProfileDescriptionInput.value;
      evt.target.reset();
      disableButton(handleEditProfileSubmit, settings);
      closeModal(editModal);
    })
    .catch(console.error);

  function handleNewPostSubmit(evt) {
    evt.preventDefault();
    const inputValues = {
      name: newPostNameInput.value,
      link: newPostImageLinkInput.value,
    };
    evt.target.reset();
    disableButton(newPostSubmitButton, settings);

    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);
    closeModal(newPostModal);
  }

  editProfileForm.addEventListener("submit", handleEditProfileSubmit);

  newPostForm.addEventListener("submit", handleNewPostSubmit);

  initialCards.forEach(function (item) {
    const cardElement = getCardElement(item);
    cardsList.append(cardElement);
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("mousedown", (evt) => {
      if (evt.target === modal) {
        closeModal(modal);
      }
    });
  });
}
