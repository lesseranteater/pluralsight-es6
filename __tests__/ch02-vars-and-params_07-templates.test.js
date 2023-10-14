import { describe, expect, it } from "@jest/globals";

describe("template literals", () => {
  test("can easily combine literals and data", () => {
    let doWork = function (name) {
      return `Hello, ${name}`; // a string literal
    };
    let result = doWork("Scott");
    expect(result).toEqual("Hello, Scott");
  });

  it("can help build URLs", () => {
    let category = "music";
    let id = 2112;
    let url = `http://apiserver/${category}/${id}`;

    expect(url).toBe("http://apiserver/music/2112");
  });

  it("can use tags", () => {
    let upper = function (strings, ...values) {
      let result = "";
      for (var i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
          result += values[i];
        }
      }
      return result.toUpperCase();
    };

    var x = 1;
    var y = 3;
    var result = upper`${x} + ${y} is ${x + y}`;

    expect(result).toBe("1 + 3 IS 4");
  });
});
