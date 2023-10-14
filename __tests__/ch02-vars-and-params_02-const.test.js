import { describe, expect, it } from "@jest/globals";

describe("how const works", () => {
  it("const without initialization", () => {
    // const MAX_SIZE; // uncomment for a syntax error
  });

  it("will make a variable read only", () => {
    const MAX_SIZE = 10;
    // MAX_SIZE = 20; // uncomment for a syntax error: TypeError: Assignment to constant variable.
    expect(MAX_SIZE).toBe(10);
  });

  it("can be shadowed by an inner declaration", () => {
    const x = 12; // a block level variable which is not hoisted
    // let x = 12;      // we can also use let instead of const
    var doWork = function () {
      var x = 10; // overshadows the variable from the outer scope
      // let x = 10;  // we can also use let instead of var
      return x;
    };

    var result = doWork();
    expect(result).toBe(10);
    expect(x).toBe(12);
  });

  it("error when there is already such variable in the same scope", () => {
    var message = "Hello!";
    let age = 25;
    // each of these throw an error
    // const message = "Goodbye"; // Error: Block scoped variables cannot share name with 'var' variables or parameters in the same block scope
    // const age = 30; // Error: Block scoped variables cannot share name with 'var' variables or parameters in the same block scope
  });

  it("const does not prevent the modifications of an object", () => {
    const person = { name: "John" };
    person.name = "Greg";

    // throws an error
    // person = { name: Greg }; // Error: Attempt to const or readonly variable
  });

  it("const and let cannot be accessed until after the declaration", () => {
    console.log(typeof value);
    let value = "blue"; // Cannot access 'value' before initialization
  });
});
