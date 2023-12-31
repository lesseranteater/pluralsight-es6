import { describe, expect, it } from "@jest/globals";

describe("Math trig functions", () => {
  it("should return correct values", () => {
    expect(Math.acosh(1)).toBe(0);
    expect(Math.asinh(0)).toBe(0);
    expect(Math.atanh(0)).toBe(0);
    expect(Math.cosh(0)).toBe(1);
    expect(Math.sinh(0)).toBe(0);
    expect(Math.tanh(0)).toBe(0);
  });
});

describe("Misc Math functions", () => {
  it("should return correct values", () => {
    expect(Math.cbrt(27)).toBe(3);
    expect(Math.clz32(5)).toBe(29); // number of leading zeros in a 32 bit representation
    expect(Math.log1p(35)).toBe(3.58351893845611);
    expect(Math.log10(100)).toBe(2);
    expect(Math.log2(32)).toBe(5);
    expect(Math.expm1(35)).toBe(1586013452313429.8);
    expect(Math.hypot(3, 4)).toBe(5);
    expect(Math.fround(2.888)).toBe(2.888000011444092);
  });
});

describe("Other Math functions", () => {
  it("should return correct values", () => {
    expect(Math.sign(10)).toBe(1);
    expect(Math.sign(0)).toBe(0);
    expect(Math.sign(-10)).toBe(-1);
    expect(Math.trunc(2.8)).toBe(2);
    expect(Math.trunc(-2.8)).toBe(-2);
  });
});
