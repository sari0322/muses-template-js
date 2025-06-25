document.querySelector('.toggle').addEventListener('click', function () {
  this.textContent = this.textContent === 'オン・オフ' ? 'オフ・オン' : 'オン・オフ';
});

window.onload = function () {
  Notification.requestPermission();
  const notification = new Notification('Check!');
};
