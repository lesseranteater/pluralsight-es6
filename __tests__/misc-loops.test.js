import { describe, expect, it } from "@jest/globals";
import console from "console";
import { createReadStream } from "fs";
global.console = console;

it("forEach with index", () => {
  const cars = ["Ford", "Chevy", "Honda", "Toyota"];
  cars.forEach((car, index, array) => {
    console.log(`${index}:${cars[index]}`);
  });
});
