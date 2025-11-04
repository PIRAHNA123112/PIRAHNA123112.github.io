const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// --------------------------------------
// Рисовалки (если нужно, добавьте ваш JS для рисовалки сюда)
// --------------------------------------
// Если надо, могу помочь с рисовалкой отдельно

// --------------------------------------
// Снег – добавляем красивые падающие снежинки
// --------------------------------------


const snowContainer = document.getElementById('snow-container');
const snowflakeCount = 60;
const snowflakes = [];

class Snowflake {
  constructor() {
    this.reset();
    this.createElement();
  }
  createElement() {
    this.el = document.createElement('div');
    this.el.classList.add('snowflake');
    this.el.style.width = this.size + 'px';
    this.el.style.height = this.size + 'px';
    this.el.style.opacity = this.opacity;
    snowContainer.appendChild(this.el);
  }
  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight - window.innerHeight;
    this.size = 8 + Math.random() * 8;
    this.speedY = 1 + Math.random() * 2;
    this.speedX = Math.random() * 1 - 0.5;
    
    // Фиксируем базовую opacity и параметры для плавного мерцания
    this.baseOpacity = 0.7 + Math.random() * 0.2;
    this.opacityAmplitude = 0.05; // небольшая амплитуда
    this.opacityAngle = Math.random() * Math.PI * 2;
    this.opacitySpeed = 0.02;

