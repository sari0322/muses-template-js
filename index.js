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
const weeks = ['日', '月', '火', '水', '木', '金', '土'];
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
const endDate = new Date(year, month, 0); // 月の最後の日を取得
const endDayCount = endDate.getDate(); // 月の末日
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
      calendarHtml += '<td></td>';
    } else if (dayCount > endDayCount) {
      // 末尾の日数を超えた
      calendarHtml += '<td></td>';
    } else {
      calendarHtml += '<td>' + dayCount + '</td>';
      dayCount++;
    }
  }
  calendarHtml += '</tr>';
}
calendarHtml += '</table>';

document.querySelector('#calendar').innerHTML = calendarHtml;
