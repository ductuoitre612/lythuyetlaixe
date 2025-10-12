// Chứa ID câu hỏi
const exams = {
  "de_1": [1, 2, 3, 4, 5],
  "de_2": [10, 11, 12, 13, 14],
  "de_3": [20, 21, 22, 23, 24],
};
const EXAM_DURATION_MINUTES = 19;

let currentQuestions = [];

async function initExam() {
  try {
    console.log("Generating exam...");
    
    const randomExamId = getRandomExamId();
    console.log(`Selected Exam: ${randomExamId}`);

    const questionIds = exams[randomExamId];
    if (!questionIds) {
      console.error("Exam is not found");
      showError("Exam is not found");
      return;
    }

    console.log(`Loading ${questionIds.length} questions...`);
    currentQuestions = await fetchQuestions(questionIds);
    
    if (currentQuestions.length === 0) {
      console.error("Can not load questions");
      showError("Can not load questions, try again");
      return;
    }

    console.log(`Loaded ${currentQuestions.length} questions`);
    renderQuestions(currentQuestions);
    renderQuestionPanel(currentQuestions);
    startTimer(EXAM_DURATION_MINUTES * 60);
    setupSubmitButton();
    
  } catch (error) {
    console.error("Exam generating error", error);
    showError("Some errors occur while generating exam: " + error.message);
  }
}

// Chọn random đề thi
function getRandomExamId() {
  const keys = Object.keys(exams);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

// Fetch câu hỏi từ lythuyet_question.html
async function fetchQuestions(ids) {
  try {
    console.log(`Fetching question with ID`, ids);
    const response = await fetch("/appthibanglaixe/Assets/Stuff/lythuyet_question.json");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`All questions: ${data.length}`);
    
    // Filter questions
    const filteredQuestions = data.filter(q => ids.includes(q.id));
    
    // Sắp xếp theo thứ tự trong ids
    const sortedQuestions = ids.map(id => 
      filteredQuestions.find(q => q.id === id)
    ).filter(q => q !== undefined);
    
    console.log(`Questions after filtered:`, sortedQuestions);
    return sortedQuestions;
    
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

// render
function renderQuestions(questions) {
  const container = document.getElementById("questions");
  // Kiểm tra question container trong html
  if (!container) {
    console.error("Can not find question container");
    return;
  }

  container.innerHTML = "";
  console.log(`Rendering ${questions.length} questions...`);

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.classList.add("question");
    div.id = `question-${q.id}`;

    div.innerHTML = `
      <h3>Câu ${index + 1}: ${q.question || "Không có nội dung"}</h3>
      ${q.image ? `<img src="${q.image}" alt="Câu hỏi ${index + 1}" style="max-width: 100%; height: auto;">` : ""}
      <div class="options">
        ${(q.options && q.options.length > 0) ? 
          q.options.map((opt, i) => `
            <label style="display: block; margin: 8px 0; padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: background 0.2s;">
              <input type="radio" name="question_${q.id}" value="${i}" style="margin-right: 8px;">
              ${opt || "Lựa chọn trống"}
            </label>
          `).join("") 
          : "<p>Không có lựa chọn</p>"
        }
      </div>
      <hr style="margin: 20px 0; border: 1px solid rgba(255,255,255,0.1);">
    `;

    // Thêm event listener cho các radio buttons
    const radioButtons = div.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        updateQuestionPanel(q.id, parseInt(this.value));
      });
    });

    container.appendChild(div);
  });

  console.log("Render completed");
}

