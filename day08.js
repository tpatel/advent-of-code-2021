const fs = require("fs");

const lines = fs
  .readFileSync("day08.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .split("\n") // Split on newline
  .filter(Boolean) // Remove empty lines
  .map((line) => {
    const [signalPatterns, outputValue] = line.split(" | ").map((x) =>
      x.split(" ").map((string) => {
        const letters = [...string];
        letters.sort();
        return letters.join``;
      })
    );
    return {
      signalPatterns,
      outputValue,
    };
  });

// number => nb of segments
// 0 => 6
// 1 => 2 #
// 2 => 5
// 3 => 5
// 4 => 4 #
// 5 => 5
// 6 => 6
// 7 => 3 #
// 8 => 7 #
// 9 => 6

function part1() {
  let counter = 0;
  for (const line of lines) {
    const matches = line.outputValue.filter((v) =>
      [2, 4, 3, 7].includes(v.length)
    );
    counter += matches.length;
  }
  console.log(counter);
}

part1();

// a includes all from b
function includes(a, b) {
  const set = new Set([...a]);
  return [...b].every((x) => set.has(x));
}

function part2() {
  let total = 0;
  for (const line of lines) {
    const matches = {
      1: line.signalPatterns.find((x) => x.length === 2),
      4: line.signalPatterns.find((x) => x.length === 4),
      7: line.signalPatterns.find((x) => x.length === 3),
      8: line.signalPatterns.find((x) => x.length === 7),
    };

    matches[6] = line.signalPatterns.find(
      (x) => x.length === 6 && !includes(x, matches[1])
    );
    matches[9] = line.signalPatterns.find(
      (x) => x.length === 6 && x !== matches[6] && includes(x, matches[4])
    );
    matches[0] = line.signalPatterns.find(
      (x) => x.length === 6 && x !== matches[6] && x !== matches[9]
    );

    matches[3] = line.signalPatterns.find(
      (x) => x.length === 5 && includes(x, matches[1])
    );
    matches[5] = line.signalPatterns.find(
      (x) => x.length === 5 && x !== matches[3] && includes(matches[6], x)
    );
    matches[2] = line.signalPatterns.find(
      (x) => x.length === 5 && x !== matches[3] && x !== matches[5]
    );

    const translationTable = Object.fromEntries(
      Object.entries(matches).map((x) => x.reverse())
    );

    const translated = Number(
      line.outputValue.map((signal) => translationTable[signal]).join``
    );

    total += translated;
  }
  console.log(total);
}

part2();
