// ui/individualPost.js
export function renderIndividualPost(post) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  // Modal container
  const section = document.createElement("section");
  section.classList.add("individual-post-section");

  section.innerHTML = `
    <div class="individual-post-div">
      <div class="individual-post-left">
        <div class="individual-pic-div">
          <img src="${post.media?.url || "assets/images/default-post.jpg"}" 
               alt="${post.media?.alt || ""}" 
               class="individual-pic-img"/>
        </div>
        <div class="individual-text-div">
          <div class="individual-like-comment">
            <ion-icon class="indiviual-icons profile-post-like" name="heart"></ion-icon>
            <p class="individual-likes">${post._count?.reactions || 0}</p>
            <ion-icon class="indiviual-icons" name="chatbox-ellipses-outline"></ion-icon>
            <p class="individual-comments">${post._count?.comments || 0}</p>
          </div>
          <h2 class="individual-post-header">${
            post.author?.name || "Unknown"
          }</h2>
          <p class="individual-post-p">${post.body || ""}</p>
        </div>
      </div>
      <div class="individual-post-right">
        <div class="individual-post-account">
          <div class="individual-account-pic">
            <img src="${
              post.author?.avatar?.url || "assets/images/default-profile.jpg"
            }"
                 alt="${post.author?.avatar?.alt || ""}" 
                 class="individual-account-img"/>
          </div>
          <div class="individual-account-details">
            <h2 class="account-username">@${post.author?.name || "Unknown"}</h2>
            <p class="account-name">${post.author?.name || "Unknown"}</p>
          </div>
        </div>
        <div class="individual-post-comments"></div>
      </div>
    </div>
  `;

  overlay.appendChild(section);
  document.body.appendChild(overlay);

  // Blur background
  document.body.classList.add("blurred");

  // Make profile image clickable
  const profileImg = section.querySelector(".individual-account-img");
  profileImg.addEventListener("click", () => {
    if (post.author) {
      // Save full author object to localStorage
      localStorage.setItem("selectedProfile", JSON.stringify(post.author));

      // Navigate to profile page (no need to pass email in hash anymore)
      window.location.hash = "#/profile";

      overlay.remove();
      document.body.classList.remove("blurred");
    }
  });

  // Dynamically render comments
  const commentsDiv = section.querySelector(".individual-post-comments");
  if (post.comments && post.comments.length) {
    post.comments.forEach((comment) => {
      const commentEl = document.createElement("div");
      commentEl.classList.add("individual-comment");

      commentEl.innerHTML = `
        <div class="individual-comment-left">
          <div class="individual-comment-pic">
            <img src="${
              comment.author?.avatar?.url || "assets/images/default-profile.jpg"
            }"
                 alt="${comment.author?.avatar?.alt || ""}"
                 class="individual-comment-img"/>
          </div>
        </div>
        <div class="individual-comment-right">
          <div class="individual-comment-txt">
            <p class="individual-comment-p">${comment.body || ""}</p>
            <ion-icon class="individual-comment-like" name="heart-outline"></ion-icon>
          </div>
        </div>
      `;

      commentsDiv.appendChild(commentEl);
    });
  } else {
    commentsDiv.innerHTML = "<p>No comments yet.</p>";
  }

  // Close modal when clicking directly on the overlay
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
      document.body.classList.remove("blurred");
    }
  });

  return overlay;
}
