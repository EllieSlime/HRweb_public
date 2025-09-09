README
TeamSync — локальный запуск (инструкция)

Проект: TeamSync (HR-AI) — веб-приложение на Django. Локальная версия для разработки и демонстрации.
Для полноценной работы необходимо подставить API-ключи в файл keys.env. Ключи вы можете получить у автора проекта.

---

Содержание:

* Что находится в репозитории
* Требования и что нужно установить
* Рекомендованный способ (скачать архив с Яндекс.Диска)
* Пошаговая установка (Windows)
* Пошаговая установка (macOS / Linux)
* Конфигурация ключей keys.env
* База данных и фикстуры (admins.json)
* Запуск сервера
* Полезные команды
* Что указать в keys.env
* Частые ошибки

---

Структура проекта:

* manage.py — точка запуска Django
* aihr/ — корень проекта Django (settings, urls, wsgi)
* three/ — Django-приложение (шаблоны, static, views, models)

  * three/templates/three/ — html страницы
  * three/static/three/ — css, js, img
  * three/fixtures/admins.json — фикстуры админов
* db.sqlite3 — локальная база (если присутствует)
* keys.env — файл с секретами (не публиковать в публичном репозитории)

---

Требования:

* Python 3.10 — 3.13
* pip (идет вместе с Python)
* Git
* Рекомендуемая IDE: PyCharm

Зависимости Python (примерный список):
Django>=4.2
requests
python-dotenv
pymupdf
gradio-client
python-multipart (если нужно)

---

Рекомендация по скачиванию:
Скачайте ZIP-архив проекта с Яндекс.Диска, распакуйте в папку, откройте в PyCharm и следуйте инструкции ниже.

---

Установка и запуск (Windows):

1. Установите Python с сайта python.org. При установке отметьте "Add Python to PATH".
2. Откройте терминал (PowerShell или CMD) и перейдите в папку проекта:
   cd C:\путь\до\HRweb
3. Создайте виртуальное окружение:
   python -m venv .venv
4. Активируйте окружение:
   PowerShell: .venv\Scripts\Activate.ps1
   CMD: .venv\Scripts\activate.bat
5. Установите зависимости:
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   (если файла requirements.txt нет, установите вручную пакеты Django, requests, python-dotenv, pymupdf, gradio-client)
6. Создайте файл keys.env в корне проекта (см. шаблон ниже) и вставьте свои ключи.
7. Выполните миграции и загрузите фикстуры:
   python manage.py migrate
   python manage.py loaddata three/fixtures/admins.json
8. Запустите сервер:
   python manage.py runserver
   Откройте [http://127.0.0.1:8000](http://127.0.0.1:8000) в браузере.

---

Установка и запуск (macOS / Linux):

1. Установите Python (например brew install python или apt install python3 python3-venv).
2. Перейдите в папку проекта.
3. Создайте и активируйте окружение:
   python3 -m venv .venv
   source .venv/bin/activate
4. Установите зависимости (pip install -r requirements.txt).
5. Создайте файл keys.env.
6. python manage.py migrate
   python manage.py loaddata three/fixtures/admins.json
7. python manage.py runserver

---

Шаблон keys.env (пример):

DJANGO\_SECRET\_KEY=change-me
HUGGINGFACE\_API\_KEY=hf\_xxx\_replace\_here
OPENROUTER\_API\_KEY=or\_xxx\_replace\_here
DEBUG=True
ALLOWED\_HOSTS=127.0.0.1,localhost

Важно: ключи предоставляются автором проекта. За ними нужно обратиться ко мне. Не публикуйте keys.env в публичном репозитории.

---

Миграции и фикстуры:

* Выполнить миграции:
  python manage.py migrate
* Загрузить фикстуры:
  python manage.py loaddata three/fixtures/admins.json

---

Запуск сервера:

* python manage.py runserver
* для доступа по сети: python manage.py runserver 0.0.0.0:8000

---

Полезные команды Git:
git add .
git commit -m "Final version for hackathon"
git push aihr main   (для публичного репозитория)
git push git main    (для приватного репозитория)

---

Рекомендации по .gitignore:
**pycache**/
\*.pyc
.venv/
keys.env
db.sqlite3
.idea/
.vscode/

---

Частые ошибки:

* "Команда git не распознана" — установите Git и добавьте в PATH.
* Ошибка Invalid model identifier при loaddata — проверьте модель в admins.json (обычно three.adminuser).
* Ошибки API — проверьте ключи в keys.env.
* Если runserver не запускается — убедитесь, что миграции применены и ключи указаны.

---

Примечания:

1. keys.env всегда держите локально. Никогда не публикуйте его в публичный репозиторий.
2. Для запуска голосового интервью нужен микрофон и интернет, так как используются внешние API.
3. Архив лучше скачать с Яндекс.Диска и распаковать прямо в PyCharm.

---

Контакты:
За ключами и вопросами обращайтесь к автору проекта (peter.pletnyov@gmail.com /тг: @ellieslime). В readme могут быть неточности, так что в случае проблем с запуском тоже обращайтесь ко мне.

