'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  const username = sessionStorage.username;
  if (!username) {
    window.alert('ログインしてください');
    location.href = 'login.html';
  }
  document.querySelector('#user_name span').textContent = username;

  const res = await fetch('data.json');
  const obj = await res.json();

  document.querySelectorAll('span.unread').forEach((el) => (el.textContent = obj.list.length));
});

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
const wrapper = document.getElementById('category_wrapper');

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;

    // 選択状態更新
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    // 件数計算
    const count = data.filter((item) => item.category === category && !item.read).length;
    message.textContent = `未読表示が${count} 件あります`;

    // 押されたボタンの背景色を取得してメッセージ背景に設定
    const bgColor = window.getComputedStyle(btn).backgroundColor;
    message.style.backgroundColor = bgColor;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  let currentYear = 2025;
  let currentMonth = 6; // 6月から開始

  const weeks = ['日', '月', '火', '水', '木', '金', '土'];

  function renderCalendar(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const startDay = startDate.getDay();
    const endDay = endDate.getDate();

    const eventList = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');

    let day = 1;
    let calendarHtml = `<h1>${year}年 ${month}月</h1>`;
    calendarHtml += '<table>';
    calendarHtml += '<tr>' + weeks.map((w) => `<th>${w}</th>`).join('') + '</tr>';

    for (let w = 0; w < 6; w++) {
      calendarHtml += '<tr>';
      for (let d = 0; d < 7; d++) {
        if (w === 0 && d < startDay) {
          calendarHtml += '<td class="is-disabled"></td>';
        } else if (day > endDay) {
          calendarHtml += '<td class="is-disabled"></td>';
        } else {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const events = eventList.filter((ev) => ev.date === dateStr);
          let eventHtml = '';

          calendarHtml += `<td><div class="day-number">${day}</div>${eventHtml}</td>`;
          day++;
        }
      }
      calendarHtml += '</tr>';
      if (day > endDay) break;
    }

    calendarHtml += '</table>';
    document.getElementById('calendar').innerHTML = calendarHtml;
  }

  // 初期表示
  renderCalendar(currentYear, currentMonth);

  // イベントリスナー
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
});
document.addEventListener('DOMContentLoaded', () => {
  const infoDiv = document.getElementById('information');
  let schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
  let scheduledEvents = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');

  // カレンダー再描画用
  let currentYear = 2025; // 初期値、必要に応じて変更
  let currentMonth = 7;

  // renderCalendar 関数はあなたの既存コードを使う想定

  function renderSchedules() {
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

      li.textContent = `${schedule.title}  ${startStr} ～ ${endStr} `;

      // 削除ボタン作成
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '削除';
      deleteBtn.style.marginLeft = '10px';
      deleteBtn.addEventListener('click', () => {
        // schedules から削除
        schedules.splice(index, 1);
        localStorage.setItem('schedules', JSON.stringify(schedules));

        // scheduledEvents からも該当予定を削除（title と start で判定など）
        const scheduleToDelete = schedule; // 削除対象
        scheduledEvents = scheduledEvents.filter((ev) => {
          // 例えばタイトルと開始日が同じなら削除対象
          return !(ev.title === scheduleToDelete.title && ev.date === scheduleToDelete.start.substr(0, 10));
        });
        localStorage.setItem('scheduledEvents', JSON.stringify(scheduledEvents));

        renderSchedules();

        // カレンダー再描画
        renderCalendar(currentYear, currentMonth);
      });

      li.appendChild(deleteBtn);
      ul.appendChild(li);
    });

    infoDiv.innerHTML = '';
    infoDiv.appendChild(ul);
  }

  renderSchedules();
});
