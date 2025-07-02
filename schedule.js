document.querySelector('.toggle').addEventListener('click', function () {
  this.textContent = this.textContent === 'オン・オフ' ? 'オフ・オン' : 'オン・オフ';
});

window.onload = function () {
  Notification.requestPermission();
  const notification = new Notification('Check!');
};

//通知
const start = document.getElementById('start');
const end = document.getElementById('end');
const notification = document.getElementById('notification');
const selected = notification.value;
const targetTime = new Date(currentTime);
const startTime = new Date(start.value);
const title = document.getElementById('title');

const checktime = function () {
  const currentTime = new Date(); // 現在時刻

  if (Notification.permission === 'granted') {
    Notification.requestPermission();
  }

  if (selected === '毎日') {
    targetTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  } else if (selected === '毎週') {
    if (currentTime.getDay() !== startTime.getDay()) return;
    targetTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  } else if (selected === '隔週') {
    const weekNumber = getWeekNumber(currentTime);
    const startWeekNumber = getWeekNumber(startTime);
    const isSameWeekday = currentTime.getDay() === startTime.getDay();
    const isEvenWeek = (weekNumber - startWeekNumber) % 2 === 0;
    if (!isSameWeekday || !isEvenWeek) return;
    targetTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  } else if (selected === '毎月') {
    if (currentTime.getDate() !== startTime.getDate()) return;
    targetTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
  } else {
    return; // その他の選択肢は無視
  }

  const timeDiff = Math.abs(currentTime - targetTime);
  const hasNotifiedRecently = lastNotified && Math.abs(currentTime - lastNotified) < 60000;

  if (timeDiff < 60000 && !hasNotifiedRecently) {
    new Notification(`${title}の通知：開始時間です！`);
    lastNotified = new Date(currentTime);
  }

  const minutes = currentTime.getMinutes();
  if (previousMinutes !== minutes && minutes % 15 === 0) {
    previousMinutes = minutes;
    const notification = new Notification('Check!');
  }
};

setInterval(checktime, 1000 * 30);
