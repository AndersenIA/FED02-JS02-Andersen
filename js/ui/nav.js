export function renderNav() {
  const nav = document.createElement("nav");
  nav.classList.add("nav-bar");

  // ✅ Always load the logged-in user
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
    <ion-icon class="menu-icon" name="menu-outline"></ion-icon>
  `;

  const profilePic = nav.querySelector(".profile-pic-div img");
  profilePic.addEventListener("click", () => {
    console.log("Nav profile pic clicked");
    const me = JSON.parse(localStorage.getItem("user")); // your own full object
    console.log("Logged-in user object:", me);

    if (me) {
      localStorage.setItem("selectedProfile", JSON.stringify(me)); // update selectedProfile
      console.log("Updated selectedProfile in localStorage");

      // Include your email in the hash
      window.location.hash = `#/profile/${encodeURIComponent(me.email)}`;
    }
  });

  // Logo → feed
  const logoImg = nav.querySelector(".logo-div img");
  logoImg.addEventListener("click", () => {
    window.location.hash = "#/feed";
  });

  return nav;
}
