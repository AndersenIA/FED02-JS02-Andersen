export function renderNav() {
  const nav = document.createElement("nav");
  nav.classList.add("nav-bar");

  const me = JSON.parse(localStorage.getItem("user"));

  nav.innerHTML = `
    <div class="profile-pic-div">
      <img class="profile-img" 
           src="${me?.avatar?.url || "assets/images/default-profile.jpg"}" 
           alt="${me?.avatar?.alt || "Profile pic"}"/>
    </div>
    <div class="logo-div">
      <img class="logo-img" src="assets/images/logoImage.png" alt="Vibe logo"/>
    </div>
    <input type="text" class="searchField" placeholder="Search users..." />
    <button class="logoutBtn">Log Out</button>
  `;

  // Profile pic → profile page
  const profilePic = nav.querySelector(".profile-pic-div img");
  profilePic.addEventListener("click", () => {
    const me = JSON.parse(localStorage.getItem("user"));
    if (me?.name) {
      localStorage.setItem("selectedProfile", JSON.stringify(me));
      window.location.hash = `#/profile/${encodeURIComponent(me.name)}`;
    }
  });

  // Logo → feed
  const logoImg = nav.querySelector(".logo-div img");
  logoImg.addEventListener("click", () => (window.location.hash = "#/feed"));

  // Log Out
  const logoutBtn = nav.querySelector(".logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProfile");
    window.location.hash = "#/login";
  });

  // Search field → navigate on Enter
  const searchField = nav.querySelector(".searchField");
  searchField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchField.value.trim();
      if (query) {
        window.location.hash = `#/search/${encodeURIComponent(query)}`;
      }
    }
  });

  return nav;
}
