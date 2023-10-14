import { describe, expect, it } from "@jest/globals";
import console from "console";
global.console = console;

it("creating symbols - default constructor", function () {
  // use the global Symbol function
  let firstName = Symbol();
  let person = {};
  person[firstName] = "Fred";
  expect(person[firstName]).toBe("Fred");
  expect(typeof firstName).toBe("symbol");
});

it("creating symbols - argument constructor", function () {
  let firstName = Symbol("first name"); // makes reading and debugging easier
  let person = {};
  person[firstName] = "Nick";
  expect("first name" in person).toBe(false); // the argument cannot be used to access the property
  expect(person[firstName]).toBe("Nick");
  expect(firstName.toString()).toBe("Symbol(first name)");
  expect(String(firstName)).toBe("Symbol(first name)"); // coercion to a string
});

it("using symbols as computed property names", function () {
  let firstName = Symbol("first name");
  // use a computed object literal property
  let person = {
    [firstName]: "Nicholas"
  };

  // make the property read only
  Object.defineProperty(person, firstName, { writable: false });
  let lastName = Symbol("last name");
  Object.defineProperties(person, {
    [lastName]: {
      value: "Zakas",
      writable: false
    }
  });
  expect(person[firstName]).toBe("Nicholas");
  expect(person[lastName]).toBe("Zakas");
});

it("sharing symbols", function () {
  let uid = Symbol.for("uid");
  let object = {};
  object[uid] = "12345";
  expect(object[uid]).toBe("12345");
  expect(uid.toString()).toBe("Symbol(uid)");

  let uid2 = Symbol.for("uid");
  // uid and uid2 contain the same symbol and can be used interchangeably
  expect(uid === uid2).toBe(true);
  expect(object[uid2]).toBe("12345");
  expect(uid2.toString()).toBe("Symbol(uid)");
  expect(Symbol.keyFor(uid)).toBe("uid");
  expect(Symbol.keyFor(uid2)).toBe("uid");
  let uid3 = Symbol("uid");
  expect(Symbol.keyFor(uid3)).toBe(undefined);
});

it("retrieving symbol properties", function () {
  let uid = Symbol.for("uid");
  let object = {
    [uid]: "12345"
  };
  // the Object.keys() and Object.getOwnPropertyNames() do not return symbols - there is a new method below
  let symbols = Object.getOwnPropertySymbols(object); // returns an array of symbols
  expect(symbols.length).toBe(1);
  expect(String(symbols[0])).toBe("Symbol(uid)");
  expect(object[symbols[0]]).toBe("12345");
});

it("Symbol.toPrimitive method", function () {
  function Temperature(degrees) {
    this.degrees = degrees;
  }
  Temperature.prototype[Symbol.toPrimitive] = function (hint) {
    switch (hint) {
      case "string":
        return this.degrees + "\u00b0"; // degrees symbol
      case "number":
        return this.degrees;
      case "default":
        return this.degrees + " degrees";
    }
  };
  let freezing = new Temperature(32);
  expect(freezing + "!").toBe("32 degrees!");
  expect(freezing / 2).toBe(16);
  expect(String(freezing)).toBe("32°");
});

it(" Symbol.hasInstance method", function () {
  function SpecialNumber() {
    // empty
  }
  Object.defineProperty(SpecialNumber, Symbol.hasInstance, {
    value: function (v) {
      return v instanceof Number && v >= 1 && v <= 100;
    }
  });
  let two = new Number(2),
    zero = new Number(0);
  expect(two instanceof SpecialNumber).toBe(true); // true
  expect(zero instanceof SpecialNumber).toBe(false); // false
});

it("Symbol.isConcatSpreadable property", function () {
  let collection = {
    0: "Hello",
    1: "world",
    length: 2,
    [Symbol.isConcatSpreadable]: true
  };
  let messages = ["Hi"].concat(collection);
  expect(messages.length).toBe(3);
  expect(messages).toEqual(["Hi", "Hello", "world"]);
});
