/**
 * Weapon Calculator Module
 * Handles weapon-specific calculations for the Solstora greatsword.
 */

/**
 * Initialize the weapon calculator functionality
 */
function setupWeaponCalculator() {
    const strScoreInput = document.getElementById('str-score');
    const profBonusInput = document.getElementById('prof-bonus');
    const attackBonusInput = document.getElementById('attack-bonus');
    const rollAttackButton = document.getElementById('roll-attack');
    const rollDamageButton = document.getElementById('roll-damage');
    
    // Update modifiers when inputs change
    strScoreInput.addEventListener('input', updateAttackModifiers);
    profBonusInput.addEventListener('input', updateAttackModifiers);
    attackBonusInput.addEventListener('input', updateAttackModifiers);
    
    // Initial calculation
    updateAttackModifiers();
    
    // Roll attack when button is clicked
    rollAttackButton.addEventListener('click', rollWeaponAttack);
    
    // Roll damage when button is clicked
    rollDamageButton.addEventListener('click', rollWeaponDamage);
}

/**
 * Update attack modifiers when inputs change
 */
function updateAttackModifiers() {
    calculateStrMod();
    calculateTotalAttackMod();
}

/**
 * Calculate strength modifier from score
 * @returns {number} The calculated strength modifier
 */
function calculateStrMod() {
    const strScore = parseInt(document.getElementById('str-score').value) || 10;
    const strMod = Math.floor((strScore - 10) / 2);
    const strModDisplay = strMod >= 0 ? `+${strMod}` : `${strMod}`;
    document.getElementById('str-mod').value = strModDisplay;
    
    // Update the damage display
    if (document.getElementById('damage-str-mod')) {
        document.getElementById('damage-str-mod').textContent = strMod;
    }
    
    return strMod;
}

/**
 * Calculate total attack modifier
 * @returns {number} The total attack modifier
 */
function calculateTotalAttackMod() {
    const strMod = calculateStrMod();
    const profBonus = parseInt(document.getElementById('prof-bonus').value) || 2;
    const attackBonus = parseInt(document.getElementById('attack-bonus').value) || 0;
    
    const totalMod = strMod + profBonus + attackBonus;
    const totalModDisplay = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;
    document.getElementById('total-attack-mod').value = totalModDisplay;
    
    return totalMod;
}

/**
 * Roll for attack with the weapon
 */
function rollWeaponAttack() {
    const rollType = document.querySelector('input[name="roll-type"]:checked').value;
    
    // Roll the d20 based on advantage/disadvantage setting
    let d20Roll, secondD20;
    let resultDetails = '';
    
    if (rollType === 'normal') {
        // Normal roll - just one d20
        d20Roll = Math.floor(Math.random() * 20) + 1;
        resultDetails = `d20 (${d20Roll})`;
    } else if (rollType === 'advantage') {
        // Advantage - roll 2d20 and take higher
        d20Roll = Math.floor(Math.random() * 20) + 1;
        secondD20 = Math.floor(Math.random() * 20) + 1;
        d20Roll = Math.max(d20Roll, secondD20);
        resultDetails = `2d20 (${d20Roll}, ${secondD20}) take higher`;
    } else if (rollType === 'disadvantage') {
        // Disadvantage - roll 2d20 and take lower
        d20Roll = Math.floor(Math.random() * 20) + 1;
        secondD20 = Math.floor(Math.random() * 20) + 1;
        d20Roll = Math.min(d20Roll, secondD20);
        resultDetails = `2d20 (${d20Roll}, ${secondD20}) take lower`;
    }
    
    const totalMod = calculateTotalAttackMod();
    const totalAttack = d20Roll + totalMod;
    
    // Display results
    document.getElementById('attack-result').textContent = totalAttack;
    
    resultDetails += ` + ${totalMod} = ${totalAttack}`;
    
    // Check for critical hit or miss
    if (d20Roll === 20) {
        resultDetails += " - CRITICAL HIT!";
    } else if (d20Roll === 1) {
        resultDetails += " - CRITICAL MISS!";
    }
    
    document.getElementById('attack-result-details').textContent = resultDetails;
    
    // Add to history
    addToHistory(`Attack roll: ${resultDetails}`);
    
    // Reset to normal roll
    document.getElementById('roll-normal').checked = true;
}

/**
 * Roll for weapon damage
 */
