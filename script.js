// ========================================
// PRIMA FITNESS CLUB — TRIAL INVITATION
// ========================================

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSemuJxc7TC7dRVGNmSC9sgX99qY2gkb9ECRJYomlRoII1lwPg/formResponse";

const ENTRY_NAME = "entry.964726218";
const ENTRY_WHATSAPP = "entry.1194023553";
const ENTRY_GUEST_COUNT = "entry.1804860749";


// ----------------------------------------
// 1. PERSONALIZED GUEST NAME
// ----------------------------------------

const params = new URLSearchParams(window.location.search);
let guestName = params.get("to") || "GUEST";

guestName = guestName.trim();

if (guestName.toUpperCase() !== "GUEST") {
  // Optional convenience: ?to=Febri-Al-Hafis
  // becomes "Febri Al Hafis".
  if (!guestName.includes(" ") && guestName.includes("-")) {
    guestName = guestName.replace(/-/g, " ");
  }

  guestName = guestName
    .split(/\s+/)
    .map(word => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const guestNameEl = document.getElementById("guestName");
const formNameEl = document.getElementById("formName");
const thankYouNameEl = document.getElementById("thankYouName");

guestNameEl.textContent = guestName;
formNameEl.value = guestName;
thankYouNameEl.textContent = guestName;


// ----------------------------------------
// 2. PAGE LOADER
// ----------------------------------------

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("pageLoader").classList.add("hide");
  }, 450);
});


// ----------------------------------------
// 3. MENU
// ----------------------------------------

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuBtn.classList.toggle("active", open);
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});


// ----------------------------------------
// 4. OPEN INVITATION
// ----------------------------------------

document.getElementById("openInvitation").addEventListener("click", () => {
  document.getElementById("details").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});


// ----------------------------------------
// 5. MODAL HELPERS
// ----------------------------------------

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.active")) {
    document.body.classList.remove("modal-open");
  }
}

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    closeModal(button.dataset.close);
  });
});

document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click", () => {
    closeModal(backdrop.parentElement.id);
  });
});


// ----------------------------------------
// 6. RSVP FLOW
// ----------------------------------------

document.getElementById("rsvpButton").addEventListener("click", () => {
  openModal("rsvpModal");
});

document.getElementById("attendBtn").addEventListener("click", () => {
  closeModal("rsvpModal");
  formNameEl.value = guestName;
  openModal("formModal");
});

document.getElementById("declineBtn").addEventListener("click", () => {
  closeModal("rsvpModal");
  openModal("declineModal");
});


// ----------------------------------------
// 7. GOOGLE FORM SUBMISSION
// Uses a hidden iframe so the visitor stays
// on the invitation website.
// ----------------------------------------

const rsvpForm = document.getElementById("rsvpForm");
const googleFrame = document.getElementById("googleFormFrame");

rsvpForm.addEventListener("submit", event => {
  event.preventDefault();

  const whatsapp = document.getElementById("whatsapp").value.trim();
  const guestCount = document.getElementById("guestCount").value;

  if (!whatsapp || !guestCount) {
    rsvpForm.reportValidity();
    return;
  }

  // Create a temporary native form.
  const submitForm = document.createElement("form");
  submitForm.method = "POST";
  submitForm.action = GOOGLE_FORM_ACTION;
  submitForm.target = "googleFormFrame";
  submitForm.style.display = "none";

  const fields = {
    [ENTRY_NAME]: guestName,
    [ENTRY_WHATSAPP]: whatsapp,
    [ENTRY_GUEST_COUNT]: guestCount
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    submitForm.appendChild(input);
  });

  document.body.appendChild(submitForm);
  submitForm.submit();
  submitForm.remove();

  // Google Forms does not expose a normal browser response
  // here because submission happens inside the hidden iframe.
  // Give the request a moment, then show confirmation.
  closeModal("formModal");

  setTimeout(() => {
    rsvpForm.reset();
    formNameEl.value = guestName;
    openModal("thankYouModal");
  }, 650);
});


// ----------------------------------------
// 8. COUNTDOWN
// Event starts: 20 September 2026, 07:00
// ----------------------------------------

const eventDate = new Date("2026-09-20T07:00:00+07:00").getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = eventDate - now;

  if (distance <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor(
    (distance % (1000 * 60)) / 1000
  );

  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
