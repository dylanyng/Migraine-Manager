function detectTimezone() {
  const timezoneInput = document.getElementById('timezone');
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