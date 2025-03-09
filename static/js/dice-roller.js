/**
 * Dice Roller Module
 * Handles all dice rolling functionality for the DnD-Near app.
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

/**
 * Roll dice with the specified parameters
 * @param {number} sides - Number of sides on the dice
 * @param {number} quantity - Number of dice to roll
 * @param {number} modifier - Modifier to add to the result
 * @returns {Object} Result object with rolls, total, and formatted string
 */
function rollDice(sides, quantity, modifier) {
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < quantity; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    // Add modifier
    const finalTotal = total + modifier;
    
    // Build result string
    let resultString = '';
    if (quantity > 1) {
        resultString = `${rolls.join(' + ')}`;
        if (modifier !== 0) {
            resultString += ` ${modifier >= 0 ? '+' : ''} ${modifier}`;
        }
        resultString += ` = ${finalTotal}`;
    } else if (modifier !== 0) {
        resultString = `${total} ${modifier >= 0 ? '+' : ''} ${modifier} = ${finalTotal}`;
    } else {
        resultString = `${total}`;
    }
    
    // Return results
    return {
        rolls: rolls,
        total: finalTotal,
        resultString: resultString
    };
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
        
        const result = rollDice(selectedDice, quantity, modifier);
        
        document.getElementById('result').textContent = result.total;
        document.getElementById('result-details').textContent = `${quantity}d${selectedDice}${modifier >= 0 ? '+' : ''}${modifier}: ${result.resultString}`;
        
        // Add to history
        addToHistory(`${quantity}d${selectedDice}${modifier !== 0 ? (modifier >= 0 ? '+' : '') + modifier : ''}: ${result.resultString}`);
    });
    
    // Handle custom roll button
    customRollButton.addEventListener('click', function() {
        const quantity = parseInt(document.getElementById('custom-quantity').value) || 1;
        const sides = parseInt(document.getElementById('custom-dice').value) || 20;
        const modifier = parseInt(document.getElementById('custom-modifier').value) || 0;
        
        const result = rollDice(sides, quantity, modifier);
        
        document.getElementById('result').textContent = result.total;
        document.getElementById('result-details').textContent = `${quantity}d${sides}${modifier >= 0 ? '+' : ''}${modifier}: ${result.resultString}`;
        
        // Add to history
        addToHistory(`${quantity}d${sides}${modifier !== 0 ? (modifier >= 0 ? '+' : '') + modifier : ''}: ${result.resultString}`);
    });
}