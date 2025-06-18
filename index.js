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
  // その他カテゴリ（全て既読または0件）
  { category: 'important', read: true },
  { category: 'job_search', read: true }
];

document.querySelectorAll('#category_buttons button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    const count = data.filter((item) => item.category === category && !item.read).length;
    document.getElementById('category_message').textContent = `${count} 件あります`;
  });
});
