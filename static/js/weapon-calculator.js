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
        d20Roll = rollD20();
        resultDetails = `d20 (${d20Roll})`;
    } else if (rollType === 'advantage') {
        // Advantage - roll 2d20 and take higher
        const rolls = rollD20s(2);
        d20Roll = Math.max(rolls[0], rolls[1]);
        secondD20 = Math.min(rolls[0], rolls[1]);
        resultDetails = `2d20 (${rolls[0]}, ${rolls[1]}) take higher`;
    } else if (rollType === 'disadvantage') {
        // Disadvantage - roll 2d20 and take lower
        const rolls = rollD20s(2);
        d20Roll = Math.min(rolls[0], rolls[1]);
        secondD20 = Math.max(rolls[0], rolls[1]);
        resultDetails = `2d20 (${rolls[0]}, ${rolls[1]}) take lower`;
    }

    const totalMod = calculateTotalAttackMod();
    const totalAttack = d20Roll + totalMod;
    
    // Display results
    document.getElementById('attack-result').textContent = totalAttack;
    
    resultDetails += ` + ${totalMod} = ${totalAttack}`;
    
    // Check for critical hit or miss
    if (d20Roll === 20) {
        resultDetails += " - CRITICAL HIT!";
        document.getElementById('damage-roll-critical').checked = true;
    } else if (d20Roll === 1) {
        resultDetails += " - CRITICAL MISS!";
        document.getElementById('damage-roll-normal').checked = true;
    } else {
        document.getElementById('damage-roll-normal').checked = true;
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
    const totalMod = calculateTotalAttackMod();
    
    // Check which damage roll type was selected
    const attackType = document.querySelector('input[name="damage-roll-type"]:checked').value;
    const isCritical = attackType === 'critical';
    const isGraze = attackType === 'graze';
    
    // Check if weapon mastery is active for Graze damage
    const hasWeaponMastery = document.getElementById('weapon-mastery').checked;
    
    // Check which combat features are active
    const isGWM = document.getElementById('great-weapon-master').checked;
    const isGWF = document.getElementById('great-weapon-fighting').checked;
    const isSavageAttacker = document.getElementById('savage-attacker').checked;
    
    // Define SVG icons for reuse
    const slashingIcon = '<img src="img/damage-icons/slashing.svg" class="damage-icon slashing-icon" alt="Slashing">';
    const lightningIcon = '<img src="img/damage-icons/lightning.svg" class="damage-icon lightning-icon" alt="Lightning">';
    
    // Build result string for history
    let damageBreakdown = [];
    let savageAttackerSection = [];
    
    // Initialize variables
    let slashingDamage = 0;
    let lightningDamage = 0;
    let diceTotal = 0;
    let chosenRoll = 1; // For Savage Attacker: 1 or 2
    let lightningRolls = [];
    
    // Handle Graze damage (only applies Strength modifier)
    if (isGraze) {
        if (!hasWeaponMastery) {
            // If weapon mastery isn't active, show a message and return
            document.getElementById('attack-result').textContent = "Graze damage requires Greatsword Weapon Mastery to be active";
            document.getElementById('attack-result-details').textContent = "Please enable Greatsword Weapon Mastery to use Graze damage";
            
            addToHistory("Attempted to use Graze damage without Greatsword Weapon Mastery enabled");
            return;
        }
        
        // Graze damage is just the Strength modifier for slashing damage
        slashingDamage = totalMod;
        lightningDamage = 0; // No lightning damage on graze
        
        // Add to damage breakdown
        damageBreakdown.push(`${strMod} (from Strength Modifier) ${slashingIcon} Slashing`);
        
        // Create history text for Graze damage
        let historyHeader = `GRAZE! Damage roll (Strength modifier only): `;
        let historyText = `${historyHeader}${slashingDamage} ${slashingIcon} Slashing`;
        
        // Add damage breakdown
        historyText += `\n${damageBreakdown.join('\n')}`;
        
        // Update result display
        document.getElementById('attack-result').innerHTML = `${slashingDamage} ${slashingIcon} Slashing`;
        document.getElementById('attack-result-details').textContent = "Graze damage: On a miss, deal damage equal to your Strength modifier";
        
        addToHistory(historyText);
        
        // Reset to normal damage roll after completion
        document.getElementById('damage-roll-normal').checked = true;
        
        console.log("Graze damage roll complete:", slashingDamage);
        return;
    }
    
    // Handle normal or critical hits from here down
    
    // Base number of dice for lightning damage
    const numLightningDice = isCritical ? 2 : 1;
    
    // Roll lightning damage using our dice utility
    lightningRolls = rollD6s(numLightningDice);
    lightningDamage = lightningRolls.reduce((sum, roll) => sum + roll, 0);
    
    // Handle Savage Attacker feature
    if (isSavageAttacker) {
        // Determine number of dice to roll (doubled for critical hit)
        const numSlashingDice = isCritical ? 4 : 2; // 2d6 becomes 4d6 on crit
        
        // Roll two sets of dice
        let set1 = {
            rolls: [],
            original: [],
            total: 0
        };
        
        let set2 = {
            rolls: [],
            original: [],
            total: 0
        };
        
        // Roll dice for each set using our dice utility
        set1.original = rollD6s(numSlashingDice);
        set2.original = rollD6s(numSlashingDice);
        
        // Apply Great Weapon Fighting if active
        for (let i = 0; i < numSlashingDice; i++) {
            // Apply Great Weapon Fighting (reroll 1s and 2s)
            set1.rolls.push(isGWF && set1.original[i] <= 2 ? 3 : set1.original[i]);
            set2.rolls.push(isGWF && set2.original[i] <= 2 ? 3 : set2.original[i]);
            
            set1.total += set1.rolls[i];
            set2.total += set2.rolls[i];
        }
        
        // Choose higher set
        if (set2.total > set1.total) {
            diceTotal = set2.total;
            chosenRoll = 2;
        } else {
            diceTotal = set1.total;
            chosenRoll = 1;
        }
        
        // Add to Savage Attacker explanation section
        savageAttackerSection.push(`Savage Attacker (taking higher of two rolls):`);
        
        // Format Set 1
        let set1Details = [];
        for (let i = 0; i < numSlashingDice; i++) {
            if (isGWF && set1.original[i] <= 2) {
                set1Details.push(`${set1.rolls[i]} (1d6: rolled ${set1.original[i]} → 3 from Great Weapon Fighting)`);
            } else {
                set1Details.push(`${set1.rolls[i]} (1d6)`);
            }
        }
        
        // Format Set 2
        let set2Details = [];
        for (let i = 0; i < numSlashingDice; i++) {
            if (isGWF && set2.original[i] <= 2) {
                set2Details.push(`${set2.rolls[i]} (1d6: rolled ${set2.original[i]} → 3 from Great Weapon Fighting)`);
            } else {
                set2Details.push(`${set2.rolls[i]} (1d6)`);
            }
        }
        
        savageAttackerSection.push(`    Set 1: ${set1Details.join(' + ')} = ${set1.total}${chosenRoll === 1 ? ' [CHOSEN]' : ''}`);
        savageAttackerSection.push(`    Set 2: ${set2Details.join(' + ')} = ${set2.total}${chosenRoll === 2 ? ' [CHOSEN]' : ''}`);
        
        // Add slashing icon to the chosen set
        savageAttackerSection.push(`    → Using Set ${chosenRoll}: ${chosenRoll === 1 ? set1.total : set2.total} ${slashingIcon} Slashing`);
        
        // Add the chosen roll total to the main damage breakdown
        damageBreakdown.push(`${diceTotal} ${slashingIcon} Slashing`);
    } else {
        // Standard rolls without Savage Attacker
        // Roll slashing damage dice (doubled for critical hit)
        const numSlashingDice = isCritical ? 4 : 2; // 2d6 becomes 4d6 on crit
        
        // Use our dice utility to roll the dice
        let slashingOriginal = rollD6s(numSlashingDice);
        let slashingRolls = [];
        
        for (let i = 0; i < numSlashingDice; i++) {
            // Apply Great Weapon Fighting (reroll 1s and 2s)
            const finalRoll = isGWF && slashingOriginal[i] <= 2 ? 3 : slashingOriginal[i];
            slashingRolls.push(finalRoll);
            diceTotal += finalRoll;
            
            // Add to damage breakdown
            if (isGWF && slashingOriginal[i] <= 2) {
                damageBreakdown.push(`${finalRoll} (1d6: rolled ${slashingOriginal[i]} → 3 from Great Weapon Fighting) ${slashingIcon} Slashing`);
            } else {
                damageBreakdown.push(`${finalRoll} (1d6) ${slashingIcon} Slashing`);
            }
        }
    }
    
    // Calculate total slashing damage
    slashingDamage = diceTotal + strMod;
    if (isGWM) {
        slashingDamage += profBonus;
    }
    
    // Add remaining damage components
    damageBreakdown.push(`${strMod} (from Strength Modifier) ${slashingIcon} Slashing`);
    
    // Add Great Weapon Master bonus damage if active
    if (isGWM) {
        damageBreakdown.push(`${profBonus} (Heavy Weapon Mastery [Great Weapon Master]) ${slashingIcon} Slashing`);
    }
    
    // Add lightning damage
    // Format lightning damage breakdown
    if (isCritical) {
        damageBreakdown.push(`${lightningRolls.join(' + ')} (${numLightningDice}d6) ${lightningIcon} Lightning`);
    } else {
        damageBreakdown.push(`${lightningDamage} (1d6) ${lightningIcon} Lightning`);
    }
    
    // Calculate total damage
    let totalDamage = slashingDamage + lightningDamage;
    
    // Update result with damage by type - emphasizing type breakdown
    const damageByType = `${slashingDamage} ${slashingIcon} Slashing + ${lightningDamage} ${lightningIcon} Lightning (${totalDamage} total)`;
    document.getElementById('attack-result').innerHTML = damageByType;
    document.getElementById('attack-result-details').textContent = "";
    
    // Create header for history text
    let historyHeader = isCritical ? 
        `CRITICAL HIT! Damage roll (double dice): ` : 
        `Damage roll: `;
    
    // Add to history with damage breakdown and totals by type
    let historyText = `${historyHeader}${slashingDamage} ${slashingIcon} Slashing + ${lightningDamage} ${lightningIcon} Lightning (${totalDamage} total)`;
    
    // Add Savage Attacker section if used
    if (isSavageAttacker) {
        historyText += `\n${savageAttackerSection.join('\n')}`;
    }
    
    // Add damage breakdown
    historyText += `\n${damageBreakdown.join('\n+ ')}`;
    
    addToHistory(historyText);
    
    // Reset to normal damage roll after completion
    document.getElementById('damage-roll-normal').checked = true;
    
    console.log("Damage roll complete:", totalDamage);
}