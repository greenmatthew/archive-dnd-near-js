/**
 * DnD-Near Dice Utility Module
 * A collection of simple functions for dice rolling operations.
 */

/**
 * Roll a single die with the specified number of sides
 * @param {number} sides - Number of sides on the die
 * @returns {number} The roll result (1 to sides)
 */
function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll multiple dice with the same number of sides
 * @param {number} sides - Number of sides on each die
 * @param {number} count - Number of dice to roll
 * @returns {Array<number>} Array containing individual die results
 */
function rollDice(sides, count) {
    const results = [];
    for (let i = 0; i < count; i++) {
        results.push(rollDie(sides));
    }
    return results;
}

/**
 * Roll a d4
 * @returns {number} Result of d4 roll (1-4)
 */
function rollD4() {
    return rollDie(4);
}

/**
 * Roll multiple d4s
 * @param {number} count - Number of d4s to roll
 * @returns {Array<number>} Array of individual d4 results
 */
function rollD4s(count) {
    return rollDice(4, count);
}

/**
 * Roll a d6
 * @returns {number} Result of d6 roll (1-6)
 */
function rollD6() {
    return rollDie(6);
}

/**
 * Roll multiple d6s
 * @param {number} count - Number of d6s to roll
 * @returns {Array<number>} Array of individual d6 results
 */
function rollD6s(count) {
    return rollDice(6, count);
}

/**
 * Roll a d8
 * @returns {number} Result of d8 roll (1-8)
 */
function rollD8() {
    return rollDie(8);
}

/**
 * Roll multiple d8s
 * @param {number} count - Number of d8s to roll
 * @returns {Array<number>} Array of individual d8 results
 */
function rollD8s(count) {
    return rollDice(8, count);
}

/**
 * Roll a d10
 * @returns {number} Result of d10 roll (1-10)
 */
function rollD10() {
    return rollDie(10);
}

/**
 * Roll multiple d10s
 * @param {number} count - Number of d10s to roll
 * @returns {Array<number>} Array of individual d10 results
 */
function rollD10s(count) {
    return rollDice(10, count);
}

/**
 * Roll a d12
 * @returns {number} Result of d12 roll (1-12)
 */
function rollD12() {
    return rollDie(12);
}

/**
 * Roll multiple d12s
 * @param {number} count - Number of d12s to roll
 * @returns {Array<number>} Array of individual d12 results
 */
function rollD12s(count) {
    return rollDice(12, count);
}

/**
 * Roll a d20
 * @returns {number} Result of d20 roll (1-20)
 */
function rollD20() {
    return rollDie(20);
}

/**
 * Roll multiple d20s
 * @param {number} count - Number of d20s to roll
 * @returns {Array<number>} Array of individual d20 results
 */
function rollD20s(count) {
    return rollDice(20, count);
}

/**
 * Roll a d100 (percentile die)
 * @returns {number} Result of d100 roll (1-100)
 */
function rollD100() {
    return rollDie(100);
}

/**
 * Roll multiple d100s
 * @param {number} count - Number of d100s to roll
 * @returns {Array<number>} Array of individual d100 results
 */
function rollD100s(count) {
    return rollDice(100, count);
}
