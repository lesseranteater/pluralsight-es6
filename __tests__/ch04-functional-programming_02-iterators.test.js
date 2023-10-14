import { describe, expect, it } from "@jest/globals";

describe("iterables", () => {
  it("a simple iterator", function () {
    function createIterator(items) {
      var i = 0;
      return {
        next: function () {
          var done = i >= items.length;
          var value = !done ? items[i++] : undefined;
          return {
            done: done,
            value: value
          };
        }
      };
    }
    var iterator = createIterator([1, 2, 3]);
    var result = iterator.next();
    expect(result.value).toBe(1);
    expect(result.done).toBe(false);
    result = iterator.next();
    expect(result.value).toBe(2);
    expect(result.done).toBe(false);
    result = iterator.next();
    expect(result.value).toBe(3);
    expect(result.done).toBe(false);
    result = iterator.next();
    expect(result.value).toBeUndefined();
    expect(result.done).toBe(true);
    result = iterator.next();
    expect(result.value).toBeUndefined();
    expect(result.done).toBe(true);
  });
  it("can work with iterators at a low level", () => {
    let sum = 0;
    let numbers = [1, 2, 3, 4];

    // for loop
    sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += numbers[i];
    }
    expect(sum).toBe(10);

    // for in
    sum = 0;
    for (let i in numbers) {
      sum += numbers[i];
    }
    expect(sum).toBe(10);

    // iterator
    sum = 0;

    // use a while loop
    let iterator = numbers.values();
    // let iterator = numbers[Symbol.iterator](); // you can also use this syntax
    let next = iterator.next();
    while (!next.done) {
      sum += next.value;
      next = iterator.next();
    }
    expect(sum).toBe(10);

    // use a for loop
    sum = 0;
    iterator = numbers.values();
    for (let next = iterator.next(); !next.done; next = iterator.next()) {
      sum += next.value;
    }
    expect(sum).toBe(10);
  });
});

describe("for of", () => {
  it("can work with iteratables at a high level", () => {
    let sum = 0;
    let numbers = [1, 2, 3, 4];

    //A for-of loop calls next() on an iterable each time the loop executes and
    // stores the value from the result object in a variable. The loop continues this
    // process until the returned object’s done property is true.
    // This for-of loop first calls the Symbol.iterator method on the values
    // array to retrieve an iterator. (The call to Symbol.iterator happens behind
    // the scenes in the JavaScript engine.) Then iterator.next() is called, and the
    // value property on the iterator’s result object is read into num.
    // The for-of statement will throw an error when you use it on a non-iterable object,
    // null, or undefined.
    for (let n of numbers) {
      sum += n;
    }

    expect(sum).toBe(10);
  });
});

it("accessing the default iterator", function () {
  let values = [1, 2, 3];
  let iterator = values[Symbol.iterator]();
  let result = iterator.next();
  expect(result.value).toBe(1); // "{ value: 1, done: false }"
  expect(result.done).toBe(false); // "{ value: 1, done: false }"
  result = iterator.next();
  expect(result.value).toBe(2); // "{ value: 1, done: false }"
  expect(result.done).toBe(false); // "{ value: 1, done: false }"
  result = iterator.next();
  expect(result.value).toBe(3); // "{ value: 1, done: false }"
  expect(result.done).toBe(false); // "{ value: 1, done: false }"
  result = iterator.next();
  expect(result.value).toBe(undefined); // "{ value: 1, done: false }"
  expect(result.done).toBe(true); // "{ value: 1, done: false }"
});

it("check if an object is iterable", function () {
  function isIterable(object) {
    return typeof object[Symbol.iterator] === "function";
  }
  expect(isIterable([1, 2, 3])).toBe(true);
  expect(isIterable("Hello")).toBe(true);
  expect(isIterable(new Map())).toBe(true);
  expect(isIterable(new Set())).toBe(true);
  expect(isIterable(new WeakMap())).toBe(false);
  expect(isIterable(new WeakSet())).toBe(false);
});

describe("iterable", () => {
  it("creating an iterable with a generator", function () {
    let collection = {
      items: [],
      *[Symbol.iterator]() {
        for (let item of this.items) {
          yield item;
        }
      }
    };
    collection.items.push(1);
    collection.items.push(2);
    collection.items.push(3);
    let elements = [];
    for (let x of collection) {
      // iterate over the collection
      elements.push(x);
    }
    expect(elements).toEqual([1, 2, 3]);
  });
  it("can be built by implementing Symbol.iterator", () => {
    class Company {
      constructor() {
        this.employees = [];
      }

      addEmployees(...names) {
        this.employees = this.employees.concat(names);
      }

      [Symbol.iterator]() {
        // specifies a function that returns an iterator for the given object
        return new ArrayIterator(this.employees);
      }
    }

    class ArrayIterator {
      constructor(array) {
        this.array = array;
        this.index = 0;
      }

      next() {
        let result = { value: undefined, done: true };
        if (this.index < this.array.length) {
          result.value = this.array[this.index];
          result.done = false;
          this.index += 1;
        }
        return result;
      }
    }

    let count = 0;
    let company = new Company();
    company.addEmployees("Tim", "Sue", "Joy", "Tom");

    for (let employee of company) {
      count += 1;
    }

    expect(count).toBe(4);
  });
});

