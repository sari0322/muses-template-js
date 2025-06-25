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
  const data = obj.list;

  console.log(data);

  const Inport = data[0]['imp']; ///重要を変数に抜き出し
  console.log(Inport);

  document.querySelectorAll('span.unread').forEach((el) => (el.textContent = data.length));

  const info_list = document.querySelector('div#info_list');

  for (const item of data) {
    const record = document.createElement('div');
    record.className = 'record';
    for (const [prop, val] of Object.entries(item)) {
      const el = document.createElement('div');
      if (prop == 'from') {
        el.innerHTML = val;
      } else if (prop == 'Button') {
        // ボタン要素を作成
        const button = document.createElement('button');
        button.textContent = val ? '★' : '☆';

        // ボタンの状態管理（true/false切替）
        button.addEventListener('click', () => {
          item.Button = !item.Button;
          button.textContent = item.Button ? '★' : '☆';
          console.log(`${item.subject} のお気に入り状態: ${item.Button}`);
        });

        el.appendChild(button); // el にボタン追加
      } else {
        el.textContent = val;
      }
      el.className = prop;

      if (prop == 'subject') {
        const tri = document.createElement('div');
        tri.textContent = '&nbsp;';
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

    //表示するときに絞り込み
    // if (bnt == bnt[buttons.length - 1]) {
    //   const checkedCategory = buttons.classList.contains('active');
    // }
  });
  const activeCheckboxes = Array.from(document.querySelectorAll('#checklist input[type="checkbox"]')).filter(
    (checkbox) => checkbox.classList.contains('active')
  );
});
