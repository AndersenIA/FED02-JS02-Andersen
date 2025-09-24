import { renderIndividualPost } from "./individualPost.js";

export function renderFeed() {
  const container = document.createElement("section");
  container.classList.add("main-section");

  const feedDiv = document.createElement("div");
  feedDiv.classList.add("main-feed");
  container.appendChild(feedDiv);

  const token = localStorage.getItem("token");
  const apiKey = "f7f1efc0-1322-45ed-9e62-152f528a798a";

  if (!token) {
    window.location.hash = "#/login";
    return container;
  }

  async function fetchPosts() {
    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/social/posts?_author=true",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      const posts = data.data;

      console.log("Fetched posts:", posts); // <-- log posts here

      if (!posts || posts.length === 0) {
        feedDiv.innerHTML = "<p>No posts to show.</p>";
        return;
      }

      feedDiv.innerHTML = "";

      posts.forEach((post) => {
        const postCard = document.createElement("div");
        postCard.classList.add("feed-card");

        // Use a default image if post.media is null
        const imgSrc = post.media?.url || "assets/images/default-post.jpg";
        const imgAlt = post.media?.alt || "Post image";

        postCard.innerHTML = `
          <div class="feed-img-div">
            <img class="feed-img" src="${imgSrc}" alt="${imgAlt}" />
          </div>
          <div class="feed-txt-div">
            <h2 class="account-name">${post.author?.name || "Unknown"}</h2>
            <div class="feed-txt-p">${post.body || ""}</div>
          </div>
        `;

        postCard.addEventListener("click", () => renderIndividualPost(post));

        feedDiv.appendChild(postCard);
      });
    } catch (error) {
      console.error(error);
      feedDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
  }

  fetchPosts();

  return container;
}
