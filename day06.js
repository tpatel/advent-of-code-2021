const fs = require("fs");

const fishes = fs
  .readFileSync("day06.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/[\r\n]/g, "") // remove all \r characters to avoid issues on Windows
  .split(",") // Split on newline
  .map(Number); // Parse each string into a number

function part1() {
  const queue = Array(9).fill(0);
  for (const fish of fishes) {
    queue[fish]++;
  }
  for (let i = 0; i < 80; i++) {
    const currentFishes = queue.shift();
    queue.push(currentFishes);
    queue[6] += currentFishes;
  }

  console.log(queue.reduce((a, b) => a + b, 0));
}

part1();

function part2() {
  const queue = Array(9).fill(0);
  for (const fish of fishes) {
    queue[fish]++;
  }
  for (let i = 0; i < 256; i++) {
    const currentFishes = queue.shift();
    queue.push(currentFishes);
    queue[6] += currentFishes;
  }

  console.log(queue.reduce((a, b) => a + b, 0));
}

part2();
