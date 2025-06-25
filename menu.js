'use strict';

let data = []; // JSONデータをここに保存

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

  // 初期表示
  renderList();

  // お気に入りチェック時の絞り込み
  const favCheckbox = document.querySelector('#filterFavorites');
  if (favCheckbox) {
    favCheckbox.addEventListener('change', () => {
      renderList();
    });
  }

  // カテゴリボタンの処理
  const buttons = document.querySelectorAll('#category_buttons button');
  const message = document.getElementById('category_message');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      // ボタン選択状態
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const count = data.filter((item) => item.category === category && item.read === false).length;

      message.textContent = `未読表示が${count} 件あります`;

      // 背景色も適用
      const bgColor = window.getComputedStyle(btn).backgroundColor;
      message.style.backgroundColor = bgColor;
    });
  });
});

// 情報リストを描画する関数
function renderList(onlyFavorites = false) {
  const info_list = document.querySelector('div#info_list');
  info_list.innerHTML = '';

  for (const item of data) {
    // 引数が true のときだけお気に入りだけ表示
    if (onlyFavorites && !item.Button) continue;

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

        // お気に入り切り替え処理
        button.addEventListener('click', () => {
          item.Button = !item.Button;
          renderList(onlyFavorites); // 表示中の状態を保持
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

// 表示ボタンの処理
document.addEventListener('DOMContentLoaded', () => {
  const displayButton = document.querySelector('#checklist button');

  displayButton.addEventListener('click', () => {
    // チェックされているカテゴリを取得
    const checkedCategories = Array.from(document.querySelectorAll('#checklist input[type="checkbox"]:checked')).map(
      (checkbox) => checkbox.dataset.category
    );

    // 「お気に入り」が含まれている場合のみ処理
    if (checkedCategories.includes('favorites')) {
      renderList(true); // お気に入りだけ表示
    } else {
      renderList(false); // 通常表示
    }
  });
});
