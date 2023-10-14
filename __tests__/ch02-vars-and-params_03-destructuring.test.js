import { describe, expect, it } from "@jest/globals";

describe("destructuring", () => {
  it("can assign a list of values from an array to a list of variables", () => {
    let [x, y] = [5, 6]; // the original array is not changed in any way
    expect(x).toBe(5);
    expect(y).toBe(6);
  });

  it("can assigned values from an array returned by a function to a list of variables", () => {
    var doWork = function () {
      return [7, 8];
    };
    let [x, y] = doWork(); // an error is thrown if the right side evaluates to null or undefined
    expect(x).toBe(7);
    expect(y).toBe(8);
  });

  it("can swap the values of variables", () => {
    let x = 2;
    let y = 3;
    [x, y] = [y, x]; // there is no need for an extra temp variable
    // tmp = a;
    // a = b;
    // b = tmp;
    expect(x).toBe(3);
    expect(y).toBe(2);
  });

  it("array destructuring - default values", function () {
    let colors = ["red"];
    let [firstColor, secondColor = "green"] = colors;
    expect(firstColor).toBe("red");
    expect(secondColor).toBe("green");
  });

  it("nested array destructuring - default values", function () {
    let colors = ["red", ["green", "lightgreen"], "blue"];
    // later
    let [firstColor, [secondColor]] = colors;
    expect(firstColor).toBe("red");
    expect(secondColor).toBe("green");
  });

  it("can use a rest parameter", () => {
    let carIds = [1, 2, 3];
    let car1, remainingCars;
    [car1, ...remainingCars] = carIds;
    expect(car1).toBe(1);
    expect(remainingCars.length).toBe(2);
    expect(remainingCars[0]).toBe(2);
    expect(remainingCars[1]).toBe(3);
    expect(remainingCars).toEqual([2, 3]);
  });

  it("can use a rest parameter and skip elements", () => {
    let carIds = [1, 2, 3, 4, 5];
    let remainingCars;
    [, , ...remainingCars] = carIds; // skip the first 2 elements by using 2 commas
    expect(remainingCars).toEqual([3, 4, 5]);
  });

  it("can skip a position", () => {
    var doWork = function () {
      return [1, 3, 2, 4, 5];
    };
    let [, x, y, ,] = doWork();
    expect(x).toBe(3);
    expect(y).toBe(2);
  });

  it("can assign only the first few values", () => {
    var doWork = function () {
      return [1, 3, 2];
    };
    let [x, y] = doWork(); // 2 is not assigned to a variable
    expect(x).toBe(1);
    expect(y).toBe(3);
  });

  it("can leave a variable undefined", () => {
    var doWork = function () {
      return [1, 3, 2];
    };
    let [, x, y, z] = doWork();
    expect(x).toBe(3);
    expect(y).toBe(2);
    expect(z).toBeUndefined();
  });

  it("clone an array", function () {
    // cloning an array in ECMAScript 6
    let colors = ["red", "green", "blue"];
    let [...clonedColors] = colors;
    expect(clonedColors[0]).toBe("red");
    expect(clonedColors[1]).toBe("green");
    expect(clonedColors[2]).toBe("blue");
  });

  it("can automatically assign properties to values with the same name", () => {
    let car = { id: 5000, style: "convertible" };
    let { id, style } = car; // the initializer is mandatory when using destructuring
    expect(id).toBe(5000);
    expect(style).toBe("convertible");
  });

  it("can automatically assign properties to values with the same name - different syntax", () => {
    let car = { id: 5000, style: "convertible" };
    let id, style;
    ({ id, style } = car); // when the declaration and assignment are on different lines, we need to parentheses
    // because the opening curly brace is expected to be a block statement, and a block statement
    // cannot appear on the left side of an assignment
    expect(id).toBe(5000);
    expect(style).toBe("convertible");
  });

  it("destructuring assignment", function () {
    let colors = ["red", "green", "blue"],
      firstColor = "black",
      secondColor = "purple";
    [firstColor, secondColor] = colors; // no need of parentheses as in the case of object destructuring
    // see the previous method above
    expect(firstColor).toBe("red");
    expect(secondColor).toBe("green");
  });

  it("destructuring operations evaluate to the right side of the expression", function () {
    let node = {
        type: "Identifier",
        name: "foo"
      },
      type = "Literal",
      name = 5;

    function outputInfo(value) {
      expect(value).toEqual(node);
    }

    outputInfo(({ type, name } = node)); // the expression evaluates to node, which becomes passed as a param
    // at the same time the type and name variable are set to the corresponding properties from the object
    expect(type).toBe("Identifier");
    expect(name).toBe("foo");
  });

  it("destructuring to properties that do not exist on the object", function () {
    let node = {
      type: "Identifier",
      name: "foo"
    };
    let { type, name, value } = node;
    expect(type).toBe("Identifier");
    expect(name).toBe("foo");
    expect(value).toBeUndefined();
  });

  it("destructuring to properties that do not exist on the object - default values", function () {
    let node = {
      type: "Identifier",
      name: "foo"
    };

    // use a default value
    let { type, name, value = true } = node; // insert an equals sign (=) after the properties name
    expect(type).toBe("Identifier");
    expect(name).toBe("foo");
    expect(value).toBe(true);
  });

  it("can map an object into variables (object properties and variables have the same names)", () => {
    let doWork = function () {
      return {
        // return an object
        firstName: "Scott",
        lastName: "Allen",
        handles: {
          twitter: "OdeToCode"
        }
      };
    };
    let {
      firstName,
      handles: { twitter }
    } = doWork(); // take the value of the object property and put it into a variable

    expect(firstName).toBe("Scott");
    expect(twitter).toBe("OdeToCode");
  });

  it("can map an object into variables (object properties and variables have the same names)", () => {
    let doWork = function () {
      return {
        // return an object
        firstName: "Scott",
        lastName: "Allen",
        handles: {
          twitter: "OdeToCode"
        }
      };
    };
    let {
      firstName,
      handles: { twitter }
    } = doWork(); // take the value of the object property and put it into a variable

    expect(firstName).toBe("Scott");
    expect(twitter).toBe("OdeToCode");
  });

  it("can map an object into variables (different names between object properties and variables)", () => {
    let doWork = function () {
      return {
        // return an object
        firstName: "Scott",
        lastName: "Allen",
        handles: {
          twitter: {
            id: 1,
            name: "OdeToCode"
          }
        }
      };
    };

    let {
      firstName: first, // the variable is defined on the right of the colon
      // This syntax is effectively the opposite of traditional object literal syntax, where the name
      // is on the left of the colon and the value is on the right
      handles: { twitter: twit } // the variable and the property of the object can have the same name
    } = doWork(); // take the value of the object property and put it into a variable

    expect(first).toBe("Scott");
    expect(twit.id).toBe(1);
    expect(twit.name).toBe("OdeToCode");
  });

  it("using different variable names with a default value", function () {
    let node = {
      type: "Identifier"
    };
    let { type: localType, name: localName = "bar" } = node;
    expect(localType).toBe("Identifier");
    expect(localName).toBe("bar");
  });

  it("can return a field from an object", () => {
    let doWork = function (url, { data, cache }) {
      // destructuring syntax, take the object that is passed it and
      // convert it into 2 variables
      return data;
    };

    let result = doWork("api/test", {
      data: "test",
      cache: false
    });
    expect(result).toBe("test");
  });

  it("destructuring parameters", function () {
    // properties on options represent additional parameters
    // properties on options represent additional parameters

    // the function below uses a traditional parameter
    // function setCookie(name, value, options) {
    //   options = options || {};
    //   let secure = options.secure,
    //     path = options.path,
    //     domain = options.domain,
    //     expires = options.expires;
    //   return {
    //     // return an object from the parameters that are passed in
    //     secure,
    //     path,
    //     domain,
    //     expires
    //   };
    // }

    function setCookie(name, value, { secure = false, path = "/", domain = "example.com", expires } = {}) {
      // if we don't provide the third parameter and we miss the default value {}, an error is raised

      return {
        // return an object from the parameters that are passed in
        secure,
        path,
        domain,
        expires
      };
    }
    // this method invocation works with both function definitions above
    // but in the second one the IDE knows what parameters are expected
    let result = setCookie("type", "js", {
      secure: true,
      expires: 6000
      // the rest of the parameters, domain and path are set to undefined in the method
    });

    expect(result.secure).toBe(true);
    expect(result.expires).toBe(6000);
    expect(result.path).toBe("/"); // default
    expect(result.domain).toBe("example.com"); // default

    let result2 = setCookie("type", "js");
    expect(result2.secure).toBe(false); // default
    expect(result2.expires).toBeUndefined(); // no default value for expires
    expect(result2.path).toBe("/"); // default
    expect(result2.domain).toBe("example.com"); // default

    let result3 = setCookie("type", "js", { secure: true });
    expect(result3.secure).toBe(true);
    expect(result3.domain).toBe("example.com"); // default
    expect(result3.path).toBe("/"); // default
  });

  it("mixed destructuring - objects and arrays", function () {
    let node = {
      type: "Identifier",
      name: "foo",
      loc: {
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 4
        }
      },
      range: [0, 3]
    };

    let {
      loc: { start },
      range: [startIndex]
    } = node;

    expect(start.line).toBe(1);
    expect(start.column).toBe(1);
    expect(startIndex).toBe(0);
  });
});