function rollWeaponDamage() {
    console.log("Rolling weapon damage...");
    
    const strMod = calculateStrMod();
    const profBonus = parseInt(document.getElementById('prof-bonus').value) || 2;
    
    // Check which combat features are active
    const isGWM = document.getElementById('great-weapon-master').checked;
    const isGWF = document.getElementById('great-weapon-fighting').checked;
    const isSavageAttacker = document.getElementById('savage-attacker').checked;
    
    // Define SVG icons for reuse
    const slashingIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 17" style="width:14px;height:14px;vertical-align:middle;"><path fill="#242528" d="M0,6s7.62,3.35,14.18,5.85l1-2.33,1.06.41-1.59,2.94L19,15.22l-.49,1.1-4.22-2.16L12.9,17l-1.31-.41,1-1.88S3.47,9.6,0,6Z"></path><path fill="#242528" d="M3,5A14.91,14.91,0,0,1,14,0S7.56.94,5,6Z"></path><path fill="#242528" d="M7,6.45a8.13,8.13,0,0,1,6-2.73S9.49,4.24,8.09,7Z"></path><path fill="#242528" d="M10,7.89A5.65,5.65,0,0,1,14.17,6a4.92,4.92,0,0,0-3.41,2.27Z"></path></svg>';
    const lightningIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.67 16" style="width:12px;height:14px;vertical-align:middle;"><path fill="#242528" d="M3.62,0H9.33L6.07,6.67h4.6L1.33,16l1.9-6.67H0Z"></path></svg>';
    
    // Build result string for history
    let damageBreakdown = [];
    let savageAttackerSection = [];
    
    // Initialize variables
    let slashingDamage = 0;
    let diceTotal = 0;
    let chosenRoll = 1; // For Savage Attacker: 1 or 2
    
    // Roll for lightning damage (not affected by Savage Attacker)
    const lightningRoll = Math.floor(Math.random() * 6) + 1;
    
    // Handle Savage Attacker feature
    if (isSavageAttacker) {
        // Roll two sets of dice
        let set1 = {
            d6Roll1: Math.floor(Math.random() * 6) + 1,
            d6Roll2: Math.floor(Math.random() * 6) + 1,
            original1: 0,
            original2: 0
        };
        
        let set2 = {
            d6Roll1: Math.floor(Math.random() * 6) + 1,
            d6Roll2: Math.floor(Math.random() * 6) + 1,
            original1: 0,
            original2: 0
        };
        
        // Store original values before Great Weapon Fighting
        set1.original1 = set1.d6Roll1;
        set1.original2 = set1.d6Roll2;
        set2.original1 = set2.d6Roll1;
        set2.original2 = set2.d6Roll2;
        
        // Apply Great Weapon Fighting if active
        if (isGWF) {
            if (set1.d6Roll1 <= 2) set1.d6Roll1 = 3;
            if (set1.d6Roll2 <= 2) set1.d6Roll2 = 3;
            if (set2.d6Roll1 <= 2) set2.d6Roll1 = 3;
            if (set2.d6Roll2 <= 2) set2.d6Roll2 = 3;
        }
        
        // Calculate totals for each set
        const set1Total = set1.d6Roll1 + set1.d6Roll2;
        const set2Total = set2.d6Roll1 + set2.d6Roll2;
        
        // Choose higher set
        if (set2Total > set1Total) {
            diceTotal = set2Total;
            chosenRoll = 2;
        } else {
            diceTotal = set1Total;
            chosenRoll = 1;
        }
        
        // Add to Savage Attacker explanation section
        savageAttackerSection.push(`Savage Attacker (taking higher of two rolls):`);
        
        // Format Set 1
        let set1Details = [];
        if (isGWF && set1.original1 <= 2) {
            set1Details.push(`${set1.d6Roll1} (1d6: rolled ${set1.original1} → 3 from Great Weapon Fighting)`);
        } else {
            set1Details.push(`${set1.d6Roll1} (1d6)`);
        }
        
        if (isGWF && set1.original2 <= 2) {
            set1Details.push(`${set1.d6Roll2} (1d6: rolled ${set1.original2} → 3 from Great Weapon Fighting)`);
        } else {
            set1Details.push(`${set1.d6Roll2} (1d6)`);
        }
        
        // Format Set 2
        let set2Details = [];
        if (isGWF && set2.original1 <= 2) {
            set2Details.push(`${set2.d6Roll1} (1d6: rolled ${set2.original1} → 3 from Great Weapon Fighting)`);
        } else {
            set2Details.push(`${set2.d6Roll1} (1d6)`);
        }
        
        if (isGWF && set2.original2 <= 2) {
            set2Details.push(`${set2.d6Roll2} (1d6: rolled ${set2.original2} → 3 from Great Weapon Fighting)`);
        } else {
            set2Details.push(`${set2.d6Roll2} (1d6)`);
        }
        
        savageAttackerSection.push(`    Set 1: ${set1Details.join(' + ')} = ${set1Total}${chosenRoll === 1 ? ' [CHOSEN]' : ''}`);
        savageAttackerSection.push(`    Set 2: ${set2Details.join(' + ')} = ${set2Total}${chosenRoll === 2 ? ' [CHOSEN]' : ''}`);
        
        // Add slashing icon to the chosen set
        savageAttackerSection.push(`    → Using Set ${chosenRoll}: ${chosenRoll === 1 ? set1Total : set2Total} ${slashingIcon} Slashing`);
        
        // Add the chosen roll total to the main damage breakdown
        damageBreakdown.push(`${diceTotal} ${slashingIcon} Slashing`);
    } else {
        // Standard rolls without Savage Attacker
        // Roll 2d6 for base slashing damage
        let d6Roll1 = Math.floor(Math.random() * 6) + 1;
        let d6Roll2 = Math.floor(Math.random() * 6) + 1;
        
        // Apply Great Weapon Fighting (reroll 1s and 2s)
        let d6Roll1Original = d6Roll1;
        let d6Roll2Original = d6Roll2;
        
        if (isGWF) {
            if (d6Roll1 <= 2) d6Roll1 = 3;
            if (d6Roll2 <= 2) d6Roll2 = 3;
        }
        
        // Calculate base slashing damage
        diceTotal = d6Roll1 + d6Roll2;
        
        // First d6 slashing
        if (isGWF && d6Roll1Original <= 2) {
            damageBreakdown.push(`${d6Roll1} (1d6: rolled ${d6Roll1Original} → 3 from Great Weapon Fighting) ${slashingIcon} Slashing`);
        } else {
            damageBreakdown.push(`${d6Roll1} (1d6) ${slashingIcon} Slashing`);
        }
        
        // Second d6 slashing
        if (isGWF && d6Roll2Original <= 2) {
            damageBreakdown.push(`${d6Roll2} (1d6: rolled ${d6Roll2Original} → 3 from Great Weapon Fighting) ${slashingIcon} Slashing`);
        } else {
            damageBreakdown.push(`${d6Roll2} (1d6) ${slashingIcon} Slashing`);
        }
    }
    
    // Calculate total slashing damage
    slashingDamage = diceTotal + strMod;
    if (isGWM) {
        slashingDamage += profBonus;
    }
    
    // Add remaining damage components
    damageBreakdown.push(`${strMod} (from Strength Mod.) ${slashingIcon} Slashing`);
    
    // Add Great Weapon Master bonus damage if active
    if (isGWM) {
        damageBreakdown.push(`${profBonus} (Heavy Weapon Mastery [Great Weapon Master]) ${slashingIcon} Slashing`);
    }
    
    // Add lightning damage
    let lightningDamage = lightningRoll;
    damageBreakdown.push(`${lightningRoll} (1d6) ${lightningIcon} Lightning`);
    
    // Calculate total damage
    let totalDamage = slashingDamage + lightningDamage;
    
    // Update result with damage by type - emphasizing type breakdown
    const damageByType = `${slashingDamage} ${slashingIcon} Slashing + ${lightningDamage} ${lightningIcon} Lightning (${totalDamage} total)`;
    document.getElementById('attack-result').innerHTML = damageByType;
    document.getElementById('attack-result-details').textContent = "";
    
    // Add to history with damage breakdown and totals by type
    let historyText = `Damage roll: ${slashingDamage} ${slashingIcon} Slashing + ${lightningDamage} ${lightningIcon} Lightning (${totalDamage} total)`;
    
    // Add Savage Attacker section if used
    if (isSavageAttacker) {
        historyText += `\n${savageAttackerSection.join('\n')}`;
    }
    
    // Add damage breakdown
    historyText += `\n${damageBreakdown.join('\n+ ')}`;
    
    addToHistory(historyText);
    
    console.log("Damage roll complete:", totalDamage);
}