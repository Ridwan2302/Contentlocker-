const translations = {
  en: {
    heading: "Asmetry",
    progressLabel:
      "To get the app, complete a survey from the list below. Once completed the app will immediately be unlocked and ready for download.",
    offer1: "Take a survey from CPX Research",
    offer2: "Complete a survey from BitLabs",
    offer3: "Complete a survey from Pollfish",
    start: "Complete",
    unlockLocked: "Download unlocks automatically",
    unlockReady: "Download now",
    finePrint:
      "This is our only source of revenue, and this is how we can keep the the app 100% free for all users, instead of charging you money directly.",
    lastSection: "Once completed the app will instantly be unlocked and ready for download.",
    footer: "© 2026 Lookmaximiser. All rights reserved.",
    toastDownload: "Your download has started.",
  },
  fr: {
    heading: "Asmetry",
    progressLabel:
      "Pour obtenir l'application, complétez un sondage depuis la liste ci-dessous. Une fois terminé, l'application sera immédiatement débloquée et prête à télécharger.",
    offer1: "Faites un sondage de CPX Research",
    offer2: "Complétez un sondage de BitLabs",
    offer3: "Complétez un sondage de Pollfish",
    start: "Compléter",
    unlockLocked: "Le téléchargement se débloque automatiquement",
    unlockReady: "Télécharger maintenant",
    finePrint:
      "Cela constitue notre seule source de revenus, et c'est ainsi que nous pouvons garder l'application 100% gratuite pour tous les utilisateurs, plutôt que de vous facturer directement de l'argent.",
    lastSection: "Une fois terminé, l'application sera instantanément débloquée et prête à télécharger.",
    footer: "© 2026 Lookmaximiser. Tous droits réservés.",
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

function renderUnlockButton() {
  unlockButton.textContent = t(unlockButton.dataset.stage === "ready" ? "unlockReady" : "unlockLocked");
}

function renderProgress() {
  const done = Math.min(state.completed.size, state.required);
  progressBar.style.width = `${(done / state.required) * 100}%`;
}

function applyTranslations() {
  document.documentElement.lang = lang;
  document.title = t("heading");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
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

// --- Unlock / download ---
unlockButton.addEventListener("click", () => {
  if (unlockButton.dataset.stage !== "ready") return;
  const link = document.createElement("a");
  link.href = "assets/your-download.txt";
  link.download = "your-download.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast(t("toastDownload"));
});

applyTranslations();
