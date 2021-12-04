const fs = require("fs");

const lines = fs
  .readFileSync("day04.txt", { encoding: "utf-8" })
  .split("\n\n")
  .filter((x) => Boolean(x))
  .map((x) =>
    x
      .replace(/[\n ,]+/g, " ")
      .trim()
      .split(" ")
      .map((y) => parseInt(y))
  );

let [drawnNumbers, ...cards] = lines;

class Card {
  constructor(numbers) {
    this.cardSize = 5;
    this.numbers = numbers;
    this.numberToPosition = new Map();
    for (let i = 0; i < this.numbers.length; i++) {
      const n = this.numbers[i];
      this.numberToPosition.set(n, {
        line: Math.floor(i / this.cardSize),
        column: i % this.cardSize,
      });
    }
    this.lines = Array(this.cardSize).fill(0);
    this.columns = Array(this.cardSize).fill(0);
    this.isComplete = false;
    this.markedNumbers = new Set();
  }

  addMarkedNumber(number) {
    const position = this.numberToPosition.get(number);
    if (!position) {
      return;
    }
    this.markedNumbers.add(number);
    this.lines[position.line]++;
    this.columns[position.column]++;
    if (
      this.lines[position.line] === this.cardSize ||
      this.columns[position.column] === this.cardSize
    ) {
      this.isComplete = true;
    }
  }

  unmarkedNumbers() {
    return this.numbers.filter((n) => !this.markedNumbers.has(n));
  }

  showCard() {
    const array = [];
    for (let i = 0; i < this.cardSize; i++) {
      array.push(
        this.numbers
          .slice(i * this.cardSize, i * this.cardSize + this.cardSize)
          .map((n) =>
            this.markedNumbers.has(n) ? `\x1b[47m\x1b[30m${n}\x1b[0m` : n
          )
          .join(`\t`)
      );
    }
    console.log(array.join("\n") + "\n");
  }
}

function part1(_cards) {
  let cards = _cards.map((x) => new Card(x));

  let winningCard;
  const actuallyDrawn = [];
  for (const drawn of drawnNumbers) {
    let finished = false;
    actuallyDrawn.push(drawn);
    for (const card of cards) {
      card.addMarkedNumber(drawn);
      if (card.isComplete) {
        finished = true;
        winningCard = card;
        break;
      }
    }
    if (finished) {
      break;
    }
  }

  const unmarkedNumbers = winningCard.unmarkedNumbers();

  console.log(
    unmarkedNumbers.reduce((a, b) => a + b, 0) * actuallyDrawn.slice(-1)
  );
}

part1(cards);

function part2(_cards) {
  let cards = _cards.map((x) => new Card(x));

  let lastWinningCard;
  let lastWinningNumber;
  const actuallyDrawn = [];
  for (const drawn of drawnNumbers) {
    actuallyDrawn.push(drawn);
    let hasIncompleteCards = false;
    for (const card of cards) {
      if (!card.isComplete) {
        hasIncompleteCards = true;
        card.addMarkedNumber(drawn);
        // card.showCard();
        if (card.isComplete) {
          lastWinningCard = card;
          lastWinningNumber = drawn;
        }
      }
    }
    if (!hasIncompleteCards) {
      break;
    }
  }

  const unmarkedNumbers = lastWinningCard.unmarkedNumbers();

  console.log(unmarkedNumbers.reduce((a, b) => a + b, 0) * lastWinningNumber);
}

part2(cards);
