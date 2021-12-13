const { match } = require("assert");
const fs = require("fs");

const [data1, data2] = fs
  .readFileSync("day13.txt", { encoding: "utf-8" }) // read day??.txt content
  .trim()
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .split("\n\n");

const coordinates = data1
  .trim()
  .split("\n") // Split on newline
  .map((x) => {
    const p = x.split(",").map(Number);
    return { x: p[0], y: p[1] };
  });

const foldInstructions = data2
  .trim()
  .split("\n") // Split on newline
  .map((x) => x.match(/fold along (?<axis>[xy])=(?<position>\d+)/).groups)
  .map((x) => ({ axis: x.axis, position: Number(x.position) }));

function part1() {
  let points = [...coordinates.map((x) => ({ ...x }))];
  let nextPoints = [];
  for (const fold of foldInstructions) {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (point[fold.axis] > fold.position) {
        point[fold.axis] =
          (point[fold.axis] - fold.position) * -1 + fold.position;
      }
      nextPoints.push(point);
    }
    break;
  }
  // console.log(points);

  // deduplication
  const set = new Set(points.map((p) => `${p.x},${p.y}`));
  // const debug = [...set];
  // debug.sort();
  // console.log(debug);
  console.log(set.size);
}

part1();

function part2() {
  let points = [...coordinates.map((x) => ({ ...x }))];
  let nextPoints = [];
  for (const fold of foldInstructions) {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (point[fold.axis] > fold.position) {
        point[fold.axis] =
          (point[fold.axis] - fold.position) * -1 + fold.position;
      }
      nextPoints.push(point);
    }
  }

  // deduplication
  const set = new Set(points.map((p) => `${p.x},${p.y}`));
  const array = [...set].map((x) => x.split(","));
  const maxX = Math.max(...array.map((x) => x[0]));
  const maxY = Math.max(...array.map((x) => x[1]));

  for (let j = 0; j <= maxY; j++) {
    let string = "";
    for (let i = 0; i <= maxX; i++) {
      const key = `${i},${j}`;
      if (set.has(key)) {
        string += "█";
      } else {
        string += "·";
      }
    }
    console.log(string);
  }
}

part2();
