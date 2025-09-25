// ui/individualPost.js
import { renderCreatePostModal } from "./createPostModal.js";
const apiKey = "f7f1efc0-1322-45ed-9e62-152f528a798a";

export function renderIndividualPost(postOrId) {
  const id = typeof postOrId === "object" ? postOrId.id : postOrId;

  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const section = document.createElement("section");
  section.classList.add("individual-post-section");
  section.innerHTML = `<div class="individual-post-loading">Loading post…</div>`;

  overlay.appendChild(section);
  document.body.appendChild(overlay);
  document.body.classList.add("blurred");

  function closeModal() {
    overlay.remove();
    document.body.classList.remove("blurred");
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  (async function fetchAndRender() {
    const token = localStorage.getItem("token");
    if (!token) {
      closeModal();
      window.location.hash = "#/login";
      return;
    }

    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/social/posts/${id}?_author=true&_comments=true&_reactions=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch post");
      const { data: fullPost } = await res.json();

      const imgSrc = fullPost.media?.url || "assets/images/default-post.jpg";
      const imgAlt = fullPost.media?.alt || "";
      const authorName = fullPost.author?.name || "Unknown";
      const authorEmail = fullPost.author?.email || "";
      const authorAvatar =
        fullPost.author?.avatar?.url || "assets/images/default-profile.jpg";
      const authorAvatarAlt = fullPost.author?.avatar?.alt || "";

      // reactions
      const reactionsArray = fullPost.reactions || [];
      let reactionsCount =
        fullPost._count?.reactions ??
        reactionsArray.reduce((acc, r) => acc + (r.count || 0), 0);

      const symbol = "❤️"; // reaction symbol
      const me = JSON.parse(localStorage.getItem("user"));

      function findReactionEntry(reactions) {
        if (!reactions) return null;
        return reactions.find((r) => r.symbol === symbol) || null;
      }

      const initialReactionEntry = findReactionEntry(reactionsArray);
      let hasReacted =
        !!initialReactionEntry &&
        Array.isArray(initialReactionEntry.reactors) &&
        (initialReactionEntry.reactors.includes(me?.email) ||
          initialReactionEntry.reactors.includes(me?.name));

      // main markup
      section.innerHTML = `
        <div class="individual-post-div">
          <div class="individual-post-left">
            <div class="individual-pic-div">
              <img src="${imgSrc}" alt="${imgAlt}" class="individual-pic-img"/>
            </div>
            <div class="individual-text-div">
              <div class="individual-like-comment">
                <ion-icon class="individual-likes" name="${
                  hasReacted ? "heart" : "heart-outline"
                }"></ion-icon>
                <span class="individual-likes-count">${reactionsCount}</span>
                <ion-icon class="indiviual-icons" name="chatbox-ellipses-outline"></ion-icon>
                <p class="individual-comments">${
                  fullPost._count?.comments ?? fullPost.comments?.length ?? 0
                }</p>
              </div>
              <h2 class="individual-post-header">${authorName}</h2>
              <p class="individual-post-p">${fullPost.body || ""}</p>
            </div>
          </div>
          <div class="individual-post-right">
            <div class="individual-post-account">
              <div class="individual-account-pic">
                <img src="${authorAvatar}" alt="${authorAvatarAlt}" class="individual-account-img"/>
              </div>
              <div class="individual-account-details">
                <h2 class="account-username">${
                  authorEmail ? `@${authorEmail}` : `@${authorName}`
                }</h2>
                <p class="account-name">${authorName}</p>
              </div>
              ${
                me?.email === authorEmail
                  ? `<div class="post-menu">
                      <ion-icon name="ellipsis-vertical" class="post-menu-icon"></ion-icon>
                      <div class="post-menu-dropdown" style="display:none;">
                        <button class="edit-post-btn">Edit</button>
                        <button class="delete-post-btn">Delete</button>
                      </div>
                    </div>`
                  : ""
              }
            </div>
            <div class="individual-post-comments"></div>

            <div class="comment-form">
              <textarea class="comment-input" placeholder="Write a comment..."></textarea>
              <button class="comment-submit-btn">Post Comment</button>
            </div>
          </div>
        </div>
      `;

      // LIKE toggle
      const likeBtn = section.querySelector(".individual-likes");
      const likeCountEl = section.querySelector(".individual-likes-count");

      function updateLikeUIFromEntry(entry) {
        const count = entry?.count ?? reactionsCount;
        likeCountEl.textContent = count;
        const reactors = entry?.reactors ?? [];
        hasReacted =
          reactors.includes(me?.email) || reactors.includes(me?.name);
        likeBtn.setAttribute("name", hasReacted ? "heart" : "heart-outline");
        reactionsCount = count;
      }

      likeBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        likeBtn.style.pointerEvents = "none";

        try {
          const toggleRes = await fetch(
            `https://v2.api.noroff.dev/social/posts/${
              fullPost.id
            }/react/${encodeURIComponent(symbol)}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
              },
            }
          );

          if (!toggleRes.ok) {
            const text = await toggleRes.text();
            throw new Error(
              `Failed to toggle reaction: ${toggleRes.status} ${text}`
            );
          }

          const json = await toggleRes.json();
          const updatedReactions = json.data?.reactions || [];
          const entry = findReactionEntry(updatedReactions);
          updateLikeUIFromEntry(entry);
        } catch (err) {
          console.error("Like toggle error:", err);
          alert(err.message || "Failed to toggle like");
        } finally {
          likeBtn.style.pointerEvents = "";
        }
      });

      // COMMENTS
      const commentsDiv = section.querySelector(".individual-post-comments");

      function renderComments(comments) {
        commentsDiv.innerHTML = "";
        if (comments && comments.length) {
          comments.forEach((comment) => {
            const isMyComment =
              comment.author?.email === me?.email ||
              comment.author?.name === me?.name;

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
          </div>
          ${
            isMyComment
              ? `<ion-icon class="comment-trash" name="trash"></ion-icon>`
              : ""
          }
        </div>
      `;

            // DELETE COMMENT handler if it's my comment
            if (isMyComment) {
              const trashIcon = commentEl.querySelector(".comment-trash");
              trashIcon.addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete this comment?"))
                  return;

                try {
                  const delRes = await fetch(
                    `https://v2.api.noroff.dev/social/posts/${fullPost.id}/comment/${comment.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Noroff-API-Key": apiKey,
                      },
                    }
                  );

                  if (!delRes.ok) {
                    const text = await delRes.text();
                    throw new Error(
                      `Failed to delete comment: ${delRes.status} ${text}`
                    );
                  }

                  // Remove from local list & re-render
                  fullPost.comments = fullPost.comments.filter(
                    (c) => c.id !== comment.id
                  );
                  renderComments(fullPost.comments);
                } catch (err) {
                  console.error("Delete comment error:", err);
                  alert(err.message || "Failed to delete comment");
                }
              });
            }

            commentsDiv.appendChild(commentEl);
          });
        } else {
          commentsDiv.innerHTML = "<p>No comments yet.</p>";
        }
      }

      renderComments(fullPost.comments);

      const commentForm = section.querySelector(".comment-form");
      const commentInput = commentForm.querySelector(".comment-input");
      const commentSubmit = commentForm.querySelector(".comment-submit-btn");

      commentSubmit.addEventListener("click", async () => {
        const body = commentInput.value.trim();
        if (!body) return;

        try {
          const commentRes = await fetch(
            `https://v2.api.noroff.dev/social/posts/${fullPost.id}/comment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
              },
              body: JSON.stringify({ body }),
            }
          );

          if (!commentRes.ok) {
            const text = await commentRes.text();
            throw new Error(
              `Failed to post comment: ${commentRes.status} ${text}`
            );
          }

          const json = await commentRes.json();
          const newComment = json.data;

          fullPost.comments = fullPost.comments || [];
          fullPost.comments.push(newComment);
          renderComments(fullPost.comments);

          commentInput.value = "";
        } catch (err) {
          console.error("Comment error:", err);
          alert(err.message || "Failed to post comment");
        }
      });

      // POST MENU (edit/delete)
      if (me?.email === authorEmail) {
        const menuIcon = section.querySelector(".post-menu-icon");
        const menuDropdown = section.querySelector(".post-menu-dropdown");

        menuIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          menuDropdown.style.display =
            menuDropdown.style.display === "none" ? "block" : "none";
        });

        document.addEventListener("click", (e) => {
          if (!menuDropdown.contains(e.target) && e.target !== menuIcon) {
            menuDropdown.style.display = "none";
          }
        });

        const editBtn = section.querySelector(".edit-post-btn");
        editBtn.addEventListener("click", () => {
          renderCreatePostModal(fullPost, () => closeModal());
        });

        const deleteBtn = section.querySelector(".delete-post-btn");
        deleteBtn.addEventListener("click", async () => {
          if (!confirm("Are you sure you want to delete this post?")) return;

          try {
            const delRes = await fetch(
              `https://v2.api.noroff.dev/social/posts/${fullPost.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "X-Noroff-API-Key": apiKey,
                },
              }
            );

            if (!delRes.ok) {
              const text = await delRes.text();
              throw new Error(
                `Failed to delete post: ${delRes.status} ${text}`
              );
            }

            alert("Post deleted successfully");
            closeModal();
            window.location.hash = "#/feed";
          } catch (err) {
            console.error(err);
            alert(err.message || "Failed to delete post");
          }
        });
      }

      // profile navigation
      const profileImg = section.querySelector(".individual-account-img");
      if (profileImg && fullPost.author) {
        profileImg.style.cursor = "pointer";
        profileImg.addEventListener("click", () => {
          localStorage.setItem(
            "selectedProfile",
            JSON.stringify(fullPost.author)
          );
          window.location.hash = "#/profile";
          closeModal();
        });
      }
    } catch (err) {
      console.error("individualPost error:", err);
      section.innerHTML = `<p style="color:red;">${
        err.message || "Failed to load post"
      }</p>`;
    }
  })();

  return overlay;
}