describe("Built-in Collection Iterators", function () {
  it("entries() iterator", function () {
    let colors = ["red", "green", "blue"];
    let tracking = new Set([1234, 5678, 9012]);
    let data = new Map();
    data.set("title", "Understanding ECMAScript 6");
    data.set("format", "ebook");

    let arrayEntriesIterator = colors.entries();
    let result = arrayEntriesIterator.next();
    expect(result.value).toEqual([0, "red"]);
    // the entry is an array, the first element is an autogenerated index
    result = arrayEntriesIterator.next();
    expect(result.value).toEqual([1, "green"]);
    result = arrayEntriesIterator.next();
    expect(result.value).toEqual([2, "blue"]);

    let setEntriesIterator = tracking.entries();
    result = setEntriesIterator.next();
    expect(result.value).toEqual([1234, 1234]); // the id is the same as the element of the set
    // the entry is an array, the first element is an autogenerated index
    result = setEntriesIterator.next();
    expect(result.value).toEqual([5678, 5678]);
    result = setEntriesIterator.next();
    expect(result.value).toEqual([9012, 9012]);

    let mapEntriesIterator = data.entries();
    result = mapEntriesIterator.next();
    expect(result.value).toEqual(["title", "Understanding ECMAScript 6"]);
    result = mapEntriesIterator.next();
    expect(result.value).toEqual(["format", "ebook"]);
  });

  it("values() iterator", function () {
    let colors = ["red", "green", "blue"];
    let tracking = new Set([1234, 5678, 9012]);
    let data = new Map();
    data.set("title", "Understanding ECMAScript 6");
    data.set("format", "ebook");

    let arrayValuesIterator = colors.values();
    let result = arrayValuesIterator.next();
    expect(result.value).toBe("red");
    result = arrayValuesIterator.next();
    expect(result.value).toBe("green");
    result = arrayValuesIterator.next();
    expect(result.value).toBe("blue");

    let setValuesIterator = tracking.values();
    result = setValuesIterator.next();
    expect(result.value).toBe(1234);
    result = setValuesIterator.next();
    expect(result.value).toBe(5678);
    result = setValuesIterator.next();
    expect(result.value).toBe(9012);

    let mapValuesIterator = data.values();
    result = mapValuesIterator.next();
    expect(result.value).toBe("Understanding ECMAScript 6");
    result = mapValuesIterator.next();
    expect(result.value).toBe("ebook");
  });

  it("keys() iterator", function () {
    let colors = ["red", "green", "blue"];
    let tracking = new Set([1234, 5678, 9012]);
    let data = new Map();
    data.set("title", "Understanding ECMAScript 6");
    data.set("format", "ebook");

    let arrayKeysIterator = colors.keys();
    let result = arrayKeysIterator.next();
    expect(result.value).toEqual(0);
    // the entry is an array, the first element is an autogenerated index
    result = arrayKeysIterator.next();
    expect(result.value).toEqual(1);
    result = arrayKeysIterator.next();
    expect(result.value).toEqual(2);

    let setKeysIterator = tracking.keys();
    result = setKeysIterator.next();
    expect(result.value).toEqual(1234); // the id is the same as the element of the set
    // the entry is an array, the first element is an autogenerated index
    result = setKeysIterator.next();
    expect(result.value).toEqual(5678);
    result = setKeysIterator.next();
    expect(result.value).toEqual(9012);

    let mapKeysIterator = data.keys();
    result = mapKeysIterator.next();
    expect(result.value).toEqual("title");
    result = mapKeysIterator.next();
    expect(result.value).toEqual("format");
  });

  it("default iterators for collection types", function () {
    let colors = ["red", "green", "blue"];
    let tracking = new Set([1234, 5678, 9012]);
    let data = new Map();
    data.set("title", "Understanding ECMAScript 6");
    data.set("format", "ebook");

    // the same as using colors.values()
    for (let value of colors) {
      // console.log(value);
    }
    let arrayValuesIterator = colors[Symbol.iterator]();
    let result = arrayValuesIterator.next();
    expect(result.value).toBe("red");
    result = arrayValuesIterator.next();
    expect(result.value).toBe("green");
    result = arrayValuesIterator.next();
    expect(result.value).toBe("blue");

    // the same as using tracking.values()
    for (let num of tracking) {
      // console.log(num);
    }
    let setKeysIterator = tracking[Symbol.iterator]();
    result = setKeysIterator.next();
    expect(result.value).toEqual(1234); // the id is the same as the element of the set
    // the entry is an array, the first element is an autogenerated index
    result = setKeysIterator.next();
    expect(result.value).toEqual(5678);
    result = setKeysIterator.next();
    expect(result.value).toEqual(9012);

    // the same as using data.entries()
    for (let entry of data) {
      // console.log(entry);
    }
    // we can also use destructing to get the key and value separately
    for (let [key, value] of data) {
      // console.log(key + "=" + value);
    }
    let mapEntriesIterator = data[Symbol.iterator]();
    result = mapEntriesIterator.next();
    expect(result.value).toEqual(["title", "Understanding ECMAScript 6"]);
    result = mapEntriesIterator.next();
    expect(result.value).toEqual(["format", "ebook"]);
  });
  it("spread operator and non-array iterables", function () {
    // This code uses the spread operator inside an array literal to fill in
    // that array with the values from set. The spread operator works on all iter-
    // ables and uses the default iterator to determine which values to include. All
    // values are read from the iterator and inserted into the array in the order in
    // which values where returned from the iterator.
    let set = new Set([1, 2, 3, 3, 3, 4, 5]),
      array = [...set];
    expect(array).toEqual([1, 2, 3, 4, 5]);

    let map = new Map([
      ["name", "Nicholas"],
      ["age", 25]
    ]);
    array = [...map];
    expect(array).toEqual([
      ["name", "Nicholas"],
      ["age", 25]
    ]);
    // You can use the spread operator in an array literal as many times as you
    // want, and you can use it wherever you want to insert multiple items from an
    // iterable. Those items will just appear in order in the new array at the location of the spread operator.
    let smallNumbers = [1, 2, 3],
      bigNumbers = [100, 101, 102],
      allNumbers = [0, ...smallNumbers, ...bigNumbers];
    expect(allNumbers.length).toBe(7);
    expect(allNumbers).toEqual([0, 1, 2, 3, 100, 101, 102]);

    let name = "Alex",
      chars = [...name];
    expect(chars[0]).toBe("A");
    expect(chars[1]).toBe("l");
    expect(chars[2]).toBe("e");
    expect(chars[3]).toBe("x");
    expect(chars.length).toBe(4);
  });
});

