const fs = require("fs");

const matrix = fs
  .readFileSync("day11.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .split("\n") // Split on newline
  .filter(Boolean) // Remove empty lines
  .map((line) => [...line].map(Number));

let firstSynchronizedFlash;
let flashes = 0;
let turnCounter = 0;
function increaseEnergy({ i, j, explodedSet }) {
  // Check that it's a valid coordinate
  if (typeof matrix[i] === "undefined") return;
  if (typeof matrix[i][j] === "undefined") return;

  // Check it hasn't exploded yet
  const key = i + ":" + j;
  if (explodedSet.has(key)) {
    return;
  }

  // Act
  matrix[i][j]++;
  if (matrix[i][j] > 9) {
    // Explode!!!
    matrix[i][j] = 0;
    explodedSet.add(key);
    flashes++;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue;

        increaseEnergy({ i: i + x, j: j + y, explodedSet });
      }
    }
    return;
  }
}
function turn() {
  turnCounter++;
  let explodedSet = new Set();

  // increase each spot by 1
  // if value> 9 then explode (on all 8 neighbors) / can only explode once per turn
  // once exploded, reset to 0
  for (let i = 0; i < matrix.length; i++) {
    const line = matrix[i];
    for (let j = 0; j < line.length; j++) {
      increaseEnergy({ i, j, explodedSet });
    }
  }
  // console.table(matrix);
  if (
    typeof firstSynchronizedFlash === "undefined" &&
    explodedSet.size === matrix.length * matrix[0].length
  ) {
    firstSynchronizedFlash = turnCounter;
  }
}
for (let i = 0; i < 100; i++) {
  turn();
}
console.log(flashes);

if (typeof firstSynchronizedFlash === "undefined") {
  while (typeof firstSynchronizedFlash === "undefined") {
    turn();
  }
}

console.log(firstSynchronizedFlash);
