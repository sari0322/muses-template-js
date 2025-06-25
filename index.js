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
          calendarHtml += `<td>${day}</td>`;
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
