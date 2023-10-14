import { describe, expect, it } from "@jest/globals";

describe("Numbers", () => {
  it("should easily mistake numbers with leading zeroes", () => {
    // legacy octal numbers are not allowed in strict mode
    // const octal = "071";
    // expect(parseInt(octal)).toBe(57);
  });

  it("should support octal literals", () => {
    let octal = 0o71;
    expect(octal).toBe(57);
  });

  it("should support binary literals", () => {
    let bin = 0b1101;
    expect(bin).toBe(13);
  });

  it("should parse octal values with Number function", () => {
    let octNum = Number("0o71");
    expect(octNum).toBe(57);
  });

  it("should parse binary values with Number function", () => {
    let binNum = Number("0b101");
    expect(binNum).toBe(5);
  });

  it("should expose parseInt and parseFloat", () => {
    expect(Number.parseInt("3")).toBe(3);
    expect(Number.parseFloat("3.5")).toBe(3.5);
  });

  it("should not convert strings when calling Number.isFinite vs global", () => {
    expect(isFinite("1")).toBe(true);
    expect(Number.isFinite("1")).toBe(false); // this is false because the string is not a number
    expect(Number.isFinite(Number.parseInt("1"))).toBe(true);
  });

  it("should not convert strings when calling Number.isNaN vs global", () => {
    expect(isNaN("NaN")).toBe(true);
    expect(Number.isNaN("NaN")).toBe(false); // the string is not going to be automatically converted
  });

  it("should correctly detect integers with isInteger", () => {
    expect(Number.isInteger(1)).toBe(true);
    expect(Number.isInteger(1.0)).toBe(true);
    expect(Number.isInteger(1.5)).toBe(false);
  });

  it("should expose max and min safe integer constants", () => {
    expect(Math.pow(2, 53)).toBe(Math.pow(2, 53) + 1);
    expect(Math.pow(2, 53) + 3).toBe(Math.pow(2, 53) + 5);

    expect(Number.MAX_SAFE_INTEGER).toBe(Math.pow(2, 53) - 1);
    expect(Number.MIN_SAFE_INTEGER).toBe(Math.pow(2, 53) * -1 + 1);
  });

  it("should indicate safe integers with isSafeInteger", () => {
    expect(Number.isSafeInteger(9007199254740991)).toBe(true);
    expect(Number.isSafeInteger(Math.pow(2, 53) - 1)).toBe(true);
    expect(Number.isSafeInteger(9007199254740992)).toBe(false);
    expect(Number.isSafeInteger(Math.pow(2, 53))).toBe(false);
  });
});
