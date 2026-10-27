const questions = [
  {
    prompt: "Скільки гравців буде за столом?",
    answers: ["2 гравці", "3–4 гравці", "5–6 гравців", "7 або більше"]
  },
  {
    prompt: "Для кого обираємо гру?",
    answers: ["Для дітей", "Для родини", "Для друзів", "Тільки для дорослих"]
  },
  {
    prompt: "Скільки часу є на гру?",
    answers: ["До 30 хвилин", "30–60 хвилин", "1–2 години", "Часу достатньо"]
  },
  {
    prompt: "Який настрій у вашої компанії?",
    answers: ["Хочемо посміятися", "Хочемо подумати", "Хочемо діяти разом", "Шукаємо щось спокійне"]
  }
];

const recommendations = {
  "Хочемо посміятися": {
    title: "Паті-гра для веселого вечора",
    description: "Обирайте динамічні завдання, швидкі раунди та багато спілкування."
  },
  "Хочемо подумати": {
    title: "Стратегічна гра для допитливої компанії",
    description: "Спробуйте гру з плануванням і цікавими рішеннями за кожен хід."
  },
  "Хочемо діяти разом": {
    title: "Кооперативна гра для спільної пригоди",
    description: "Об’єднайте зусилля, щоб досягти спільної мети та перемогти разом."
  },
  "Шукаємо щось спокійне": {
    title: "Сімейна гра для затишного вечора",
    description: "Зверніть увагу на прості правила, дружній темп і задоволення для всіх."
  }
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);

const menuButton = document.querySelector("[data-menu-toggle]");
const primaryNavigation = document.querySelector("#primary-navigation");

if (menuButton && primaryNavigation) {
  const setMenuOpen = (isOpen) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Закрити меню" : "Відкрити меню");
    primaryNavigation.classList.toggle("is-open", isOpen);
  };

  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && window.matchMedia("(max-width: 767px)").matches) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
}

const quizContent = document.querySelector("#quiz-content");
const quizProgress = document.querySelector("#quiz-progress");
const quizProgressLabel = document.querySelector("#quiz-progress-label");
const quizStepLabel = document.querySelector("#quiz-step-label");
const quizBackButton = document.querySelector("[data-quiz-back]");
const quizNextButton = document.querySelector("[data-quiz-next]");

