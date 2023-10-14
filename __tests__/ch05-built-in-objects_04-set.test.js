import { describe, expect, it } from "@jest/globals";

describe("Sets", function () {
  it("should contain zero items when constructed", () => {
    var set = new Set();
    expect(set.size).toBe(0);
  });

  it("should contain 1 item when one item is added", () => {
    let set = new Set();
    set.add("somevalue");
    expect(set.size).toBe(1);
  });

  it("should allow strings and numbers which are equal with ==", function () {
    let set = new Set();
    set.add(5);
    set.add("5");
    set.add(5); // this call is ignored
    expect(set.size).toBe(2);
  });

  it("should allow objects as a key", function () {
    let set = new Set();
    let key = {};
    set.add(key);
    expect(set.has(key)).toBe(true);
  });

  it("should allow multiple distinct objects", function () {
    let set = new Set(),
      key1 = {},
      key2 = {};
    set.add(key1);
    set.add(key2);
    expect(set.size).toBe(2);
  });

  it("should contain items when given an array in the constructor", () => {
    let set = new Set([1, 2, 3, 3, 2]);
    expect(set.has(1)).toBe(true);
    expect(set.has(2)).toBe(true);
    expect(set.has(3)).toBe(true);
    expect(set.size).toBe(3); // the duplicate numbers are ignored
  });

  it("should not allow duplicate values", () => {
    let set = new Set();
    let key = {};
    set.add(key);
    set.add(key);
    expect(set.size).toBe(1);
  });

  it("should have no items after clear is called", () => {
    let set = new Set();
    set.add(1);
    set.add(2);
    set.add(3);
    set.clear();
    expect(set.size).toBe(0);
  });

  it("should remove an item when delete is called", () => {
    let set = new Set();
    set.add(1);
    set.add(2);
    set.delete(1);
    expect(set.size).toBe(1);
  });

  it("should call a callback function once for each item when foreach is invoked", function () {
    let set = new Set();
    set.add("Tom");
    set.add("Dick");
    set.add("Harry");

    let iterationCount = 0;
    set.forEach((item) => iterationCount++);
    expect(iterationCount).toBe(3);
  });

  it("should get a this reference if we need this in callback functions", function () {
    let set = new Set([1, 2]);
    let processor = {
      output(value) {
        console.log(value);
      },
      process(dataSet) {
        dataSet.forEach(function (value) {
          this.output(value);
        }, this); // this argument is not necessary if we use an arrow function
      }
    };
    processor.process(set);

    let processor2 = {
      output(value) {
        console.log(value);
      },
      process(dataSet) {
        dataSet.forEach((value) => this.output(value)); // this is not passed as a parameter
      }
    };
    processor2.process(set);
  });

  it("should support for of iteration", function () {
    let set = new Set([1, 2, 3]);

    let iterationCount = 0;
    for (let item of set) {
      // Weak references in contrast are not iterable
      iterationCount++;
    }
    expect(iterationCount).toBe(3);
  });

  it("should get converted to an array if we need to reference the elements by index", function () {
    let set = new Set([1, 2, 3, 3, 3, 4, 5]),
      array = [...set];
    expect(array).toEqual([1, 2, 3, 4, 5]);

    function eliminateDuplicates(items) {
      return [...new Set(items)];
    }
    let numbers = [1, 2, 3, 3, 3, 4, 5],
      noDuplicates = eliminateDuplicates(numbers);
    expect(noDuplicates).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return an iterator of arrays when entries is called", () => {
    let set = new Set();
    set.add("1");

    let entries = set.entries();
    let firstEntry = entries.next().value;
    expect(firstEntry[0]).toBe("1");
    expect(firstEntry[1]).toBe("1");
  });

  it("should return an iterator of keys when values is called", () => {
    let set = new Set();
    set.add("1");

    let values = set.keys(); // this method is not defined for weak sets
    let firstValue = values.next().value;
    expect(firstValue).toBe("1");
  });

  it("should return an iterator of values when values is called", () => {
    let set = new Set();
    set.add("1");

    let values = set.values();
    let firstValue = values.next().value;
    expect(firstValue).toBe("1");
  });

  it("should be able to be constructed with an iterator", () => {
    let set = new Set();
    set.add("1");
    set.add("2");
    set.add("3");

    let set2 = new Set(set.values());
    expect(set2.size).toBe(3);
  });
});
