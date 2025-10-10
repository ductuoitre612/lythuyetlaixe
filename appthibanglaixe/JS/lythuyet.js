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

// Nút prev/next
document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

document.getElementById("next").addEventListener("click", () => {
  if (currentPage < Math.ceil(questions.length / perPage)) {
    currentPage++;
    renderPage(currentPage);
  }
});

// Jump to page via input/button
const pageInputEl = document.getElementById('pageInput');
const goPageBtn = document.getElementById('goPage');

if (goPageBtn) {
  goPageBtn.addEventListener('click', () => {
    if (!questions || questions.length === 0) return; // nothing loaded yet
    const totalPages = Math.max(1, Math.ceil(questions.length / perPage));
    let val = parseInt(pageInputEl.value, 10);
    if (Number.isNaN(val)) return;
    // clamp
    if (val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    currentPage = val;
    renderPage(currentPage);
  });
}

if (pageInputEl) {
  pageInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (goPageBtn) goPageBtn.click();
    }
  });
}

let questions = [];
let currentPage = 1;
const perPage = 10;

async function loadQuestions() {
  const res = await fetch("/appthibanglaixe/Assets/Stuff/lythuyet_question.json");
  questions = await res.json();
  renderPage(currentPage);
}

function nl2br(raw) {
  if (!raw) return "";
  raw = String(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const esc = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc.replace(/\n/g, "<br>");
}


function renderPage(page) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageQuestions = questions.slice(start, end);

  const container = document.getElementById("questions");
  container.innerHTML = "";

  pageQuestions.forEach(q => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");

    // tolerate common typos and missing fields
    const opts = q.options || q.option || q.opstions || [];
    let optionsHTML = (Array.isArray(opts) ? opts : []).map((opt, i) => {
      if (i === q.answer) {
        return `<li data-correct="true">${opt}</li>`;
      }
      return `<li>${opt}</li>`;
    }).join("");

    // safe image handling
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
    `Trang ${page} / ${Math.ceil(questions.length / perPage)}`;

  renderPagination(page);
}

function renderPagination(page) {
  const totalPages = Math.ceil(questions.length / perPage);
  const pageNumbers = document.getElementById("pageNumbers");
  pageNumbers.innerHTML = "";

  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, page + half);

  if (end - start + 1 < maxVisible) {
    if (page <= half) {
      end = Math.min(totalPages, start + maxVisible - 1);
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

  if (end < totalPages) {
    if (end < totalPages - 1) addDots();
    createPageButton(totalPages);
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
      currentPage = num;
      renderPage(currentPage);
    };
    pageNumbers.appendChild(btn);
  }

  function addDots() {
    const span = document.createElement("span");
    span.textContent = "...";
    span.style.margin = "0 5px";
    pageNumbers.appendChild(span);
  }
}


loadQuestions();