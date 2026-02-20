
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 3000; // Изменил порт с 443 на 3000, чтобы не было проблем с правами и SSL

const USERS_FILE = path.join(__dirname, 'users.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Создаем папку uploads, если не существует
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Загрузка пользователей из файла
function loadUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Сохранение пользователей в файл
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

let users = loadUsers();

const FILE_VIEW_PASSWORD = 'K160525R';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'секрет_сессии_для_подписи_уникальный_ключ_!@#',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 час
    httpOnly: true,
  }
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Для сохранения расширения файла
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const upload = multer({ storage });

let filesMetadata = {};

function isStrongPassword(password) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

// Регистрция пользователя
app.post('/register', async (req, res) => {
  const { username, password, botcode } = req.body;
  // Исправлена проверка на заполнение полей
  if (!username || !password || !botcode) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }
  if (botcode !== '2804') {
    return res.status(403).json({ message: 'Неверный код проверки (бот)' });
  }
  if (users[username]) {
    return res.status(409).json({ message: 'Пользователь уже существует' });
  }
  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Пароль должен быть минимум 8 символов, содержать заглавную букву, цифру и спецсимвол',
    });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    users[username] = { passwordHash };
    saveUsers(users);
    res.json({ message: 'Регистрация успешна' });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вход пользователя
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  users = loadUsers();
  if (!username || !password) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }
  const user = users[username];
  if (!user) {
    return res.status(401).json({ message: 'Неверные имя пользователя или пароль' });
  }
  try {
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверные имя пользователя или пароль' });
    }
    req.session.user = username;
    res.json({ message: 'Вход выполнен успешно' });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Неавторизован' });
  }
  // Исправлена строка с использованием шаблонной строки
  res.json({ message: `Вы авторизованы как ${req.session.user}` });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка выхода из системы' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Вы вышли из системы' });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});

// Загрузка видео с проверкой сессии
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.session.user) {
    // Если файл был загружен, но пользователь не авторизован - удаляем файл
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(401).json({ message: 'Требуется авторизация для загрузки файлов' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'Файл не загружен' });
  }
  filesMetadata[req.file.filename] = {
    originalName: req.file.originalname,
    uploader: req.session.user,
    uploadDate: new Date().toISOString(),
  };
  res.json({ message: 'Файл успешно загружен', fileId: req.file.filename });
});

// Просмотр/загрузка видео по паролю
app.post('/files/:fileId', (req, res) => {
  const { fileId } = req.params;
  const { password } = req.body;

  if (!filesMetadata[fileId]) {
    return res.status(404).json({ message: 'Файл не найден' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Введите пароль для просмотра' });
  }
  if (password !== FILE_VIEW_PASSWORD) {
    return res.status(403).json({ message: 'Неверный пароль для просмотра файла' });
  }
  const filePath = path.join(UPLOAD_DIR, fileId);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Файл отсутствует на сервере' });
  }
  res.download(filePath, filesMetadata[fileId].originalName);
});


app.listen(PORT, '26.162.110.67', () => {
  console.log(`Сервер запущен на http://192.168.0.5:${PORT}`);
});


