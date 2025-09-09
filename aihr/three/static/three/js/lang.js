const translations = {
  en: {
    // General
    title: "TeamSync - Job Application Platform",
    brand: "TeamSync",
    languageToggle: "RU/EN",

    // navbar
    home: "Home",
    hrDialog: "HR Dialog",
    voiceCall: "Voice Call",
    adminLogin: "Admin Login",

    // HR dialog
    schedule: "Schedule an Interview",
    chat: "Chat with HR Agent",
    chatIntro: "HR: Hello! Let's schedule your interview. Please select a date and time.",
    send: "Send",
    datetime: "Select Date & Time",
    scheduleCall: "📅 Schedule Call",
    startNow: "🚀 Start Meeting Now",

    // Voice call
    voiceInterview: "Voice Interview",
    ongoingCall: "Ongoing Voice Call",
    recording: "Voice Recording Active...",
    timer: "Timer",
    endCall: "End Call",
    callEnded: "Call ended. Report generated.",
    returnToDialog: "Return to HR Dialog",
    waiting: "Waiting to start...",
    startRecording: "🎤 Start Recording",

    // Home
    welcome: "Welcome to TeamSync",
    teamIntro: "We are a passionate team ready to bring value to your company. Hire us, please! 😺",
    member1: "Ilya Maslov",
    role1: "ML Specialist",
    member2: "Peter Pletev",
    role2: "Backend Developer",
    member3: "Egor Tertitsa",
    role3: "Frontend Developer",
    member4: "Pavel Noskov",
    role4: "UI/UX Designer",
    viewResume: "View Resume",
    contact: "Contact Us",

    // Admin login
    adminLoginTitle: "Admin Login",
    secureAccess: "Secure Admin Access",
    loginDesc: "Login using SAML/SSO or credentials.",
    captcha: "I'm not a robot",
    loginCreds: "Login with Credentials",
    loginSSO: "Login with SSO",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",

    // Admin room
    adminDashboard: "Admin Dashboard",
    manageVacancies: "Manage Vacancies & Resumes",
    addVacancy: "Add Vacancy",
    addVacancyBtn: "Add Vacancy",
    manageResumes: "Manage Resumes",
    viewDetails: "View Details",
    candidateScreening: "Candidate Screening",
    vacancyDescription: "Vacancy Description",
    vacancyPlaceholder: "Enter vacancy description",
    resumeFile: "Resume (docx or pdf)",
    uploadFile: "📎 Upload File",
    coverLetter: "Cover Letter (optional)",
    coverLetterPlaceholder: "Enter cover letter text",
    submitReview: "📤 Submit for Review",
    screeningResult: "Screening Result"
  },

  ru: {
    // General
    title: "TeamSync - Платформа для трудоустройства",
    brand: "TeamSync",
    languageToggle: "RU/EN",

    // navbar
    home: "Главная",
    hrDialog: "Диалог с HR",
    voiceCall: "Голосовое интервью",
    adminLogin: "Вход администратора",

    // HR dialog
    schedule: "Назначить собеседование",
    chat: "Чат с HR-агентом",
    chatIntro: "HR: Здравствуйте! Давайте назначим собеседование. Выберите дату и время.",
    send: "Отправить",
    datetime: "Выберите дату и время",
    scheduleCall: "📅 Назначить звонок",
    startNow: "🚀 Начать встречу сейчас",

    // Voice call
    voiceInterview: "Голосовое интервью",
    ongoingCall: "Идёт голосовой звонок",
    recording: "Идёт запись голоса...",
    timer: "Таймер",
    endCall: "Завершить звонок",
    callEnded: "Звонок завершён. Отчёт сгенерирован.",
    returnToDialog: "Вернуться к диалогу",
    waiting: "Ожидание начала...",
    startRecording: "🎤 Говорить",

    // Home
    welcome: "Добро пожаловать в TeamSync",
    teamIntro: "Мы — увлечённая команда, готовая принести ценность вашей компании. Возьмите нас на работу, пожалуйста! 😺",
    member1: "Илья Маслов",
    role1: "ML-специалист",
    member2: "Пётр Плетёв",
    role2: "Backend-разработчик",
    member3: "Егор Тертица",
    role3: "Frontend-разработчик",
    member4: "Павел Носков",
    role4: "UI/UX дизайнер",
    viewResume: "Посмотреть резюме",
    contact: "Связаться с нами",

    // Admin login
    adminLoginTitle: "Вход администратора",
    secureAccess: "Безопасный вход администратора",
    loginDesc: "Войдите с помощью SAML/SSO или логина и пароля.",
    captcha: "Я не робот",
    loginCreds: "Войти по логину и паролю",
    loginSSO: "Войти через SSO",
    usernamePlaceholder: "Логин",
    passwordPlaceholder: "Пароль",

    // Admin room
    adminDashboard: "Панель администратора",
    manageVacancies: "Управление вакансиями и резюме",
    addVacancy: "Добавить вакансию",
    addVacancyBtn: "Добавить вакансию",
    manageResumes: "Управление резюме",
    viewDetails: "Посмотреть детали",
    candidateScreening: "Проверка кандидата",
    vacancyDescription: "Описание вакансии",
    vacancyPlaceholder: "Введите текстовое описание вакансии",
    resumeFile: "Резюме (docx или pdf)",
    uploadFile: "📎 Загрузить файл",
    coverLetter: "Сопроводительное письмо (необязательно)",
    coverLetterPlaceholder: "Введите текст письма",
    submitReview: "📤 Отправить на проверку",
    screeningResult: "Результат проверки"
  }
};

let currentLang = localStorage.getItem("lang") || "en";

function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[currentLang][key]) {
      el.placeholder = translations[currentLang][key];
    }
  });
}

function toggleLang() {
  currentLang = currentLang === "en" ? "ru" : "en";
  localStorage.setItem("lang", currentLang);
  updateTexts();
}

document.addEventListener("DOMContentLoaded", () => {
  updateTexts();
  document.getElementById("lang-toggle").addEventListener("click", (e) => {
    e.preventDefault();
    toggleLang();
  });
});

// Теперь переменная currentLang доступна глобально