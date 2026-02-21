const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Указываем папку для статических файлов
app.use(express.static(path.join(__dirname)));

// Обработка маршрута для index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});
