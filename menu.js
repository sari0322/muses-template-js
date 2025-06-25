'use strict';

let data = []; // JSONからの通知一覧データ
const categoryData = [
  { category: 'favorites', read: false },
  { category: 'favorites', read: false },
  { category: 'read', read: false },
  { category: 'read', read: false },
  { category: 'read', read: false },
  { category: 'read', read: false },
  { category: 'important', read: true },
  { category: 'job_search', read: true }
];

document.addEventListener('DOMContentLoaded', async () => {
  const username = sessionStorage.username;
  if (!username) {
    alert('ログインしてください');
    location.href = 'login.html';
    return;
  }

  document.querySelector('#user_name span').textContent = username;

  const res = await fetch('data.json');
  const obj = await res.json();

  data = obj.list;

  document.querySelectorAll('span.unread').forEach((el) => {
    el.textContent = data.length;
  });

  renderList(); // 初期表示

  // 表示ボタン処理（重要・お気に入りなどチェックされたカテゴリでフィルター）
  const displayButton = document.querySelector('#checklist button');
  displayButton.addEventListener('click', () => {
    const checked = Array.from(document.querySelectorAll('#checklist input[type="checkbox"]:checked'));
    const selectedCategories = checked.map((c) => c.dataset.category);

    const options = {
      important: selectedCategories.includes('important'),
      favorites: selectedCategories.includes('favorites')
    };

    renderList(options);
  });

  // カテゴリボタンの未読件数表示処理
  const buttons = document.querySelectorAll('#category_buttons button');
  const message = document.getElementById('category_message');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      // ボタンのアクティブ表示切り替え
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // 未読件数計算（categoryDataを使用）
      const count = categoryData.filter((item) => item.category === category && !item.read).length;
      message.textContent = `未読表示が${count} 件あります`;

      // ボタンの背景色を取得しメッセージ背景に設定
      const bgColor = window.getComputedStyle(btn).backgroundColor;
      message.style.backgroundColor = bgColor;
    });
  });
});

// renderList関数は元のまま（略）
// ... ここにrenderList関数をコピペしてください ...

function renderList(options = {}) {
  const info_list = document.querySelector('#info_list');
  info_list.innerHTML = '';

  for (const item of data) {
    // OR条件でフィルタする処理

    if (options.important && options.favorites) {
      // 重要 または お気に入り のどちらかを満たせばOK
      if (item.imp !== '★重要★' && !item.Button) continue;
    } else if (options.important) {
      // 重要のみチェックされている場合
      if (item.imp !== '★重要★') continue;
    } else if (options.favorites) {
      // お気に入りのみチェックされている場合
      if (!item.Button) continue;
    }

    // 両方チェックなしの場合は全件表示

    // ... 以下は元の描画処理 ...
    const record = document.createElement('div');
    record.className = 'record';

    for (const [prop, val] of Object.entries(item)) {
      const el = document.createElement('div');
      el.className = prop;

      if (prop === 'from') {
        el.innerHTML = val;
      } else if (prop === 'Button') {
        const button = document.createElement('button');
        button.textContent = val ? '★' : '☆';

        button.addEventListener('click', () => {
          item.Button = !item.Button;
          renderList(options);
        });

        el.appendChild(button);
      } else {
        el.textContent = val;
      }

      if (prop === 'subject') {
        const tri = document.createElement('div');
        tri.textContent = '\u00A0';
        tri.className = 'tri';
        record.appendChild(tri);

        const mark = document.createElement('div');
        mark.className = 'mark';
        const span = document.createElement('span');
        span.textContent = '!';
        span.className = 'exmark';
        mark.appendChild(span);
        record.appendChild(mark);
      }

      record.appendChild(el);
    }

    info_list.appendChild(record);
  }
}
