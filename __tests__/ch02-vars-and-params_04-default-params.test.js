import { describe, expect, it } from "@jest/globals";

describe("default parameter", () => {
  it("provides defaults", () => {
    let doWork = function (name = "Scott") {
      return name;
    };

    let result = doWork(); // use the default name, as no parameter has been provided
    expect(result).toBe("Scott");

    result = doWork(undefined); // undefined does trigger the default constructor
    expect(result).toBe("Scott");

    result = doWork(null); // null does NOT trigger the default name
    expect(result).toBe(null);

    result = doWork(""); // empty string does NOT trigger the default name
    expect(result).toBe("");
  });

  it("will provide a value for undefined", () => {
    let doWork = function (a = 1, b = 2, c = 3) {
      return [a, b, c];
    };
    let [a, b, c] = doWork(5, undefined);
    expect(a).toBe(5);
    expect(b).toBe(2);
    expect(c).toBe(3);
  });

  it("works with destructuring", () => {
    let doWork = function (url, { data = "Scott", cache = true }) {
      return data;
    };

    let result = doWork("api/test", {
      cache: false
    });
    expect(result).toBe("Scott");
  });

  it("default values and arguments object", function () {
    // not in strict mode
    function mixArgs(first, second = "b") {
      expect(arguments.length).toBe(1);
      expect(first).toBe("a");
      expect(arguments[0]).toBe("a");
      expect(second).toBe("b");
      expect(arguments[1]).toBe(undefined);
      first = "c";
      second = "d";
      expect(first).toBe("c");
      expect(arguments[0]).toBe("a");
      expect(second).toBe("d");
      expect(arguments[1]).toBe(undefined);
    }
    mixArgs("a");
  });

  it("default parameter expressions", function () {
    let value = 5;
    function getValue() {
      return value++;
    }
    function add(first, second = getValue()) {
      return first + second;
    }
    expect(add(1, 1)).toBe(2);
    expect(add(1)).toBe(6); // the default method is called only when add() is called without a second parameter
    expect(add(1)).toBe(7);
  });

  it("give one parameter the value of another", function () {
    function add(first, second = first) {
      return first + second;
    }
    expect(add(1, 2)).toBe(3);
    expect(add(1)).toBe(2); // the second parameter is given the value of the first
    // meaning the passing in just one argument leaves both arguments with the same value
  });

  it("process one argument with a function and use it as another argument", function () {
    function getValue(value) {
      return value + 5;
    }
    function add(first, second = getValue(first)) {
      return first + second;
    }
    // NOTE: earlier arguments don't have access to later arguments
    // function add(first = second, second) {
    //   return first + second;
    // }
    // console.log(add(1, 1));              // 2
    // console.log(add(undefined, 1));      // throws an error because second is defined after first and is therefore
    // unavailable as default value

    expect(add(1, 2)).toBe(3);
    expect(add(1)).toBe(7);
  });
});
