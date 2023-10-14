import { describe, expect, it } from "@jest/globals";

describe("WeakSets", () => {
  it("should not have properties & methods that relate to the entire set", () => {
    let set = new WeakSet();
    expect(set.size).toBe(undefined);
    expect(set.entries).toBe(undefined);
    expect(set.values).toBe(undefined);
    expect(set.forEach).toBe(undefined);
  });

  it("should be able to find items with has", () => {
    let set = new WeakSet();
    let item = { name: "Joe" };
    set.add(item);
    expect(set.has(item)).toBe(true);
  });

  it("should be able to remove items with delete", () => {
    let set = new WeakSet();
    let item = { name: "Joe" };
    set.add(item);
    set.delete(item); // however, there is no clear() method, as that would require enumerating keys
    expect(set.has(item)).toBe(false);
  });
});

describe("WeakMaps", () => {
  it("should not have properties & methods that relate to the entire set", () => {
    let map = new WeakMap();
    expect(map.size).toBe(undefined); // no size property
    expect(map.entries).toBe(undefined);
    expect(map.keys).toBe(undefined);
    expect(map.values).toBe(undefined);
    expect(map.forEach).toBe(undefined); // no forEach method
  });

  it("should be able to determine existence of items with has", () => {
    let map = new WeakMap();
    let key = {};
    map.set(key, "a");
    expect(map.has(key)).toBe(true);
  });

  it("should be able to get the correct value", () => {
    let map = new WeakMap();
    let key = {};
    map.set(key, "a");
    expect(map.get(key)).toBe("a");
  });

  it("should be able to remove items with delete", () => {
    let map = new WeakMap();
    let key = {};
    map.set(key, "a");
    map.delete(key);
    expect(map.has(key)).toBe(false);
  });

  it("WeakMap initialization ", function () {
    let key1 = {},
      key2 = {},
      map = new WeakMap([
        [key1, "Hello"],
        [key2, 42]
      ]);
    expect(map.has(key1)).toBe(true);
    expect(map.get(key1)).toBe("Hello");
    expect(map.has(key2)).toBe(true);
    expect(map.get(key2)).toBe(42);
  });

  it("private object data", function () {
    let Person = (function () {
      let privateData = new WeakMap();
      function Person(name) {
        privateData.set(this, { name: name });
      }
      Person.prototype.getName = function () {
        return privateData.get(this).name;
      };
      return Person;
    })();

    let person = new Person("Alex");
    expect(person.getName()).toBe("Alex");
    person = null; // the private information is destroyed when the object instance associated with it is destroyed
  });
});