    this.angle = Math.random() * 360;
    this.angularSpeed = (Math.random() - 0.5) * 0.02;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.angle) * 0.5; // мягкие колебания по X
    this.angle += this.angularSpeed;

    if (this.y > window.innerHeight) {
      this.reset();
      this.y = -this.size;
    }

    const scale = 0.7 + 0.3 * Math.sin(this.angle * 5);

    // Плавное изменение opacity
    this.opacityAngle += this.opacitySpeed;
    this.opacity = this.baseOpacity + Math.sin(this.opacityAngle) * this.opacityAmplitude;
    if (this.opacity < 0) this.opacity = 0; // на всякий случай

    this.el.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}rad) scale(${scale})`;
    this.el.style.opacity = this.opacity;
  }
}

for (let i = 0; i < snowflakeCount; i++) {
  snowflakes.push(new Snowflake());
}

function animateSnow() {
  snowflakes.forEach(flake => flake.update());
  requestAnimationFrame(animateSnow);
}

animateSnow();

window.addEventListener('resize', () => {
  snowflakes.forEach(flake => flake.reset());
});

// конец снежинок


// Рисовалка для .sign-box
  document.querySelectorAll('.sign-box').forEach(box => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.style.position = 'absolute';
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.pointerEvents = 'none';
    const polyline = document.createElementNS(svgNS, 'polyline');
    svg.appendChild(polyline);
    box.appendChild(svg);

    let drawing = false;
    let points = [];

    function getPosition(evt) {
      const rect = box.getBoundingClientRect();
      let clientX, clientY;
      if (evt.touches) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
      } else {
        clientX = evt.clientX;
        clientY = evt.clientY;
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    box.addEventListener('mousedown', e => {
      drawing = true;
      points = [];
      const pos = getPosition(e);
      points.push(`${pos.x},${pos.y}`);
      polyline.setAttribute('points', points.join(' '));
      svg.style.pointerEvents = 'auto';
    });

    box.addEventListener('touchstart', e => {
      e.preventDefault();
      drawing = true;
      points = [];
      const pos = getPosition(e);
      points.push(`${pos.x},${pos.y}`);
      polyline.setAttribute('points', points.join(' '));
      svg.style.pointerEvents = 'auto';
    }, {passive:false});

    box.addEventListener('mousemove', e => {
      if (!drawing) return;
      const pos = getPosition(e);
      points.push(`${pos.x},${pos.y}`);
      polyline.setAttribute('points', points.join(' '));
    });

    box.addEventListener('touchmove', e => {
      if (!drawing) return;
      e.preventDefault();
      const pos = getPosition(e);
      points.push(`${pos.x},${pos.y}`);
      polyline.setAttribute('points', points.join(' '));
    }, {passive:false});

    window.addEventListener('mouseup', () => {
      drawing = false;
      svg.style.pointerEvents = 'none';
    });
    window.addEventListener('touchend', () => {
      drawing = false;
      svg.style.pointerEvents = 'none';
    });
  });

  // Tooltip toggle
  document.querySelectorAll('.tooltip-btn').forEach(btn => {
    const tooltipId = btn.getAttribute('aria-describedby');
    const tooltip = document.getElementById(tooltipId);

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        tooltip.classList.add('tooltip-show');
        tooltip.setAttribute('aria-hidden', 'false');
      } else {
        tooltip.classList.remove('tooltip-show');
        tooltip.setAttribute('aria-hidden', 'true');
      }
    });

    // Скрытие tooltip при потере фокуса
    btn.addEventListener('blur', () => {
      btn.setAttribute('aria-expanded', 'false');
      tooltip.classList.remove('tooltip-show');
      tooltip.setAtt
ribute('aria-hidden', 'true');
    });
  });
    // Тултипы
  const tooltipButtons = document.querySelectorAll('.tooltip-btn');
  tooltipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tooltipId = btn.getAttribute('aria-describedby');
      const tooltip = document.getElementById(tooltipId);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      tooltip.setAttribute('aria-hidden', String(expanded));
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Модальное окно и кнопки "Со�
    const modal = document.getElementById('modal-overlay');
  const agreeButtons = document.querySelectorAll('.agree-button');
  const touchAreaa = document.getElementById('touch-areaa');
  let fingerTimer = null;

  // Открыть модальное окно по кнопке
  agreeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'flex';
      modal.focus();
      touchAreaa.classList.remove('active');
    });
  });

  // Закрытие по удержанию пальца в специальной зоне
  const closeTouchDuration = 1500;

  function closeModal() {
    modal.style.display = 'none';
  }

  function startHold() {
    touchAreaa.classList.add('active');
    if (fingerTimer) clearTimeout(fingerTimer);
    fingerTimer = setTimeout(() => {
      closeModal();
      touchAreaa.classList.remove('active');
    }, closeTouchDuration);
  }

  function cancelHold() {
    touchAreas.classList.remove('active');
    if (fingerTimer) {
      clearTimeout(fingerTimer);
      fingerTimer = null;
    }
  }

  // События для мыши и сенсора
  touchAreaa.addEventListener('mousedown', e => {
    e.preventDefault();
    startHold();
  });
  touchAreaa.addEventListener('touchstart', e => {
    e.preventDefault();
    startHold();
  });
  touchAreaa.addEventListener('mouseup', e => {
    e.preventDefault();
    cancelHold();
  });
  touchAreaa.addEventListener('mouseleave', e => {
    e.preventDefault();
    cancelHold();
  });
  touchAreaa.addEventListener('touchend', e => {
    e.preventDefault();
    cancelHold();
  });
  touchArea.addEventListener('touchcancel', e => {
    e.preventDefault();
    cancelHold();
  });

  // Esc закрытие для удобства
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Примитивная рисовалка — заменяем div.sign-box на canvas
  function setupDrawing(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = window.getComputedStyle(canvas).borderColor || '#1565c0';
    ctx.lineWidth = 2;
    let drawing = false;

    function start(e) {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(getX(e), getY(e));
      e.preventDefault();
    }
    function draw(e) {
      if (!drawing) return;
      ctx.lineTo(getX(e), getY(e));
      ctx.stroke();
      e.preventDefault();
    }
    function end(e) {
      if (drawing) {
        drawing = false;
        e.preventDefault();
      }
    }
    function getX(e) {
      const rect = canvas.getBoundingClientRect();
      return ((e.touches ? e.touches[0].clientX : e.clientX) - rect.left);
    }
    function getY(e) {
      const rect = canvas.getBoundingClientRect();
      return ((e.touches ? e.touches[0].clientY : e.clientY) - rect.top);
    }

    canvas.style.touchAction = "none";
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseout', end);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('touchcancel', end);
  }

  document.querySelectorAll('.sign-box').forEach(div => {
    const canvas = document.createElement('canvas');
    canvas.width = div.clientWidth;
    canvas.height = div.clientHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', div.getAttribute('aria-label'));
    div.replaceWith(canvas);
    setupDrawing(canvas);
  });
    const totalDays = 412;
  const initialDaysLeft = 242; // Например, состояние на сегодня

  const daysLeftElem = document.getElementById('days-left');
  const progressPassed = document.querySelector('.progress-passed');

  function calculateDaysLeft() {
    // Задаём дату, от которой начинаем отсчёт (чтобы уменьшать на 1 день ежедневно)
    const startDate = new Date('2024-03-01'); // Например, дата когда осталось 242 дня
    const today = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;

    // Считаем сколько дней прошло с startDate
    let daysPassedSinceStart = Math.floor((today - startDate) / msPerDay);
    if (daysPassedSinceStart < 0) daysPassedSinceStart = 0;

    // Считаем сколько дней осталось
    let daysLeft = initialDaysLeft - daysPassedSinceStart;
    if (daysLeft < 242) daysLeft = 242;

    return daysLeft;
  }

  function updateProgress() {
    const daysLeft = calculateDaysLeft();
    daysLeftElem.textContent = daysLeft;

    const daysPassed = totalDays - daysLeft;
    let progressPercent = (daysPassed / totalDays) * 100;
    if (progressPercent > 100) progressPercent = 100;

    progressPassed.style.width = progressPercent + '%';
  }

  updateProgress();

  // Автообновление раз в день (86400000 мс)
  setInterval(updateProgress, 86400000);


