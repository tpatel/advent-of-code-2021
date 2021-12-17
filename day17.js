const fs = require("fs");

const line = fs
  .readFileSync("day17.txt", { encoding: "utf-8" }) // read day??.txt content
  .trim();

const target = line.match(
  /target area: x=(?<xMin>-?\d+)..(?<xMax>-?\d+), y=(?<yMin>-?\d+)..(?<yMax>-?\d+)/
).groups;

function simulate({ vx, vy, target }) {
  const steps = [];
  let x = 0;
  let y = 0;
  while (x < target.xMax && y > target.yMin) {
    steps.push({ x, y });
    x += vx;
    y += vy;
    if (vx > 0) {
      vx--;
    }
    if (vx < 0) {
      vx++;
    }
    vy--; //gravity
    if (
      x >= target.xMin &&
      x <= target.xMax &&
      y >= target.yMin &&
      y <= target.yMax
    ) {
      steps.push({ x, y });
      return steps;
    }
  }
}

function part1() {
  let maxY = 0;
  for (let vx = 0; vx < target.xMax; vx++) {
    for (let vy = 1000; vy >= 0; vy--) {
      const steps = simulate({ vx, vy, target });
      if (steps) {
        let max = Math.max(...steps.map((p) => p.y));
        if (max > maxY) {
          maxY = max;
        }
      }
    }
  }
  console.log(maxY);
}

part1();

function part2() {
  let total = 0;
  for (let vx = 1; vx <= target.xMax; vx++) {
    for (let vy = 1000; vy >= target.yMin; vy--) {
      const steps = simulate({ vx, vy, target });
      if (steps) {
        total++;
      }
    }
  }
  console.log(total);
}

part2();
