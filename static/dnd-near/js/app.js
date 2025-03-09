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
    
    // Setup feature tooltips
    setupFeatureTooltips();
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
    
    // Add timestamp in 24-hour format
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${hours}:${minutes}:${seconds}`;
    
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
    
    // Limit history to 20 entries
    if (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}

/**
 * Setup Feature Info Tooltips
 * Handles the display and hiding of feature information tooltips
 */
function setupFeatureTooltips() {
    const featureInfoIcons = document.querySelectorAll('.feature-info');
    let activeTooltip = null;
    
    // Show tooltip when info icon is clicked
    featureInfoIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent click from reaching document
            
            const featureId = this.getAttribute('data-feature');
            const tooltip = document.getElementById(`${featureId}-tooltip`);
            
            // If there's an active tooltip and it's not this one, hide it
            if (activeTooltip && activeTooltip !== tooltip) {
                activeTooltip.classList.remove('visible');
            }
            
            // Toggle the current tooltip
            tooltip.classList.toggle('visible');
            
            // Update active tooltip reference
            activeTooltip = tooltip.classList.contains('visible') ? tooltip : null;
        });
    });
    
    // Hide tooltips when clicking elsewhere on the document
    document.addEventListener('click', function() {
        if (activeTooltip) {
            activeTooltip.classList.remove('visible');
            activeTooltip = null;
        }
    });
    
    // Prevent tooltip from closing when clicked
    const tooltips = document.querySelectorAll('.feature-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
    
    // Hide tooltip when ESC key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && activeTooltip) {
            activeTooltip.classList.remove('visible');
            activeTooltip = null;
        }
    });
}