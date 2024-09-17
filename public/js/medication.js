let pastMedications = [];
let selectedMedications = window.existingMedications || [];
const medicationCheckbox = document.getElementById('medication');
const medicationDetails = document.getElementById('medicationDetails');
const medicationList = document.getElementById('medicationList');
const medNameInput = document.getElementById('medName');
const medDoseInput = document.getElementById('medDose');
const medQuantityInput = document.getElementById('medQuantity');
const addMedicationBtn = document.getElementById('addMedication');
const medicationSuggestions = document.getElementById('medicationSuggestions');

// Event Listeners
medicationCheckbox.addEventListener('change', () => {
    toggleMedicationDetails();
    if (!medicationCheckbox.checked) {
        selectedMedications = [];
        updateMedicationList();
    }
  });
  addMedicationBtn.addEventListener('click', () => addMedication({
      name: medNameInput.value,
      dose: medDoseInput.value,
      quantity: parseInt(medQuantityInput.value, 10)
  }));
  medNameInput.addEventListener('input', showSuggestions);
  
  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
      if (!medNameInput.contains(e.target) && !medicationSuggestions.contains(e.target)) {
          medicationSuggestions.classList.add('hidden');
      }
  });

// Fetch past medications from the server
async function fetchPastMedications() {
    try {
        const response = await fetch('/medication/past-medications');
        if (!response.ok) {
            throw new Error('Failed to fetch past medications');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching past medications:', error);
        return [];
    }
}

fetchPastMedications().then(medications => {
    pastMedications = medications;
    updateMedicationList();
});

function initializeMedicationState() {
  if (medicationCheckbox.checked || selectedMedications.length > 0) {
      medicationDetails.classList.remove('hidden');
  } else {
      medicationDetails.classList.add('hidden');
  }
  updateMedicationList();
}

function toggleMedicationDetails() {
    medicationDetails.classList.toggle('hidden', !medicationCheckbox.checked);
}

function addMedication(medication) {
    if (medication.name && medication.dose && medication.quantity) {
        selectedMedications.push(medication);
        updateMedicationList();
        clearMedicationInputs();
    }
}

function removeMedication(index) {
    selectedMedications.splice(index, 1);
    updateMedicationList();
}

function updateMedicationList() {
    medicationList.innerHTML = selectedMedications.map((med, index) => `
        <div class="flex items-center justify-between bg-indigo-100 text-indigo-800 p-2 rounded-md mb-2">
            <span>${med.name} - ${med.dose} (Qty: ${med.quantity})</span>
            <button type="button" onclick="removeMedication(${index})" class="text-red-500 hover:text-red-700">Remove</button>
        </div>
    `).join('');

    // Update hidden input for form submission
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'medications';
    hiddenInput.value = JSON.stringify(selectedMedications);
    medicationList.appendChild(hiddenInput);
}

function clearMedicationInputs() {
    medNameInput.value = '';
    medDoseInput.value = '';
    medQuantityInput.value = '';
}

function showSuggestions() {
    const input = medNameInput.value.toLowerCase();
    const matchingMedications = pastMedications.filter(med => 
        med.name.toLowerCase().includes(input)
    );
    
    if (matchingMedications.length > 0) {
        medicationSuggestions.innerHTML = matchingMedications.map(med => `
            <div class="p-2 hover:bg-gray-100 text-indigo-800 cursor-pointer" onclick="selectMedication('${med.name}', '${med.dose}', ${med.quantity})">
                ${med.name} - ${med.dose} (Qty: ${med.quantity})
            </div>
        `).join('');
        medicationSuggestions.classList.remove('hidden');
    } else {
        medicationSuggestions.classList.add('hidden');
    }
}

function selectMedication(name, dose, quantity) {
    medNameInput.value = name;
    medDoseInput.value = dose;
    medQuantityInput.value = quantity;
    medicationSuggestions.classList.add('hidden');
}

// Initialize
toggleMedicationDetails();
updateMedicationList();
initializeMedicationState();