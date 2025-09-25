import { renderProfile } from "./profile.js";

const apiKey = "f7f1efc0-1322-45ed-9e62-152f528a798a";

export function renderSearch(query) {
  const container = document.createElement("section");
  container.classList.add("search-section");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.hash = "#/login";
    return container;
  }

  container.innerHTML = `
    <h2 class="search-title">Search results for "${query}"</h2>
    <div class="search-results">Loading...</div>
  `;
  const resultsDiv = container.querySelector(".search-results");

  async function loadResults() {
    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/social/profiles/search?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to search profiles");

      const { data } = await res.json();

      resultsDiv.innerHTML = "";
      if (!data.length) {
        resultsDiv.innerHTML = `<p class="no-results">No users found.</p>`;
      } else {
        data.forEach((profile) => {
          const profileEl = document.createElement("div");
          profileEl.classList.add("search-profile-card");

          profileEl.innerHTML = `
            <div class="search-profile-avatar">
              <img src="${
                profile.avatar?.url || "assets/images/default-profile.jpg"
              }" alt="${profile.name}" />
            </div>
            <div class="search-profile-info">
              <h3 class="search-profile-name">${
                profile.name || profile.email
              }</h3>
              <p class="search-profile-bio">${profile.bio || ""}</p>
            </div>
          `;

          profileEl.addEventListener("click", () => {
            localStorage.setItem("selectedProfile", JSON.stringify(profile));
            window.location.hash = `#/profile/${encodeURIComponent(
              profile.name
            )}`;
          });

          resultsDiv.appendChild(profileEl);
        });
      }
    } catch (err) {
      console.error(err);
      resultsDiv.innerHTML = `<p class="error-message" style="color:red;">${err.message}</p>`;
    }
  }

  loadResults();

  return container;
}
