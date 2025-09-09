document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-record-btn");
  const replyAudio = document.getElementById("reply-audio");
  const statusBox = document.getElementById("voice-status");
  const visualBox = document.getElementById("voice-visual");

  let recorder, chunks = [];
  let audioCtx, analyser, micStream;
  let silenceTimer;

  function setStatus(msg, mode = "idle") {
    statusBox.textContent = msg;

    if (mode === "recording") {
      visualBox.className = "h-32 rounded-lg flex items-center justify-center transition-all duration-500 bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-pulse";
    } else if (mode === "thinking") {
      visualBox.className = "h-32 rounded-lg flex items-center justify-center transition-all duration-500 bg-gray-200";
    } else if (mode === "speaking") {
      visualBox.className = "h-32 rounded-lg flex items-center justify-center transition-all duration-500 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse";
    } else {
      visualBox.className = "bg-gray-200 h-32 rounded-lg flex items-center justify-center transition-all duration-500";
    }
  }

  startBtn.addEventListener("click", async () => {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      return;
    }

    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(micStream);
    chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setStatus("💭 Думаю...", "thinking");
      await sendAudio(blob);
    };

    recorder.start();
    setStatus("🎙️ Слушаю вас...", "recording");
    monitorSilence();
  });

  function monitorSilence() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(micStream);
    analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    const data = new Float32Array(analyser.fftSize);

    function check() {
      analyser.getFloatTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
      const rms = Math.sqrt(sum / data.length);

      if (rms < 0.01) {
        if (!silenceTimer) {
          silenceTimer = setTimeout(() => {
            recorder.stop();
            micStream.getTracks().forEach(t => t.stop());
            audioCtx.close();
          }, 2000);
        }
      } else {
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }
      }
      requestAnimationFrame(check);
    }
    check();
  }

  async function sendAudio(blob) {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    const resp = await fetch("/api/voice/", { method: "POST", body: formData });
    const data = await resp.json();

    if (data.reply_audio) {
      replyAudio.src = "data:" + data.reply_audio_mime + ";base64," + data.reply_audio;
      setStatus("🔊 Говорит HR...", "speaking");
      replyAudio.play();

      replyAudio.onended = () => {
        setStatus("✅ Можете продолжить. Нажмите 🎤", "idle");
      };
    } else {
      setStatus("⚠️ Ошибка: " + (data.reply_text || "нет ответа"), "idle");
    }
  }
});
