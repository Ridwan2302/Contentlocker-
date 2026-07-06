const translations = {
  en: {
    heading: "Asmetry",
    subtitle:
      "Asmetry is made by a small team with very limited resources. Survey partners are the only reason we can keep it 100% free instead of charging you directly — completing just one below genuinely helps us keep going. Thank you.",
    progressLabel: "One survey helps us keep Asmetry alive.",
    offer1: "Take a survey from CPX Research",
    offer2: "Complete a survey from BitLabs",
    offer3: "Complete a survey from Pollfish",
    start: "Complete",
    confirm: "Confirm",
    done: "Done",
    unlockLocked: "Download unlocks automatically",
    unlockReady: "Download now",
    finePrint: "No passwords. No payment details. Just one quick survey.",
    footer: "© 2026 Lookmaximiser. Built with honest offers, by design.",
    toastSurvey: "Thanks for completing the survey!",
    toastDownload: "Your download has started.",
  },
  fr: {
    heading: "Asmetry",
    subtitle:
      "Asmetry est développée par une toute petite équipe, avec très peu de moyens. Ce sont nos partenaires de sondages qui nous permettent de garder l'application 100% gratuite plutôt que de vous la facturer — en compléter un seul ci-dessous nous aide vraiment à continuer. Merci.",
    progressLabel: "Un sondage nous aide à garder Asmetry en vie.",
    offer1: "Faites un sondage de CPX Research",
    offer2: "Complétez un sondage de BitLabs",
    offer3: "Complétez un sondage de Pollfish",
    start: "Compléter",
    confirm: "Confirmer",
    done: "Terminé",
    unlockLocked: "Le téléchargement se débloque automatiquement",
    unlockReady: "Télécharger maintenant",
    finePrint: "Aucun mot de passe. Aucune information de paiement. Juste un sondage rapide.",
    footer: "© 2026 Lookmaximiser. Conçu avec des offres honnêtes.",
    toastSurvey: "Merci d'avoir complété le sondage !",
    toastDownload: "Votre téléchargement a commencé.",
  },
};

let lang = localStorage.getItem("lang") || (navigator.language.startsWith("fr") ? "fr" : "en");

const state = {
  completed: new Set(),
  required: 1,
};

const progressBar = document.getElementById("progressBar");
const unlockButton = document.getElementById("unlockButton");
const toast = document.getElementById("toast");

function t(key) {
  return translations[lang][key];
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function renderSurveyButton(button) {
  button.textContent = t(button.dataset.stage);
}

function renderUnlockButton() {
  unlockButton.textContent = t(unlockButton.dataset.stage === "ready" ? "unlockReady" : "unlockLocked");
}

function renderProgress() {
  const done = Math.min(state.completed.size, state.required);
  progressBar.style.width = `${(done / state.required) * 100}%`;
}

function applyTranslations() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll(".offer-action").forEach(renderSurveyButton);
  renderUnlockButton();
  renderProgress();
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    lang = btn.dataset.lang;
    localStorage.setItem("lang", lang);
    applyTranslations();
  });
});

function markCompleted(offerKey, button) {
  if (state.completed.has(offerKey)) return;
  state.completed.add(offerKey);

  button.dataset.stage = "done";
  renderSurveyButton(button);
  button.disabled = true;
  button.closest(".offer").classList.add("completed");

  renderProgress();

  if (state.completed.size >= state.required) {
    unlockButton.disabled = false;
    unlockButton.classList.add("ready");
    unlockButton.dataset.stage = "ready";
    renderUnlockButton();
  }
}

// --- Surveys ---
// Each survey opens the partner's real site in a new tab. In production,
// this URL would be a per-user tracking link from the survey network's
// postback API, and completion would be confirmed by that postback rather
// than a self-reported click.
document.querySelectorAll('[data-action="survey"]').forEach((button) => {
  const offerKey = button.closest(".offer").dataset.offer;
  const url = button.dataset.url;

  button.addEventListener("click", () => {
    if (button.dataset.stage === "confirm") {
      markCompleted(offerKey, button);
      showToast(t("toastSurvey"));
      return;
    }
    window.open(url, "_blank", "noopener");
    button.dataset.stage = "confirm";
    renderSurveyButton(button);
  });
});

// --- Unlock / download ---
unlockButton.addEventListener("click", () => {
  if (unlockButton.disabled) return;
  const link = document.createElement("a");
  link.href = "assets/your-download.txt";
  link.download = "your-download.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast(t("toastDownload"));
});

applyTranslations();
