/**
 * Global configuration for cube animations and styling
 */
const CONFIG = {
  animation: {
    period: 5000, // Duration of one full rotation in milliseconds
    interval: 5, // Redraw interval in milliseconds
  },
  canvas: {
    lineWidth: 5, // Width of drawn lines
  },
  colors: {
    white: '#ffffffff',
    black: '#000000',
    creamWhite: '#FCFBF4EE',
    green: '#11FF3499',
    red: '#FF3333BB',
    blue: '#0034FFBB',
    orange: '#FF8C00EE',
    yellow: '#FFFF00EE',
  },
};

/**
 * Utility function: modulus operation that handles negative numbers correctly
 * @param {number} x - The number to take modulus of
 * @param {number} y - The divisor
 * @returns {number} Result of (x + y) % y
 */
function mod(x, y) {
  return (x + y) % y;
}