// Question panel
function renderQuestionPanel(questions) {
  const panel = document.getElementById("questionPanel");
  // Kiểm tra question panel trong html
  if (!panel) {
    console.error("Can not find question panel");
    return;
  }

  panel.innerHTML = "";
  
  questions.forEach((q, index) => {
    const button = document.createElement("button");
    button.textContent = index + 1;
    button.title = `Câu ${index + 1}`;
    
    button.addEventListener("click", () => {
      // Scroll đến câu hỏi tương ứng
      const questionElement = document.getElementById(`question-${q.id}`);
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    
    panel.appendChild(button);
  });
}

// Cập nhật panel
function updateQuestionPanel(questionId, answerIndex) {
  const panel = document.getElementById("questionPanel");
  const buttons = panel.getElementsByTagName("button");
  
  const questionIndex = currentQuestions.findIndex(q => q.id === questionId);
  if (questionIndex !== -1 && buttons[questionIndex]) {
    const button = buttons[questionIndex];
    
    // Reset classes
    button.classList.remove("correct", "wrong", "active");
    
    // Thêm class active khi đã trả lời
    if (answerIndex !== null) {
      button.classList.add("active");
    }
  }
}

// Clock
function startTimer(durationInSeconds) {
  const timerElement = document.getElementById("timer");
  if (!timerElement) {
    console.error("❌ Không tìm thấy timer element");
    return;
  }

  let remaining = durationInSeconds;

  const interval = setInterval(() => {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

    // Đổi màu khi sắp hết giờ
    if (remaining <= 60) { // 1 phút cuối
      timerElement.style.color = "var(--danger)";
      timerElement.style.animation = "pulse 1s infinite";
    }

    if (remaining <= 0) {
      clearInterval(interval);
      timerElement.textContent = "⏰ Hết giờ!";
      timerElement.style.color = "var(--danger)";
      
      // Tự động nộp bài khi hết giờ
      setTimeout(() => {
        if (document.getElementById("submitExamBtn")) {
          document.getElementById("submitExamBtn").click();
        }
      }, 1000);
    }

    remaining--;
  }, 1000);
}

// Xử lý nộp bài
function setupSubmitButton() {
  const submitBtn = document.getElementById("submitExamBtn");
  if (!submitBtn) {
    console.error("Can not find submit button");
    return;
  }

  submitBtn.addEventListener("click", handleSubmit);
}

function handleSubmit() {
  console.log("Đang xử lý nộp bài...");
  const userAnswers = getUserAnswers();
  const result = calculateScore(userAnswers, currentQuestions);
  showDetailedResult(result);
}

function getUserAnswers() {
  const answers = {};
  currentQuestions.forEach(q => {
    const selected = document.querySelector(`input[name="question_${q.id}"]:checked`);
    answers[q.id] = selected ? parseInt(selected.value) : null;
    
    // Cập nhật giao diện panel
    updateQuestionPanel(q.id, answers[q.id]);
  });
  
  console.log("User answer:", answers);
  return answers;
}

function calculateScore(userAnswers, questions) {
  let correct = 0;
  const details = [];

  questions.forEach(q => {
    const userAnswer = userAnswers[q.id];
    const isCorrect = userAnswer === q.answer;
    if (isCorrect) correct++;

    details.push({
      id: q.id,
      question: q.question,
      userAnswer,
      correctAnswer: q.answer,
      options: q.options,
      isCorrect,
      explanation: q.explanation || ""
    });
  });

  return {
    total: questions.length,
    correct,
    wrong: questions.length - correct,
    score: Math.round((correct / questions.length) * 100),
    details
  };
}

// =========================
// 📊 HIỂN THỊ KẾT QUẢ CHI TIẾT - PHIÊN BẢN CẢI TIẾN
// =========================
function showDetailedResult(result) {
  const container = document.getElementById("questions");
  if (!container) {
    console.error("❌ Không tìm thấy container để hiển thị kết quả");
    return;
  }

  container.innerHTML = "";
  
  // Ẩn panel câu hỏi khi hiển thị kết quả
  const panel = document.getElementById("questionPanel");
  if (panel) panel.style.display = "none";

  const resultBox = document.createElement("div");
  resultBox.classList.add("result-box");
  
  // Xác định kết quả
  const passed = result.correct >= Math.ceil(result.total * 0.8); // 80% để đỗ
  const resultColor = passed ? "var(--accent-2)" : "var(--danger)";
  const resultText = passed ? "🎉 CHÚC MỪNG BẠN ĐÃ ĐẠT 🎉" : "❌ RẤT TIẾC BẠN CHƯA ĐẠT";

  resultBox.innerHTML = `
    <h2 style="color: ${resultColor};">${resultText}</h2>
    <div style="text-align: center; margin: 20px 0;">
      <p>✅ Số câu đúng: <b style="color: var(--accent-2);">${result.correct}/${result.total}</b></p>
      <p>❌ Số câu sai: <b style="color: var(--danger);">${result.wrong}/${result.total}</b></p>
      <p>📊 Điểm số: <b style="color: var(--accent);">${result.score}%</b></p>
    </div>
    <hr style="border-color: rgba(255,255,255,0.1);">
    <h3>📝 Chi tiết bài làm:</h3>
  `;

  // Hiển thị chi tiết từng câu
  result.details.forEach((d, idx) => {
    const div = document.createElement("div");
    div.classList.add("result-item");
    div.style.background = "rgba(255,255,255,0.02)";
    div.style.padding = "15px";
    div.style.borderRadius = "8px";
    div.style.margin = "10px 0";
    div.style.border = `1px solid ${d.isCorrect ? 'rgba(126,231,135,0.2)' : 'rgba(255,123,123,0.2)'}`;

    div.innerHTML = `
      <h4 style="color: ${d.isCorrect ? 'var(--accent-2)' : 'var(--danger)'};">
        ${d.isCorrect ? '✅' : '❌'} Câu ${idx + 1}: ${d.question}
      </h4>
      <div style="margin: 10px 0;">
        ${d.options.map((opt, i) => {
          let style = "padding: 5px 10px; margin: 2px 0; border-radius: 4px;";
          if (i === d.correctAnswer) {
            style += "background: rgba(126,231,135,0.1); color: var(--accent-2); font-weight: bold;";
          } else if (i === d.userAnswer && !d.isCorrect) {
            style += "background: rgba(255,123,123,0.1); color: var(--danger); font-weight: bold; text-decoration: line-through;";
          }
          return `<div style="${style}">${String.fromCharCode(65 + i)}. ${opt}</div>`;
        }).join("")}
      </div>
      ${d.explanation ? `<p style="color: var(--muted-text); font-style: italic;">💡 Giải thích: ${d.explanation}</p>` : ''}
      <hr style="margin: 10px 0; border-color: rgba(255,255,255,0.05);">
    `;
    
    resultBox.appendChild(div);
  });

  // Nút hành động
  const actionDiv = document.createElement("div");
  actionDiv.style.textAlign = "center";
  actionDiv.style.marginTop = "20px";
  
  actionDiv.innerHTML = `
    <button id="retryBtn" style="background: var(--accent); color: white; border: none; padding: 12px 24px; border-radius: 8px; margin: 5px; cursor: pointer;">
      🔁 Làm đề khác
    </button>
    <button id="reviewBtn" style="background: var(--accent-2); color: black; border: none; padding: 12px 24px; border-radius: 8px; margin: 5px; cursor: pointer;">
      📚 Xem lại lý thuyết
    </button>
  `;
  
  resultBox.appendChild(actionDiv);
  container.appendChild(resultBox);

  // Thêm event listeners cho nút
  document.getElementById("retryBtn").addEventListener("click", () => {
    window.location.reload();
  });
  
  document.getElementById("reviewBtn").addEventListener("click", () => {
    window.location.href = "/appthibanglaixe/HTML/lythuyet.html";
  });
}

// =========================
// 🛟 HÀM HIỂN THỊ LỖI
// =========================
function showError(message) {
  const container = document.getElementById("questions");
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--danger);">
        <h2>❌ Lỗi</h2>
        <p>${message}</p>
        <button onclick="window.location.reload()" style="background: var(--accent); color: white; border: none; padding: 10px 20px; border-radius: 6px; margin-top: 20px; cursor: pointer;">
          Thử lại
        </button>
      </div>
    `;
  }
}

// =========================
// 🚀 KHỞI CHẠY VỚI XỬ LÝ LỖI
// =========================
document.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 DOM đã sẵn sàng, khởi chạy bài thi...");
  initExam().catch(error => {
    console.error("❌ Lỗi khởi chạy:", error);
    showError("Không thể khởi chạy bài thi: " + error.message);
  });
});

// Thêm CSS animation cho timer
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(style);