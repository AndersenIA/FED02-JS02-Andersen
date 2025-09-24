import { renderEditProfileModal } from "./editProfileModal.js";

const apiKey = "f7f1efc0-1322-45ed-9e62-152f528a798a";

export function renderProfile(viewUserEmail = null) {
  const container = document.createElement("section");
  container.classList.add("profile-section");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.hash = "#/login";
    return container;
  }

  async function loadProfile() {
    console.log("profile.js: loadProfile called");

    // Clear container
    container.innerHTML = `
      <div class="profile-info">
        <div class="profile-info-pic">
          <img class="profile-info-img" src="assets/images/default-profile.jpg" alt="Profile Picture"/>
        </div>
        <div class="profile-info-txt">
          <h2 class="account-username">Loading...</h2>
          <h3 class="account-name"></h3>
          <p class="account-bio"></p>
        </div>
        <button class="edit-profile-btn">Edit profile</button>
      </div>
      <div class="profile-posts"></div>
    `;

    const profileImg = container.querySelector(".profile-info-img");
    const profileUsername = container.querySelector(".account-username");
    const profileName = container.querySelector(".account-name");
    const profileBio = container.querySelector(".account-bio");
    const editBtn = container.querySelector(".edit-profile-btn");
    const postsDiv = container.querySelector(".profile-posts");

    try {
      let profileData;
      const me = JSON.parse(localStorage.getItem("user"));

      // 1️⃣ If a viewUserEmail is provided via hash (someone else's profile)
      if (viewUserEmail) {
        // If it's your own email, just use your user object
        if (viewUserEmail === me.email) {
          profileData = me;
        } else {
          // Otherwise fetch the other user's profile
          const res = await fetch("https://v2.api.noroff.dev/social/profiles", {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          });
          const result = await res.json();
          profileData = result.data.find(
            (p) => p.email.toLowerCase() === viewUserEmail.toLowerCase()
          );
          if (!profileData) throw new Error("User not found");
        }
        localStorage.setItem("selectedProfile", JSON.stringify(profileData));
      } else {
        // 2️⃣ If no email is provided in hash, just load the stored selectedProfile
        const storedProfile = localStorage.getItem("selectedProfile");
        if (!storedProfile) throw new Error("No profile selected");
        profileData = JSON.parse(storedProfile);
      }
      console.log("profile.js: loaded profileData:", profileData);

      // Fill profile info
      profileImg.src =
        profileData.avatar?.url || "assets/images/default-profile.jpg";
      profileImg.onerror = () =>
        (profileImg.src = "assets/images/default-profile.jpg");
      profileUsername.textContent = profileData.email || "No email set";
      profileName.textContent = profileData.name || "No name set";
      profileBio.textContent = profileData.bio || "No bio set";

      // Show edit button only for your own profile
      const meEmail = JSON.parse(localStorage.getItem("user"))?.email;
      editBtn.style.display = profileData.email === meEmail ? "block" : "none";
      editBtn.onclick = () => renderEditProfileModal();

      // Fetch posts for this profile
      const postsRes = await fetch(
        `https://v2.api.noroff.dev/social/profiles/${profileData.name}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      let userPosts = [];
      if (postsRes.ok) {
        const { data: posts } = await postsRes.json();
        userPosts = posts;
      } else {
        console.warn("profile.js: failed to fetch posts", postsRes.status);
      }

      postsDiv.innerHTML = "";
      if (!userPosts.length) {
        postsDiv.innerHTML = "<p>No posts yet.</p>";
      } else {
        userPosts.forEach((post) => {
          const postEl = document.createElement("div");
          postEl.classList.add("profile-post");
          postEl.innerHTML = `
            <div class="profile-post-pic">
              <img src="${post.media?.url || "assets/images/default-post.jpg"}"
                   alt="${post.media?.alt || ""}" class="profile-post-img"/>
            </div>
            <div class="profile-post-info">
              <ion-icon class="profile-post-like" name="heart-outline"></ion-icon>
              <p class="like-amount">${post._count?.reactions || 0}</p>
              <ion-icon class="profile-post-comment" name="chatbox-ellipses-outline"></ion-icon>
              <p class="comment-amount">${post._count?.comments || 0}</p>
            </div>
            <div class="profile-post-txt">
              <h3 class="profile-post-username">${
                profileData.name || "Unknown"
              }</h3>
              <p class="profile-post-p">${post.body || ""}</p>
            </div>
          `;
          postsDiv.appendChild(postEl);
        });
      }
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  }

  loadProfile();

  // Reload profile if hash changes while staying on a profile page
  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#/profile")) {
      // Extract email from hash
      const parts = window.location.hash.split("/");
      const email = parts[2] ? decodeURIComponent(parts[2]) : null;
      if (email) {
        viewUserEmail = email;
      }
      loadProfile();
    }
  });

  return container;
}
