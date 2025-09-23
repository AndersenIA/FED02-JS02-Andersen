// ui/register.js
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
        />
        
        <label class="input-label" for="username">Username</label>
        <input
          class="input-field"
          type="text"
          id="username"
          placeholder="Username"
        />
        
        <label class="input-label" for="password">Password</label>
        <input
          class="input-field"
          type="password"
          id="password"
          placeholder="Password"
        />
        
        <button class="login-btn" type="submit">Register</button>
        
        <p class="form-p">
          Already have an account?
          <a class="form-p-a" href="#/login">Log in!</a>
        </p>
      </form>
    </div>
  `;

  return container;
}
