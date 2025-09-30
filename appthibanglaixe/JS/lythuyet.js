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

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.style.margin = "0 3px";
    btn.onclick = () => {
      currentPage = i;
      renderPage(currentPage);
    };

    if (i === page) {
      btn.style.fontWeight = "bold";
      btn.style.background = "#ddd";
    }

    pageNumbers.appendChild(btn);
  }
}

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

document.getElementById("goPage").addEventListener("click", () => {
  const page = parseInt(document.getElementById("pageInput").value);
  if (page >= 1 && page <= Math.ceil(questions.length / perPage)) {
    currentPage = page;
    renderPage(currentPage);
  }
});

loadQuestions();
