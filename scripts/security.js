// Sanitize input function. This has not been added to the project. This is just for consideration. 
function sanitizeInput(str) {
  return str.replace(/[&<>"'/]/g, function (char) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    return entityMap[char] || char;
  });
}

// Validate username and password formats
const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");

usernameField.addEventListener("input", function () {
  if (!usernameField.value.match(/^[a-zA-Z0-9]+$/)) {
    alert("Invalid username!");
  }
  usernameField.value = sanitizeInput(usernameField.value);
});

passwordField.addEventListener("blur", function () {
  if (passwordField.value.length < 8) {
    alert("Password too short!");
  }
  passwordField.value = sanitizeInput(passwordField.value);
});

// Limit login attempts to 3 within 30 seconds
const loginButton = document.getElementById("login");
let loginAttempts = 0;
let lastLoginAttempt = 0;

loginButton.addEventListener("click", function () {
  const currentTime = new Date().getTime();
  if (loginAttempts >= 3 && currentTime - lastLoginAttempt < 30000) {
    alert("Too many login attempts!");
    return;
  }
  loginAttempts++;
  lastLoginAttempt = currentTime;
  // Proceed with login attempt
});

// Form submission event listener
document.querySelector("form").addEventListener("submit", function (e) {
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("password");

  usernameField.value = sanitizeInput(usernameField.value);
  passwordField.value = sanitizeInput(passwordField.value);
});