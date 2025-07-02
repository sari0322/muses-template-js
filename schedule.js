document.querySelector('.toggle').addEventListener('click', function () {
  this.textContent = this.textContent === 'オン・オフ' ? 'オフ・オン' : 'オン・オフ';
});

const add = document.getElementsByClassName('add');

window.onload = function () {
  Notification.requestPermission();
};

//日付指定
const start = document.getElementById('start');
const end = document.getElementById('end');
const storage = localStorage;
const title = document.getElementById('title');
//通知

let selected = null;
let startTime = null;
let titleText = '';
let lastNotified = null;
let previousMinutes = -1;
const addButton = document.querySelector('.add');
// const titleInput = document.getElementById('title');
const notificationSelect = document.getElementById('notification');
let storedDates = JSON.parse(localStorage.getItem('scheduledDates') || '[]');

addButton.addEventListener('click', () => {
  const dateOnly = start.value.split('T')[0];
  const newEvent = { date: dateOnly, title: title.value };

  // 既存の予定を取得
  const eventList = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');
  eventList.push(newEvent);

  // 保存
  localStorage.setItem('scheduledEvents', JSON.stringify(eventList));

  if (!storedDates.includes(dateOnly)) {
    storedDates.push(dateOnly);
    localStorage.setItem('scheduledDates', JSON.stringify(storedDates));
  }

  titleText = title.value.trim();
  selected = notificationSelect.value;
  startTime = new Date(document.getElementById('start').value);

  if (!titleText) {
    alert('タイトルを入力してください');
    return;
  }

  const repeatSelect = notificationSelect.value;
  const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
  const storedDates = JSON.parse(localStorage.getItem('scheduledDates') || '[]');

  const startDate = new Date(startInput);
  const endDate = new Date(endInput);
  const repeatCount = 10; // 繰り返し回数（例）

  for (let i = 0; i < repeatCount; i++) {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    if (repeatSelect === '毎日') {
      newStart.setDate(startDate.getDate() + i);
      newEnd.setDate(endDate.getDate() + i);
    } else if (repeatSelect === '毎週') {
      newStart.setDate(startDate.getDate() + i * 7);
      newEnd.setDate(endDate.getDate() + i * 7);
    } else if (repeatSelect === '隔週') {
      newStart.setDate(startDate.getDate() + i * 14);
      newEnd.setDate(endDate.getDate() + i * 14);
    } else if (repeatSelect === '毎月') {
      newStart.setMonth(startDate.getMonth() + i);
      newEnd.setMonth(endDate.getMonth() + i);
    } else if (repeatSelect === '毎年') {
      newStart.setFullYear(startDate.getFullYear() + i);
      newEnd.setFullYear(endDate.getFullYear() + i);
    } else if (repeatSelect === 'しない') {
      if (i > 0) break;
    }

    schedules.push({
      title: titleText,
      start: newStart.toISOString(),
      end: newEnd.toISOString()
    });

    const dateOnly = newStart.toISOString().split('T')[0];
    if (!storedDates.includes(dateOnly)) {
      storedDates.push(dateOnly);
    }
  }

  localStorage.setItem('schedules', JSON.stringify(schedules));
  localStorage.setItem('scheduledDates', JSON.stringify(storedDates));

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
};

document.querySelector('.add').addEventListener('click', () => {
  const title = document.getElementById('title').value.trim();
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;

  if (!title || !start || !end) {
    alert('タイトル、開始日時、終了日時は必須です。');
    return;
  }

  // const newSchedule = { title, start, end };
  // const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
  // schedules.push(newSchedule);
  // localStorage.setItem('schedules', JSON.stringify(schedules));

  window.location.href = 'index.html'; // index.htmlに遷移
});
