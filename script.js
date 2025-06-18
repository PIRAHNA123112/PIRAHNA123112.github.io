const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setDarkIcon() {
  themeIcon.innerHTML = `
    <path fill="#b497f9" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
  `; // иконка луны
}

function setLightIcon() {
  themeIcon.innerHTML = `
    <circle cx="12" cy="12" r="5" stroke="#b497f9" stroke-width="2" fill="none"/>
    <g stroke="#b497f9" stroke-width="2">
      <line x1="12" y1="1" x2="12" y2="4"/>
      <line x1="12" y1="20" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="4" y2="12"/>
      <line x1="20" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
    </g>
  `; // иконка солнца
}

function toggleTheme() {
  if (document.body.classList.contains('dark-theme')) {
    document.body.classList.remove('dark-theme');
    setLightIcon();
  } else {
    document.body.classList.add('dark-theme');
    setDarkIcon();
  }
}

themeToggle.addEventListener('click', toggleTheme);

// Инициализация при загрузке (если нужна сохранённая тема)
if (document.body.classList.contains('dark-theme')) {
  setDarkIcon();
} else {
  setLightIcon();
}
