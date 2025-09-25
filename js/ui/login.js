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

  const form = container.querySelector(".login-form");
  const errorMsg = container.querySelector(".error-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear old tokens & user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProfile");

    const email = form.querySelector("#email").value;
    const password = form.querySelector("#password").value;

    try {
      // Login request
      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": "f7f1efc0-1322-45ed-9e62-152f528a798a",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid email or password");

      const data = await response.json();
      const user = data.data; // ✅ this already has name, email, avatar, accessToken

      // Save token and full user object
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("selectedProfile", JSON.stringify(user));

      // Redirect to feed
      window.location.hash = "#/feed";
    } catch (error) {
      console.error(error);
      errorMsg.textContent = error.message;
    }
  });

  return container;
}
