function showMedicationDetails() {
  const medicationCheckbox = document.getElementById('medication');
  const medicationDetails = document.getElementById('medicationDetails');

  // Hide/Un-hide medication details
  function toggleMedicationDetails() {
      medicationDetails.classList.toggle('hidden', !medicationCheckbox.checked);
  } 

  medicationCheckbox.addEventListener('change', toggleMedicationDetails);

  // Initial check in case the checkbox is checked by default
  toggleMedicationDetails();
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', showMedicationDetails);