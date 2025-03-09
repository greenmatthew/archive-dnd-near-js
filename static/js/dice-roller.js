/**
 * Dice Roller Module
 * Handles all dice rolling functionality for the DnD-Near app.
 * Uses dice-utils.js for dice rolling operations.
 */

// Global variables
let selectedDice = 20; // Default to d20

/**
 * Initialize the dice roller functionality
 */
function setupDiceRoller() {
    const diceButtons = document.querySelectorAll('.dice-button[data-dice]');
    const rollButton = document.getElementById('roll-button');
    const customRollButton = document.getElementById('custom-roll-button');
    
    // Highlight the d20 button by default
    document.querySelector('.dice-button[data-dice="20"]').style.backgroundColor = '#3c096c';
    
    // Set up dice selection
    diceButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Only process if it has the data-dice attribute
            if (this.hasAttribute('data-dice')) {
                selectedDice = parseInt(this.getAttribute('data-dice'));
                
                // Reset all buttons
                diceButtons.forEach(b => {
                    if (b.hasAttribute('data-dice')) {
                        b.style.backgroundColor = '#5a189a';
                    }
                });
                
                // Highlight selected button
                this.style.backgroundColor = '#3c096c';
            }
        });
    });
    
    // Handle standard roll button
    rollButton.addEventListener('click', function() {
        const quantity = parseInt(document.getElementById('dice-quantity').value) || 1;
        const modifier = parseInt(document.getElementById('modifier').value) || 0;
        
        // Use the new dice utility functions to roll dice
        const rolls = rollDiceAndGetResult(selectedDice, quantity, modifier);
        
        document.getElementById('result').textContent = rolls.finalTotal;
        document.getElementById('result-details').textContent = `${quantity}d${selectedDice}${modifier >= 0 ? '+' : ''}${modifier}: ${rolls.resultString}`;
        
        // Add to history
        addToHistory(`${quantity}d${selectedDice}${modifier !== 0 ? (modifier >= 0 ? '+' : '') + modifier : ''}: ${rolls.resultString}`);
    });
    
    // Handle custom roll button
    customRollButton.addEventListener('click', function() {
        const quantity = parseInt(document.getElementById('custom-quantity').value) || 1;
        const sides = parseInt(document.getElementById('custom-dice').value) || 20;
        const modifier = parseInt(document.getElementById('custom-modifier').value) || 0;
        
        // Use the new dice utility functions to roll dice
        const rolls = rollDiceAndGetResult(sides, quantity, modifier);
        
        document.getElementById('result').textContent = rolls.finalTotal;
        document.getElementById('result-details').textContent = `${quantity}d${sides}${modifier >= 0 ? '+' : ''}${modifier}: ${rolls.resultString}`;
        
        // Add to history
        addToHistory(`${quantity}d${sides}${modifier !== 0 ? (modifier >= 0 ? '+' : '') + modifier : ''}: ${rolls.resultString}`);
    });
}

/**
 * Roll dice and format the results using the dice utility functions
 * @param {number} sides - Number of sides on the dice
 * @param {number} quantity - Number of dice to roll
 * @param {number} modifier - Modifier to add to the result
 * @returns {Object} Result object with rolls, finalTotal, and formatted resultString
 */
function rollDiceAndGetResult(sides, quantity, modifier) {
    // Get array of dice rolls using the dice-utils function
    const diceResults = rollDice(sides, quantity);
    
    // Calculate the total of all dice
    const diceTotal = diceResults.reduce((sum, roll) => sum + roll, 0);
    
    // Add modifier
    const finalTotal = diceTotal + modifier;
    
    // Build result string
    let resultString = '';
    if (quantity > 1) {
        resultString = `${diceResults.join(' + ')}`;
        if (modifier !== 0) {
            resultString += ` ${modifier >= 0 ? '+' : ''} ${modifier}`;
        }
        resultString += ` = ${finalTotal}`;
    } else if (modifier !== 0) {
        resultString = `${diceTotal} ${modifier >= 0 ? '+' : ''} ${modifier} = ${finalTotal}`;
    } else {
        resultString = `${diceTotal}`;
    }
    
    // Return results
    return {
        rolls: diceResults,
        diceTotal: diceTotal,
        finalTotal: finalTotal,
        resultString: resultString
    };
}