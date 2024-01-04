import { describe, expect, it } from "@jest/globals";
import console from "console";
global.console = console;

describe("how var/let work", () => {
  it("var will not provide block scoping", () => {
    var doWork = function (flag) {
      if (flag) {
        var x = 3; // x is hoisted up to the top of the function
      }
      return x;
    };
    var result = doWork(true);
    expect(result).toBe(3);
    result = doWork(false);
    expect(result).toBe(undefined);
  });

  it("let will provide block scoping, unlike var", () => {
    var doWork = function (flag) {
      if (flag) {
        let x = 3;
      }
      return x; // ReferenceError: x is not defined
    };
    var result = doWork(true);
    expect(result).toBe(3);
  });

  it("declaring a variable twice with var and let in the same scope", () => {
    var doWork = function (flag) {
      var count = 30;
      // let count = 40; // Error: Block scoped variables cannot share name with 'var' variables or parameters in the same block scope
      return count;
    };
    var result = doWork(true);
    expect(result).toBe(30);
  });

  it("declaring a variable twice with var and let in different scope", () => {
    var doWork = function (flag) {
      var count = 30;
      if (flag) {
        let count = 40; // there is no syntax error, as the two variables no longer share the same scope
      } // when the variable is out of scope, the value of count becomes 30
      return count;
    };
    var result = doWork(true);
    expect(result).toBe(30);
  });

  it("var will not provide block scoping in for loops", () => {
    var doWork = function () {
      for (var i = 0; i < 10; i++) {}
      return i; // the loop variable is visible outside the loop
    };
    var result = doWork();
    expect(result).toBe(10);
  });

  it("let will provide block scoping in for loops, unlike var", () => {
    var doWork = function () {
      for (let i = 0; i < 10; i++) {}
      return i; // ReferenceError: i is not defined
    };
    var result = doWork();
    expect(result).toBe(10);
  });

  it("functions in loops with var", () => {
    var funcs = [];
    for (var i = 0; i < 10; i++) {
      funcs.push(function () {
        return i; // i is shared across each iteration of the loop, meaning the functions created inside the loop
        // all hold a reference to the same variable. The variable i has a value of 10 when the loop completes.
      });
    }
    funcs.forEach(function (func) {
      expect(func()).toBe(10); // outputs the number "10" ten times
    });
  });

  it("functions in loops with var and IIFEs (immediately invoked function expressions)", () => {
    var funcs = [];
    for (var i = 0; i < 10; i++) {
      funcs.push(
        (function (value) {
          return function () {
            return value;
          };
        })(i) // the function creates its own copy and stores it as a value
      );
    }
    let counter = 0;
    funcs.forEach(function (func) {
      let result = func();
      expect(result).toBe(counter++); // outputs the numbers 0 to 9
    });
  });

  it("functions in loops with let - IIFEs not needed ", () => {
    var funcs = [];
    for (let i = 0; i < 10; i++) {
      // the let declaration creates a new variable i each time through the loop,
      // so each function created inside the loop gets its own copy of i. Each copy of i has the value it was
      // assigned at the beginning of the loop iteration in which it was created.
      funcs.push(function () {
        return i;
      });
    }
    let counter = 0;
    funcs.forEach(function (func) {
      let result = func();
      expect(result).toBe(counter++); // outputs the numbers 0 to 9
    });
  });

  it("for-in loops with let", () => {
    var funcs = [],
      object = {
        a: true,
        b: true,
        c: true
      };
    for (let key in object) {
      // we can also use 'const' instead of 'let' here
      funcs.push(function () {
        return key; // each function has its own copy of the function variable
      });
    }

    let result = funcs[0]();
    expect(result).toBe("a");
    result = funcs[1]();
    expect(result).toBe("b");
    result = funcs[2]();
    expect(result).toBe("c");
  });
});
