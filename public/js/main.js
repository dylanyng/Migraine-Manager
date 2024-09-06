function detectTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  document.getElementById('timezone').value = timezone;
}

window.onload = detectTimezone;