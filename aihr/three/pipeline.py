'''import os
import base64
import requests
from pydub import AudioSegment
import tempfile
from dotenv import load_dotenv

# Загружаем ключи из .env
load_dotenv()
HF_KEY = os.getenv("HUGGINGFACE_API_KEY")
OR_KEY = os.getenv("OPENROUTER_API_KEY")

def process_audio(file_path: str) -> dict:
    headers_hf = {"Authorization": f"Bearer {HF_KEY}"}

    # === 1. Speech-to-Text (Whisper) ===
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        # Конвертация webm -> wav (Whisper не всегда понимает webm напрямую)
        audio = AudioSegment.from_file(file_path, format="webm")
        audio.export(tmp.name, format="wav")

        stt_url = "https://api-inference.huggingface.co/models/hf-audio/whisper-large-v3"
        with open(tmp.name, "rb") as f:
            stt_resp = requests.post(stt_url, headers=headers_hf,
                                     files={"file": ("audio.wav", f, "audio/wav")})
        stt_json = stt_resp.json()
        user_text = stt_json.get("text") or ""
        print("STT result:", user_text)

    if not user_text:
        return {"error": "STT failed", "raw": stt_json}

    # === 2. Chatbot (Qwen3 via OpenRouter) ===
    chat_url = "https://openrouter.ai/api/v1/chat/completions"
    chat_headers = {
        "Authorization": f"Bearer {OR_KEY}",
        "Content-Type": "application/json",
    }
    chat_payload = {
        # ⚠️ Тут нужно указать реальный ID модели!
        "model": "qwen/qwen3-coder:free",  # проверь на openrouter.ai/models
        "messages": [
            {"role": "system", "content": "You are a helpful HR interviewer."},
            {"role": "user", "content": user_text},
        ],
    }
    chat_resp = requests.post(chat_url, headers=chat_headers, json=chat_payload)
    chat_json = chat_resp.json()
    reply_text = chat_json["choices"][0]["message"]["content"]
    print("LLM result:", reply_text)

    # === 3. Text-to-Speech (Edge-TTS) ===
    tts_url = "https://api-inference.huggingface.co/models/innoai/Edge-TTS-Text-to-Speech"
    tts_payload = {
        "inputs": reply_text,
        "parameters": {"voice": "ru-RU-SvetlanaNeural - ru-RU (Female)"}  # ⚠️ тут можно поменять голос
    }
    tts_resp = requests.post(tts_url, headers=headers_hf, json=tts_payload)

    mime = tts_resp.headers.get("content-type", "audio/mpeg")
    reply_audio = base64.b64encode(tts_resp.content).decode("utf-8")

    return {
        "user_text": user_text,
        "reply_text": reply_text,
        "reply_audio": reply_audio,
        "mime": mime
    }


if __name__ == "__main__":
    # Локальный тест
    result = process_audio("recording.webm")  # путь к тестовому файлу
    print("Result:", result.keys())
'''