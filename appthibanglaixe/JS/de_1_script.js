// Nút prev/next
document.getElementById("prev").addEventListener("click", () => {
  if (current_page > 1) {
    current_page--;
    renderPage(current_page);
  }
});

document.getElementById("next").addEventListener("click", () => {
  if (current_page < Math.ceil(questions.length / perPage)) {
    current_page++;
    renderPage(current_page);
  }
});

// Jump to page via input/button
const page_input_El = document.getElementById('pageInput');
const goPage_button = document.getElementById('goPage');

if (goPage_button) {
  goPage_button.addEventListener('click', () => {
    if (!questions || questions.length === 0) return; // nothing loaded yet
    const totalPages = Math.max(1, Math.ceil(questions.length / perPage));
    let val = parseInt(page_input_El.value, 10);
    if (Number.isNaN(val)) return;
    // clamp
    if (val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    current_page = val;
    renderPage(current_page);
  });
}

if (page_input_El) {
  page_input_El.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (goPage_button) goPage_button.click();
    }
  });
}