import { describe, expect, it } from "@jest/globals";
import fs from "fs";

describe("generators", () => {
  it("a simple generator", function () {
    function* createIterator() {
      yield 1; // the execution stops after each yield statement until the iterator's next() method is called
      yield 2;
      yield 3;
    }
    let iterator = createIterator();
    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
    expect(iterator.next().value).toBe(3);
  });

  it("can build an iterable", () => {
    let numbers = function* (start, end) {
      // with generator function expressions the star is before the function keyword and the opening parenthesis
      for (let i = start; i <= end; i++) {
        yield i; // there is no problem using yield in a loop
      }
    };

    // NOTE:
    // Creating an arrow function that is also a generator is not possible!

    // NOTE:
    // You can use the yield keyword only inside generators. Using yield anywhere
    // else is a syntax error, including in functions that are inside generators, such as:
    // function *createIterator(items) {
    //   items.forEach(function(item) {
    //     // syntax error
    //     yield item + 1;
    //   });
    // }

    // iterate with the of operator
    let sum = 0;
    for (let n of numbers(1, 5)) {
      sum += n;
    }
    expect(sum).toBe(15);

    // iterate with an iterator
    sum = 0;
    let iterator = numbers(1, 5); // the generator method return an iterator
    for (let next = iterator.next(); !next.done; next = iterator.next()) {
      sum += next.value;
    }
    expect(sum).toBe(15);
  });

  it("generator object methods", function () {
    // Because generators are just functions, you can add them to objects, too
    // ES5 syntax
    let o = {
      createIterator: function* (items) {
        for (let i = 0; i < items.length; i++) {
          yield items[i];
        }
      }
    };
    let iterator = o.createIterator([1, 2, 3]);

    // ES6 syntax
    o = {
      *createIterator(items) {
        for (let i = 0; i < items.length; i++) {
          yield items[i];
        }
      }
    };
    iterator = o.createIterator([1, 2, 3]);
  });

  it("can be built by implementing Symbol.iterator", () => {
    class Company {
      constructor() {
        this.employees = [];
      }

      addEmployees(...names) {
        this.employees = this.employees.concat(names);
      }

      *[Symbol.iterator]() {
        for (let e of this.employees) {
          //console.log(e);
          yield e;
        }
      }
    }

    let filter = function* (items, predicate) {
      for (let item of items) {
        //console.log("filter", item);
        if (predicate(item)) {
          yield item;
        }
      }
    };

    let take = function* (items, number) {
      let count = 0;
      if (number < 1) return;
      for (let item of items) {
        //console.log("take", item);
        yield item;
        count += 1;
        if (count >= number) {
          return;
        }
      }
    };

    let count = 0;
    let company = new Company();
    company.addEmployees("Tim", "Sue", "Joy", "Tom");

    for (let employee of take(
      filter(company, (e) => e[0] == "T"),
      1
    )) {
      count += 1;
    }

    expect(count).toBe(1);
  });

  it("can take a parameter from next(param)", () => {
    // with the yield operator
    let range_yield = function* (start, end) {
      let current = start;
      while (current <= end) {
        let delta = yield current;
        current += delta || 1;
      }
    };

    // without yield operator
    let range_no_yield = function (start, end) {
      let current = start;
      let first = true;
      return {
        next(delta = 1) {
          let result = { value: undefined, done: true };
          if (!first) {
            current += delta;
          }
          if (current <= end) {
            result.value = current;
            result.done = false;
          }
          first = false;
          return result;
        }
      };
    };

    let result = [];
    let iterator = range_yield(1, 10);
    let next = iterator.next();
    while (!next.done) {
      result.push(next.value);
      next = iterator.next(2);
    }

    expect(result).toEqual([1, 3, 5, 7, 9]);

    result = [];
    iterator = range_no_yield(1, 10);
    next = iterator.next();
    while (!next.done) {
      result.push(next.value);
      next = iterator.next(2);
    }

    expect(result).toEqual([1, 3, 5, 7, 9]);
  });
});

