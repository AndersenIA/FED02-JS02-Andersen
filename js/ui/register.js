// ui/register.js
const apiKey = "f7f1efc0-1322-45ed-9e62-152f528a798a";

export function renderRegister() {
  const container = document.createElement("div");

  container.innerHTML = `
    <nav class="nav-bar">
      <div class="logo-div">
        <img
          class="logo-img"
          src="assets/images/logoImage.png"
          alt="Vibe logo image"
        />
      </div>
    </nav>
    <div class="login-div">
      <form class="login-form">
        <h1 class="form-header">Register</h1>

        <label class="input-label" for="email">Email</label>
        <input
          class="input-field"
          type="email"
          id="email"
          placeholder="Email address"
          required
        />

        <label class="input-label" for="username">Username</label>
        <input
          class="input-field"
          type="text"
          id="username"
          placeholder="Username"
          required
        />

        <label class="input-label" for="password">Password</label>
        <input
          class="input-field"
          type="password"
          id="password"
          placeholder="Password"
          minlength="8"
          required
        />

        <button class="login-btn" type="submit">Register</button>

        <p class="form-p">
          Already have an account?
          <a class="form-p-a" href="#/login">Log in!</a>
        </p>
      </form>
    </div>
  `;

  const form = container.querySelector(".login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector("#email").value.trim();
    const name = form.querySelector("#username").value.trim();
    const password = form.querySelector("#password").value.trim();

    // Basic validation
    if (!email.endsWith("@stud.noroff.no")) {
      alert("You must use a valid stud.noroff.no email.");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    try {
      const res = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Registration failed: ${res.status} ${errorText}`);
      }

      const { data } = await res.json();
      alert("Account created successfully! You can now log in.");

      // Store user so they can be redirected/logged in directly if you want
      localStorage.setItem("user", JSON.stringify(data));
      window.location.hash = "#/login";
    } catch (err) {
      console.error("Register error:", err);
      alert(err.message || "Something went wrong during registration");
    }
  });

  return container;
}
