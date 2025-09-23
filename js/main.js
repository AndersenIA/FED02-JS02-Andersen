import { renderLogin } from "./ui/login.js";
import { renderRegister } from "./ui/register.js";
import { renderFeed } from "./ui/feed.js";
import { renderProfile } from "./ui/profile.js";
import { renderPost } from "./ui/post.js";
import { renderNav } from "./ui/nav.js";

// The main page container for dynamic content
const pageContent = document.getElementById("page-content");

// Render the nav **once at the top of the body**
document.body.prepend(renderNav());

console.log("main.js loaded");
console.log("pageContent element:", pageContent);
console.log("current hash:", window.location.hash);

function router() {
  const path = window.location.hash || "#/login";
  pageContent.innerHTML = ""; // clear previous page content

  switch (path) {
    case "#/login":
      pageContent.appendChild(renderLogin());
      break;
    case "#/register":
      pageContent.appendChild(renderRegister());
      break;
    case "#/feed":
      pageContent.appendChild(renderFeed());
      break;
    case "#/profile":
      pageContent.appendChild(renderProfile());
      break;
    case "#/post":
      pageContent.appendChild(renderPost());
      break;
    default:
      window.location.hash = "#/login";
      break;
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
