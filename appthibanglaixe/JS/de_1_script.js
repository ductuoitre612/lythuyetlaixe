document.addEventListener('DOMContentLoaded', () => {
  // Đường dẫn tới file JSON
  const jsonPath = "/appthibanglaixe/Assets/Stuff/lythuyet_question.json";

  // Danh sách ID muốn hiển thị (ví dụ đề 1)
  const selectedIds = [1, 30, 173, 200, 245];

  // Số câu trên mỗi trang
  const questionsPerPage = 1;

  let allQuestions = [];
  let filteredQuestions = [];
  let currentPage = 1;

  async function loadQuestions() {
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) throw new Error("Không thể tải file JSON");
      allQuestions = await response.json();

      // Lọc ra những câu hỏi có ID trong selectedIds
      filteredQuestions = allQuestions.filter(q => selectedIds.includes(q.id));

      // Hiển thị trang đầu tiên
      renderQuestions();
      updatePageInfo();
    } catch (error) {
      console.error("Lỗi khi tải câu hỏi:", error);
      const container = document.getElementById("questions");
      if (container) container.innerHTML = "<p>Không thể tải câu hỏi. Kiểm tra console.</p>";
    }
  }

  function renderQuestions() {
    const container = document.getElementById("questions");
    if (!container) return;

    container.innerHTML = "";

    const start = (currentPage - 1) * questionsPerPage;
    const end = start + questionsPerPage;
    const pageQuestions = filteredQuestions.slice(start, end);

    pageQuestions.forEach((q, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("question");

      // tolerate either "options" or legacy "option"
      const opts = q.options || q.option || [];

      // build options markup
      const optionsHtml = opts
        .map((opt, i) => `<li><button class="option-btn" data-index="${i}">${opt}</button></li>`)
        .join("");

      questionDiv.innerHTML = `
        <h3>Câu ${start + index + 1}: ${q.question}</h3>
        <div class="question-media"></div>
        <ul>
          ${optionsHtml}
        </ul>
        <p class="explanation" style="display:none;">${q.explanation || ""}</p>
        <hr>
      `;

      // insert image if present (use DOM API to avoid accidental HTML injection)
      if (q.image) {
        const mediaContainer = questionDiv.querySelector(".question-media");
        if (mediaContainer) {
          const img = document.createElement("img");
          img.src = q.image; // e.g. "/appthibanglaixe/Assets/Imgs/your_image.jpg"
          img.alt = q.imageAlt || `Hình câu ${q.id || start + index + 1}`;
          mediaContainer.appendChild(img);
        }
      }

      container.appendChild(questionDiv);

      // Thêm event cho từng button
      const buttons = questionDiv.querySelectorAll(".option-btn");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const selectedIndex = parseInt(btn.dataset.index, 10);
          checkAnswer(btn, q, selectedIndex, questionDiv);
        });
      });
    });
  }

  function checkAnswer(btn, question, selectedIndex, container) {
    const explanation = container.querySelector(".explanation");
    const buttons = Array.from(container.querySelectorAll(".option-btn"));

    buttons.forEach(b => b.disabled = true); // khoá sau khi chọn

    if (selectedIndex === question.answer) {
      btn.style.backgroundColor = "#4CAF50"; // xanh đúng
    } else {
      btn.style.backgroundColor = "#F44336"; // đỏ sai
      const correctBtn = buttons[question.answer];
      if (correctBtn) correctBtn.style.backgroundColor = "#4CAF50"; // hiển thị đáp án đúng
    }

    if (explanation) explanation.style.display = "block";
  }

  function updatePageInfo() {
    const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / questionsPerPage));
    const el = document.getElementById("pageInfo");
    if (el) el.textContent = `Trang ${currentPage} / ${totalPages}`;
  }

  // ====== Điều khiển phân trang ======
  const prevEl = document.getElementById("prev");
  if (prevEl) {
    prevEl.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderQuestions();
        updatePageInfo();
      }
    });
  }

  const nextEl = document.getElementById("next");
  if (nextEl) {
    nextEl.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderQuestions();
        updatePageInfo();
      }
    });
  }

  const goBtn = document.getElementById("goPage");
  if (goBtn) {
    goBtn.addEventListener("click", () => {
      const inputEl = document.getElementById("pageInput");
      if (!inputEl) return;
      const input = parseInt(inputEl.value, 10);
      const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
      if (!Number.isNaN(input) && input >= 1 && input <= totalPages) {
        currentPage = input;
        renderQuestions();
        updatePageInfo();
      }
    });
  }

  // ====== Bắt đầu ======
  loadQuestions();
});
