// Custom colors to match tailwind colors from list view
const tRed = 'rgba(116, 42, 42, 1)';
const tOrange = 'rgba(123, 52, 30, 1)';
const tYellow = 'rgba(116, 66, 16, 1)';

// Pass data from server to client-side JavaScript
const attackTypesData = window.attackTypesData;
const monthlyAttacksData = window.monthlyAttacksData;
const topTriggersData = window.topTriggersData;

// Attack Type Doughnut Chart
const attackTypeCtx = document.getElementById('attackTypeChart').getContext('2d');
new Chart(attackTypeCtx, {
  type: 'doughnut',
  data: {
    labels: attackTypesData.map(type => type._id),
    datasets: [{
      data: attackTypesData.map(type => type.count),
      backgroundColor: [tRed, tOrange, tYellow],
      borderColor: '#000000',
      weight: 1,
    }]
  }
});

// Monthly Attacks Line Chart
const monthlyAttacksCtx = document.getElementById('monthlyAttacksChart').getContext('2d');
new Chart(monthlyAttacksCtx, {
  type: 'line',
  data: {
    labels: monthlyAttacksData.map(month => month._id),
    datasets: [{
      label: 'Number of Attacks',
      data: monthlyAttacksData.map(month => month.count),
      borderColor: '#36A2EB',
      fill: false
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});

// Top Triggers Bar Chart
const topTriggersCtx = document.getElementById('topTriggersChart').getContext('2d');
new Chart(topTriggersCtx, {
  type: 'bar',
  data: {
    labels: topTriggersData.map(trigger => trigger._id),
    datasets: [{
      label: 'Occurrences',
      data: topTriggersData.map(trigger => trigger.count),
      backgroundColor: '#FFCE56'
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});