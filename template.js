const fs = require("fs");

const lines = fs
  .readFileSync("day??.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .split("\n") // Split on newline
  .filter(Boolean) // Remove empty lines
  .map(Number); // Parse each line into a number
