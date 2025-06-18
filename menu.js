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
  for (let i = 0; i < data.length - 1; i += 1) {
    data[i].favorite = false;
  }
  console.log(data[0]);
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
