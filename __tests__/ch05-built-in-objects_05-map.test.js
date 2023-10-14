import { describe, expect, it } from "@jest/globals";

describe("Maps", () => {
  it("should contain zero items when constructed", () => {
    let map = new Map();
    expect(map.size).toBe(0);
  });

  it("should contain 1 item when one item is added", () => {
    let map = new Map();
    map.set("age", 35);
    expect(map.size).toBe(1);
  });

  it("should return the value when get is called with the correct key", () => {
    let map = new Map();
    map.set("age", 35);
    expect(map.get("age")).toBe(35);
  });

  it("should allow an object to be the key", () => {
    let ageMap = new Map();
    let ralph = { name: "Ralph" };
    ageMap.set(ralph, 29);

    expect(ageMap.get(ralph)).toBe(29);
  });

  it("should contain items when given an array in the constructor", () => {
    let map = new Map([
      ["name", "John"],
      ["age", 15],
      ["weight", "155"]
    ]);
    expect(map.size).toBe(3);
  });

  it("should find the correct item when has is called", () => {
    let map = new Map([
      ["name", "John"],
      ["age", 15],
      ["weight", "155"]
    ]);
    expect(map.has("age")).toBe(true);
  });

  it("should not allow duplicate keys", () => {
    let map = new Map();
    let key = {};
    map.set(key, "first");
    map.set(key, "second");
    expect(map.get(key)).toBe("second");
  });

  it("should not allow duplicate keys", () => {
    let map = new Map();
    let key1 = {};
    let key2 = {};
    map.set(key1, "first");
    map.set(key2, "second");

    expect(map.get(key1)).toBe("first");
    expect(map.has(key1)).toBe(true);
    expect(map.get(key2)).toBe("second");
    expect(map.has(key2)).toBe(true);
  });

  it("should have no items after clear is called", () => {
    let map = new Map();
    map.set(1, "a");
    map.set(2, "b");
    map.set(3, "c");
    map.clear();

    expect(map.has("name")).toBe(false);
    expect(map.get("name")).toBe(undefined);
    expect(map.has("age")).toBe(false);
    expect(map.get("age")).toBe(undefined);
    expect(map.size).toBe(0);
  });

  it("should remove an item when delete is called", () => {
    let map = new Map();
    let key1 = {};
    let key2 = {}; // keys are not coerced into another form and each object is considered unique
    map.set(key1, 100);
    map.set(key2, 200);
    map.delete(key2);
    expect(map.has(key2)).toBe(false);
  });

  it("should call the callback function for each item when forEach is called", () => {
    let map = new Map([
      // an array of arrays, where each array has a key and value
      ["name", "John"],
      ["age", 15]
    ]);

    expect(map.has("name")).toBe(true);
    expect(map.get("name")).toBe("John");
    expect(map.has("age")).toBe(true);
    expect(map.get("age")).toBe(15);
    expect(map.size).toBe(2);

    let iterationCount = 0;
    map.forEach(function (value, key) {
      iterationCount++;
      // use value & key
      console.log(value, key);
    });
    expect(iterationCount).toBe(2);
  });

  it("should support for of iteration", () => {
    let map = new Map([
      ["name", "John"],
      ["age", 15],
      ["weight", "155"]
    ]);
    let iterationCount = 0;
    for (let [key, value] of map) {
      // destructuring the array
      // item is an array like ['name', 'John']
      iterationCount++;
      console.log(key, value);
    }
    expect(iterationCount).toBe(3);
  });

  it("should return an iterator of arrays of key value pairs when entries is called", () => {
    let map = new Map();
    map.set("name", "Joe");
    let items = map.entries();
    let first = items.next().value;
    expect(first[0]).toBe("name");
    expect(first[1]).toBe("Joe");
  });

  it("should return an iterator of values when values is called", () => {
    let map = new Map();
    map.set(1, "a");
    let values = map.values();
    let first = values.next().value;
    expect(first).toBe("a");
  });

  it("should return an iterator of keys when keys is called", () => {
    let map = new Map();
    map.set(1, "a");
    let keys = map.keys();
    let firstKey = keys.next().value;
    expect(firstKey).toBe(1);
  });

  it("should be able to be constructed with an iterator", () => {
    let map = new Map();
    map.set("1");
    map.set("2");
    map.set("3");
    let map2 = new Map(map.entries());
    expect(map2.size).toBe(3);
  });
});
