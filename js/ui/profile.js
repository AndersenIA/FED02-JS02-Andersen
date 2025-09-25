import { renderEditProfileModal } from "./editProfileModal.js";
import { renderIndividualPost } from "./individualPost.js";

const apiKey = "f7f1efc0-1322-45ed-9e62-152f528a798a";

export function renderProfile(viewUserName = null) {
  // changed parameter name
  const container = document.createElement("section");
  container.classList.add("profile-section");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.hash = "#/login";
    return container;
  }

  async function loadProfile() {
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
      const me = JSON.parse(localStorage.getItem("user"));
      let profileData;

      if (viewUserName) {
        if (viewUserName === me.name) {
          profileData = me;
        } else {
          // Fetch profile by name
          const res = await fetch(
            `https://v2.api.noroff.dev/social/profiles/${encodeURIComponent(
              viewUserName
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
              },
            }
          );
          const result = await res.json();
          profileData = result.data;
          if (!profileData) throw new Error("User not found");
        }
      } else {
        const storedProfile = localStorage.getItem("selectedProfile");
        if (!storedProfile) throw new Error("No profile selected");
        profileData = JSON.parse(storedProfile);
      }

      localStorage.setItem("selectedProfile", JSON.stringify(profileData));

      profileImg.src =
        profileData.avatar?.url || "assets/images/default-profile.jpg";
      profileImg.onerror = () =>
        (profileImg.src = "assets/images/default-profile.jpg");
      profileUsername.textContent = profileData.email || "No email set";
      profileName.textContent = profileData.name || "No name set";
      profileBio.textContent = profileData.bio || "No bio set";

      editBtn.style.display = profileData.email === me.email ? "block" : "none";

      // Edit profile
      editBtn.onclick = () =>
        renderEditProfileModal(profileData, async (updatedData) => {
          profileImg.src =
            updatedData.avatar?.url || "assets/images/default-profile.jpg";
          profileBio.textContent = updatedData.bio || "";

          try {
            const res = await fetch(
              `https://v2.api.noroff.dev/social/profiles/${profileData.name}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                  "X-Noroff-API-Key": apiKey,
                },
                body: JSON.stringify({
                  bio: updatedData.bio,
                  avatar: updatedData.avatar,
                }),
              }
            );

            if (!res.ok) throw new Error("Failed to update profile on server");

            const savedData = await res.json();

            profileData = { ...profileData, ...savedData.data };
            localStorage.setItem("user", JSON.stringify(profileData));
            localStorage.setItem(
              "selectedProfile",
              JSON.stringify(profileData)
            );

            loadPosts(profileData.name);
          } catch (err) {
            console.error(err);
            alert(
              "Failed to update profile on the server. Please try again later."
            );
          }
        });

      loadPosts(profileData.name);

      async function loadPosts(username) {
        try {
          const postsRes = await fetch(
            `https://v2.api.noroff.dev/social/profiles/${encodeURIComponent(
              username
            )}/posts`,
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
                  <img src="${
                    post.media?.url || "assets/images/default-post.jpg"
                  }" 
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
              postEl.addEventListener("click", () =>
                renderIndividualPost(post)
              );
              postsDiv.appendChild(postEl);
            });
          }
        } catch (err) {
          console.error("Failed to load posts:", err);
          postsDiv.innerHTML =
            "<p style='color:red;'>Failed to load posts.</p>";
        }
      }
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  }

  loadProfile();

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#/profile")) {
      const parts = window.location.hash.split("/");
      const name = parts[2] ? decodeURIComponent(parts[2]) : null;
      if (name) viewUserName = name;
      loadProfile();
    }
  });

  return container;
}
