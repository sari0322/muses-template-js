document.querySelector('.toggle').addEventListener('click', function () {
  this.textContent = this.textContent === 'オン・オフ' ? 'オフ・オン' : 'オン・オフ';
});

window.onload = function () {
  Notification.requestPermission();
  const notification = new Notification('Check!');
};

const checktime = function () {
  const currentTime = new Date();
  console.log('currentTime');
  const minutes = currentTime.getMinutes();
  if (previousMinutes !== minutes && minutes % 15 === 0) {
    previousMinutes = minutes;
    const notification = new Notification('Check!');
  }
};
