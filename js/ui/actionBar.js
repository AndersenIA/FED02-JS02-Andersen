import { renderCreatePostModal } from "./createPostModal.js";

export function renderActionBar() {
  const actionBar = document.createElement("div");
  actionBar.classList.add("actionBar");

  const plusIcon = document.createElement("ion-icon");
  plusIcon.classList.add("plus-icon");
  plusIcon.setAttribute("name", "add-circle-outline");

  // Open create post modal instead of navigating
  plusIcon.addEventListener("click", () => {
    renderCreatePostModal();
  });

  actionBar.appendChild(plusIcon);
  return actionBar;
}
