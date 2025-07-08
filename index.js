'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  const username = sessionStorage.username;
  if (!username) {
    window.alert('ログインしてください');
    location.href = 'login.html';
  }
  document.querySelector('#user_name span').textContent = username;

  // 通知権限の確認とリクエスト、通知のスケジューリング
  (async () => {
    if (!('Notification' in window)) {
      console.log('このブラウザは通知に対応していません。');
      return;
    }

    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }

    if (Notification.permission === 'granted') {
      scheduleNotifications();
    }
  })();

  const res = await fetch('data.json');
  const obj = await res.json();

  document.querySelectorAll('span.unread').forEach((el) => (el.textContent = obj.list.length));

  renderCalendar(currentYear, currentMonth);
  renderSchedules();
  function scheduleNotifications() {
    const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');

    schedules.forEach((schedule) => {
      const notificationTime = new Date(schedule.start).getTime();
      const now = Date.now();
      const delay = notificationTime - now;

      // 通知予定時刻が未来のときだけセット
      if (delay > 0) {
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(`${schedule.title} の時間です！`);
          }
        }, delay);
      }
    });
  }
});

// カテゴリボタン
const data = [
  { category: 'favorites', read: false },
  { category: 'favorites', read: false },
  { category: 'read', read: false },
  { category: 'read', read: false },
  { category: 'read', read: false },
  { category: 'read', read: false },
  { category: 'important', read: true },
  { category: 'job_search', read: true }
];

const buttons = document.querySelectorAll('#category_buttons button');
const message = document.getElementById('category_message');

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const count = data.filter((item) => item.category === category && !item.read).length;
    message.textContent = `未読表示が${count} 件あります`;

    const bgColor = window.getComputedStyle(btn).backgroundColor;
    message.style.backgroundColor = bgColor;
  });
});

// カレンダー表示
let currentYear = 2025;
let currentMonth = 7;
const weeks = ['日', '月', '火', '水', '木', '金', '土'];

function renderCalendar(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const startDay = startDate.getDay();
  const endDay = endDate.getDate();
  const eventList = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');

  let day = 1;
  let calendarHtml = `<h1>${year}年 ${month}月</h1>`;
  calendarHtml += '<table><tr>' + weeks.map((w) => `<th>${w}</th>`).join('') + '</tr>';

  for (let w = 0; w < 6; w++) {
    calendarHtml += '<tr>';
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < startDay) || day > endDay) {
        calendarHtml += '<td class="is-disabled"></td>';
      } else {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        calendarHtml += `<td><div class="day-number">${day}</div></td>`;
        day++;
      }
    }
    calendarHtml += '</tr>';
    if (day > endDay) break;
  }

  calendarHtml += '</table>';
  document.getElementById('calendar').innerHTML = calendarHtml;
}

document.getElementById('prev').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth === 0) {
    currentMonth = 12;
    currentYear--;
  }
  renderCalendar(currentYear, currentMonth);
});

document.getElementById('next').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth === 13) {
    currentMonth = 1;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth);
});

// Information欄の予定表示
function renderSchedules() {
  const infoDiv = document.getElementById('information');
  let schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
  let scheduledEvents = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');

  if (schedules.length === 0) {
    infoDiv.textContent = '予定はありません。';
    return;
  }

  const ul = document.createElement('ul');
  schedules.forEach((schedule, index) => {
    const li = document.createElement('li');

    const startDate = new Date(schedule.start);
    const endDate = new Date(schedule.end);
    const startStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(
      startDate.getDate()
    ).padStart(2, '0')} ${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(
      2,
      '0'
    )}`;
    const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(
      endDate.getDate()
    ).padStart(2, '0')} ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(
      2,
      '0'
    )}`;

    li.textContent = `${schedule.title}  ${startStr} ～ ${endStr}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.addEventListener('click', () => {
      schedules.splice(index, 1);
      localStorage.setItem('schedules', JSON.stringify(schedules));
      scheduledEvents = scheduledEvents.filter(
        (ev) => !(ev.title === schedule.title && ev.date === schedule.start.substr(0, 10))
      );
      localStorage.setItem('scheduledEvents', JSON.stringify(scheduledEvents));
      renderSchedules();
      renderCalendar(currentYear, currentMonth);
    });

    li.appendChild(deleteBtn);
    ul.appendChild(li);
  });

  infoDiv.innerHTML = '';
  infoDiv.appendChild(ul);
}
