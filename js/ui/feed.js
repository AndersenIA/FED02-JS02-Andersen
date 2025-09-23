// ui/feed.js

export function renderFeed() {
  // Create the main container section for the feed
  const container = document.createElement("section");
  container.classList.add("main-section"); // padding-top moves feed below nav

  // Feed div for posts
  const feedDiv = document.createElement("div");
  feedDiv.classList.add("main-feed");
  container.appendChild(feedDiv);

  const token = localStorage.getItem("token");
  const apiKey = "f7f1efc0-1322-45ed-9e62-152f528a798a"; // Your Noroff API Key

  // Redirect to login if no token
  if (!token) {
    window.location.hash = "#/login";
    return container;
  }

  async function fetchPosts() {
    try {
      const response = await fetch("https://v2.api.noroff.dev/social/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      const posts = data.data;

      if (!posts || posts.length === 0) {
        feedDiv.innerHTML = "<p>No posts to show.</p>";
        return;
      }

      // Clear previous posts
      feedDiv.innerHTML = "";

      // Loop through posts and create feed cards
      posts.forEach((post) => {
        const postCard = document.createElement("div");
        postCard.classList.add("feed-card");

        postCard.innerHTML = `
          <div class="feed-img-div">
            ${
              post.media
                ? `<img class="feed-img" src="${post.media.url}" alt="${
                    post.media.alt || ""
                  }"/>`
                : ""
            }
          </div>
          <div class="feed-txt-div">
            <h2 class="account-name">${post.author?.name || "Unknown"}</h2>
            <div class="feed-txt-p">${post.body || ""}</div>
          </div>
        `;

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
