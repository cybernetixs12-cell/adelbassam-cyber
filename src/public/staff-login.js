const loginForm = document.getElementById("loginForm");
const loginResult = document.getElementById("loginResult");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username =
    document.getElementById("username").value.trim();

  const pin =
    document.getElementById("pin").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        pin
      })
    });

    const data = await response.json();

    if (!response.ok) {
      loginResult.textContent =
        data.error || "Login failed.";

      return;
    }

    window.location.href = "/staff.html";
  } catch (error) {
    console.error("Login error:", error);

    loginResult.textContent =
      "Unable to log in. Please try again.";
  }
});