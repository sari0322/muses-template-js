document.querySelector('.toggle').addEventListener('click', function () {
  this.textContent = this.textContent === 'オン・オフ' ? 'オフ・オン' : 'オン・オフ';
});

const add = document.getElementsByClassName('add');

window.onload = function () {
  Notification.requestPermission();
  const notification = new Notification('Check!');
};

//日付指定
const start = document.getElementById('start');
const end = document.getElementById('end');
const storage = localStorage;
//通知

let selected = null;
let startTime = null;
let titleText = '';
let lastNotified = null;
let previousMinutes = -1;
const addButton = document.querySelector('.add');
const titleInput = document.getElementById('title');
const notificationSelect = document.getElementById('notification');

addButton.addEventListener('click', () => {
  const dateOnly = startValue.split('T')[0];
  const newEvent = { date: dateOnly, title: titleValue };

  // 既存の予定を取得
  const eventList = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');
  eventList.push(newEvent);

  // 保存
  localStorage.setItem('scheduledEvents', JSON.stringify(eventList));

  if (!storedDates.includes(dateOnly)) {
    storedDates.push(dateOnly);
    localStorage.setItem('scheduledDates', JSON.stringify(storedDates));
  }

  titleText = titleInput.value.trim();
  selected = notificationSelect.value;
  startTime = new Date(document.getElementById('start').value);

  if (!titleText) {
    alert('タイトルを入力してください');
    return;
  }

  if (selected === 'しない' || !selected) {
    alert('通知は設定されていません');
    return;
  }

  // 通知確認（追加直後にも1回通知させるなら以下）
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(`「${titleText}」を登録しました（${selected}通知）`);
      }
    });
  } else {
    new Notification(`「${titleText}」を登録しました（${selected}通知）`);
  }
});
const checktime = function () {
  const currentTime = new Date();

  if (!selected || selected === 'しない' || !startTime || !titleText) return;

  const targetTime = new Date(currentTime);

  if (selected === '毎日') {
    targetTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  } else if (selected === '毎週') {
    if (currentTime.getDay() !== startTime.getDay()) return;
    targetTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  } else if (selected === '隔週') {
    const weekNumber = getWeekNumber(currentTime);
    const startWeekNumber = getWeekNumber(startTime);
    if ((weekNumber - startWeekNumber) % 2 !== 0 || currentTime.getDay() !== startTime.getDay()) return;
    targetTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  } else if (selected === '毎月') {
    if (currentTime.getDate() !== startTime.getDate()) return;
    targetTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  } else {
    return;
  }

  const timeDiff = Math.abs(currentTime - targetTime);
  const hasNotifiedRecently = lastNotified && Math.abs(currentTime - lastNotified) < 60000;

  if (timeDiff < 60000 && !hasNotifiedRecently) {
    new Notification(`「${titleText}」の通知：開始時間です`);
    lastNotified = new Date(currentTime);
  }

  // 1分ごとのデバッグ用通知
  const minutes = currentTime.getMinutes();
  if (previousMinutes !== minutes) {
    previousMinutes = minutes;
    new Notification(`（1分チェック）「${titleText}」`);
  }
};
setInterval(checktime, 1000 * 30); // 30秒ごと

document.querySelector('.add').addEventListener('click', () => {
  const title = document.getElementById('title').value.trim();
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;

  if (!title || !start || !end) {
    alert('タイトル、開始日時、終了日時は必須です。');
    return;
  }

  const newSchedule = { title, start, end };
  const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
  schedules.push(newSchedule);
  localStorage.setItem('schedules', JSON.stringify(schedules));

  window.location.href = 'index.html'; // index.htmlに遷移
});
