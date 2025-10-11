document.addEventListener('DOMContentLoaded', () => {
  // Đường dẫn tới file JSON
  const jsonPath = "/appthibanglaixe/Assets/Stuff/lythuyet_question.json";

  // Danh sách ID muốn hiển thị (ví dụ đề 1)
  const selectedIds = [100, 26, 173, 200, 245];

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
        .map((opt, i) => `<li data-index="${i}">${opt}</li>`)
        .join("");

      // ✨ Hàm xử lý xuống dòng
      function nl2br(raw) {
        if (!raw) return "";
        raw = String(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        const esc = raw
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return esc.replace(/\n/g, "<br>");
      }

      // build HTML
      questionDiv.innerHTML = `
        <h3>Câu ${start + index + 1}: ${q.question}</h3>
        <div class="question-media"></div>
        <ul>${optionsHtml}</ul>
        <p class="explanation" style="display:none;">${nl2br(q.explanation || "")}</p>
        <hr>
      `;

      // insert image if present
      if (q.image) {
        const mediaContainer = questionDiv.querySelector(".question-media");
        if (mediaContainer) {
          const img = document.createElement("img");
          img.src = q.image;
          img.alt = q.imageAlt || `Hình câu ${q.id || start + index + 1}`;
          mediaContainer.appendChild(img);
        }
      }

      // gán sự kiện cho mỗi lựa chọn
      const liItems = questionDiv.querySelectorAll("li");
      liItems.forEach((li) => {
        li.addEventListener("click", () => {
          const selected = parseInt(li.dataset.index, 10);
          checkAnswer(li, q, selected, questionDiv);
        });
      });

      // thêm hiệu ứng xuất hiện
      container.appendChild(questionDiv);
      setTimeout(() => {
        questionDiv.classList.add("show");
      }, 50);
    });
  }


  function checkAnswer(selectedLi, question, selectedIndex, container) {
    const explanation = container.querySelector(".explanation");
    const allOptions = container.querySelectorAll("li");

    // Khóa tất cả các lựa chọn sau khi click
    allOptions.forEach(li => {
      li.style.pointerEvents = "none";
      li.style.opacity = "0.85";
    });

    // Nếu đúng
    if (selectedIndex === question.answer) {
      selectedLi.setAttribute("data-correct", "true");
    } else {
      // Đánh dấu đáp án đúng
      allOptions[question.answer]?.setAttribute("data-correct", "true");

      // Làm nổi bật đáp án sai nhẹ
      selectedLi.style.color = "var(--danger)";
      selectedLi.style.fontWeight = "600";
      selectedLi.style.background = "rgba(255,123,123,0.06)";
      selectedLi.style.borderLeft = "4px solid rgba(255,123,123,0.18)";
      selectedLi.style.paddingLeft = "10px";
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
