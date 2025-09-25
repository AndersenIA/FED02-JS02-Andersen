export function renderEditProfileModal(currentUser, onSave) {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("edit-profile-modal");

  modal.innerHTML = `
    <h2>Edit Profile</h2>
    <form class="edit-profile-form">
      <label>
        Bio:
        <textarea name="bio" placeholder="Write something about yourself...">${
          currentUser.bio || ""
        }</textarea>
      </label>
      <label>
        Profile Picture (Upload):
        <input type="file" name="profilePic" accept="image/*" />
      </label>
      <label>
        Profile Picture (URL):
        <input type="url" name="profilePicUrl" placeholder="https://example.com/image.jpg" />
      </label>
      <div class="profile-preview">
        <img src="${
          currentUser.avatar?.url || "assets/images/default-profile.jpg"
        }" 
             alt="Profile Preview" />
      </div>
      <div class="modal-buttons">
        <button type="submit" class="save-btn">Save</button>
        <button type="button" class="close-btn">Cancel</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.classList.add("blurred");

  const form = modal.querySelector(".edit-profile-form");
  const preview = modal.querySelector(".profile-preview img");
  const fileInput = form.querySelector("input[name='profilePic']");
  const urlInput = form.querySelector("input[name='profilePicUrl']");

  // Preview for uploaded file
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (preview.src = e.target.result);
      reader.readAsDataURL(file);
      urlInput.value = "";
    }
  });

  // Preview for URL
  urlInput.addEventListener("input", () => {
    if (urlInput.value) {
      preview.src = urlInput.value;
      fileInput.value = "";
    }
  });

  // Save changes
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedData = {
      bio: form.bio.value,
      avatar: { url: preview.src },
    };

    console.log("=== Modal Save ===");
    console.log("Current user:", currentUser);
    console.log("Updated data from modal:", updatedData);

    onSave(updatedData);

    overlay.remove();
    document.body.classList.remove("blurred");
  });

  // Close modal
  modal.querySelector(".close-btn").addEventListener("click", () => {
    overlay.remove();
    document.body.classList.remove("blurred");
  });

  return overlay;
}
