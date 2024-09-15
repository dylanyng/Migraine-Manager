// Custom colors
const dark = 'rgba(79, 70, 229, 1)';
const medium = 'rgba(0, 152, 233, 1)';
const light = 'rgba(170, 248, 209, 1)';
const darkGray = '#4d4d4d';


// Pass data from server to client-side JavaScript
const attackTypesData = window.attackTypesData;
const monthlyAttacksData = window.monthlyAttacksData;
const topTriggersData = window.topTriggersData;


const chartOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#ffffff' 
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: light
      },
      grid: {
        color: darkGray
      }
    },
    y: {
      ticks: {
        color: light 
      },
      grid: {
        color: darkGray
      }
    }
  }
};



// DOUGHNUT CHART
// Attack Type 
const attackTypeCtx = document.getElementById('attackTypeChart').getContext('2d');
new Chart(attackTypeCtx, {
  type: 'doughnut',
  data: {
    labels: attackTypesData.map(type => type._id),
    datasets: [{
      data: attackTypesData.map(type => type.count),
      backgroundColor: [light, medium, dark],
      borderColor: '#000000',
      weight: 1,
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    }
  }
});


// BAR CHART
// Top Triggers
const topTriggersCtx = document.getElementById('topTriggersChart').getContext('2d');
new Chart(topTriggersCtx, {
  type: 'bar',
  data: {
    labels: topTriggersData.map(trigger => trigger._id),
    datasets: [{
      label: 'Occurrences',
      data: topTriggersData.map(trigger => trigger.count),
      backgroundColor: medium
    }]
  },
  options: {
    
    plugins: {
      legend: {
        labels: {
          color: '#ffffff' 
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: light
        }
      },
      y: {
        ticks: {
          color: light,
          stepSize: 1
        },
        grid: {
          color: darkGray
        }
      }
    }
  }
});


// LINE CHART
// Monthly Attacks
const monthlyAttacksCtx = document.getElementById('monthlyAttacksChart').getContext('2d');
new Chart(monthlyAttacksCtx, {
  type: 'line',
  data: {
    labels: monthlyAttacksData.map(month => month._id),
    datasets: [
      {
        label: 'Migraine',
        data: monthlyAttacksData.map(month => month.migraine),
        borderColor: dark,
        fill: false
      },
      {
        label: 'Headache',
        data: monthlyAttacksData.map(month => month.headache),
        borderColor: medium,
        fill: false
      },
      {
        label: 'Misc Symptoms',
        data: monthlyAttacksData.map(month => month.miscSymptoms),
        borderColor: light,
        fill: false
      }
    ]
  },
  options: chartOptions
});