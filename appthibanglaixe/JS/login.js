document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (
    (username === "admin" && password === "123") ||
    (username === "NOVA" && password === "123")
  ) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);
    // chuyển trang sau khi đăng nhập
    window.location.href = "/appthibanglaixe/main_page.html";
  } else {
    document.getElementById("loginMessage").innerText =
      "Sai tài khoản hoặc mật khẩu!";
  }
});
