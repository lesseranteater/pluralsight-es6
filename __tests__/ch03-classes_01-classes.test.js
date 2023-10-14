import { describe, expect, it } from "@jest/globals";

it("ES5 class-like functionality", function () {
  function PersonType(name) {
    // a constructor function
    this.name = name; // this is an own property which occurs on the instance rather than the prototype
  }
  PersonType.prototype.getName = function () {
    return this.name;
  };
  var person = new PersonType("Dwayne"); // create a new instance with the new operator
  expect(person.getName()).toBe("Dwayne");
  expect(person instanceof PersonType).toBe(true);
  expect(person instanceof Object).toBe(true);
});

describe("the class keyword", () => {
  it("basic class declaration and ES5 equivalent implementation", function () {
    class PersonClass {
      // equivalent of the PersonType constructor
      constructor(name) {
        this.name = name;
      }
      // equivalent of PersonType.prototype.sayName
      sayName() {
        console.log(this.name);
      }
    }
    let person = new PersonClass("Alex");
    person.sayName(); // outputs "Alex"
    expect(person instanceof PersonClass).toBe(true);
    expect(person instanceof Object).toBe(true);
    expect(typeof PersonClass).toBe("function");
    expect(typeof PersonClass.prototype.sayName).toBe("function");
    expect(PersonClass.name).toBe("PersonClass"); // in the

    // direct equivalent of PersonClass
    // •	 Class declarations, unlike function declarations, are not hoisted. Class
    // declarations act like let declarations, so they exist in the temporal dead
    // zone until execution reaches the declaration.
    // •	 All code inside class declarations runs in strict mode automatically.
    // There’s no way to opt out of strict mode inside classes.
    // •	 All methods are nonenumerable. This is a significant change from
    // custom types, where you need to use Object.defineProperty() to make a
    // method nonenumerable.
    // •	 All methods lack an internal [[Construct]] method and will throw an
    // error if you try to call them with new.
    // •	 Calling the class constructor without new throws an error.
    // •	 Attempting to overwrite the class name within a class method throws
    // an error.
    // First, notice that there are two PersonType2 declarations: a let declaration
    // in the outer scope and a const declaration inside the immediately
    // invoked function expression (IIFE)—this is how class methods are forbidden
    // from overwriting the class name while code outside the class is
    // allowed to do so. The constructor function checks new.target to ensure
    // that it’s being called with new; if not, an error is thrown. Next, the sayName()
    // method is defined as nonenumerable, and the method checks new.target to
    // ensure that it wasn’t called with new. The final step returns the constructor
    // function.

    let PersonType2 = (function () {
      "use strict";
      const PersonType2 = function (name) {
        // make sure the function was called with new
        if (typeof new.target === "undefined") {
          throw new Error("Constructor must be called with new.");
        }
        this.name = name;
      };
      Object.defineProperty(PersonType2.prototype, "sayName", {
        value: function () {
          // make sure the method wasn't called with new
          if (typeof new.target !== "undefined") {
            throw new Error("Method cannot be called with new.");
          }
          console.log(this.name);
        },
        enumerable: false,
        writable: true,
        configurable: true
      });
      return PersonType2;
    })();

    person = new PersonType2("Alex");
    person.sayName(); // outputs "Alex"
    expect(person instanceof PersonType2).toBe(true);
    expect(person instanceof Object).toBe(true);
    expect(typeof PersonType2).toBe("function");
    expect(typeof PersonType2.prototype.sayName).toBe("function");
  });

  it("class expressions", function () {
    let PersonClass = class {
      // this is the class expression syntax
      // equivalent of the PersonType constructor
      constructor(name) {
        this.name = name;
      }
      // equivalent of PersonType.prototype.sayName
      sayName() {
        console.log(this.name);
      }
    };
    let person = new PersonClass("Alex");
    person.sayName(); // outputs "Alex"
    expect(person instanceof PersonClass).toBe(true);
    expect(person instanceof Object).toBe(true);
    expect(typeof PersonClass).toBe("function");
    expect(typeof PersonClass.prototype.sayName).toBe("function");
    expect(PersonClass.name).toBe("PersonClass"); // in the
  });

  it("can create a class", () => {
    class Employee {
      doWork() {
        return "complete!";
      }

      getName() {
        // this method ends up on the prototype
        return "Scott";
      }
    }

    let e = new Employee();

    expect(e.doWork()).toBe("complete!");
    expect(e.getName()).toBe("Scott");
    expect(Employee.prototype.doWork.call(e)).toBe("complete!");
    expect(e instanceof Employee).toBe(true);
    expect(e instanceof Object).toBe(true);
    expect(typeof Employee).toBe("function"); // under the surface classes are converted to constructor functions
    expect(typeof Employee.prototype.getName).toBe("function");
  });

  it("can have a constructor", () => {
    class Employee {
      constructor(name) {
        this._name = name;
      }

      doWork() {
        return "complete!";
      }

      getName() {
        return this._name;
      }
    }

    let e1 = new Employee("Scott");
    let e2 = new Employee("Alex");

    expect(e1.getName()).toBe("Scott");
    expect(e2.getName()).toBe("Alex");
  });

  it("classes as first-class citizens", function () {
    // In programming, a first-class citizen  is a value that can be passed into a function,
    // returned from a function, and assigned to a variable. Functions are first-class citizens
    function createObject(classDef) {
      return new classDef();
    }
    let obj = createObject(
      // the function is called with an anonymous class expression as an argument,
      // creates a class with new and returns the instance. The variable obj stores the returned instance.
      class {
        sayHi() {
          console.log("Hi!");
        }
      }
    );
    obj.sayHi(); // "Hi!"
  });

  it("singletons with class expressions", function () {
    let person = new (class {
      constructor(name) {
        this.name = name;
      }
      sayName() {
        console.log(this.name);
      }
    })("Paul");
    person.sayName(); // "Paul"
  });

  it("can have getters and setters", () => {
    class Employee {
      constructor(name) {
        this.name = name;
      }

      doWork() {
        return "complete!";
      }

      get name() {
        return this._name.toUpperCase();
      }

      set name(newValue) {
        this._name = newValue;
      }
    }

    let e1 = new Employee("Scott");
    let e2 = new Employee("Alex");

    expect(e1.name).toBe("SCOTT");
    expect(e2.name).toBe("ALEX");

    e1.name = "Chris";
    expect(e1.name).toBe("CHRIS");

    let descriptor = Object.getOwnPropertyDescriptor(Employee.prototype, "name");
    expect("get" in descriptor).toBe(true);
    expect("set" in descriptor).toBe(true);
    expect(descriptor.enumerable).toBe(false); // just like any other class method
  });

  it("computed member names", function () {
    let methodName = "sayName";
    let propertyName = "name";
    class PersonClass {
      constructor(name) {
        this._name = name;
      }
      [methodName]() {
        // a method with name sayName
        console.log(this._name);
      }
      get [propertyName]() {
        return this._name;
      }

      set [propertyName](value) {
        this._name = value;
      }
    }
    let me = new PersonClass("Bob");
    me.sayName(); // "Bob"
    expect(me.name).toBe("Bob");
    me.name = "Paul";
    expect(me.name).toBe("Paul");
  });

  it("generator methods", function () {
    class Collection {
      constructor() {
        this.items = [];
      }
      *[Symbol.iterator]() {
        yield* this.items.values();
      }
    }
    let collection = new Collection();
    collection.items.push(1);
    collection.items.push(2);
    collection.items.push(3);
    let elements = [];
    for (let x of collection) {
      elements.push(x);
    }
    expect(elements).toEqual([1, 2, 3]);
  });

  it("static members", function () {
    // ES5 syntax
    function PersonType(name) {
      this.name = name;
    }
    // static method
    PersonType.create = function (name) {
      return new PersonType(name);
    };
    // instance method
    PersonType.prototype.sayName = function () {
      console.log(this.name);
    };
    var person = PersonType.create("Bob");

    class PersonClass {
      // equivalent of the PersonType constructor
      constructor(name) {
        this.name = name;
      }
      // equivalent of PersonType.prototype.sayName
      sayName() {
        console.log(this.name);
      }
      // equivalent of PersonType.create
      static create(name) {
        return new PersonClass(name);
      }
    }
    person = PersonClass.create("Nicholas");
    // Static members are not accessible from instances. You must always access static members from the class directly.
  });

  it("inheritance with derived classes ", function () {
    class Rectangle {
      constructor(length, width) {
        this.length = length;
        this.width = width;
      }
      getArea() {
        return this.length * this.width;
      }
    }
    class Square extends Rectangle {
      constructor(length) {
        // equivalent of Rectangle.call(this, length, length)
        super(length, length);
      }
    }
    let square = new Square(3);
    expect(square.getArea()).toBe(9);
    expect(square instanceof Square).toBe(true);
    expect(square instanceof Rectangle).toBe(true);
  });

  it("shadowing class members", function () {
    class Rectangle {
      constructor(length, width) {
        this.length = length;
        this.width = width;
      }
      getArea() {
        return this.length * this.width;
      }
    }
    class Square extends Rectangle {
      constructor(length) {
        super(length, length);
      }
      // override and shadow Rectangle.prototype.getArea()
      getArea() {
        console.log("Calling the shadowing method");
        return this.length * this.length;
      }

      // we can override, shadow, and call Rectangle.prototype.getArea() like this
      // getArea() {
      //   return super.getArea();
      // }
    }
    let square = new Square(3);
    expect(square.getArea()).toBe(9);
  });

  it("inheriting static members", function () {
    class Rectangle {
      constructor(length, width) {
        this.length = length;
        this.width = width;
      }
      getArea() {
        return this.length * this.width;
      }
      static create(length, width) {
        return new Rectangle(length, width);
      }
    }
    class Square extends Rectangle {
      constructor(length) {
        // equivalent of Rectangle.call(this, length, length)
        super(length, length);
      }
    }
    let rect = Square.create(3, 4);
    expect(rect instanceof Rectangle).toBe(true);
    expect(rect.getArea()).toBe(12);
    expect(rect instanceof Square).toBe(false);
  });

  it("derived classes from expressions", function () {
    function Rectangle(length, width) {
      this.length = length;
      this.width = width;
    }

    Rectangle.prototype.getArea = function () {
      return this.length * this.width;
    };
    class Square extends Rectangle {
      // Rectangle is a function and not a class
      constructor(length) {
        super(length, length);
      }
    }
    var x = new Square(3);
    expect(x.getArea()).toBe(9);
    expect(x instanceof Rectangle).toBe(true);
  });

  it("determine dynamically what to inherit from - expression after extends", function () {
    function Rectangle(length, width) {
      this.length = length;
      this.width = width;
    }
    Rectangle.prototype.getArea = function () {
      return this.length * this.width;
    };
    function getBase() {
      return Rectangle;
    }
    class Square extends getBase() {
      // we extend from an expression
      constructor(length) {
        super(length, length);
      }
    }
    var x = new Square(3);
    expect(x.getArea()).toBe(9);
    expect(x instanceof Rectangle).toBe(true);
  });

  it("extend from expressions - mixins", function () {
    let SerializableMixin = {
      serialize() {
        return JSON.stringify(this);
      }
    };
    let AreaMixin = {
      getArea() {
        return this.length * this.width;
      }
    };
    function mixin(...mixins) {
      var base = function () {};
      Object.assign(base.prototype, ...mixins); // the properties of each mixin are assigned to the prototype
      // if multiple mixins have the same property, only hte last property added will remain
      return base;
    }
    class Square extends mixin(AreaMixin, SerializableMixin) {
      constructor(length) {
        super();
        this.length = length;
        this.width = length;
      }
    }
    var x = new Square(3);
    expect(x.getArea()).toBe(9);
    expect(x.serialize()).toEqual('{"length":3,"width":3}');
  });

  it("inheriting from build-ins", function () {
    class MyArray extends Array {
      // empty
    }
    var colors = new MyArray();
    colors[0] = "red";
    expect(colors.length).toBe(1);
    colors.length = 0;
    expect(colors[0]).toBeUndefined();
  });

  it("inheriting from built-ins - methods that returns an instance of the built-in will return a derived class ", function () {
    class MyArray extends Array {
      // empty
    }
    let items = new MyArray(1, 2, 3, 4),
      subitems = items.slice(1, 3); // the slice method returns a MyArray instance
    // Behind the scenes, the Symbol.species property is actually making this change.
    expect(items instanceof MyArray).toBe(true);
    expect(subitems instanceof MyArray).toBe(true);

    // by changing the Symbol.species property we can modify the type of the instance the methods return
    class MyArray2 extends Array {
      static get [Symbol.species]() {
        return Array;
      }
    }
    let items2 = new MyArray2(1, 2, 3, 4),
      subitems2 = items.slice(1, 3);
    expect(items2 instanceof MyArray2).toBe(true); // true
    expect(subitems2 instanceof Array).toBe(true); // true
    expect(subitems2 instanceof MyArray2).toBe(false); // false
  });

  it("Symbol.species on a custom class ", function () {
    // The Symbol.species well-known symbol is used to define a static accessor
    // property that returns a function. That function is a constructor to
    // use whenever an instance of the class must be created inside an instance
    // method (instead of using the constructor). The following built-in types
    // have Symbol.species defined:
    // •	 Array
    // •	 ArrayBuffer (discussed in Chapter 10)
    // •	 Map
    // •	 Promise
    // •	 RegExp
    // •	 Set
    // •	 Typed arrays (discussed in Chapter 10)
    // Each type in the list has a default Symbol.species property that returns
    // this, meaning the property will always return the constructor function. If
    // you implemented that functionality on a custom class, the code would look
    // like this:
    // several built-in types use species similar to this
    // In general, you should use the Symbol.species property whenever you
    // might want to use this.constructor in a class method. Doing so allows derived
    // classes to override the return type easily. Additionally, if you’re creating
    // derived classes from a class that has Symbol.species defined, be sure to use
    // that value instead of the constructor.
    class MyClass {
      static get [Symbol.species]() {
        return this;
      }
      constructor(value) {
        this.value = value;
      }
      clone() {
        return new this.constructor[Symbol.species](this.value);
      }
    }

    class MyDerivedClass1 extends MyClass {
      // empty
      // doesn't change the Symbol.species property
    }
    class MyDerivedClass2 extends MyClass {
      static get [Symbol.species]() {
        // changes the default property - when clone is called the returned instance is of type MyClass
        return MyClass;
      }
    }
    let instance1 = new MyDerivedClass1("foo"),
      clone1 = instance1.clone(),
      instance2 = new MyDerivedClass2("bar"),
      clone2 = instance2.clone();
    expect(clone1 instanceof MyClass).toBe(true);
    expect(clone1 instanceof MyDerivedClass1).toBe(true);
    expect(clone2 instanceof MyClass).toBe(true);
    expect(clone2 instanceof MyDerivedClass2).toBe(false);
  });

  it("new.target", function () {
    // prevent an abstract class from being instantiated
    // abstract base class
    class Shape {
      constructor() {
        if (new.target === Shape) {
          throw new Error("This class cannot be instantiated directly.");
        }
      }
    }
    class Rectangle extends Shape {
      constructor(length, width) {
        super();
        this.length = length;
        this.width = width;
      }
    }

    var y = new Rectangle(3, 4); // no error
    expect(y instanceof Shape).toBe(true);
    try {
      var x = new Shape(); // throws an error: Error: This class cannot be instantiated directly.
    } catch (e) {
      expect(e.toString()).toBe("Error: This class cannot be instantiated directly.");
    }
  });

  it("can have a super class", () => {
    class Person {
      constructor(name) {
        this.name = name; // this is calling the setter
      }

      get name() {
        return this._name;
      }

      set name(newValue) {
        if (newValue) {
          this._name = newValue;
        }
      }
    }

    class Employee extends Person {
      doWork() {
        return `${this._name} is working`;
      }
    }

    let p1 = new Person("Scott");
    let e1 = new Employee("Christopher");

    expect(p1.name).toBe("Scott");
    expect(e1.name).toBe("Christopher");
    expect(e1.doWork()).toBe("Christopher is working");
  });

  it("can invoke super methods", () => {
    class Person {
      constructor(name) {
        this.name = name; // this is calling the setter
      }

      get name() {
        return this._name;
      }

      set name(newValue) {
        if (newValue) {
          this._name = newValue;
        }
      }
    }

    class Employee extends Person {
      constructor(title, name) {
        super(name);
        this._title = title;
      }

      get title() {
        return this._title;
      }

      doWork() {
        return `${this._name} is working`;
      }
    }

    let e1 = new Employee("Developer", "Scott");
    expect(e1.name).toBe("Scott");
    expect(e1.title).toBe("Developer");
  });

  it("can override methods", () => {
    class Person {
      constructor(name) {
        this.name = name;
      }

      get name() {
        return this._name;
      }

      set name(newValue) {
        if (newValue) {
          this._name = newValue;
        }
      }

      doWork() {
        return "free";
      }

      toString() {
        return this.name;
      }
    }

    class Employee extends Person {
      constructor(title, name) {
        super(name);
        this._title = title;
      }

      get title() {
        return this._title;
      }

      doWork() {
        return "paid";
      }
    }

    let e1 = new Employee("Developer", "Scott");
    let p1 = new Person("Alex");

    expect(p1.doWork()).toBe("free");
    expect(e1.doWork()).toBe("paid");
    expect(p1.toString()).toBe("Alex");
    expect(e1.toString()).toBe("Scott");

    let makeEveryoneWork = (...people) => {
      let results = [];
      for (let i = 0; i < people.length; i++) {
        if (people[i] instanceof Person) {
          results.push(people[i].doWork());
        }
      }
      return results;
    };

    expect(makeEveryoneWork(p1, e1, {})).toEqual(["free", "paid"]);
  });
});
