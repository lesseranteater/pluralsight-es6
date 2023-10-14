import { describe, expect, it } from "@jest/globals";

describe("the spread", () => {
  it("can spread an array across parameters", () => {
    let doWork = function (x, y, z) {
      return x + y + z;
    };

    let result = doWork(...[1, 2, 3]);
    expect(result).toBe(6);
    let a = [1, 2, 3];
    result = doWork(...a); // we can use either an array or a variable initialized with an array
    expect(result).toBe(6);
  });

  it("spread arguments with regular arguments", function () {
    let values = [-25, -50, -75, -100];
    expect(Math.max(...values, 0)).toBe(0);
  });

  it("can build arrays", () => {
    let a = [4, 5, 6];
    let b = [1, 2, 3, ...a, 7, 8, 9];
    expect(b).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("can be combined with rest params", () => {
    let doWork = function (a, b, c, ...rest) {
      return rest;
    };
    let a = [1, 2, 3, 4, 5];
    let result = doWork(...a);
    expect(result).toEqual([4, 5]);
  });
});
