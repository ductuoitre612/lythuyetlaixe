// Lythuyet.html self-reload
(function () {
  var link = document.getElementById('reload-lythuyet');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      try {
        location.reload();
      } catch (err) {
        location.href = location.pathname + location.search + location.hash;
      }
    });
})();

// Dùng để chỉnh nút prev và next
document.getElementById("prev").addEventListener("click", () => {
  if (current_page > 1) {
    current_page--;
    renderPage(current_page);
  }
});

document.getElementById("next").addEventListener("click", () => {
  if (current_page < Math.ceil(questions.length / questions_per_page)) {
    current_page++;
    renderPage(current_page);
  }
});

// Dùng để jump to page, có input
const page_input_El = document.getElementById('pageInput');
const goPage_button = document.getElementById('goPage');

if (goPage_button) {
  goPage_button.addEventListener('click', () => {
    if (!questions || questions.length === 0) return;

    const total_pages = Math.max(1, Math.ceil(questions.length / questions_per_page));
    let val = parseInt(page_input_El.value, 10);

    if (Number.isNaN(val)) return;
    if (val < 1) val = 1;
    if (val > total_pages) val = total_pages;

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

let questions = [];
let current_page = 1;
const questions_per_page = 10;

async function loadQuestions() {
  const res = await fetch("/appthibanglaixe/Assets/Stuff/lythuyet_question.json");
  questions = await res.json();
  renderPage(current_page);
}

// Dùng để ngắt dòng text cho file JSON
function nl2br(raw) {
  if (!raw) return "";
  raw = String(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const esc = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc.replace(/\n/g, "<br>");
}

// Như tên. Render page
function renderPage(page) {
  const start = (page - 1) * questions_per_page;
  const end = start + questions_per_page;
  const pageQuestions = questions.slice(start, end);

  const container = document.getElementById("questions");
  container.innerHTML = "";

  pageQuestions.forEach(q => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");

    const opts = q.options || q.option || q.opstions || [];
    let optionsHTML = (Array.isArray(opts) ? opts : []).map((opt, i) => {
      if (i === q.answer) {
        return `<li data-correct="true">${opt}</li>`;
      }
      return `<li>${opt}</li>`;
    }).join("");

    // Kiểm tra xem JSON có chứa hình ảnh hay không
    const imgHtml = q.image ? `<img src="${q.image}" alt="Câu ${q.id || ''}">` : "";

    qDiv.innerHTML = `
      <h3>Câu ${q.id}: ${q.question || ""}</h3>
      ${imgHtml}
      <ol type="A">${optionsHTML}</ol><br>
      ${q.explanation ? `<p class="explanation"><b>Giải thích:</b> ${nl2br(q.explanation)}</p>` : ""}<br>
    `;
    container.appendChild(qDiv);
  });

  document.getElementById("pageInput").value = page;
  document.getElementById("pageInfo").textContent = 
    `Trang ${page} / ${Math.ceil(questions.length / questions_per_page)}`;

  renderPagination(page);
}

// Dùng để chỉnh nút nhảy trang
function renderPagination(page) {
  const total_pages = Math.ceil(questions.length / questions_per_page);
  const page_numbers = document.getElementById("page_numbers");
  page_numbers.innerHTML = "";

  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(total_pages, page + half);

  if (end - start + 1 < maxVisible) {
    if (page <= half) {
      end = Math.min(total_pages, start + maxVisible - 1);
    } else {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  if (start > 1) {
    createPageButton(1);
    if (start > 2) addDots();
  }

  for (let i = start; i <= end; i++) {
    createPageButton(i, i === page);
  }

  if (end < total_pages) {
    if (end < total_pages - 1) addDots();
    createPageButton(total_pages);
  }

  function createPageButton(num, isActive = false) {
    const btn = document.createElement("button");
    btn.textContent = num;
    btn.style.margin = "0 3px";
    if (isActive) {
      btn.style.fontWeight = "bold";
      btn.style.background = "#ddd";
    }
    btn.onclick = () => {
      current_page = num;
      renderPage(current_page);
    };
    page_numbers.appendChild(btn);
  }

  function addDots() {
    const span = document.createElement("span");
    span.textContent = "...";
    span.style.margin = "0 5px";
    page_numbers.appendChild(span);
  }
}


loadQuestions();