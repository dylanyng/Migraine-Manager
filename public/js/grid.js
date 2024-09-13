function createMigraineContributionGrid(containerId, migraineEvents) {
    const container = document.getElementById(containerId);
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 181); // 181 Or 363
  
    const dateRange = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      dateRange.push(new Date(d));
    }
  
    function getEventForDate(date) {
      return migraineEvents.find(event => isSameDay(new Date(event.date), date));
    }
  
    function isSameDay(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate();
    }
  
    function getColorForEvent(event) {
      if (!event) return 'bg-gray-500/50';
      switch (event.attackType) {
        case 'migraine':
          return 'bg-red-900/50';
        case 'headache':
          return 'bg-orange-900/50';
        case 'misc symptoms':
          return 'bg-yellow-900/50';
        default:
          return 'bg-blue-900/50';
      }
    }
  
    const weeks = [];
    for (let i = 0; i < 26; i++) { //26 or 52
      weeks.push(dateRange.slice(i * 7, (i + 1) * 7));
    }
  
    let gridHTML = '<div class="inline-flex gap-1">';
    weeks.forEach((week, weekIndex) => {
      gridHTML += '<div class="flex flex-col gap-1">';
      week.forEach((date, dayIndex) => {
        const event = getEventForDate(date);
        const color = getColorForEvent(event);
        const title = event 
          ? `${date.toLocaleDateString()}: ${event.attackType}`
          : date.toLocaleDateString();
        gridHTML += `<div class="w-3 h-3 rounded-sm ${color}" title="${title}"></div>`;
      });
      gridHTML += '</div>';
    });
    gridHTML += '</div>';
  
    container.innerHTML = gridHTML;
  }