/**
 * Initialize and start all cube animations
 */
function main() {
  // Create and start Rubik's cubes of different dimensions
  const cube2x2 = new RubiksCube("2x2rubiksCanvas", 2);
  const cube3x3 = new RubiksCube("3x3rubiksCanvas", 3);
  const cube4x4 = new RubiksCube("4x4rubiksCanvas", 4);
  const cube7x7 = new RubiksCube("7x7rubiksCanvas", 7);

  // Create and start Pyraminx
  const pyraminx = new Pyraminx("pyraminxCanvas");

  // Start all animations
  cube2x2.start();
  cube3x3.start();
  cube4x4.start();
  cube7x7.start();
  pyraminx.start();

  // Optional: Make cubes accessible globally for debugging/control
  window.cubes = {
    cube2x2,
    cube3x3,
    cube4x4,
    cube7x7,
    pyraminx,
  };
}

// Start animations when page loads
document.addEventListener("DOMContentLoaded", main);