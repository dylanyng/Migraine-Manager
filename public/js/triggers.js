let selectedTriggers = window.existingTriggers || [];
const triggerInput = document.getElementById('triggerInput');
const addTriggerBtn = document.getElementById('addTrigger');
const selectedTriggersContainer = document.getElementById('selectedTriggers');
const triggerSuggestions = document.getElementById('triggerSuggestions');
const triggersHiddenInput = document.getElementById('triggers');

// Fetch past triggers from the server
async function fetchPastTriggers() {
    try {
        const response = await fetch('/triggers/past-triggers');
        if (!response.ok) {
            throw new Error('Failed to fetch past triggers');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching past triggers:', error);
        return [];
    }
}

let pastTriggers = [];
fetchPastTriggers().then(triggers => {
    pastTriggers = triggers;
    updateSelectedTriggers(); // Update the UI with pre-populated triggers
});

function addTrigger(trigger) {
    if (trigger && !selectedTriggers.includes(trigger.toLowerCase())) {
        selectedTriggers.push(trigger.toLowerCase());
        updateSelectedTriggers();
        updateHiddenInput();
        triggerInput.value = '';
    }
}

function removeTrigger(trigger) {
    selectedTriggers = selectedTriggers.filter(t => t !== trigger);
    updateSelectedTriggers();
    updateHiddenInput();
}

function updateSelectedTriggers() {
    selectedTriggersContainer.innerHTML = selectedTriggers.map(trigger => `
        <span class="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
            ${trigger}
            <button type="button" class="ml-1 text-indigo-600 hover:text-indigo-800" onclick="removeTrigger('${trigger}')">×</button>
        </span>
    `).join('');
}

function updateHiddenInput() {
    triggersHiddenInput.value = selectedTriggers.join(',');
}

function showSuggestions(input) {
    const matchingTriggers = pastTriggers.filter(trigger => 
        trigger.toLowerCase().includes(input.toLowerCase()) && 
        !selectedTriggers.includes(trigger.toLowerCase())
    );
    
    if (matchingTriggers.length > 0) {
        triggerSuggestions.innerHTML = matchingTriggers.map(trigger => `
            <div class="p-2 text-indigo-900 bg-indigo-100 hover:bg-indigo-200 cursor-pointer" onclick="addTrigger('${trigger}')">${trigger}</div>
        `).join('');
        triggerSuggestions.classList.remove('hidden');
    } else {
        triggerSuggestions.classList.add('hidden');
    }
}

triggerInput.addEventListener('input', (e) => showSuggestions(e.target.value));
addTriggerBtn.addEventListener('click', () => addTrigger(triggerInput.value));
triggerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTrigger(triggerInput.value);
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!triggerInput.contains(e.target) && !triggerSuggestions.contains(e.target)) {
        triggerSuggestions.classList.add('hidden');
    }
});

// Initialize the UI with pre-populated triggers
updateSelectedTriggers();
updateHiddenInput();