let questions = [];
let currentPage = 1;
const perPage = 10;

async function loadQuestions() {
  const res = await fetch("/appthibanglaixe/Assets/Stuff/lythuyet_question.json");
  questions = await res.json();
  renderPage(currentPage);
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

    let optionsHTML = q.options.map((opt, i) => {
      if (i === q.answer) {
        return `<li style="color:red; font-weight:bold;">${opt}</li>`;
      }
      return `<li>${opt}</li>`;
    }).join("");

    qDiv.innerHTML = `
      <h3>Câu ${q.id}: ${q.question}</h3>
      ${q.image ? `<img src="${q.image}" alt="Câu ${q.id}" style="max-width:400px; display:block; margin:10px 0;">` : ""}
      <ol type="A">${optionsHTML}</ol>
      ${q.explanation ? `<p><b>Giải thích:</b> ${q.explanation}</p>` : ""}
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

  const maxVisible = 5; // số nút hiển thị quanh trang hiện tại
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, page + half);

  // đảm bảo đủ số nút
  if (end - start + 1 < maxVisible) {
    if (page <= half) {
      end = Math.min(totalPages, start + maxVisible - 1);
    } else {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  // nút đầu
  if (start > 1) {
    createPageButton(1);
    if (start > 2) addDots();
  }

  // các nút giữa
  for (let i = start; i <= end; i++) {
    createPageButton(i, i === page);
  }

  // nút cuối
  if (end < totalPages) {
    if (end < totalPages - 1) addDots();
    createPageButton(totalPages);
  }

  // helper: tạo nút số
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

  // helper: dấu ...
  function addDots() {
    const span = document.createElement("span");
    span.textContent = "...";
    span.style.margin = "0 5px";
    pageNumbers.appendChild(span);
  }
}


loadQuestions();
