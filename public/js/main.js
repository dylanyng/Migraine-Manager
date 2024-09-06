// Time zone detection
function detectTimezone() {
  const timezoneInput = document.getElementById('timezone');
  // Check if timezone element is on page before running
  if (timezoneInput) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    timezoneInput.value = timezone;
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', detectTimezone);
} else {
  detectTimezone();
}