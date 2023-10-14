import { describe, expect, it } from "@jest/globals";

describe("Miscellaneous - Objects", () => {
  it("this keyword in a constructor function", () => {
    function Car(id) {
      this.carId = id;
      this.start = function () {
        return "start: " + this.carId;
      };
    }

    let car = new Car(123);
    expect(car.carId).toBe(123);
    expect(car.start()).toBe("start: 123");
  });

  it("Proper invocation of a constructor function", () => {
    function Car() {
      expect(this).toBe(undefined);
    }

    Car(); // we don't use the 'new keyword'

    function CarExpr() {
      expect(this).toEqual({});
    }

    let carExpr = new CarExpr(); // when we use the 'new' keyword,the this reference becomes an empty object
  });

  it("Proper invocation of a constructor function", () => {
    function Car(id) {
      this.carId = id;
    }

    Car.prototype.start = function () {
      return "start: " + this.carId;
    }; // there is just one copy of this function and as we create new objects, the functions is not copied

    let car = new Car(123);
    expect(car.start()).toBe("start: 123");
  });

  it("Polyfills", () => {
    String.prototype.hello = function () {
      // create a new method for the standard String
      return this.toString() + " Hello";
    };

    expect("foo".hello()).toBe("foo Hello");
  });

  it("Convert object to JSON", () => {
    let car = {
      id: 123,
      style: "convertible"
    };
    expect(JSON.stringify(car)).toBe('{"id":123,"style":"convertible"}'); // the properties are in quotes
  });

  it("Convert array to JSON", () => {
    let carIds = [
      {
        carId: 123
      },
      {
        carId: 456
      },
      {
        carId: 789
      }
    ];
    expect(JSON.stringify(carIds)).toBe('[{"carId":123},{"carId":456},{"carId":789}]');
    // the properties are in quotes
  });

  it("Parsing JSON", () => {
    let jsonIn = `
      [
        {"carId":123},
        {"carId":456},
        {"carId":789}
      ]
    `;
    let carIds = JSON.parse(jsonIn);
    expect(carIds).toEqual([
      {
        carId: 123
      },
      {
        carId: 456
      },
      {
        carId: 789
      }
    ]);
    // the properties are in quotes
  });

  it("property initializer shorthand", function () {
    function createPerson(name, age) {
      // ES 5 syntax
      //   return {
      //     name: name,
      //     age: age
      //   };

      // simplified ES6 syntax
      return {
        name,
        age
      };
    }
    let result = createPerson("John", 20);
    expect(result.name).toBe("John");
    expect(result.age).toBe(20);
  });

  it("concise methods", function () {
    // ES5 syntax
    var person = {
      name: "Bob",
      sayName: function () {
        expect(this.name).toBe("Bob");
      }
    };

    person.sayName();

    let personNew = {
      name: "Bob",
      // concise method syntax, the concise methods can use super() and the non-concise methods cannot
      sayName() {
        expect(this.name).toBe("Bob");
      }
    };
    personNew.sayName();
  });

  it("computed property names", function () {
    let suffix = "name";
    let lastName = "last name";
    let person = {
      ["first " + suffix]: "John",
      [lastName]: "Smith"
    };
    expect(person["first name"]).toBe("John");
    expect(person["last name"]).toBe("Smith");
  });

  describe("new methods", function () {
    it("Object.is()", function () {
      // returns true if the 2 values are equivalent
      expect(+0 == -0).toBe(true);
      expect(+0 === -0).toBe(true);
      expect(Object.is(+0, -0)).toBe(false);
      expect(NaN == NaN).toBe(false);
      expect(NaN === NaN).toBe(false);
      expect(Object.is(NaN, NaN)).toBe(true);
      expect(5 == 5).toBe(true);
      expect(5 == "5").toBe(true);
      expect(5 === 5).toBe(true);
      expect(5 === "5").toBe(false);
      expect(Object.is(5, 5)).toBe(true);
      expect(Object.is(5, "5")).toBe(false);
    });

    it("Object.assign()", function () {
      // in a mixin one object receives properties from another
      function EventTarget() {
        /*...*/
      }
      EventTarget.prototype = {
        constructor: EventTarget,
        emit: function () {
          /*...*/
        },
        on: function () {
          /*...*/
        }
      };
      var myObject = {};
      Object.assign(myObject, EventTarget.prototype);
      myObject.emit("somethingChanged"); // the object acquires the method

      // The Object.assign() method accepts any number of suppliers, and the
      // receiver receives the properties in the order in which the suppliers are specified.
      // That means the second supplier might overwrite a value from the first
      // supplier on the receiver, which is what happens in this code snippet:
      var receiver = {};
      Object.assign(
        receiver,
        {
          type: "js",
          name: "file.js"
        },
        {
          type: "css"
        }
      );
      expect(receiver.type).toBe("css");
      expect(receiver.name).toBe("file.js");
    });
  });

  it("accessor methods become properties", function () {
    var receiver = {},
      supplier = {
        get name() {
          return "file.js";
        }
      };
    Object.assign(receiver, supplier); // the name() method is copied across as a property value
    var descriptor = Object.getOwnPropertyDescriptor(receiver, "name");
    expect(descriptor.value).toBe("file.js");
    expect(descriptor.get).toBe(undefined);
  });

  it("duplicate properties", function () {
    // noinspection JSAnnotator
    var person = {
      name: "Nicholas",
      name: "Greg" // no error in ES6 strict mode
    };
    expect(person.name).toBe("Greg"); // this is the last value assigned to the property
  });

  it("own property enumeration order", function () {
    var obj = {
      a: 1,
      0: 1,
      c: 1,
      2: 1,
      b: 1,
      1: 1
    };
    obj.d = 1;
    expect(Object.getOwnPropertyNames(obj).join("")).toBe("012acbd");
    // 1.  All numeric keys in ascending order
    // 2.  All string keys in the order in which they were added to the object
    // 3.  All symbol keys in the order in which they were added to the object

    // The for-in loop still has an unspecified enumeration order because not all JavaScript
    // engines implement it the same way. The Object.keys() method and JSON.stringify()
    // are both specified to use the same (unspecified) enumeration order as for-in.
  });

  it("changing object's prototype", function () {
    let person = {
      getGreeting() {
        return "Hello";
      }
    };
    let dog = {
      getGreeting() {
        return "Woof";
      }
    };
    // prototype is person
    let friend = Object.create(person);
    expect(friend.getGreeting()).toBe("Hello");
    expect(Object.getPrototypeOf(friend)).toEqual(person);
    // set prototype to dog
    Object.setPrototypeOf(friend, dog);
    // The actual value of an object’s prototype is stored in an internal only
    // property called [[Prototype]]. The Object.getPrototypeOf() method returns
    // the value stored in [[Prototype]] and Object.setPrototypeOf() changes the
    // value stored in [[Prototype]]
    expect(friend.getGreeting()).toBe("Woof");
    expect(Object.getPrototypeOf(friend)).toEqual(dog);
  });

  it("prototype access with super references", function () {
    let person = {
      getGreeting() {
        return "Hello";
      }
    };
    let dog = {
      getGreeting() {
        return "Woof";
      }
    };

    let friend = {
      getGreeting() {
        // ES5
        // return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!";
        // ES6
        return super.getGreeting() + ", hi!";
      }
    };
    // let friend = {
    //   getGreeting: function() {
    //     // syntax error
    //     return super.getGreeting() + ", hi!"; // super cannot be used in a method which is not concise
    //   }
    // };

    // set prototype to person
    Object.setPrototypeOf(friend, person);
    expect(friend.getGreeting()).toBe("Hello, hi!");
    expect(Object.getPrototypeOf(friend)).toEqual(person);
    // set prototype to dog
    Object.setPrototypeOf(friend, dog);
    expect(friend.getGreeting()).toBe("Woof, hi!");
    expect(Object.getPrototypeOf(friend)).toEqual(dog);
  });

  it("super with multiple levels of inheritance", function () {
    let person = {
      getGreeting() {
        return "Hello";
      }
    };
    // prototype is person
    let friend = {
      getGreeting() {
        return super.getGreeting() + ", hi!";
        // Because super references are not dynamic, they always refer to the correct
        // object. In this case, super.getGreeting() always refers to person.getGreeting()
        // regardless of how many other objects inherit the method.

        // ES5 syntax
        // return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!"; // ES5 syntax, causes an error in
        // the relative.getGreeting() method below: Maximum call stack size exceeded
        // When relative.getGreeting() is called, the call to Object.getPrototypeOf()
        // results in an error. The reason is that this is relative, and the prototype
        // of relative is the friend object. When friend.getGreeting().call() is called
        // with relative as this, the process starts over again and continues to call
        // recursively until a stack overflow error occurs.
      }
    };
    Object.setPrototypeOf(friend, person);
    // prototype is friend
    let relative = Object.create(friend);
    expect(person.getGreeting()).toBe("Hello");
    expect(friend.getGreeting()).toBe("Hello, hi!");
    expect(relative.getGreeting()).toBe("Hello, hi!");
  });

  it("should ", function () {});
});
