// Target the date picker on the page
const dateInput = document.getElementById('date');

// Get today's date in YYYY-MM-DD format, based on user's time zone
const today = new Date().toLocaleString("sv").split(' ')[0];

// Set date picker value to today
function setDateAsToday() {
  dateInput.value = today;
}

// Restrict future dates from selection
function restrictFutureDates() {
  dateInput.setAttribute('max', today);
}