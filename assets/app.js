const state = {
  completed: new Set(),
  required: 1,
};

const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const unlockButton = document.getElementById("unlockButton");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function markCompleted(offerKey, button) {
  if (state.completed.has(offerKey)) return;
  state.completed.add(offerKey);

  button.textContent = "Done";
  button.disabled = true;
  button.closest(".offer").classList.add("completed");

  const done = Math.min(state.completed.size, state.required);
  progressBar.style.width = `${(done / state.required) * 100}%`;
  progressLabel.textContent = `${done} of ${state.required} step${state.required > 1 ? "s" : ""} completed`;

  if (state.completed.size >= state.required) {
    unlockButton.disabled = false;
    unlockButton.classList.add("ready");
    unlockButton.textContent = "Download now";
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
    if (button.dataset.stage === "opened") {
      markCompleted(offerKey, button);
      showToast("Thanks for completing the survey!");
      return;
    }
    window.open(url, "_blank", "noopener");
    button.dataset.stage = "opened";
    button.textContent = "Confirm";
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
  showToast("Your download has started.");
});
