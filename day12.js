const fs = require("fs");

const graph = {};

const lines = fs
  .readFileSync("day12.txt", { encoding: "utf-8" }) // read day??.txt content
  .replace(/\r/g, "") // remove all \r characters to avoid issues on Windows
  .split("\n") // Split on newline
  .filter(Boolean) // Remove empty lines
  .map((x) => {
    const [from, to] = x.split("-");
    if (!graph[from]) {
      graph[from] = [];
    }
    if (!graph[to]) {
      graph[to] = [];
    }
    graph[from].push(to);
    graph[to].push(from);

    return { from, to };
  });

function isSmallCave(string) {
  return /[a-z]/.test(string);
}

function part1() {
  function depthFirstSearch(node, visited, paths) {
    visited.push(node);
    if (node === "end") {
      paths.push(visited.join`,`);
      return;
    }

    for (const neighbor of graph[node]) {
      if (isSmallCave(neighbor) && visited.includes(neighbor)) {
        continue;
      }
      depthFirstSearch(neighbor, [...visited], paths);
    }
  }

  const paths = [];
  depthFirstSearch("start", [], paths);
  console.log(paths.length);
}

part1();

/**
 * one small cave can be visited at most twice
 * all other small caves can be visited at most once
 */
function part2() {
  function depthFirstSearch(node, visited, visitedTwiceAlready, paths) {
    visited.push(node);
    if (node === "end") {
      paths.push(visited.join`,`);
      return;
    }

    for (const neighbor of graph[node]) {
      if (neighbor === "start") {
        continue;
      }
      if (isSmallCave(neighbor) && visited.includes(neighbor)) {
        if (visitedTwiceAlready) {
          continue;
        }
        if (visited.filter((x) => x === neighbor).length >= 2) {
          continue;
        }
        depthFirstSearch(neighbor, [...visited], true, paths);
      } else {
        depthFirstSearch(neighbor, [...visited], visitedTwiceAlready, paths);
      }
    }
  }

  const paths = [];
  depthFirstSearch("start", [], false, paths);
  console.log(paths.length);
}

part2();
