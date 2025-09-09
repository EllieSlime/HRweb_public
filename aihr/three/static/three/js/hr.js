document.addEventListener("DOMContentLoaded", () => {
  const scheduleBtn = document.getElementById("schedule-btn");
  const meetingInput = document.getElementById("meeting-time");
  const chatBox = document.getElementById("chat-box");
  const chatText = document.getElementById("chat-text");
  const startNowBtn = document.getElementById("start-now-btn");

  // Подсветка-анимация
  if (!document.getElementById("pulse-style")) {
    const style = document.createElement("style");
    style.id = "pulse-style";
    style.textContent = `
      @keyframes pulse-gradient {
        0% { background: linear-gradient(90deg, #dcfce7, #bbf7d0); }
        50% { background: linear-gradient(90deg, #bbf7d0, #86efac); }
        100% { background: linear-gradient(90deg, #dcfce7, #bbf7d0); }
      }
      .pulse {
        animation: pulse-gradient 1.5s ease-in-out;
      }
    `;
    document.head.appendChild(style);
  }

  // Назначение встречи
  scheduleBtn.addEventListener("click", async () => {
    const datetime = meetingInput.value;
    if (!datetime) {
      alert("Пожалуйста, выберите дату и время!");
      return;
    }

    chatBox.classList.add("pulse");

    try {
      const resp = await fetch("/api/schedule_meeting/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetime })
      });

      const data = await resp.json();
      chatText.textContent = data.reply || "⚠️ Ошибка при назначении встречи";
    } catch (err) {
      chatText.textContent = "Ошибка: " + err;
    } finally {
      setTimeout(() => chatBox.classList.remove("pulse"), 1500);
    }
  });

  // Начать встречу сейчас → эмулируем клик по ссылке в шапке
  if (startNowBtn) {
    startNowBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const navLink = document.querySelector('nav a[href="#voice-call"]');
      if (navLink) navLink.click();
    });
  }
});