it("generator return statements - no return value", function () {
  function* createIterator() {
    yield 1;
    return;
    yield 2; // unreachable block
    yield 3;
  }
  let iterator = createIterator();
  let result = iterator.next();
  expect(result.value).toBe(1);
  expect(result.done).toBe(false);
  result = iterator.next();
  expect(result.value).toBeUndefined();
  expect(result.done).toBe(true);
});

it("generator return statements - with return value", function () {
  function* createIterator() {
    yield 1;
    return 42;
  }
  let iterator = createIterator();
  let result = iterator.next();
  expect(result.value).toBe(1);
  expect(result.done).toBe(false);
  result = iterator.next();
  expect(result.value).toBe(42);
  expect(result.done).toBe(true);
  result = iterator.next();
  expect(result.value).toBeUndefined();
  expect(result.done).toBe(true);
});

it("delegating generators", function () {
  function* createNumberIterator() {
    yield 1;
    yield 2;
  }
  function* createColorIterator() {
    yield "red";
    yield "green";
  }
  function* createCombinedIterator() {
    yield* createNumberIterator();
    yield* createColorIterator();
    yield true;
  }
  let iterator = createCombinedIterator();

  let result = iterator.next();
  expect(result.value).toBe(1);
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBe(2);
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBe("red");
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBe("green");
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBe(true);
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBeUndefined();
  expect(result.done).toBe(true);
});

it("delegating to a generator with repetition", function () {
  function* createNumberIterator() {
    yield 1;
    yield 2;
    return 3;
  }
  function* createRepeatingIterator(count) {
    for (let i = 0; i < count; i++) {
      yield "repeat";
    }
  }
  function* createCombinedIterator() {
    let result = yield* createNumberIterator(); // result is 3, the value returned by the generator
    // the value 3 is never output from any call to the next() method
    // if we need to output the value 3, we can introduce another yield:
    // yield result;
    yield* createRepeatingIterator(result);
  }
  let iterator = createCombinedIterator();

  let result = iterator.next();
  expect(result.value).toBe(1);
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBe(2);
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBe("repeat");
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBe("repeat");
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBe("repeat");
  expect(result.done).toBe(false);

  result = iterator.next();
  expect(result.value).toBeUndefined();
  expect(result.done).toBe(true);
});

it("simple task runner", function () {
  function run(taskDef) {
    // create the iterator, make available elsewhere
    let task = taskDef();
    // start the task
    let result = task.next();
    // recursive function to keep calling next()
    function step() {
      // if there's more to do
      if (!result.done) {
        result = task.next();
        step();
      }
    }
    // start the process
    step();
  }

  run(function* () {
    // output 3 numbers to the console
    console.log(1);
    yield;
    console.log(2);
    yield;
    console.log(3);
  });
});

it("task runner with data", function () {
  function run(taskDef) {
    // create the iterator, make available elsewhere
    let task = taskDef();
    // start the task
    let result = task.next();
    // recursive function to keep calling next()
    function step() {
      // if there's more to do
      if (!result.done) {
        result = task.next(result.value);
        step();
      }
    }
    // start the process
    step();
  }

  run(function* () {
    let value = yield 1;
    console.log(value); // 1 - this value comes from 'yield 1' because it is passed back right into the value variable
    value = yield value + 3;
    console.log(value); // 4
  });
});

it("asynchronous task runner", function (done) {
  function run(taskDef) {
    // create the iterator, make available elsewhere
    let task = taskDef();
    // start the task
    let result = task.next();
    // recursive function to keep calling next()
    function step() {
      // if there's more to do
      if (!result.done) {
        if (typeof result.value === "function") {
          result.value(function (err, data) {
            if (err) {
              result = task.throw(err);
              return;
            }
            result = task.next(data);
            step();
          });
        } else {
          result = task.next(result.value);
          step();
        }
      }
    }
    // start the process
    step();
  }
  let fs = require("fs");
  function readFile(filename) {
    return function (callback) {
      fs.readFile(filename, callback);
    };
  }
  run(function* () {
    let contents = yield readFile("./config.js");
    console.log(String(contents));
    console.log("Done");
    done();
  });
});
