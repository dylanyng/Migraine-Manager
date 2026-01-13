// Custom colors - Colorblind-safe palette optimized for dark backgrounds
const dark = 'rgba(67, 56, 202, 1)'; // indigo-700 - darker blue, distinguishable
const medium = 'rgba(245, 158, 11, 1)'; // amber-500 - orange/amber, colorblind-safe contrast
const light = 'rgba(125, 211, 252, 1)'; // sky-300 - soft light blue, not too bright
const darkGray = 'rgba(71, 85, 105, 1)'; // slate-600 - neutral gray for grids


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

// DOUGHNUT CHART
// Pain Location Doughnut Chart
const painLocationCtx = document.getElementById('painLocationChart').getContext('2d');
new Chart(painLocationCtx, {
  type: 'doughnut',
  data: {
    labels: painLocationData.map(location => location._id),
    datasets: [{
      data: painLocationData.map(location => location.count),
      backgroundColor: [light, medium, dark, 'rgba(34, 197, 94, 1)', 'rgba(139, 92, 246, 1)', 'rgba(202, 138, 4, 1)'], // green-500, violet-500, amber-600 - colorblind-safe, not too bright
      borderColor: '#000000',
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          boxWidth: 15,
          padding: 10,
          font: {
            size: 11
          }
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
    maintainAspectRatio: true,
    scales: {
      x: {
        ticks: {
          color: light,
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: light,
          stepSize: 2,
          precision: 0
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

// BAR CHART
// Medication Quantity 
const medicationQuantityCtx = document.getElementById('medicationQuantityChart').getContext('2d');
new Chart(medicationQuantityCtx, {
  type: 'bar',
  data: {
    labels: medicationData.map(month => month._id),
    datasets: [
      {
        label: medicationData[0]?.medications[0]?.name || 'Medication 1',
        data: medicationData.map(month => month.medications[0]?.quantity || 0),
        backgroundColor: light,
      },
      {
        label: medicationData[0]?.medications[1]?.name || 'Medication 2',
        data: medicationData.map(month => month.medications[1]?.quantity || 0),
        backgroundColor: medium,
      },
      {
        label: medicationData[0]?.medications[2]?.name || 'Medication 3',
        data: medicationData.map(month => month.medications[2]?.quantity || 0),
        backgroundColor: dark,
      }
    ]
  },
  options: {
    ...chartOptions,
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ...chartOptions.scales.x
      },
      y: {
        stacked: true,
        ...chartOptions.scales.y
      }
    }
  }
});

