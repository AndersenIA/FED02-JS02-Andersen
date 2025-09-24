export function renderEditProfileModal() {
  // Overlay to blur background
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  // Modal window
  const modal = document.createElement("div");
  modal.classList.add("edit-profile-modal");

  modal.innerHTML = `
    <h2>Feature Coming Soon</h2>
    <p>This feature is under development and will be available in a future update.</p>
    <div class="modal-buttons">
      <button class="close-btn">Close</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Blur the background
  document.body.classList.add("blurred");

  // Handle close
  modal.querySelector(".close-btn").addEventListener("click", () => {
    overlay.remove();
    document.body.classList.remove("blurred");
  });

  return overlay;
}
