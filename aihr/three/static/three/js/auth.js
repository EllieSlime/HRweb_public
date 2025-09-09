// main/static/js/auth.js
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-login-form");
  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const errorP = document.getElementById("login-error");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    const csrftoken = getCookie("csrftoken");

    try {
      const resp = await fetch("/admin-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken || ""
        },
        body: JSON.stringify({ username, password })
      });

      const data = await resp.json();

      if (resp.ok && data.success) {
        // успешный вход → переключаем на home
        document.getElementById("admin-login").classList.add("hidden");
        document.getElementById("admin-room").classList.remove("hidden");
      } else {
        showNegative();
      }
    } catch (err) {
      console.error(err);
      showNegative();
    }
  });

  function showNegative() {
    usernameInput.value = "";
    passwordInput.value = "";
    errorP.textContent = "Invalid username or password :(";
    errorP.classList.remove("hidden");
  }
});
