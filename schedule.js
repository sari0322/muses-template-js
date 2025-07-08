document.querySelector('.add').addEventListener('click', () => {
  const titleInput = document.getElementById('title');
  const startInput = document.getElementById('start');
  const endInput = document.getElementById('end');
  const repeatSelect = document.getElementById('repeat');
  const notificationSelect = document.getElementById('notification');

  const titleText = titleInput.value.trim();
  const startValue = startInput.value;
  const endValue = endInput.value;

  if (!titleText || !startValue || !endValue) {
    alert('タイトル、開始日時、終了日時は必須です。');
    return;
  }

  const startDate = new Date(startValue);
  const endDate = new Date(endValue);
  const repeat = repeatSelect.value;

  let repeatCount = 1;
  if (repeat === '毎日') repeatCount = 7;
  else if (repeat === '毎週') repeatCount = 4;
  else if (repeat === '毎月') repeatCount = 3;
  else if (repeat === '毎年') repeatCount = 2;

  let schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
  let scheduledEvents = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');
  let scheduledDates = JSON.parse(localStorage.getItem('scheduledDates') || '[]');

  for (let i = 0; i < repeatCount; i++) {
    let newStart = new Date(startDate);
    let newEnd = new Date(endDate);

    if (repeat === '毎日') {
      newStart.setDate(newStart.getDate() + i);
      newEnd.setDate(newEnd.getDate() + i);
    } else if (repeat === '毎週') {
      newStart.setDate(newStart.getDate() + i * 7);
      newEnd.setDate(newEnd.getDate() + i * 7);
    } else if (repeat === '毎月') {
      newStart.setMonth(newStart.getMonth() + i);
      newEnd.setMonth(newEnd.getMonth() + i);
    } else if (repeat === '毎年') {
      newStart.setFullYear(newStart.getFullYear() + i);
      newEnd.setFullYear(newEnd.getFullYear() + i);
    }

    schedules.push({
      title: titleText,
      start: newStart.toISOString(),
      end: newEnd.toISOString()
    });

    const dateOnly = newStart.toISOString().split('T')[0];
    if (!scheduledDates.includes(dateOnly)) {
      scheduledDates.push(dateOnly);
    }

    scheduledEvents.push({
      title: titleText,
      date: dateOnly
    });
  }

  localStorage.setItem('schedules', JSON.stringify(schedules));
  localStorage.setItem('scheduledDates', JSON.stringify(scheduledDates));
  localStorage.setItem('scheduledEvents', JSON.stringify(scheduledEvents));

  window.location.href = 'index.html';
});
