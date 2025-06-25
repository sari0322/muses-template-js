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

<<<<<<< HEAD
  showCalendar(year, month);
}

document.querySelector('#prev').addEventListener('click', moveCalendar);
document.querySelector('#next').addEventListener('click', moveCalendar);

showCalendar(year, month);
// const weeks = ['日', '月', '火', '水', '木', '金', '土'];
// const date = new Date();
// const year = date.getFullYear();
// const month = date.getMonth() + 1;
const startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
const endDate = new Date(year, month, 0); // 月の最後の日を取得
const endDayCount = endDate.getDate(); // 月の末日
const lastMonthEndDate = new Date(year, month - 1, 0); // 前月の最後の日の情報
const lastMonthendDayCount = lastMonthEndDate.getDate(); // 前月の末日
const startDay = startDate.getDay(); // 月の最初の日の曜日を取得
let dayCount = 1; // 日にちのカウント
let calendarHtml = ''; // HTMLを組み立てる変数

calendarHtml += '<h1>' + year + '/' + month + '</h1>';
calendarHtml += '<table>';

// 曜日の行を作成
for (let i = 0; i < weeks.length; i++) {
  calendarHtml += '<td>' + weeks[i] + '</td>';
}

for (let w = 0; w < 6; w++) {
  calendarHtml += '<tr>';

  for (let d = 0; d < 7; d++) {
    if (w == 0 && d < startDay) {
      // 1行目で1日の曜日の前
      let num = lastMonthendDayCount - startDay + d + 1;
      calendarHtml += '<td class="is-disabled">' + num + '</td>';
    } else if (dayCount > endDayCount) {
      // 末尾の日数を超えた
      let num = dayCount - endDayCount;
      calendarHtml += '<td class="is-disabled">' + num + '</td>';
      dayCount++;
    } else {
      calendarHtml += '<td>' + dayCount + '</td>';
      dayCount++;
=======
  document.getElementById('next').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth === 13) {
      currentMonth = 1;
      currentYear++;
>>>>>>> 5c657336a20d7ef1041337483bbeca999bfaddac
    }
    renderCalendar(currentYear, currentMonth);
  });
});
