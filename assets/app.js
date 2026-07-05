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

// --- Watch ad ---
const videoModal = document.getElementById("videoModal");
const videoProgress = document.getElementById("videoProgress");
const videoCountdown = document.getElementById("videoCountdown");
const AD_DURATION_MS = 15000;

document.querySelector('[data-action="video"]').addEventListener("click", (e) => {
  const button = e.currentTarget;
  videoModal.hidden = false;
  let elapsed = 0;
  const start = Date.now();

  const tick = () => {
    elapsed = Date.now() - start;
    const pct = Math.min(100, (elapsed / AD_DURATION_MS) * 100);
    videoProgress.style.width = `${pct}%`;
    const remaining = Math.max(0, Math.ceil((AD_DURATION_MS - elapsed) / 1000));
    videoCountdown.textContent = `${remaining}s remaining`;

    if (elapsed < AD_DURATION_MS) {
      requestAnimationFrame(tick);
    } else {
      videoModal.hidden = true;
      videoProgress.style.width = "0%";
      markCompleted("video", button);
      showToast("Thanks for watching!");
    }
  };
  requestAnimationFrame(tick);
});

// --- Follow ---
document.querySelector('[data-action="follow"]').addEventListener("click", (e) => {
  const button = e.currentTarget;
  if (button.dataset.stage === "opened") {
    markCompleted("follow", button);
    showToast("Thanks for following!");
    return;
  }
  window.open("https://instagram.com/", "_blank", "noopener");
  button.dataset.stage = "opened";
  button.textContent = "Confirm";
});

// --- Share ---
document.querySelector('[data-action="share"]').addEventListener("click", async (e) => {
  const button = e.currentTarget;
  const shareData = {
    title: "Lookmaximiser",
    text: "Check this out:",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      markCompleted("share", button);
      showToast("Thanks for sharing!");
    } else {
      await navigator.clipboard.writeText(shareData.url);
      markCompleted("share", button);
      showToast("Link copied to clipboard!");
    }
  } catch (err) {
    // user cancelled the share sheet — no action taken, no penalty
  }
});

// --- Newsletter ---
const newsletterModal = document.getElementById("newsletterModal");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterCancel = document.getElementById("newsletterCancel");
let newsletterButtonRef = null;

document.querySelector('[data-action="newsletter"]').addEventListener("click", (e) => {
  newsletterButtonRef = e.currentTarget;
  newsletterModal.hidden = false;
});

newsletterCancel.addEventListener("click", () => {
  newsletterModal.hidden = true;
  newsletterForm.reset();
});

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  newsletterModal.hidden = true;
  markCompleted("newsletter", newsletterButtonRef);
  showToast("You're subscribed — welcome!");
  newsletterForm.reset();
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
