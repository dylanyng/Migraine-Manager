// Pass data from server to client-side JavaScript
const attackTypesData = <%- JSON.stringify(attackTypes) %>;
const monthlyAttacksData = <%- JSON.stringify(monthlyAttacks) %>;
const topTriggersData = <%- JSON.stringify(topTriggers) %>;

// Attack Types Pie Chart
const attackTypeCtx = document.getElementById('attackTypeChart').getContext('2d');
new Chart(attackTypeCtx, {
  type: 'pie',
  data: {
    labels: attackTypesData.map(type => type._id),
    datasets: [{
      data: attackTypesData.map(type => type.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
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