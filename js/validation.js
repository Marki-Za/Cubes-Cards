const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGEX_PHONE = /^\+380\d{9}$/;

function validateName(value) {
  return Array.from(value.trim()).length >= 2;
}

function validateEmail(value) {
  return REGEX_EMAIL.test(value.trim());
}

function validatePhone(value) {
  return REGEX_PHONE.test(value);
}

function validateMessage(value) {
  return Array.from(value.trim()).length >= 10;
}

function validateAgreement(checked) {
  return checked;
}

function showErr(input, error, successMark, message) {
  input.setAttribute("aria-invalid", "true");
  input.classList.remove("is-valid");
  error.textContent = message;
  error.classList.remove("hidden");
  successMark.classList.add("hidden");
}

function showSuccess(input, error, successMark) {
  input.setAttribute("aria-invalid", "false");
  input.classList.add("is-valid");
  error.textContent = "";
  error.classList.add("hidden");
  successMark.classList.remove("hidden");
}

function clearError(input, error, successMark) {
  input.setAttribute("aria-invalid", "false");
  input.classList.remove("is-valid");
  error.textContent = "";
  error.classList.add("hidden");
  successMark.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const message = document.getElementById("message");
  const agreement = document.getElementById("agreement");
  const submitButton = document.getElementById("submitFeedbackBtn");
  const successModal = document.getElementById("successModal");
  const closeModalButton = document.getElementById("closeModalBtn");

  if (
    !(form instanceof HTMLFormElement) ||
    !(username instanceof HTMLInputElement) ||
    !(email instanceof HTMLInputElement) ||
    !(phone instanceof HTMLInputElement) ||
    !(message instanceof HTMLTextAreaElement) ||
    !(agreement instanceof HTMLInputElement) ||
    !(submitButton instanceof HTMLButtonElement) ||
    !(successModal instanceof HTMLElement) ||
    !(closeModalButton instanceof HTMLButtonElement)
  ) {
    console.error("Не вдалося ініціалізувати форму зворотного зв'язку: перевірте її HTML-елементи.");
    return;
  }

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const messageError = document.getElementById("messageError");
  const agreementError = document.getElementById("agreementError");
  const nameSuccess = document.querySelector('[data-success-for="username"]');
  const emailSuccess = document.querySelector('[data-success-for="email"]');
  const phoneSuccess = document.querySelector('[data-success-for="phone"]');
  const messageSuccess = document.querySelector('[data-success-for="message"]');
  const agreementSuccess = document.createElement("span");

  if (
    !(nameError instanceof HTMLElement) ||
    !(emailError instanceof HTMLElement) ||
    !(phoneError instanceof HTMLElement) ||
    !(messageError instanceof HTMLElement) ||
    !(agreementError instanceof HTMLElement) ||
    !(nameSuccess instanceof HTMLElement) ||
    !(emailSuccess instanceof HTMLElement) ||
    !(phoneSuccess instanceof HTMLElement) ||
    !(messageSuccess instanceof HTMLElement)
  ) {
    console.error("Не вдалося ініціалізувати повідомлення форми: перевірте елементи помилок та індикатори.");
    return;
  }

  const fields = [
    {
      input: username,
      error: nameError,
      successMark: nameSuccess,
      validate: () => validateName(username.value),
      errorMessage: "Введіть ім'я щонайменше з 2 символів."
    },
    {
      input: email,
      error: emailError,
      successMark: emailSuccess,
      validate: () => validateEmail(email.value),
      errorMessage: "Введіть коректну електронну адресу."
    },
    {
      input: phone,
      error: phoneError,
      successMark: phoneSuccess,
      validate: () => validatePhone(phone.value),
      errorMessage: "Введіть номер у форматі +380XXXXXXXXX."
    },
    {
      input: message,
      error: messageError,
      successMark: messageSuccess,
      validate: () => validateMessage(message.value),
      errorMessage: "Повідомлення має містити щонайменше 10 символів."
    },
    {
      input: agreement,
      error: agreementError,
      successMark: agreementSuccess,
      validate: () => validateAgreement(agreement.checked),
      errorMessage: "Потрібно погодитися з політикою конфіденційності."
    }
  ];
  const touched = new Set();
  let returnFocusElement = submitButton;

  const validateField = (field) => {
    if (field.validate()) {
      showSuccess(field.input, field.error, field.successMark);
      return true;
    }

    showErr(field.input, field.error, field.successMark, field.errorMessage);
    return false;
  };

  const normalizePhone = () => {
    const originalValue = phone.value;
    const caret = phone.selectionStart ?? originalValue.length;
    const digitsBeforeCaret = (originalValue.slice(0, caret).match(/\d/g) || []).length;
    const rawDigits = originalValue.replace(/\D/g, "");
    let digits = rawDigits;
    const hasLeadingPlus = originalValue.trimStart().startsWith("+");

    if (digits.startsWith("0")) {
      digits = `380${digits.slice(1)}`;
    }

    let normalized = digits.startsWith("380") || hasLeadingPlus
      ? `+${digits}`
      : digits;

    if (!digits && hasLeadingPlus) {
      normalized = "+";
    }

    phone.value = normalized.slice(0, 13);

    // Зберігаємо позицію курсора відносно цифр під час редагування номера.
    const prefixDigitsAdded = rawDigits.startsWith("0") && digitsBeforeCaret > 0 ? 2 : 0;
    const targetDigitCount = Math.min(digitsBeforeCaret + prefixDigitsAdded, (phone.value.match(/\d/g) || []).length);
    let targetCaret = phone.value.length;
    let seenDigits = 0;

    for (let index = 0; index < phone.value.length; index += 1) {
      if (/\d/.test(phone.value[index])) {
        seenDigits += 1;
        if (seenDigits === targetDigitCount) {
          targetCaret = index + 1;
          break;
        }
      }
    }

    phone.setSelectionRange(targetCaret, targetCaret);
  };

  fields.forEach((field) => {
    field.input.addEventListener("blur", () => {
      touched.add(field.input);
      validateField(field);
    });

    if (field.input === agreement) {
      agreement.addEventListener("change", () => {
        touched.add(agreement);
        validateField(field);
      });
      return;
    }

    if (field.input === phone) {
      phone.addEventListener("paste", (event) => {
        const pastedText = event.clipboardData?.getData("text");
        if (pastedText === undefined) {
          return;
        }

        event.preventDefault();
        const selectionStart = phone.selectionStart ?? phone.value.length;
        const selectionEnd = phone.selectionEnd ?? selectionStart;
        phone.value = `${phone.value.slice(0, selectionStart)}${pastedText}${phone.value.slice(selectionEnd)}`;
        const caretAfterPaste = selectionStart + pastedText.length;
        phone.setSelectionRange(caretAfterPaste, caretAfterPaste);
        normalizePhone();
        touched.add(phone);
        validateField(field);
      });
    }

    field.input.addEventListener("input", () => {
      if (field.input === phone) {
        normalizePhone();
      }

      if (touched.has(field.input)) {
        validateField(field);
        return;
      }

      touched.add(field.input);
      validateField(field);
    });
  });

  const openSuccessModal = () => {
    returnFocusElement = submitButton;
    submitButton.disabled = true;
    successModal.classList.remove("hidden");
    successModal.classList.add("flex");
    closeModalButton.focus();
  };

  const closeSuccessModal = () => {
    successModal.classList.add("hidden");
    successModal.classList.remove("flex");
    submitButton.disabled = false;
    returnFocusElement.focus();
  };

  successModal.addEventListener("click", (event) => {
    if (event.target === successModal) {
      closeSuccessModal();
    }
  });

  successModal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSuccessModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = successModal.querySelectorAll(
      'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  closeModalButton.addEventListener("click", closeSuccessModal);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    fields.forEach((field) => touched.add(field.input));
    const invalidFields = fields.filter((field) => !validateField(field));

    if (invalidFields.length > 0) {
      invalidFields[0].input.focus();
      return;
    }

    form.reset();
    touched.clear();
    fields.forEach((field) => clearError(field.input, field.error, field.successMark));
    openSuccessModal();
  });
});
