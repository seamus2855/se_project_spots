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
const newPostInput = newPostModal.querySelector("#new-post-input");

const newPostLinkInput = newPostModal.querySelector("#new-post-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPost = document.querySelector("#new-post-input-name");
const imageLink = document.querySelector("#new-post-input");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", function () {
  newPostInput.value = newPost.textContent;
  newPostLinkInput.value = imageLink.textContent;
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
}

 closeModal(editProfileModal);

function handlenewPostSubmit(evt) {
  evt.preventDefault();
  newPost.textContent = newPostInput.value;
  imageLink.textContent = newPostLinkInput.value;
}

 closeModal(newPostModal);

 editProfileForm.addEventListener("submit", handleEditProfileSubmit);

newPostForm.addEventListener("submit", handlenewPostSubmit);
