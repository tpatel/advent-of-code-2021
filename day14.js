const fs = require("fs");

const [template, data] = fs
  .readFileSync("day14.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim()
  .split("\n\n");

const pairRules = data
  .trim()
  .split("\n")
  .map((x) => x.split(" -> "));

// console.log(template, pairRules);

function addToMap(map, key, val = 1) {
  if (!map.has(key)) {
    map.set(key, 0);
  }
  map.set(key, map.get(key) + val);
}

// create a better pairRule data structure
const pairRulesMap = new Map();
for (const rule of pairRules) {
  // if you have CH => B
  // CH creates CB and BH
  pairRulesMap.set(rule[0], [rule[0][0] + rule[1], rule[1] + rule[0][1]]);
}

function part1() {
  // create datastructure from template
  let map = new Map();
  for (let i = 0; i < template.length - 1; i++) {
    const pair = template[i] + template[i + 1];
    addToMap(map, pair);
  }
  const lastChar = template[template.length - 1];

  for (let step = 0; step < 10; step++) {
    let current = new Map();
    const keys = map.keys();
    for (const key of keys) {
      const next = pairRulesMap.get(key);
      addToMap(current, next[0], map.get(key));
      addToMap(current, next[1], map.get(key));
    }
    map = current;
  }
  // console.log(map);

  const elementCount = new Map();
  addToMap(elementCount, lastChar);
  const keys = map.keys();
  for (const key of keys) {
    addToMap(elementCount, key[0], map.get(key));
  }
  // console.log(elementCount);

  const values = [...elementCount.values()];
  const min = Math.min(...values);
  const max = Math.max(...values);
  console.log(max - min);
}

part1();

function part2() {
  // create datastructure from template
  let map = new Map();
  for (let i = 0; i < template.length - 1; i++) {
    const pair = template[i] + template[i + 1];
    addToMap(map, pair);
  }
  const lastChar = template[template.length - 1];

  for (let step = 0; step < 40; step++) {
    let current = new Map();
    const keys = map.keys();
    for (const key of keys) {
      const next = pairRulesMap.get(key);
      addToMap(current, next[0], map.get(key));
      addToMap(current, next[1], map.get(key));
    }
    map = current;
  }
  // console.log(map);

  const elementCount = new Map();
  addToMap(elementCount, lastChar);
  const keys = map.keys();
  for (const key of keys) {
    addToMap(elementCount, key[0], map.get(key));
  }
  // console.log(elementCount);

  const values = [...elementCount.values()];
  const min = Math.min(...values);
  const max = Math.max(...values);
  console.log(max - min);
}

part2();
