export function renderLogin() {
  const container = document.createElement("div");

  container.innerHTML = `
    <nav class="nav-bar">
      <div class="logo-div">
        <img class="logo-img" src="assets/images/logoImage.png" alt="Vibe logo image"/>
      </div>
    </nav>
    <div class="login-div">
      <form class="login-form">
        <h1 class="form-header">Log in</h1>
        <label class="input-label" for="email">Email</label>
        <input class="input-field" type="email" id="email" placeholder="Email address" required/>
        <label class="input-label" for="password">Password</label>
        <input class="input-field" type="password" id="password" placeholder="Password" required/>
        <button class="login-btn" type="submit">Log in</button>
        <p class="form-p">
          Don’t have an account? <a class="form-p-a" href="#/register">Register!</a>
        </p>
      </form>
      <p class="error-msg" style="color:red;"></p>
    </div>
  `;

  // Grab the form and error message elements
  const form = container.querySelector(".login-form");
  const errorMsg = container.querySelector(".error-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload

    // Clear old tokens
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");

    const email = form.querySelector("#email").value;
    const password = form.querySelector("#password").value;

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": "f7f1efc0-1322-45ed-9e62-152f528a798a", // 🔑 add this
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.data.accessToken); // save new token

      // ✅ Store logged-in user object too
      localStorage.setItem("user", JSON.stringify(data.data));

      window.location.hash = "#/feed"; // redirect to feed
    } catch (error) {
      console.error(error);
      errorMsg.textContent = error.message;
    }
  });

  // ✅ Return the container so router can append it
  return container;
}
