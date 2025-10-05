// hieu ung chuyen mau navbar khi cuon trang
window.addEventListener("scroll", function () {
  let navbar = this.document.querySelector(".navbar");
  if (this.window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
