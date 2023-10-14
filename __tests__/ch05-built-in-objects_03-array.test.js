import { describe, expect, it } from "@jest/globals";

describe("Arrays", () => {
  it("should return the first matching element using find", () => {
    let ary = [1, 5, 10];
    let match = ary.find((item) => item > 8);
    expect(match).toBe(10);
  });

  it("should return the first matching index using findIndex", () => {
    let match = [1, 5, 10].findIndex((item) => item > 3);
    expect(match).toBe(1);
  });

  it("should fill in the entire array when fill is called", () => {
    let ary = [1, 2, 3, 4, 5];
    ary.fill("a");
    expect(ary[3]).toBe("a");
  });

  it("should fill in some of the array when fill is called with args", () => {
    let ary = [1, 2, 3, 4, 5];
    ary.fill("a", 2, 3); // [1,2,'a',4,5]
    expect(ary[2]).toBe("a");
    expect(ary[3]).toBe(4);
  });

  it("should copy elements with copyWithin", () => {
    let ary = [1, 2, 3, 4];
    ary.copyWithin(0, -2); //[3,4,3,4]
    expect(ary[0]).toBe(3);
    expect(ary[1]).toBe(4);
  });

  it("should create a new array with 1 arg when given 1 arg when of is called", () => {
    let ar = new Array(1, 2, 3);
    let ary = new Array(3);
    let ofAry = Array.of(3);
    expect(ar).toEqual([1, 2, 3]);
    expect(ary.length).toBe(3);
    expect(ary).toEqual([undefined, undefined, undefined]);
    expect(ofAry.length).toBe(1);
    expect(ofAry).toEqual([3]);
  });

  it("should create a new array from an array-like object when from is called", () => {
    let fromAry = Array.from("foo");
    expect(fromAry.forEach).toBeDefined();
    expect(fromAry).toEqual(["f", "o", "o"]);

    fromAry = Array.from([1, 2, 3], (x) => x + x);
    expect(fromAry).toEqual([2, 4, 6]);
  });

  it("should return entries from the entries function", () => {
    let a = ["Joe", "Jim", "John"];
    let entries = a.entries();

    let firstEntry = entries.next().value;
    expect(firstEntry[0]).toBe(0);
    expect(firstEntry[1]).toBe("Joe");
  });

  it("should enumerate keys with the keys function", () => {
    let a = ["Joe", "Jim", "John"];
    let keys = a.keys();

    let firstKey = keys.next().value; // just the key, not the value
    expect(firstKey).toBe(0);
  });
});
