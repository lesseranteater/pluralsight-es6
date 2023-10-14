import { describe, expect, it } from "@jest/globals";

describe("rest parameters", () => {
  it("is like varargs", () => {
    let doWork = function (name, ...numbers) {
      // a rest parameter is indicated by 3 dotes preceding a named parameter
      // the rest parameter must be the last one
      // rest parameters cannot be used in setter functions, as setters are restricted to a single argument
      let result = 0;
      numbers.forEach(function (n) {
        result += n;
      });
      return result;
    };
    let result = doWork("Scott", 1, 2, 3);
    expect(result).toBe(6);
  });

  it("rest parameters and the arguments object", function () {
    // the arguments object correctly reflects the parameters which were passed regardless of rest parameter usage
    function checkArgs(...args) {
      expect(args.length).toBe(2);
      expect(arguments.length).toBe(2);
      expect(args[0]).toBe(arguments[0]);
      expect(args[1]).toBe(arguments[1]);
    }
    checkArgs("a", "b");
  });
});
