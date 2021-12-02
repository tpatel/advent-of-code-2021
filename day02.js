const fs = require("fs");

const lines = fs
  .readFileSync("day02.txt", { encoding: "utf-8" })
  .split("\n")
  .filter((x) => Boolean(x))
  .map((x) => {
    const [direction, n] = x.split(" ");
    return {
      direction,
      x: parseInt(n),
    };
  });

let submarine = {
  position: 0,
  depth: 0,
};

for (const line of lines) {
  switch (line.direction) {
    case "forward":
      submarine.position += line.x;
      break;
    case "down":
      submarine.depth += line.x;
      break;
    case "up":
      submarine.depth -= line.x;
      break;
  }
}

console.log(submarine.position * submarine.depth);

submarine = {
  position: 0,
  depth: 0,
  aim: 0,
};

for (const line of lines) {
  switch (line.direction) {
    case "forward":
      submarine.position += line.x;
      submarine.depth += submarine.aim * line.x;
      break;
    case "down":
      submarine.aim += line.x;
      break;
    case "up":
      submarine.aim -= line.x;
      break;
  }
}

console.log(submarine.position * submarine.depth);
