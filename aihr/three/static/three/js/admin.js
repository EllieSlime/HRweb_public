document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("analyze-btn");
  const statusLine = document.getElementById("status-line");
  const resultBox = document.getElementById("analysis-result");
  const resultText = document.getElementById("result-text");
  const fileInput = document.getElementById("resume-file");
  const fileLabel = document.getElementById("resume-label");

  // При выборе файла обновляем текст кнопки
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      let fileName = fileInput.files[0].name;
      if (fileName.length > 25) fileName = fileName.substring(0, 22) + "...";
      fileLabel.textContent = "📄 " + fileName;
      fileLabel.classList.remove("from-blue-500", "to-blue-700");
      fileLabel.classList.add("from-green-500", "to-green-700");
    } else {
      fileLabel.textContent = "📎 Загрузить файл";
      fileLabel.classList.remove("from-green-500", "to-green-700");
      fileLabel.classList.add("from-blue-500", "to-blue-700");
    }
  });

  // Отправка данных
  btn.addEventListener("click", async () => {
    const vacancy = document.getElementById("vacancy-desc").value;
    const resumeFile = document.getElementById("resume-file").files[0];
    const cover = document.getElementById("cover-letter").value;

    if (!vacancy || !resumeFile) {
      alert("Нужно заполнить описание вакансии и загрузить резюме!");
      return;
    }

    const formData = new FormData();
    formData.append("vacancy", vacancy);
    formData.append("resume", resumeFile);
    if (cover) formData.append("cover", cover);

    // Загрузка → зелёный
    statusLine.className = "mt-4 h-2 rounded bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-pulse";
    statusLine.classList.remove("hidden");

    try {
      const resp = await fetch("/api/analyze_resume/", { method: "POST", body: formData });
      const data = await resp.json();

      // Ответ → синий
      statusLine.className = "mt-4 h-2 rounded bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse";
      setTimeout(() => statusLine.classList.add("hidden"), 1500);

      // Показываем плавно результат
      resultText.textContent = data.result || "⚠️ Ошибка: нет ответа от модели";
      resultBox.classList.remove("opacity-0");
      resultBox.classList.add("opacity-100");
    } catch (err) {
      resultText.textContent = "Ошибка при отправке данных: " + err;
      resultBox.classList.remove("opacity-0");
      resultBox.classList.add("opacity-100");
    }
  });
});
