const fs = require("fs");

const lines = fs
  .readFileSync("day09.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .split("\n") // Split on newline
  .filter(Boolean); // Remove empty lines

function part1() {
  let risk = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const current = line[j];

      if (
        (!(i - 1 >= 0) || current < lines[i - 1][j]) &&
        (!(i + 1 < lines.length) || current < lines[i + 1][j]) &&
        (!(j - 1 >= 0) || current < lines[i][j - 1]) &&
        (!(j + 1 < line.length) || current < lines[i][j + 1])
      ) {
        risk += Number(current) + 1;
      }
    }
  }
  console.log(risk);
}

part1();

function floodfill(i, j, map) {
  if (map[i][j] === 1) return 0; // check node hasn't been visited
  map[i][j] = 1; // mark node as visited

  // count neighbors
  let size = 1;

  if (i - 1 >= 0) {
    size += floodfill(i - 1, j, map);
  }
  if (i + 1 < map.length) {
    size += floodfill(i + 1, j, map);
  }
  if (j - 1 >= 0) {
    size += floodfill(i, j - 1, map);
  }
  if (j + 1 < map[i].length) {
    size += floodfill(i, j + 1, map);
  }

  return size;
}

function part2() {
  const map = Array(lines.length)
    .fill(0)
    .map((x, i) =>
      Array(lines[0].length)
        .fill(0)
        .map((x, j) => (lines[i][j] === "9" ? 1 : 0))
    );
  let bassins = [];

  // console.log(map.map((x) => x.join``).join`\n`);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const size = floodfill(i, j, map);

      if (size > 0) {
        // console.log("");
        // console.log(map.map((x) => x.join``).join`\n`);
        bassins.push(size);
      }
    }
  }
  bassins.sort((a, b) => b - a);
  console.log(bassins[0] * bassins[1] * bassins[2]);
}

part2();
