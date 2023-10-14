import { describe, expect, it } from "@jest/globals";

describe("arrow functions", () => {
  test("provide a compact syntax to define a function", () => {
    // let reflect = (value) => value;
    // is effectively equivalent to:
    // let reflect = function (value) {
    //   return value;
    // };

    let addTraditional = function (x, y) {
      return x + y;
    };

    let addArrow = (x, y) => x + y;

    let addArrowWithBody = (x, y) => {
      let temp = x + y;
      return temp;
    };

    let square = (x) => x * x;
    let three = () => 3;

    expect(typeof addArrow).toBe("function");
    expect(addArrow instanceof Function).toBe(true);
    expect(square(addTraditional(2, three()))).toBe(25);
    expect(square(addArrow(2, three()))).toBe(25);
    expect(square(addArrowWithBody(2, three()))).toBe(25);
  });

  it("can be used with array methods", () => {
    let numbers = [1, 2, 3, 4];

    let sum = 0;
    numbers.forEach((n) => (sum += n));
    expect(sum).toBe(10);

    let doubled = numbers.map((n) => n * 2);
    expect(doubled).toEqual([2, 4, 6, 8]);
  });

  it("lexically binds to 'this'", function () {
    // without arrow functions
    let self = this;
    self.name = "Scott";
    setTimeout(function () {
      expect(self.name).toBe("Scott");
    }, 15);

    // with arrow functions
    this.name = "Scott";
    setTimeout(() => {
      expect(this.name).toBe("Scott");
      // this refers to the enclosing context
      // because the arrow function do not have their own this value
    }, 15);
  });

  it("arrow function which returns an object literal outside a function body", function () {
    // we must wrap the literal in parenthesis
    let getTempItemArrow = (id) => ({ id: id, name: "Temp" });
    // effectively equivalent to:
    let getTempItemTraditional = function (id) {
      return {
        id: id,
        name: "Temp"
      };
    };

    let resultArrow = getTempItemArrow(1);
    expect(resultArrow.id).toBe(1);
    expect(resultArrow.name).toBe("Temp");

    let resultTraditional = getTempItemTraditional(1);
    expect(resultTraditional.id).toBe(1);
    expect(resultTraditional.name).toBe("Temp");
  });

  it("call, apply and bind on arrow functions", function () {
    // Like other functions, you can still use call(), apply(), and bind()
    // on arrow functions, although the 'this' binding of the function will not be
    // affected.
    let sum = (num1, num2) => num1 + num2;
    expect(sum.call(null, 1, 2)).toBe(3);
    expect(sum.apply(null, [1, 2])).toBe(3);
    let boundSum = sum.bind(null, 1, 2);
    expect(boundSum(3));
  });
});
