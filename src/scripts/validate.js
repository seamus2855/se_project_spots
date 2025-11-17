export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Helper function to find the error element
const getErrorElement = (formEl, inputElement) => {
  const errorMsgID = `${inputElement.id}-error`;
  return formEl.querySelector(`#${errorMsgID}`);
};

// Show a validation error and set ARIA attributes
const showInputError = (formEl, inputElement, errorMsg, config) => {
  const errorMsgEl = getErrorElement(formEl, inputElement);
  if (errorMsgEl) {
    errorMsgEl.textContent = errorMsg;
    errorMsgEl.classList.add(config.errorClass);
    inputElement.classList.add(config.inputErrorClass);
    inputElement.setAttribute('aria-invalid', 'true');
    inputElement.setAttribute('aria-describedby', `${inputElement.id}-error`);
  }
};

// Hide a validation error and remove ARIA attributes
const hideInputError = (formEl, inputElement, config) => {
  const errorMsgEl = getErrorElement(formEl, inputElement);
  if (errorMsgEl) {
    errorMsgEl.textContent = "";
    errorMsgEl.classList.remove(config.errorClass);
    inputElement.classList.remove(config.inputErrorClass);
    inputElement.removeAttribute('aria-invalid');
    inputElement.removeAttribute('aria-describedby');
  }
};

// Check a single input's validity
const checkInputValidity = (formEl, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(formEl, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formEl, inputElement, config);
  }
};

// Check if any input in a list is invalid
const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

// Toggle the disabled state of the submit button
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

// Reset the validation state for a form
export const resetValidation = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  inputList.forEach((input) => hideInputError(formEl, input, config));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonEl, config);
};

// Disable a button and apply the inactive class
export const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

// Set up event listeners for a specific form using event delegation
const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  formEl.addEventListener("input", function (event) {
    if (event.target.matches(config.inputSelector)) {
      checkInputValidity(formEl, event.target, config);
      toggleButtonState(inputList, buttonElement, config);
    }
  });

  // Re-check button state on form reset
  formEl.addEventListener("reset", () => {
    // A small timeout is necessary to ensure the browser has finished resetting the form state
    setTimeout(() => toggleButtonState(inputList, buttonElement, config), 0);
  });
};

// Enable validation for all forms matching the selector
export const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
