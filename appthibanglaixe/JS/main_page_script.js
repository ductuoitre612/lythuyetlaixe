document.getElementById("btn_1").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_1.html";
});

document.getElementById("btn_2").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_2.html";
});

document.getElementById("btn_3").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_3.html";
});

document.getElementById("btn_4").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_4.html";
});

document.getElementById("btn_5").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_5.html";
});

document.getElementById("btn_6").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_6.html";
});

document.getElementById("btn_7").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_7.html";
});

document.getElementById("btn_8").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_8.html";
});

document.getElementById("btn_9").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_9.html";
});

document.getElementById("btn_10").addEventListener("click", () => {
  window.location.href = "/appthibanglaixe/HTML/de_10.html";
});
// hiệu ứng chuyển màu navbar khi cuộn trang
window.addEventListener("scroll", function () {
  let navbar = document.querySelector(".nav_bar"); // dùng đúng class CSS
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
// Kiểm tra đăng nhập
window.addEventListener("load", () => {
  let loginBtn = document.getElementById("login");
  let username = localStorage.getItem("username");

  if (localStorage.getItem("loggedIn") === "true" && username) {
    loginBtn.innerHTML = `<a href="#">Xin chào, ${username}</a> | <a href="#" id="logout">ĐĂNG XUẤT</a>`;

    // Xử lý nút đăng xuất
    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("username");
      window.location.reload();
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Lấy tất cả link cần bảo vệ
  const protectedLinks = document.querySelectorAll(
    'a[href*="lythuyet.html"], a[href*="thi_thu_A1.html"], a[href*="thi_20_cau_diem_liet.html"]'
  );

  protectedLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (localStorage.getItem("loggedIn") !== "true") {
        e.preventDefault(); // chặn chuyển trang
        alert("⚠️ Vui lòng đăng nhập để sử dụng tính năng này!");
        window.location.href = "/appthibanglaixe/HTML/login.html";
      }
    });
  });
});
