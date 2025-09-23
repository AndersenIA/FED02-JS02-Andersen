// ui/nav.js
export function renderNav() {
  const nav = document.createElement("nav");
  nav.classList.add("nav-bar");

  nav.innerHTML = `
    <div class="profile-pic-div">
      <img class="profile-img" src="assets/images/profile-pics/jake-nackos-IF9TK5Uy-KI-unsplash.jpg" alt="Profile pic"/>
    </div>
    <div class="logo-div">
      <img class="logo-img" src="assets/images/logoImage.png" alt="Vibe logo"/>
    </div>
    <ion-icon class="menu-icon" name="menu-outline"></ion-icon>
  `;

  // Add click listener to profile pic
  const profilePic = nav.querySelector(".profile-pic-div img");
  profilePic.addEventListener("click", () => {
    window.location.hash = "#/profile";
  });

  return nav;
}
