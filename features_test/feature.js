// ====== SampleQuestions======
const questions = [];
for (let i = 1; i <= 25; i++) {
  questions.push(`Question ${i}: This is the text of question ${i}?`);
}

// ====== Variables ======
const quizContainer = document.getElementById("quiz-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pagination = document.getElementById("pagination");
const pageInput = document.getElementById("page-input");
const goBtn = document.getElementById("go-btn");

let currentPage = 0;
const questionsPerPage = 10;

// ====== Functions ======
function renderPage(page) {
  quizContainer.innerHTML = "";

  const start = page * questionsPerPage;
  const end = Math.min(start + questionsPerPage, questions.length);

  for (let i = start; i < end; i++) {
    const qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.textContent = questions[i];
    quizContainer.appendChild(qDiv);
  }

  prevBtn.disabled = page === 0;
  nextBtn.disabled = end >= questions.length;

  renderPagination();

  // auto scroll to top when page changes
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  for (let i = 0; i < totalPages; i++) {
    const startQ = i * questionsPerPage + 1;
    const endQ = Math.min(startQ + questionsPerPage - 1, questions.length);

    const pageBtn = document.createElement("button");
    pageBtn.textContent = `P${i + 1} (${startQ}-${endQ})`;

    if (i === currentPage) {
      pageBtn.classList.add("active");
    }

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderPage(currentPage);
    });

    pagination.appendChild(pageBtn);
  }
}

// ====== Event Listeners ======
prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderPage(currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderPage(currentPage);
  }
});

goBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  let page = parseInt(pageInput.value, 10);

  if (!isNaN(page) && page >= 1 && page <= totalPages) {
    currentPage = page - 1;
    renderPage(currentPage);
  } else {
    alert("Please enter a number between 1 and " + totalPages);
  }
});

pageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    goBtn.click();
  }
});

// ====== Initial Render ======
renderPage(currentPage);

// ======20 CÂU ĐIỂM LIỆT ======

const diemLietLink = document.getElementById("diemliet-link");

if (diemLietLink) {
  diemLietLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await loadDiemLiet();
  });
}

async function loadDiemLiet() {
  const quizContainer = document.getElementById("questions");

  const pagination = document.getElementById("pagination");
  quizContainer.innerHTML = "<h2>Đang tải 20 câu điểm liệt...</h2>";
  pagination.style.display = "none";

  try {
    const res = await fetch("/Assets/Stuff/20caudiemliet_question.json");

    const data = await res.json();

    let html = "<h2>20 Câu Điểm Liệt</h2>";
    data.forEach((q, i) => {
      html += `
        <div class="question">
          <p><b>Câu ${i + 1}:</b> ${q.question}</p>
          <ul>
            ${q.options
              .map(
                (opt, idx) => `
              <li><input type="radio" name="q${i}" value="${idx}"> ${opt}</li>
            `
              )
              .join("")}
          </ul>
          <details>
            <summary>Hiển thị đáp án</summary>
            <p><b>Đáp án đúng:</b> ${q.options[q.answer]}</p>
            <em>${q.explanation || ""}</em>
          </details>
        </div>
        <hr>
      `;
    });

    quizContainer.innerHTML = html;
  } catch (err) {
    quizContainer.innerHTML =
      "<p>Lỗi khi tải file 20 câu điểm liệt: " + err + "</p>";
  }
}
