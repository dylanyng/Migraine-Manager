function initializeMigraineForm() {
  // Medication //
  // Show medication details if box checked
  const medicationCheckbox = document.getElementById('medication');
  const medicationDetails = document.getElementById('medicationDetails');

  function toggleMedicationDetails() {
      medicationDetails.classList.toggle('hidden', !medicationCheckbox.checked);
  } 

  medicationCheckbox.addEventListener('change', toggleMedicationDetails);

  // Initial check in case the checkbox is checked by default
  toggleMedicationDetails();

  // Date picker //
  // Set max date
  const dateInput = document.getElementById('date');

  // Get today's date in YYYY-MM-DD format, based on user's time zone
  const today = new Date().toLocaleString("sv").split(' ')[0];

  // Set the default value to today
  dateInput.value = today;

  // Restrict future dates from selection
  dateInput.setAttribute('max', today);
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeMigraineForm);