const assert = require("assert");
const fs = require("fs");

const lines = fs
  .readFileSync("day18.txt", { encoding: "utf-8" }) // read day??.txt content
  .trim()
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .split("\n") // Split on newline
  .map((line) => JSON.parse(line));

function explode(snailfish, level = 1) {
  for (let i = 0; i < snailfish.length; i++) {
    const s = snailfish[i];
    if (
      level === 4 &&
      s.length &&
      s.length === 2 &&
      typeof s[0].value !== "undefined" &&
      typeof s[1].value !== "undefined"
    ) {
      // Explode
      console.log("explode");
      // console.log(s[0].previous, s[1].next);
      let prev = s[0].previous;
      if (prev) {
        prev.value += s[0].value;
      }
      let next = s[1].next;
      if (next) {
        next.value += s[1].value;
      }
      const object = {
        value: 0,
        previous: s[0].previous,
        next: s[1].next,
        parent: s[0].parent.parent,
      };
      if (s[0].previous) {
        s[0].previous.next = object;
      }
      if (s[1].next) {
        s[1].next.previous = object;
      }
      snailfish[i] = object;
      return true;
    }
    const res = explode(s, level + 1);
    if (res) {
      return true;
    }
  }
}

function split(snailfish) {
  for (let i = 0; i < snailfish.length; i++) {
    const s = snailfish[i];
    if (typeof s.value !== "undefined" && s.value >= 10) {
      //split
      console.log("split");
      const one = {
        value: Math.floor(s.value / 2),
        previous: s.previous,
      };
      const two = {
        value: Math.ceil(s.value / 2),
        previous: one,
        next: s.next,
      };
      one.next = two;
      snailfish[i] = [one, two];
      snailfish[i].parent = s.parent;
      one.parent = snailfish[i];
      two.parent = snailfish[i];
      if (s.next) {
        s.next.previous = two;
      }
      if (s.previous) {
        s.previous.next = one;
      }

      return true;
    }
    const res = split(s);
    if (res) {
      return true;
    }
  }
}

function createObject(array) {
  let previous = null;
  let last = null;
  function doThing(value, parent) {
    value.parent = parent;
    for (let i = 0; i < value.length; i++) {
      const element = value[i];
      if (typeof element === "number") {
        //it's a number
        const object = {
          value: element,
          previous,
          parent: value,
        };
        value[i] = object;
        previous = object;
        last = object;
        if (!array.first) {
          array.first = object;
        }
      } else {
        doThing(element, value);
      }
    }
  }
  doThing(array, null);
  array.last = last;
  let next = null;
  while (last) {
    last.next = next;
    next = last;
    last = last.previous;
  }

  return array;
}

function toString(snailfish) {
  if (typeof snailfish.value !== "undefined") {
    return snailfish.value;
  }
  let str = "[";
  for (let i = 0; i < snailfish.length; i++) {
    const e = snailfish[i];
    str += toString(e);
    if (i < snailfish.length - 1) {
      str += ",";
    }
  }
  str += "]";
  return str;
}

function reduce(o) {
  // console.log(toString(o));
  let modified;
  do {
    modified = false;
    modified = explode(o);
    if (!modified) {
      modified = split(o);
    }
    if (modified) {
      console.log(toString(o));
    }
  } while (modified);
}

function add(one, two) {
  reduce(one);
  reduce(two);
  const res = [one, two];
  one.parent = res;
  two.parent = res;
  one.last.next = two.first;
  two.first.previous = one.last;
  res.first = one.first;
  res.last = two.last;
  reduce(res);
  return res;
}

function processList(lines) {
  let sum = createObject(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const current = createObject(lines[i]);
    sum = add(sum, current);
  }
  return sum;
}

function check(lines, expectedResult) {
  const sum = processList(lines.split("\n").map((x) => JSON.parse(x)));
  assert.equal(toString(sum), expectedResult);
}

// check(
//   `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
// [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]`,
//   "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]"
// );

check(
  `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]`,
  "[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]"
);

// check(
//   `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
// [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
// [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
// [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]`,
//   "[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]"
// );

// check(
//   `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
// [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
// [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
// [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
// [7,[5,[[3,8],[1,4]]]]`,
//   "[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]"
// );

// check(
//   `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
// [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
// [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
// [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
// [7,[5,[[3,8],[1,4]]]]
// [[2,[2,2]],[8,[8,1]]]`,
//   "[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]"
// );

// check(
//   `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
// [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
// [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
// [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
// [7,[5,[[3,8],[1,4]]]]
// [[2,[2,2]],[8,[8,1]]]
// [2,9]
// `,
//   "[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]"
// );

// check(
//   `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
// [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
// [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
// [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
// [7,[5,[[3,8],[1,4]]]]
// [[2,[2,2]],[8,[8,1]]]
// [2,9]
// [1,[[[9,3],9],[[9,0],[0,7]]]]`,
//   "[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]"
// );

// check(
//   `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
// [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
// [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
// [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
// [7,[5,[[3,8],[1,4]]]]
// [[2,[2,2]],[8,[8,1]]]
// [2,9]
// [1,[[[9,3],9],[[9,0],[0,7]]]]
// [[[5,[7,4]],7],1]`,
//   "[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]"
// );

// check(
//   `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
// [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
// [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
// [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
// [7,[5,[[3,8],[1,4]]]]
// [[2,[2,2]],[8,[8,1]]]
// [2,9]
// [1,[[[9,3],9],[[9,0],[0,7]]]]
// [[[5,[7,4]],7],1]
// [[[[4,2],2],6],[8,7]]`,
//   "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"
// );

// function part1() {
//   const sum = processList(lines);
//   console.log(toString(sum));
// }

// part1();

function part2() {
  //do something here
}

part2();
