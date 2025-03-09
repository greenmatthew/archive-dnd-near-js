/**
 * Main Application Module
 * Initializes the application and handles shared functionality.
 */

// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log("DnD-Near initialized");
    
    // Setup tab navigation
    setupTabs();
    
    // Setup the dice roller
    setupDiceRoller();
    
    // Setup the weapon calculator
    setupWeaponCalculator();
});

/**
 * Setup tab functionality
 */
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Add roll to history
 * @param {string} text - The text to add to the history
 */
function addToHistory(text) {
    const historyList = document.getElementById('history-list');
    const entry = document.createElement('div');
    
    // Add timestamp
    const timestamp = new Date().toLocaleTimeString();
    
    // Check if the text contains new lines
    if (text.includes('\n')) {
        const [firstLine, ...restLines] = text.split('\n');
        
        // Create the main entry with timestamp
        entry.innerHTML = `[${timestamp}] ${firstLine}`;
        
        // Create a details section for the rest of the lines
        const details = document.createElement('div');
        details.className = 'history-details';
        details.innerHTML = restLines.join('<br>');
        entry.appendChild(details);
    } else {
        entry.innerHTML = `[${timestamp}] ${text}`;
    }
    
    historyList.prepend(entry);
    
    // Limit history to 10 entries
    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}