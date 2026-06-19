(function() {
  'use strict';

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  const themeToggle = document.getElementById('themeToggle');
  let theme = load('blog-theme', 'light');
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.addEventListener('click', function() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    save('blog-theme', theme);
  });

  const navLinks = document.querySelectorAll('#mainNav a');
  const sections = document.querySelectorAll('.content-section');

  function switchSection(id) {
    sections.forEach(function(s) { s.classList.remove('active'); });
    var target = document.getElementById('section-' + id);
    if (target) target.classList.add('active');
    navLinks.forEach(function(a) { a.classList.remove('active'); });
    var activeLink = document.querySelector('#mainNav a[data-section="' + id + '"]');
    if (activeLink) activeLink.classList.add('active');
  }

  navLinks.forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      switchSection(this.getAttribute('data-section'));
    });
  });

  var defaultNews = [
    { date: '18.06.2026', title: 'Обновил дизайн блога' },
    { date: '15.06.2026', title: 'Новый арт в портфолио' },
    { date: '10.06.2026', title: 'Прошёл Ultrakill на P-rank' },
    { date: '05.06.2026', title: 'Начал изучать Three.js' },
    { date: '01.06.2026', title: 'Записался на курс по Blender' }
  ];
  var news = load('blog-news', defaultNews);
  function renderNews() {
    var list = document.getElementById('newsList');
    list.innerHTML = news.map(function(n) {
      return '<div class="news-item"><span class="news-date">' + escapeHtml(n.date) + '</span><span class="news-title">' + escapeHtml(n.title) + '</span></div>';
    }).join('');
  }
  renderNews();

  var defaultReminders = [
    { text: 'Закончить скетч персонажа', done: false },
    { text: 'Обновить портфолио на Behance', done: false },
    { text: 'Купить новый графический планшет', done: false },
    { text: 'Посмотреть гайд по Ultrakill стратам', done: true }
  ];
  var reminders = load('blog-reminders', defaultReminders);
  function renderReminders() {
    var list = document.getElementById('reminderList');
    list.innerHTML = reminders.map(function(r, i) {
      return '<div class="reminder-item' + (r.done ? ' done' : '') + '">' +
        '<span class="reminder-check" data-index="' + i + '">' +
          (r.done
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>') +
        '</span>' +
        '<span class="reminder-text">' + escapeHtml(r.text) + '</span>' +
        '<span class="reminder-del" data-index="' + i + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</span>' +
        '</div>';
    }).join('');

    document.querySelectorAll('.reminder-check').forEach(function(el) {
      el.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-index'));
        reminders[idx].done = !reminders[idx].done;
        save('blog-reminders', reminders);
        renderReminders();
      });
    });
    document.querySelectorAll('.reminder-del').forEach(function(el) {
      el.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-index'));
        reminders.splice(idx, 1);
        save('blog-reminders', reminders);
        renderReminders();
      });
    });
  }
  renderReminders();

  document.getElementById('addReminderBtn').addEventListener('click', function() {
    var text = prompt('Новое напоминание:');
    if (text && text.trim()) {
      reminders.push({ text: text.trim(), done: false });
      save('blog-reminders', reminders);
      renderReminders();
    }
  });

  var notes = load('blog-notes', [
    { text: 'Научиться работать с Canvas API', date: '18.06.2026' },
    { text: 'Набросать идеи для арта в стиле cyberpunk', date: '16.06.2026' },
    { text: 'Доделать страницу достижений в портфолио', date: '14.06.2026' },
    { text: 'Выучить паттерны V2 в Ultrakill', date: '12.06.2026' },
    { text: 'Настроить CI/CD для пет-проектов', date: '10.06.2026' }
  ]);
  function renderNotes() {
    var list = document.getElementById('noteList');
    list.innerHTML = notes.map(function(n, i) {
      return '<div class="note-item">' +
        '<div><span class="note-text">' + escapeHtml(n.text) + '</span><span class="note-date">' + escapeHtml(n.date) + '</span></div>' +
        '<span class="note-del" data-index="' + i + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</span>' +
        '</div>';
    }).join('');
    document.querySelectorAll('#noteList .note-del').forEach(function(el) {
      el.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-index'));
        notes.splice(idx, 1);
        save('blog-notes', notes);
        renderNotes();
      });
    });
  }
  renderNotes();

  document.getElementById('addNoteBtn').addEventListener('click', function() {
    var input = document.getElementById('noteInput');
    var text = input.value.trim();
    if (!text) return;
    var now = new Date();
    var date = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    notes.unshift({ text: text, date: date });
    save('blog-notes', notes);
    input.value = '';
    renderNotes();
  });
  document.getElementById('noteInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') document.getElementById('addNoteBtn').click();
  });

  var plans = load('blog-plans', [
    { text: 'Создать личный сайт-портфолио', done: true },
    { text: 'Нарисовать серию артов по Ultrakill', done: false },
    { text: 'Выучить React до продвинутого уровня', done: false },
    { text: 'Пройти все уровни Ultrakill на Brutal', done: false },
    { text: 'Сделать инди-игру на Godot', done: false },
    { text: 'Участвовать в game jam', done: false }
  ]);
  function renderPlans() {
    var list = document.getElementById('planList');
    list.innerHTML = plans.map(function(p, i) {
      return '<div class="plan-item' + (p.done ? ' done' : '') + '">' +
        '<span class="plan-check" data-index="' + i + '">' +
          (p.done
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>') +
        '</span>' +
        '<span class="plan-text">' + escapeHtml(p.text) + '</span>' +
        '<span class="plan-del" data-index="' + i + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</span>' +
        '</div>';
    }).join('');
    document.querySelectorAll('#planList .plan-check').forEach(function(el) {
      el.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-index'));
        plans[idx].done = !plans[idx].done;
        save('blog-plans', plans);
        renderPlans();
      });
    });
    document.querySelectorAll('#planList .plan-del').forEach(function(el) {
      el.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-index'));
        plans.splice(idx, 1);
        save('blog-plans', plans);
        renderPlans();
      });
    });
  }
  renderPlans();

  document.getElementById('addPlanBtn').addEventListener('click', function() {
    var input = document.getElementById('planInput');
    var text = input.value.trim();
    if (!text) return;
    plans.push({ text: text, done: false });
    save('blog-plans', plans);
    input.value = '';
    renderPlans();
  });
  document.getElementById('planInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') document.getElementById('addPlanBtn').click();
  });

  var modalOverlay = document.getElementById('modalOverlay');
  var modalName = document.getElementById('modalName');
  var modalMsg = document.getElementById('modalMsg');

  function openModal() {
    modalOverlay.classList.add('open');
    modalName.value = '';
    modalMsg.value = '';
    modalName.focus();
  }
  function closeModal() {
    modalOverlay.classList.remove('open');
  }

  document.getElementById('openModalBtn').addEventListener('click', openModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeModal();
  });
  document.getElementById('modalSend').addEventListener('click', function() {
    var name = modalName.value.trim() || 'Аноним';
    var msg = modalMsg.value.trim() || 'Пустое сообщение';
    alert('Спасибо, ' + name + '! Ваше сообщение отправлено.\n\nТекст: ' + msg);
    closeModal();
  });
  modalMsg.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) document.getElementById('modalSend').click();
  });

  document.querySelectorAll('[contenteditable="true"]').forEach(function(el) {
    var key = el.getAttribute('data-key');
    if (key) {
      var saved = localStorage.getItem('ce-' + key);
      if (saved !== null) el.textContent = saved;
    }
    el.addEventListener('blur', function() {
      var k = this.getAttribute('data-key');
      if (k) localStorage.setItem('ce-' + k, this.textContent);
    });
  });

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
