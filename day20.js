const fs = require("fs");

const [algorithm, data] = fs
  .readFileSync("day20.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .trim() // Remove starting/ending whitespace
  .split("\n\n"); // Split on newline

const image = data.trim().split("\n");

function get(y, x, image, defaultChar) {
  if (typeof image[y] !== "undefined" && typeof image[y][x] !== "undefined") {
    return image[y][x];
  }
  return defaultChar;
}

function convolution({ image, algorithm, defaultChar = "." }) {
  const result = [];
  for (let y = -1; y < image.length + 1; y++) {
    const current = [];
    for (let x = -1; x < image[0].length + 1; x++) {
      // do the convolution
      let binary = "";
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          binary += get(y + i, x + j, image, defaultChar) === "#" ? "1" : "0";
        }
      }
      const index = parseInt(binary, 2);
      current.push(algorithm[index]);
    }
    result.push(current.join(""));
  }
  return result;
}

function doubleConvolution({ image, algorithm }) {
  let defaultChar = ".";
  const tmp = convolution({ image, algorithm, defaultChar });
  if (algorithm[0] === "#") {
    defaultChar = "#";
  }
  return convolution({ image: tmp, algorithm, defaultChar });
}

function countLight(image) {
  return image.join("").replace(/\./g, "").length;
}

function part1() {
  // console.table(image);
  // console.table(convolution({ image, algorithm }));
  // console.table(doubleConvolution({ image, algorithm }));
  console.log(countLight(doubleConvolution({ image, algorithm })));
}

part1();

function multipleConvolution({ image, algorithm, steps }) {
  let defaultChar = ".";
  for (let i = 0; i < steps; i++) {
    image = convolution({ image, algorithm, defaultChar });
    if (defaultChar === "." && algorithm[0] === "#") {
      defaultChar = "#";
    } else if (defaultChar === "#" && algorithm[511] === ".") {
      defaultChar = ".";
    }
  }
  return image;
}

function part2() {
  console.log(
    countLight(
      multipleConvolution({
        image,
        algorithm,
        steps: 50,
      })
    )
  );
}

part2();
