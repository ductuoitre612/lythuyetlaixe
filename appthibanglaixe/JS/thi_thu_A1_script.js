// =========================
// ⚙️ CẤU HÌNH & DỮ LIỆU
// =========================
const exams = {
  "de_1": [1, 2, 3, 4, 5],
  "de_2": [10, 11, 12, 13, 14],
  "de_3": [20, 21, 22, 23, 24],
};
const EXAM_DURATION_MINUTES = 19;

let currentQuestions = [];

// =========================
// 🔄 KHỞI TẠO BÀI THI
// =========================
async function initExam() {
  const randomExamId = getRandomExamId();
  console.log(`Đề được chọn: ${randomExamId}`);

  const questionIds = exams[randomExamId];
  if (!questionIds) {
    console.error("Không tìm thấy đề hợp lệ.");
    return;
  }

  currentQuestions = await fetchQuestions(questionIds);
  renderQuestions(currentQuestions);
  startTimer(EXAM_DURATION_MINUTES * 60);
  setupSubmitButton();
}

// =========================
// 🎲 RANDOM ĐỀ
// =========================
function getRandomExamId() {
  const keys = Object.keys(exams);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

// =========================
// 📥 FETCH CÂU HỎI
// =========================
async function fetchQuestions(ids) {
  try {
    const response = await fetch("/appthibanglaixe/Assets/Stuff/lythuyet_question.json");
    const data = await response.json();
    return data.filter(q => ids.includes(q.id));
  } catch (err) {
    console.error("Lỗi khi tải câu hỏi:", err);
    return [];
  }
}

// =========================
// 🧱 RENDER CÂU HỎI
// =========================
function renderQuestions(questions) {
  const container = document.getElementById("questions");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.classList.add("question");

    div.innerHTML = `
      <h3>Câu ${index + 1}: ${q.question}</h3>
      ${q.image ? `<img src="${q.image}" alt="Câu hỏi ${index + 1}">` : ""}
      <div class="options">
        ${q.options.map((opt, i) => `
          <label>
            <input type="radio" name="question_${q.id}" value="${i}">
            ${opt}
          </label>
        `).join("")}
      </div>
      <hr>
    `;

    container.appendChild(div);
  });
}

// =========================
// ⏳ ĐỒNG HỒ ĐẾM NGƯỢC
// =========================
function startTimer(durationInSeconds) {
  const timerElement = document.getElementById("timer");
  let remaining = durationInSeconds;

  const interval = setInterval(() => {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

    if (remaining <= 0) {
      clearInterval(interval);
      timerElement.textContent = "⏰ Hết giờ!";
      alert("Đã hết thời gian làm bài!");
      document.getElementById("submitExamBtn").click();
    }

    remaining--;
  }, 1000);
}

// =========================
// 🧮 XỬ LÝ NỘP BÀI
// =========================
function setupSubmitButton() {
  const submitBtn = document.getElementById("submitExamBtn");
  submitBtn.addEventListener("click", () => {
    const userAnswers = getUserAnswers();
    const result = calculateScore(userAnswers, currentQuestions);
    showDetailedResult(result);
  });
}

function getUserAnswers() {
  const answers = {};
  currentQuestions.forEach(q => {
    const selected = document.querySelector(`input[name="question_${q.id}"]:checked`);
    answers[q.id] = selected ? parseInt(selected.value) : null;
  });
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
      isCorrect
    });
  });

  return {
    total: questions.length,
    correct,
    wrong: questions.length - correct,
    details
  };
}

// =========================
// 📊 HIỂN THỊ KẾT QUẢ CHI TIẾT
// =========================
function showDetailedResult(result) {
  const container = document.getElementById("questions");
  container.innerHTML = ""; // Xóa phần câu hỏi cũ

  const resultBox = document.createElement("div");
  resultBox.classList.add("result-box");
  resultBox.innerHTML = `
    <h2>Kết quả thi thử</h2>
    <p>✅ Số câu đúng: <b>${result.correct}</b></p>
    <p>❌ Số câu sai: <b>${result.wrong}</b></p>
    <p>📊 Tỷ lệ đúng: <b>${Math.round((result.correct / result.total) * 100)}%</b></p>
    <hr>
    <h3>Chi tiết từng câu:</h3>
  `;

  result.details.forEach((d, idx) => {
    const div = document.createElement("div");
    div.classList.add("result-item");
    div.innerHTML = `
      <h4>Câu ${idx + 1}: ${d.question}</h4>
      <ul>
        ${d.options.map((opt, i) => {
          let color = "";
          if (i === d.correctAnswer) color = "style='color:lime;font-weight:bold;'";
          if (i === d.userAnswer && !d.isCorrect) color = "style='color:red;font-weight:bold;'";
          return `<li ${color}>${opt}</li>`;
        }).join("")}
      </ul>
      <p>Kết quả: ${d.isCorrect ? "✅ Đúng" : "❌ Sai"}</p>
      <hr>
    `;
    resultBox.appendChild(div);
  });

  // Nút làm lại
  const retryBtn = document.createElement("button");
  retryBtn.textContent = "🔁 Làm lại đề khác";
  retryBtn.style.marginTop = "20px";
  retryBtn.addEventListener("click", () => window.location.reload());
  resultBox.appendChild(retryBtn);

  container.appendChild(resultBox);
}
 
// =========================
// 🚀 KHỞI CHẠY
// =========================
document.addEventListener("DOMContentLoaded", initExam);
