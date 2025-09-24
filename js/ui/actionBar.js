export function renderActionBar() {
  const actionBar = document.createElement("div");
  actionBar.classList.add("actionBar");

  const plusIcon = document.createElement("ion-icon");
  plusIcon.classList.add("plus-icon");
  plusIcon.setAttribute("name", "add-circle-outline");

  // Optional: add click behavior (e.g., navigate to create post page)
  plusIcon.addEventListener("click", () => {
    window.location.hash = "#/post";
  });

  actionBar.appendChild(plusIcon);
  return actionBar;
}
