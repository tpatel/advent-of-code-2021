const fs = require("fs");

const map = fs
  .readFileSync("day15.txt", { encoding: "utf-8" }) // read day??.txt content
  .trim()
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .split("\n") // Split on newline
  .map((x) => [...x].map(Number)); // Parse each line into a number

function coordinatesToIndex({ x, y }, map) {
  return x + y * map.length;
}

function indexToCoordinates(index, map) {
  const x = index % map.length;
  const y = (index - x) / map.length;
  return {
    x,
    y,
  };
}

function getNeighbors(index, map) {
  const { x, y } = indexToCoordinates(index, map);
  const list = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ].filter(({ x, y }) => x >= 0 && y >= 0 && x < map.length && y < map.length);
  return list;
}

function solve(map) {
  const target = { x: map.length - 1, y: map.length - 1 };
  const targetIndex = coordinatesToIndex(target, map);

  const dist = Array(map.length * map.length).fill(Infinity);
  const Q = new Set(
    Array(map.length * map.length)
      .fill(0)
      .map((x, index) => index)
  );

  dist[0] = 0;

  while (Q.size > 0) {
    let min = Infinity;
    let minIndex = 0;

    for (const value of Q) {
      if (dist[value] < min) {
        min = dist[value];
        minIndex = value;
      }
    }

    const u = minIndex;
    Q.delete(u);

    if (u === targetIndex) break;

    const neighbors = getNeighbors(u, map);

    for (const neighbor of neighbors) {
      const neighborIndex = coordinatesToIndex(neighbor, map);
      const alt = dist[u] + map[neighbor.y][neighbor.x];

      if (alt < dist[neighborIndex]) {
        dist[neighborIndex] = alt;
      }
    }
  }

  console.log(dist[coordinatesToIndex(target, map)]);
}

solve(map);

const biggerMap = Array(5 * map.length)
  .fill(0)
  .map((_, y) =>
    Array(5 * map.length)
      .fill(0)
      .map((_, x) => {
        const originalX = x % map.length;
        const originalY = y % map.length;
        const offset = Math.floor(x / map.length) + Math.floor(y / map.length);
        const value = map[originalY][originalX] + offset;
        return value > 9 ? value - 9 : value;
      })
  );

// console.log(biggerMap.map((v) => v.join("")).join`\n`);

solve(biggerMap);