if (
  quizContent instanceof HTMLElement &&
  quizProgress instanceof HTMLProgressElement &&
  quizProgressLabel instanceof HTMLElement &&
  quizStepLabel instanceof HTMLElement &&
  quizBackButton instanceof HTMLButtonElement &&
  quizNextButton instanceof HTMLButtonElement
) {
  const answers = Array(questions.length).fill("");
  let currentStep = -1;

  const updateProgress = () => {
    const completedSteps = currentStep < 0 ? 0 : Math.min(currentStep, questions.length);
    quizProgress.value = completedSteps;
    quizProgressLabel.textContent = `${Math.round((completedSteps / questions.length) * 100)}%`;
    quizStepLabel.textContent = currentStep < 0
      ? `Крок 1 з ${questions.length}`
      : currentStep === questions.length
        ? "Рекомендація готова"
        : `Крок ${currentStep + 1} з ${questions.length}`;
    quizProgress.setAttribute("aria-valuetext", `${completedSteps} з ${questions.length} кроків`);
  };

  const showStart = () => {
    currentStep = -1;
    quizContent.innerHTML = `
      <p class="mb-2 text-sm font-extrabold uppercase tracking-wider text-coral-dark">Почнімо підбір</p>
      <h3 class="font-heading text-2xl font-extrabold">Готові знайти свою гру?</h3>
      <p class="mt-3 leading-7 text-text-muted">Відповідайте на 4 коротких питання, і ми підберемо тип настільної гри для вашої компанії.</p>
      <button class="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sun px-6 py-3 font-extrabold leading-tight text-navy shadow-button transition hover:-translate-y-px hover:bg-sun-hover active:translate-y-0 active:bg-sun-active focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun" type="button" data-quiz-start><span aria-hidden="true">🚀</span> Почати підбір</button>`;
    quizBackButton.disabled = true;
    quizBackButton.classList.remove("hidden");
    quizNextButton.disabled = true;
    quizNextButton.classList.remove("hidden");
    updateProgress();
  };

  const showQuestion = () => {
    const question = questions[currentStep];
    const safePrompt = escapeHtml(question.prompt);
    const options = question.answers.map((answer) => {
      const safeAnswer = escapeHtml(answer);
      const isSelected = answers[currentStep] === answer;
      return `<button class="quiz-option min-h-12 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-left font-semibold text-navy transition hover:border-navy/50 hover:bg-white focus-visible:outline-none ${isSelected ? "is-selected" : ""}" type="button" data-quiz-answer="${safeAnswer}" aria-pressed="${isSelected}">${safeAnswer}</button>`;
    }).join("");

    quizContent.innerHTML = `
      <p class="mb-2 text-sm font-extrabold uppercase tracking-wider text-coral-dark">Питання ${currentStep + 1}</p>
      <h3 class="font-heading text-2xl font-extrabold" id="current-question">${safePrompt}</h3>
      <div class="mt-5 grid gap-3" role="group" aria-labelledby="current-question">${options}</div>`;
    quizBackButton.disabled = currentStep === 0;
    quizBackButton.classList.remove("hidden");
    quizNextButton.disabled = !answers[currentStep];
    quizNextButton.classList.remove("hidden");
    updateProgress();
    quizContent.querySelector(".quiz-option")?.focus();
  };

  const showRecommendation = () => {
    const mood = answers[3];
    const recommendation = recommendations[mood];
    const summary = answers.map(escapeHtml).join(" · ");

    quizContent.innerHTML = `
      <p class="mb-2 text-sm font-extrabold uppercase tracking-wider text-coral-dark">Ваша рекомендація</p>
      <h3 class="font-heading text-2xl font-extrabold">${escapeHtml(recommendation.title)}</h3>
      <p class="mt-3 leading-7 text-text-muted">${escapeHtml(recommendation.description)}</p>
      <p class="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-text-muted"><strong class="text-navy">Ваші відповіді:</strong> ${summary}</p>
      <p class="mt-4 text-sm leading-6 text-text-muted">Квіз підказує напрямок, а конкретну гру для підписки допоможе підібрати наша команда.</p>
      <a class="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-sun px-6 py-3 font-extrabold text-navy shadow-button transition hover:-translate-y-px hover:bg-sun-hover active:translate-y-0 active:bg-sun-active focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun" href="#contact">Запитати про гру</a>`;
    quizBackButton.disabled = false;
    quizNextButton.classList.add("hidden");
    updateProgress();
    quizContent.querySelector("a")?.focus();
  };

  quizContent.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.closest("[data-quiz-start]")) {
      currentStep = 0;
      showQuestion();
      return;
    }

    const option = target.closest("[data-quiz-answer]");
    if (!(option instanceof HTMLButtonElement) || currentStep < 0 || currentStep >= questions.length) return;

    answers[currentStep] = option.dataset.quizAnswer ?? "";
    quizContent.querySelectorAll("[data-quiz-answer]").forEach((answerButton) => {
      const isSelected = answerButton === option;
      answerButton.classList.toggle("is-selected", isSelected);
      answerButton.setAttribute("aria-pressed", String(isSelected));
    });
    quizNextButton.disabled = !answers[currentStep];
  });

  quizBackButton.addEventListener("click", () => {
    if (currentStep === questions.length) {
      currentStep = questions.length - 1;
      showQuestion();
    } else if (currentStep > 0) {
      currentStep -= 1;
      showQuestion();
    } else if (currentStep === 0) {
      showStart();
    }
  });

  quizNextButton.addEventListener("click", () => {
    if (currentStep < 0 || currentStep >= questions.length || !answers[currentStep]) return;
    currentStep += 1;
    if (currentStep === questions.length) {
      showRecommendation();
    } else {
      showQuestion();
    }
  });

  updateProgress();
}

const lvivTimeWidget = document.querySelector("#time-is-widget");

if (lvivTimeWidget instanceof HTMLElement) {
  const updateLvivTime = () => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("uk-UA", {
      timeZone: "Europe/Kyiv",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(now);

    lvivTimeWidget.textContent = formatted;
  };

  updateLvivTime();
  setInterval(updateLvivTime, 1000);
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm instanceof HTMLFormElement) {
  const contactStatus = document.querySelector("#contact-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!(contactStatus instanceof HTMLElement) || !(submitButton instanceof HTMLButtonElement)) return;

    contactStatus.classList.remove("hidden", "text-coral-dark");
    contactStatus.classList.add("text-navy");
    contactStatus.textContent = "Надсилаємо повідомлення…";
    submitButton.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error(`Сервер повернув статус ${response.status}.`);
      }

      contactForm.reset();
      contactStatus.textContent = "Дякуємо! Ваше повідомлення успішно надіслано.";
    } catch (error) {
      contactStatus.classList.remove("text-navy");
      contactStatus.classList.add("text-coral-dark");
      contactStatus.textContent = "Не вдалося надіслати повідомлення. Спробуйте ще раз або напишіть нам на hello@kubyky-karty.example.";
      console.error("Contact form submission failed:", error);
    } finally {
      submitButton.disabled = false;
    }
  });
}
