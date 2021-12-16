const fs = require("fs");

const input = fs
  .readFileSync("day16.txt", { encoding: "utf-8" }) // read day??.txt content
  .trim();

class Packet {
  constructor({ version, typeId }) {
    this.version = version;
    this.typeId = typeId;
    this.packets = [];
  }
}

/**
 * take a binary string, return a list of packets
 */
function parsePackets(input, totalSubpackets = -1) {
  const packets = [];
  let totalPackets = 0;
  const startInputSize = input.length;
  while (
    input.length > 0 &&
    (totalSubpackets < 0 || totalPackets < totalSubpackets)
  ) {
    if (/^0+$/.test(input)) {
      // Only zeros, most likely due to padding
      break;
    }
    const version = parseInt(input.substring(0, 3), 2);
    const typeId = parseInt(input.substring(3, 6), 2);
    const packet = new Packet({
      version,
      typeId,
    });
    totalPackets++;
    input = input.substring(6);

    // literal
    if (typeId === 4) {
      let binaryString = "";
      while (input[0] === "1") {
        binaryString += input.substring(1, 5);
        input = input.substring(5);
      }
      binaryString += input.substring(1, 5);
      input = input.substring(5);
      packet.value = parseInt(binaryString, 2);
    } else {
      const lengthTypeId = input[0];
      input = input.substring(1);
      if (lengthTypeId === "0") {
        const length = parseInt(input.substring(0, 15), 2);
        input = input.substring(15);

        const subpackets = input.substring(0, length);
        packet.packets = parsePackets(subpackets);
        input = input.substring(length);
      } else {
        const totalSubPackets = parseInt(input.substring(0, 11), 2);
        input = input.substring(11);

        packet.packets = parsePackets(input, totalSubPackets);
        input = input.substring(packet.packets.consumed);
        delete packet.packets.consumed;
      }

      //we have the list of subpackets, we can act on it
      switch (typeId) {
        case 0: // sum
          packet.value = packet.packets.reduce((a, b) => a + b.value, 0);
          break;
        case 1: // product
          packet.value = packet.packets.reduce((a, b) => a * b.value, 1);
          break;
        case 2: // min
          packet.value = Math.min(...packet.packets.map((p) => p.value));
          break;
        case 3: // max
          packet.value = Math.max(...packet.packets.map((p) => p.value));
          break;
        case 5: //greater than
          packet.value = Number(
            packet.packets[0].value > packet.packets[1].value
          );
          break;
        case 6: //lower than
          packet.value = Number(
            packet.packets[0].value < packet.packets[1].value
          );
          break;
        case 7: //equal to
          packet.value = Number(
            packet.packets[0].value === packet.packets[1].value
          );
          break;
        default:
          break;
      }
    }
    packets.push(packet);
  }
  packets.consumed = startInputSize - input.length;
  return packets;
}

function sumVersions(packets) {
  return packets
    .map((p) => p.version + sumVersions(p.packets))
    .reduce((a, b) => a + b, 0);
}

function hexToBinary(hex) {
  return [...hex].map((n) => parseInt(n, 16).toString(2).padStart(4, "0"))
    .join``;
}

function part1(input) {
  const binary = hexToBinary(input);
  const packets = parsePackets(binary);

  // console.log(JSON.stringify(packets, null, 2));

  return sumVersions(packets);
}

function assertEqual(a, b) {
  if (a === b) {
    console.log("🎉 Yay", a, b);
  } else {
    console.log("😭 Oops", a, b);
  }
}

// assertEqual(part1("D2FE28"), 6);
// assertEqual(part1("38006F45291200"), 9);
// assertEqual(part1("8A004A801A8002F478"), 16);
// assertEqual(part1("620080001611562C8802118E34"), 12);
// assertEqual(part1("C0015000016115A2E0802F182340"), 23);
// assertEqual(part1("A0016C880162017C3686B18A3D4780"), 31);

console.log(part1(input));

function part2(input) {
  const binary = hexToBinary(input);
  const packets = parsePackets(binary);

  return packets[0].value;
}

// assertEqual(part2("C200B40A82"), 3);
// assertEqual(part2("04005AC33890"), 54);
// assertEqual(part2("880086C3E88112"), 7);
// assertEqual(part2("CE00C43D881120"), 9);
// assertEqual(part2("D8005AC2A8F0"), 1);
// assertEqual(part2("F600BC2D8F"), 0);
// assertEqual(part2("9C005AC2F8F0"), 0);
// assertEqual(part2("9C0141080250320F1802104A08"), 1);

console.log(part2(input));
