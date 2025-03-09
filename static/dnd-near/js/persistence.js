/**
 * Persistence Module
 * Handles saving and loading form values using localStorage
 * 
 * To use this module:
 * 1. Include this script in your HTML
 * 2. Add a call to setupPersistence() in your initialization code
 * 3. Optionally add a button with id="reset-saved-data" to clear saved data
 */

// Keys for localStorage
const STORAGE_KEY_PREFIX = 'dnd-near-';
const STATS_KEY = `${STORAGE_KEY_PREFIX}stats`;
const FEATS_KEY = `${STORAGE_KEY_PREFIX}feats`;

/**
 * Setup persistence functionality
 * Loads saved values and sets up event listeners to save changes
 */
function setupPersistence() {
    console.log("Setting up persistence module...");
    
    // Load saved values
    loadSavedStats();
    loadSavedFeats();
    
    // Setup event listeners to save stats when they change
    const statsInputs = [
        document.getElementById('str-score'),
        document.getElementById('prof-bonus'),
        document.getElementById('attack-bonus')
    ];
    
    statsInputs.forEach(input => {
        if (input) {
            input.addEventListener('change', saveStats);
        }
    });
    
    // Setup event listeners to save feats when they change
    const featsInputs = [
        document.getElementById('weapon-mastery'),
        document.getElementById('great-weapon-master'),
        document.getElementById('great-weapon-fighting'),
        document.getElementById('savage-attacker')
    ];
    
    featsInputs.forEach(input => {
        if (input) {
            input.addEventListener('change', saveFeats);
        }
    });
    
    // Setup reset button
    const resetDataButton = document.getElementById('reset-saved-data');
    if (resetDataButton) {
        resetDataButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all saved data? This will clear your saved character stats and feats.')) {
                clearSavedData();
                window.location.reload(); // Reload the page to reset the form
            }
        });
    }
}

/**
 * Save stats to localStorage
 */
function saveStats() {
    const stats = {
        strScore: document.getElementById('str-score').value,
        profBonus: document.getElementById('prof-bonus').value,
        attackBonus: document.getElementById('attack-bonus').value
    };
    
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        console.log("Stats saved to localStorage:", stats);
    } catch (error) {
        console.error("Error saving stats to localStorage:", error);
    }
}

/**
 * Save feats to localStorage
 */
function saveFeats() {
    const feats = {
        weaponMastery: document.getElementById('weapon-mastery').checked,
        greatWeaponMaster: document.getElementById('great-weapon-master').checked,
        greatWeaponFighting: document.getElementById('great-weapon-fighting').checked,
        savageAttacker: document.getElementById('savage-attacker').checked
    };
    
    try {
        localStorage.setItem(FEATS_KEY, JSON.stringify(feats));
        console.log("Feats saved to localStorage:", feats);
    } catch (error) {
        console.error("Error saving feats to localStorage:", error);
    }
}

/**
 * Load saved stats from localStorage
 */
function loadSavedStats() {
    try {
        const savedStats = localStorage.getItem(STATS_KEY);
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            
            // Set input values
            if (stats.strScore) document.getElementById('str-score').value = stats.strScore;
            if (stats.profBonus) document.getElementById('prof-bonus').value = stats.profBonus;
            if (stats.attackBonus) document.getElementById('attack-bonus').value = stats.attackBonus;
            
            // Update calculated values
            if (typeof updateAttackModifiers === 'function') {
                updateAttackModifiers();
            }
            
            console.log("Loaded saved stats:", stats);
        }
    } catch (error) {
        console.error("Error loading stats from localStorage:", error);
    }
}

/**
 * Load saved feats from localStorage
 */
function loadSavedFeats() {
    try {
        const savedFeats = localStorage.getItem(FEATS_KEY);
        if (savedFeats) {
            const feats = JSON.parse(savedFeats);
            
            // Set checkbox states
            if (feats.weaponMastery !== undefined) 
                document.getElementById('weapon-mastery').checked = feats.weaponMastery;
                
            if (feats.greatWeaponMaster !== undefined) 
                document.getElementById('great-weapon-master').checked = feats.greatWeaponMaster;
                
            if (feats.greatWeaponFighting !== undefined) 
                document.getElementById('great-weapon-fighting').checked = feats.greatWeaponFighting;
                
            if (feats.savageAttacker !== undefined) 
                document.getElementById('savage-attacker').checked = feats.savageAttacker;
            
            console.log("Loaded saved feats:", feats);
        }
    } catch (error) {
        console.error("Error loading feats from localStorage:", error);
    }
}

/**
 * Clear all saved data
 */
function clearSavedData() {
    try {
        localStorage.removeItem(STATS_KEY);
        localStorage.removeItem(FEATS_KEY);
        console.log("Cleared all saved data");
        
        // Reset form values to defaults
        document.getElementById('str-score').value = '10';
        document.getElementById('prof-bonus').value = '2';
        document.getElementById('attack-bonus').value = '0';
        
        document.getElementById('weapon-mastery').checked = false;
        document.getElementById('great-weapon-master').checked = false;
        document.getElementById('great-weapon-fighting').checked = false;
        document.getElementById('savage-attacker').checked = false;
        
        // Update calculated values
        if (typeof updateAttackModifiers === 'function') {
            updateAttackModifiers();
        }
    } catch (error) {
        console.error("Error clearing saved data:", error);
    }
}