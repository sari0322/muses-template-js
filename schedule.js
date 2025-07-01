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

const checktime = function () {
  const currentTime = new Date(); // 現在時刻

  if (start.value) {
    const starttime = new Date(start.value);
    if (Notification.permission === 'granted') {
      new Notification('開始時間になりました！（毎日通知）');
    }
  }

  const minutes = currentTime.getMinutes();
  if (previousMinutes !== minutes && minutes % 15 === 0) {
    previousMinutes = minutes;
    const notification = new Notification('Check!');
  }
};
