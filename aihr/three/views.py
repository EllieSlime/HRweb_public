from django.shortcuts import render
import json
import base64
import requests
import docx2txt
import fitz
import os
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from .models import AdminUser
from django.views.decorators.csrf import csrf_exempt
from gradio_client import Client

# Create your views here.

#from django.http import HttpResponse

def index(request):
    return render(request, 'three/page3.html')

def admin_login_api(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Only POST")

    username = request.POST.get("username")
    password = request.POST.get("password")

    # если данные приходят в JSON
    if username is None and request.body:
        try:
            data = json.loads(request.body.decode("utf-8"))
            username = data.get("username")
            password = data.get("password")
        except Exception:
            pass

    if not username or not password:
        return JsonResponse({"success": False, "error": "missing"}, status=400)

    try:
        AdminUser.objects.get(username=username, password=password)
        return JsonResponse({"success": True})
    except AdminUser.DoesNotExist:
        return JsonResponse({"success": False, "error": "invalid"}, status=401)

@csrf_exempt
def voice_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    audio_file = request.FILES.get("audio")####
    if not audio_file:
        return JsonResponse({"error": "No audio uploaded"}, status=400)

    try:
        print(">> Получен аудиофайл:", audio_file.name, audio_file.size, "байт")

        # Whisper STT
        hf_stt_url = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"#"https://api-inference.huggingface.co/models/hf-audio/whisper-large-v3"
        hf_headers = {
            "Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}",
            "Content-Type": "audio/webm"  # важно! или audio/wav, если конвертируешь
        }

        audio_bytes = audio_file.read()
        stt_resp = requests.post(hf_stt_url, headers=hf_headers, data=audio_bytes, timeout=120)

        print(">> Whisper status:", stt_resp.status_code)
        print(">> Whisper raw:", stt_resp.text[:500])

        stt_json = stt_resp.json()
        user_text = stt_json.get("text") or stt_json.get("transcription") or ""
        print(">> Распознанный текст:", user_text)

        # OpenRouter chat
        chat_url = "https://openrouter.ai/api/v1/chat/completions"
        chat_headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            #
            "Content-Type": "application/json",
        }
        chat_payload = {
            "model": "qwen/qwen3-coder:free",  # замени, если в openrouter другой id
            "messages": [
                {"role": "system", "content": "You are a helpful HR interviewer."},
                {"role": "user", "content": user_text},
            ]
        }
        chat_resp = requests.post(chat_url, headers=chat_headers, json=chat_payload)
        print(">> Chat status:", chat_resp.status_code)
        print(">> Chat raw:", chat_resp.text[:500])

        chat_json = chat_resp.json()
        reply_text = chat_json["choices"][0]["message"]["content"]
        print(">> Ответ LLM:", reply_text)

        # TTS
        client = Client("innoai/Edge-TTS-Text-to-Speech")

        # Просто вызываем predict без api_name
        tts_resp = client.predict(
            reply_text,  # текст для озвучки
            "ru-RU-SvetlanaNeural - ru-RU (Female)"  # голос
        )

        print(">> TTS ответ:", tts_resp)
        #print(">> TTS content-type:", tts_resp.headers.get("content-type"))

        if isinstance(tts_resp, tuple):
            audio_path = tts_resp[0]  # путь к mp3-файлу
        else:
            audio_path = tts_resp

        # читаем mp3 из файла, который вернул gradio_client
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()

        # кодируем в base64, чтобы фронт мог воспроизвести
        reply_audio = base64.b64encode(audio_bytes).decode("utf-8")
        mime = "audio/mpeg"  # так как Space возвращает mp3

        return JsonResponse({
            "user_text": user_text,
            "reply_text": reply_text,
            "reply_audio": reply_audio,
            "reply_audio_mime": mime
        })

    except Exception as e:
        print(">> Ошибка:", str(e))
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def analyze_resume(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    vacancy = request.POST.get("vacancy", "")
    cover = request.POST.get("cover", "")
    resume_file = request.FILES.get("resume")

    if not vacancy or not resume_file:
        return JsonResponse({"error": "Missing data"}, status=400)

    # --- читаем текст из резюме ---
    text_resume = ""
    if resume_file.name.endswith(".docx"):
        text_resume = docx2txt.process(resume_file)
    elif resume_file.name.endswith(".pdf"):
        pdf = fitz.open(stream=resume_file.read(), filetype="pdf")
        text_resume = "\n".join(page.get_text() for page in pdf)

    # --- готовим запрос к OpenRouter ---
    chat_url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    prompt = f"""
    Вакансия:
    {vacancy}

    Резюме:
    {text_resume}

    Сопроводительное письмо:
    {cover}

    Проанализируй кандидата. Ответь строго в формате:

    1. Если подходит:
    "Кандидат проходит на следующий этап, (причина, несколько слов), (ссылка-приглашение на голосовой звонок для кандидата)"

    2. Если не подходит:
    "Отказано :(, (причина, несколько слов)"
    """

    payload = {
        "model": "qwen/qwen3-coder:free",
        "messages": [
            {"role": "system", "content": "Ты HR-бот, делающий быстрый отбор кандидатов"},
            {"role": "user", "content": prompt},
        ]
    }

    resp = requests.post(chat_url, headers=headers, json=payload)
    try:
        reply = resp.json()["choices"][0]["message"]["content"]
    except Exception:
        reply = "⚠️ Ошибка: " + resp.text[:200]

    return JsonResponse({"result": reply})

@csrf_exempt
def schedule_meeting(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            datetime = data.get("datetime")

            # Сохраняем в файл
            filepath = os.path.join(os.path.dirname(__file__), "scheduled_meetings.txt")
            with open(filepath, "a", encoding="utf-8") as f:
                f.write(f"Meeting scheduled at: {datetime}\n")

            return JsonResponse({
                "reply": f"Отлично! Буду ждать вашего звонка {datetime}."
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Only POST allowed"}, status=405)