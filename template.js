const fs = require("fs");

const lines = fs
  .readFileSync("day??.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim() // Remove starting/ending whitespace
  .split("\n") // Split on newline
  .map(Number); // Parse each line into a number

function part1() {
  //do something here
}

part1();

function part2() {
  //do something here
}

part2();
