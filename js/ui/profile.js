import { renderNav } from "./nav.js";

// ui/profile.js
export function renderProfile() {
  const container = document.createElement("section");
  container.classList.add("profile-section");

  const token = localStorage.getItem("token");
  const apiKey = "f7f1efc0-1322-45ed-9e62-152f528a798a";

  if (!token) {
    window.location.hash = "#/login";
    return container;
  }

  container.innerHTML = `
    <div class="profile-info">
      <div class="profile-info-pic">
        <img class="profile-info-img" src="" alt="Profile Picture" />
      </div>
      <div class="profile-info-txt">
        <h2 class="account-username"></h2>
        <h3 class="account-name"></h3>
        <p class="account-bio"></p>
      </div>
      <button class="edit-profile-btn">Edit profile</button>
    </div>
    <div class="profile-posts"></div>
    <p class="error-msg" style="color:red;"></p>
  `;

  const profileImg = container.querySelector(".profile-info-img");
  const profileUsername = container.querySelector(".account-username");
  const profileName = container.querySelector(".account-name");
  const profileBio = container.querySelector(".account-bio");
  const editBtn = container.querySelector(".edit-profile-btn");
  const postsDiv = container.querySelector(".profile-posts");
  const errorMsg = container.querySelector(".error-msg");

  // Fetch user profile
  async function fetchProfile() {
    try {
      const res = await fetch("https://v2.api.noroff.dev/social/profiles/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      profileImg.src = data.avatar?.url || "assets/images/default-profile.png";
      profileUsername.textContent = data.name || "No username set";
      profileName.textContent = data.name || "No name set";
      profileBio.textContent = data.bio || "No bio set";

      fetchUserPosts(data.name);
    } catch (err) {
      console.error(err);
      errorMsg.textContent = err.message;
    }
  }

  // Fetch posts by user
  async function fetchUserPosts(username) {
    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/social/posts?_author=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch user posts");
      const data = await res.json();
      postsDiv.innerHTML = "";

      data.data.forEach((post) => {
        const postEl = document.createElement("div");
        postEl.classList.add("profile-post");

        postEl.innerHTML = `
          <div class="profile-post-pic">
            <img src="${
              post.media?.url || "assets/images/default-post.png"
            }" alt="${post.media?.alt || ""}" class="profile-post-img"/>
          </div>
          <div class="profile-post-info">
            <ion-icon class="profile-post-like" name="heart-outline"></ion-icon>
            <p class="like-amount">${post._count?.reactions || 0}</p>
            <ion-icon class="profile-post-comment" name="chatbox-ellipses-outline"></ion-icon>
            <p class="comment-amount">${post._count?.comments || 0}</p>
          </div>
          <div class="profile-post-txt">
            <h3 class="profile-post-username">${
              post.author?.name || "Unknown"
            }</h3>
            <p class="profile-post-p">${post.body || ""}</p>
          </div>
        `;

        postsDiv.appendChild(postEl);
      });
    } catch (err) {
      console.error(err);
      errorMsg.textContent = err.message;
    }
  }

  // Edit profile functionality
  editBtn.addEventListener("click", () => {
    const newUsername = prompt(
      "Enter new username:",
      profileUsername.textContent
    );
    const newPic = prompt("Enter new profile picture URL:", profileImg.src);

    if (!newUsername && !newPic) return;

    updateProfile(newUsername, newPic);
  });

  async function updateProfile(name, avatarUrl) {
    try {
      const res = await fetch("https://v2.api.noroff.dev/social/profiles/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          avatar: avatarUrl
            ? { url: avatarUrl, alt: "Profile picture" }
            : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      fetchProfile(); // Refresh UI
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      errorMsg.textContent = err.message;
    }
  }

  fetchProfile(); // Initial load
  return container;
}
