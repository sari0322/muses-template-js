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

  ////繰り返し設定
  const repeatSelect = document.getElementById('repeat').value;
  const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
  const storedDates = JSON.parse(localStorage.getItem('scheduledDates') || '[]');

  const startDate = new Date(start.value);
  const endDate = new Date(end.value);

  let repeatCount = 1;

  if (repeatSelect === '毎日') {
    repeatCount = 7; // 7日間
  } else if (repeatSelect === '毎週') {
    repeatCount = 4; // 4週間
  } else if (repeatSelect === '毎月') {
    repeatCount = 3; // 3ヶ月
  } else if (repeatSelect === '毎年') {
    repeatCount = 2; // 2年
  }

  for (let i = 0; i < repeatCount; i++) {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    if (repeatSelect === '毎日') {
      newStart.setDate(startDate.getDate() + i);
      newEnd.setDate(endDate.getDate() + i);
    } else if (repeatSelect === '毎週') {
      newStart.setDate(startDate.getDate() + i * 7);
      newEnd.setDate(endDate.getDate() + i * 7);
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
  renderSchedules();
});

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

setInterval(() => {
  const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
  const now = new Date();

  schedules.forEach((schedule) => {
    const startTime = new Date(schedule.start);
    const title = schedule.title;

    // 通知設定を取得
    const notificationSetting = document.getElementById('notification').value;

    let notifyTime = new Date(startTime);
    if (notificationSetting === '5分前') {
      notifyTime.setMinutes(startTime.getMinutes() - 5);
    } else if (notificationSetting === '30分前') {
      notifyTime.setMinutes(startTime.getMinutes() - 30);
    } else if (notificationSetting === '一時間前') {
      notifyTime.setHours(startTime.getHours() - 1);
    } else if (notificationSetting === '一日前') {
      notifyTime.setDate(startTime.getDate() - 1);
    } else if (notificationSetting === '予定の時刻') {
      // 予定の時刻に通知
      notifyTime = startTime;
    } else {
      return; // 通知設定が「しない」の場合は何もしない
    }

    const timeDiff = Math.abs(now - notifyTime);
    const within1min = timeDiff <= 60000; // 1分以内

    const notifiedKey = `notified_${title}_${schedule.start}`;
    if (within1min && !localStorage.getItem(notifiedKey)) {
      if (Notification.permission === 'granted') {
        new Notification(`「${title}」の通知：もうすぐ予定が始まります`);
        localStorage.setItem(notifiedKey, 'true'); // 二重通知を防ぐ
      } else {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification(`「${title}」の通知：もうすぐ予定が始まります`);
            localStorage.setItem(notifiedKey, 'true');
          }
        });
      }
    }
  });
}, 60000); // 1分ごとに確認

function renderFooterSchedules() {
  const footerList = document.getElementById('footerScheduleList');
  footerList.innerHTML = ''; // 一旦リセット

  const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');

  schedules.forEach((schedule) => {
    const li = document.createElement('li');
    const date = new Date(schedule.start);
    li.textContent = `「${schedule.title}」: ${date.toLocaleString()}`;
    footerList.appendChild(li);
  });
}

renderSchedules();
renderFooterSchedules(); // ←これを追加
