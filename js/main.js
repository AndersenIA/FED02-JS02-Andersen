import { renderLogin } from "./ui/login.js";
import { renderRegister } from "./ui/register.js";
import { renderFeed } from "./ui/feed.js";
import { renderProfile } from "./ui/profile.js";
import { renderPost } from "./ui/post.js";
import { renderNav } from "./ui/nav.js";
import { renderActionBar } from "./ui/actionBar.js";
import { renderSearch } from "./ui/search.js";

// Main page container
const pageContent = document.getElementById("page-content");

function router() {
  const path = window.location.hash || "#/login";

  // Clear previous content
  pageContent.innerHTML = "";

  // Pages that show nav + action bar
  const withNavAndAction = ["#/feed", "#/profile", "#/post", "#/search"];

  if (withNavAndAction.some((p) => path.startsWith(p))) {
    pageContent.appendChild(renderNav());
  }

  if (path.startsWith("#/login")) {
    pageContent.appendChild(renderLogin());
  } else if (path.startsWith("#/register")) {
    pageContent.appendChild(renderRegister());
  } else if (path.startsWith("#/feed")) {
    pageContent.appendChild(renderFeed());
  } else if (path.startsWith("#/profile")) {
    const parts = path.split("/");
    const username = parts[2] ? decodeURIComponent(parts[2]) : null;

    pageContent.appendChild(renderProfile(username));
  } else if (path.startsWith("#/post")) {
    pageContent.appendChild(renderPost());
  } else if (path.startsWith("#/search")) {
    const parts = path.split("/");
    const query = parts[2] ? decodeURIComponent(parts[2]) : "";
    pageContent.appendChild(renderSearch(query));
  } else {
    window.location.hash = "#/login";
  }

  if (withNavAndAction.some((p) => path.startsWith(p))) {
    pageContent.appendChild(renderActionBar());
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
