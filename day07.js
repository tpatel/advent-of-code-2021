const fs = require("fs");

const crabs = fs
  .readFileSync("day07.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/[\r\n]/g, "") // remove all \r characters to avoid issues on Windows
  .split(",") // Split on newline
  .map(Number); // Parse each line into a number

crabs.sort();

function median(array) {
  const internalArray = [...array];
  internalArray.sort((a, b) => a - b);
  if (internalArray.length % 2 === 0) {
    return (
      (internalArray[internalArray.length / 2 - 1] +
        internalArray[internalArray.length / 2]) /
      2
    );
  } else {
    return internalArray[Math.floor(internalArray.length / 2)];
  }
}

function part1() {
  const meetAt = median(crabs);
  const fuelCost = crabs
    .map((position) => Math.abs(position - meetAt))
    .reduce((a, b) => a + b, 0);
  console.log(fuelCost);
}

part1();

function part2() {
  const highestPosition = crabs[crabs.length - 1];
  const allCosts = Array(highestPosition).fill(0);

  for (let i = 0; i < highestPosition; i++) {
    const fuelCost = crabs
      .map(
        (position) =>
          (Math.abs(position - i) * (1 + Math.abs(position - i))) / 2
      )
      .reduce((a, b) => a + b, 0);
    allCosts[i] = fuelCost;
  }

  console.log(Math.min(...allCosts));
}

part2();
