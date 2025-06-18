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

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;

    // 選択状態更新
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    // 件数計算
    const count = data.filter((item) => item.category === category && !item.read).length;
    message.textContent = `${count} 件あります`;

    // 押されたボタンの背景色を取得してメッセージ背景に設定
    const bgColor = window.getComputedStyle(btn).backgroundColor;
    message.style.backgroundColor = bgColor;
  });
});
