const apiKey = "f7f1efc0-1322-45ed-9e62-152f528a798a";

/**
 * Renders a modal for creating or editing a post.
 * @param {Object|null} post - Optional. If provided, the modal edits this post.
 * @param {Function} onClose - Callback after modal closes or post is submitted.
 */
export function renderCreatePostModal(post = null, onClose) {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <h2>${post ? "Edit Post" : "Create a New Post"}</h2>
    <label>Title (required)</label>
    <input type="text" class="post-title" placeholder="Post title" />
    <label>Body</label>
    <textarea class="post-body" placeholder="Write something..."></textarea>
    <label>Image URL</label>
    <input type="text" class="post-image" placeholder="https://..." />
    <label>Tags (comma separated)</label>
    <input type="text" class="post-tags" placeholder="tag1, tag2" />
    <div class="modal-actions">
      <button class="cancel-btn">Cancel</button>
      <button class="submit-btn">${post ? "Update" : "Post"}</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Pre-fill fields if editing
  if (post) {
    modal.querySelector(".post-title").value = post.title || "";
    modal.querySelector(".post-body").value = post.body || "";
    modal.querySelector(".post-image").value = post.media?.url || "";
    modal.querySelector(".post-tags").value = post.tags?.join(", ") || "";
  }

  // Close modal
  overlay.querySelector(".cancel-btn").addEventListener("click", () => {
    document.body.removeChild(overlay);
    if (onClose) onClose();
  });

  // Submit post (create or edit)
  overlay.querySelector(".submit-btn").addEventListener("click", async () => {
    const title = modal.querySelector(".post-title").value.trim();
    const body = modal.querySelector(".post-body").value.trim();
    const imageUrl = modal.querySelector(".post-image").value.trim();
    const tags = modal
      .querySelector(".post-tags")
      .value.split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    if (!title) return alert("Title is required!");

    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in.");

    try {
      const url = post?.id
        ? `https://v2.api.noroff.dev/social/posts/${post.id}`
        : "https://v2.api.noroff.dev/social/posts";
      const method = post?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({
          title,
          body,
          tags,
          media: imageUrl ? { url: imageUrl, alt: title } : undefined,
        }),
      });

      if (!res.ok)
        throw new Error(
          post ? "Failed to update post" : "Failed to create post"
        );

      alert(post ? "Post updated successfully!" : "Post created successfully!");
      document.body.removeChild(overlay);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
}