it("passing arguments to iterators", function () {
  function* createIterator() {
    let first = yield 1;
    let second = yield first + 2; // 4 + 2
    yield second + 3; // 5 + 3
  }
  let iterator = createIterator();

  // The first call to next() is a special case where any argument passed to
  // it is lost. Because arguments passed to next() become the values returned
  // by yield, an argument from the first call to next() could only replace the
  // first yield statement in the generator function if it could be accessed before
  // that yield statement. That’s not possible, so there’s no reason to pass an
  // argument the first time next() is called.
  let result = iterator.next();
  expect(result.value).toBe(1);
  expect(result.done).toBe(false);

  // On the second call to next(), the value 4 is passed as the argument.
  // The 4 ends up assigned to the variable first inside the generator functions
  // In a yield statement including an assignment, the right side of the
  // expression is evaluated on the first call to next() and the left side is evaluated
  // on the second call to next() before the function continues executing.
  // Because the second call to next() passes in 4, that value is assigned to
  // first and then execution continues.
  // The second yield uses the result of the first yield and adds two, which
  // means it returns a value of 6. When next() is called a third time, the value 5
  // is passed as an argument. That value is assigned to the variable second and
  // then used in the third yield statement to return 8.
  // The second yield uses the result of the first yield and adds two, which
  // means it returns a value of 6. When next() is called a third time, the value 5
  // is passed as an argument. That value is assigned to the variable second and
  // then used in the third yield statement to return 8.
  result = iterator.next(4);
  expect(result.value).toBe(6);
  expect(result.done).toBe(false);

  result = iterator.next(5);
  expect(result.value).toBe(8);
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBe(undefined);
  expect(result.done).toBe(true);
});

it("throwing errors in iterators", function () {
  function* createIterator() {
    let first = yield 1;
    let second;
    try {
      second = yield first + 2; // yield 4 + 2, then throw
    } catch (ex) {
      second = 6; // on error, assign a different value
    }
    yield second + 3;
  }

  let iterator = createIterator();

  let result = iterator.next();
  expect(result.value).toBe(1);
  expect(result.done).toBe(false);

  result = iterator.next(4);
  expect(result.value).toBe(6);
  expect(result.done).toBe(false);

  result = iterator.throw(new Error("Boom"));
  expect(result.value).toBe(9);
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBeUndefined();
  expect(result.done).toBe(true);
});
