import { describe, expect, it } from "@jest/globals";

describe("Miscellaneous - Functions", () => {
  it("Function scope", () => {
    let startCar = () => {
      let message = "Starting...";
      let startFn = () => {
        let message = "Override"; // this is out of scope in the external block
      };
      startFn();
      expect(message).toBe("Starting...");
    };
    startCar();
  });

  it("Function scope", () => {
    let message = "Starting...";
    let startFn = function turnKey() {
      expect(message).toBe("Starting..."); // the inner function sees the variable in the outer scope
    };
    startFn();
  });

  it("Problematic block scope with var", () => {
    var message = "Outside";
    if (5 === 5) {
      var message = "Equal";
    }
    expect(message).toBe("Equal");

    let message2 = "Outside";
    if (5 === 5) {
      let message2 = "Equal"; // unused local variable
    }
    expect(message2).toBe("Outside");
  });

  it("IIFE's", () => {
    // immediately invoked function expression
    // used to create a scope which is shielded from the rest of a program
    let car = (function (carId) {
      return {
        id: carId,
        getId: function () {
          // the property can also be a function
          return carId;
        }
      };
    })(123);

    expect(car.id).toBe(123);
    expect(car.getId()).toBe(123);
  });

  it("IIFEs with arrow functions", function () {
    // we must wrap the arrow function up in parentheses
    let person = ((name) => {
      return {
        getName: function () {
          return name;
        }
      };
    })("Floyd");
    expect(person.getName()).toBe("Floyd");
  });

  it("IIFE's and closures", () => {
    // immediately invoked function expression
    let car = (function () {
      let carId = 123;
      let getId = function () {
        return carId;
      };
      return {
        getId: getId // return a reference to a function - it keep the values from the enclosing scope
      };
    })();

    expect(car.getId()).toEqual(123);
  });

  it("This keyword in objects", () => {
    let car = {
      carId: 123,
      getId: function () {
        // each function is associated with the context of an object
        return this.carId;
      }
    };
    expect(car.getId()).toEqual(123);
  });

  it("call method", () => {
    let car = {
      carId: 123,
      getId: function () {
        return this.carId;
      }
    };

    let newCar = { carId: 456 };
    expect(car.getId.call(newCar)).toEqual(456);
    // the call method passes a new object context to the getId method
    // and the function will be executed as if it existed on the newCar object
  });

  it("apply method", () => {
    let car = {
      carId: 123,
      getId: function (prefix) {
        return prefix + this.carId;
      }
    };

    let newCar = { carId: 456 };
    expect(car.getId.apply(newCar, ["ID:"])).toEqual("ID:456");
    // the apply method is similar to the call method above
    // but allows us to pass parameters as an argument array
  });

  it("bind method", () => {
    let car = {
      carId: 123,
      getId: function () {
        return this.carId;
      }
    };

    let newCar = { carId: 456 };
    let newFn = car.getId.bind(newCar);
    expect(newFn()).toEqual(456);
    // create a copy of the method and attach it to the new object
  });

  it("function constructor", function () {
    // traditional use
    let add = new Function("first", "second", "return first + second");
    expect(add(1, 1)).toBe(2);

    // new ES6 support for default parameters
    let addDefault = new Function("first", "second = first", "return first + second");
    expect(addDefault(1, 1)).toBe(2);
    expect(addDefault(1)).toBe(2);

    // rest parameters
    let pickFirst = new Function("...args", "return args[0]"); // returns the first parameter that was passed in
    expect(pickFirst(1, 2)).toBe(1);
  });

  it("function 'name' property", function () {
    function doSomething() {
      // empty
    }
    let doAnotherThing = function () {
      // empty
    };
    expect(doSomething.name).toBe("doSomething");
    expect(doAnotherThing.name).toBe("doAnotherThing");
  });

  it("function 'name' property - special cases", function () {
    let doSomething = function doSomethingElse() {
      // empty
    };
    let person = {
      get firstName() {
        return "Alex";
      },
      sayName: function () {
        console.log(this.name);
      }
    };
    expect(doSomething.name).toBe("doSomethingElse");
    expect(person.sayName.name).toBe("sayName");
    expect(person.firstName.name).toBe(undefined); // this should have been "get firstName"!!!
    expect(new Function().name).toBe("anonymous");
    expect(doSomething.bind().name).toBe("bound doSomethingElse");
  });

  it("block level functions with hoisting to the top of the block in strict mode", function () {
    "use strict";
    if (true) {
      expect(typeof doSomething).toBe("function");
      function doSomething() {
        // empty
      }
      doSomething();
    }
    // once the block is finished, the function no longer exists
    expect(typeof doSomething).toBe("undefined");
  });

  it("block level functions without hoisting to the top of the block in strict mode", function () {
    "use strict";
    if (true) {
      console.log(typeof doSomething); // throws an error: Cannot access 'doSomething' before initialization
      // Here, code execution stops when typeof doSomething is executed, because
      // the let statement hasn’t been executed yet, leaving doSomething() in the TDZ.
      let doSomething = function () {
        // empty
      };
      doSomething();
    }
    // once the block is finished, the function no longer exists
    expect(typeof doSomething).toBe("undefined");
  });

  it("tail call optimization", function () {
    // ECMAScript 6 reduces the size of the call stack for certain tail calls in strict
    // mode (non-strict mode tail calls are left untouched). With this optimization,
    // instead of creating a new stack frame for a tail call, the current stack
    // frame is cleared and reused as long as the following conditions are met:
    //   •	 The tail call does not require access to variables in the current stack
    // frame (meaning the function is not a closure).
    //   •	 The function making the tail call has no further work to do after the
    // tail call returns.
    //   •	 The result of the tail call is returned as the function value.

    function factorial(n) {
      if (n <= 1) {
        return 1;
      } else {
        // not optimized - must multiply after returning
        return n * factorial(n - 1); // this cannot be optimized because multiplication must happen after the
        // recursive call to factorial. If n is a very large number, the call stack size will grow and could potentially
        // cause a stack overflow. We must ensure that the multiplication does not occur after the last recursive call.
      }
    }
    function factorialTailCallOptimization(n, p = 1) {
      // The p parameter holds the previous multiplication result so the next result can be computed without another
      // function call.
      if (n <= 1) {
        return 1 * p;
      } else {
        let result = n * p;
        // optimized
        return factorial(n - 1, result);
      }
    }
  });
});
