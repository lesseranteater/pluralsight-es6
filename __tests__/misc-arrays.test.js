import { describe, expect, it } from "@jest/globals";

describe("Miscellaneous - Arrays", () => {
  it("Array iteration", () => {
    let carIds = [
      {
        id: 123,
        style: "sedan"
      },
      {
        id: 456,
        style: "convertible"
      },
      {
        id: 789,
        style: "sedan"
      }
    ];

    let newCarIds = [];
    carIds.forEach((car) => newCarIds.push(car));
    expect(carIds).toEqual(newCarIds);

    let indexes = [];
    carIds.forEach((car, index) => indexes.push(index));
    expect(indexes).toEqual([0, 1, 2]);
  });

  it("every method", () => {
    let carIds = [
      {
        carId: 123,
        style: "sedan"
      },
      {
        carId: 456,
        style: "convertible"
      },
      {
        carId: 789,
        style: "sedan"
      }
    ];

    let result = carIds.every((car) => car.carId > 0);
    // every tests if all the elements of the array pass the test
    expect(result).toBe(true);
  });

  it("Filter method", () => {
    let carIds = [
      {
        carId: 123,
        style: "sedan"
      },
      {
        carId: 456,
        style: "convertible"
      },
      {
        carId: 789,
        style: "sedan"
      }
    ];

    let convertibles = carIds.filter((car) => car.style === "sedan");
    // return only the elements that satisfy the predicate
    expect(convertibles).toEqual([
      {
        carId: 123,
        style: "sedan"
      },
      {
        carId: 789,
        style: "sedan"
      }
    ]);
  });

  it("Find method", () => {
    let carIds = [
      {
        carId: 123,
        style: "sedan"
      },
      {
        carId: 456,
        style: "convertible"
      },
      {
        carId: 789,
        style: "sedan"
      }
    ];

    let car = carIds.find((car) => car.style === "sedan");
    // return only the elements that satisfy the predicate
    expect(car).toEqual({
      carId: 123,
      style: "sedan"
    });
  });
});

it("Array.of() method", function () {
  let items = Array.of(1, 2);
  expect(items.length).toBe(2);
  expect(items[0]).toBe(1);
  expect(items[1]).toBe(2);
  items = Array.of(2);
  expect(items.length).toBe(1);
  expect(items[0]).toBe(2);
  items = Array.of("2");
  expect(items.length).toBe(1);
  expect(items[0]).toBe("2");
});

it("array creator", function () {
  function createArray(arrayCreator, value) {
    return arrayCreator(value);
  }
  let items = createArray(Array.of, 2);
  expect(items.length).toBe(1);
  expect(items[0]).toBe(2);
});

it("Array.from() method - convert objects into arrays", function () {
  function doSomething() {
    return Array.from(arguments);
  }

  let args = doSomething(1, 2, 3);
  expect(args.length).toBe(3);
  expect(args[0]).toBe(1);
  expect(args[1]).toBe(2);
  expect(args[2]).toBe(3);
});

it("Array.from() method - mapping conversion", function () {
  function translate() {
    return Array.from(arguments, (value) => value + 1);
  }
  let numbers = translate(1, 2, 3);
  expect(numbers.length).toBe(3);
  expect(numbers[0]).toBe(2);
  expect(numbers[1]).toBe(3);
  expect(numbers[2]).toBe(4);
});

it("Array.from() method - mapping conversion  - pass in the this value of the mapping function", function () {
  let helper = {
    diff: 2,
    add(value) {
      return value + this.diff;
    }
  };
  function translate() {
    return Array.from(arguments, helper.add, helper);
  }
  let numbers = translate(1, 2, 3);
  expect(numbers.length).toBe(3);
  expect(numbers[0]).toBe(3);
  expect(numbers[1]).toBe(4);
  expect(numbers[2]).toBe(5);
});

it("Array.from() method - convert iterables to arrays", function () {
  let numbers = {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
      yield 3;
    }
  };
  let numbers2 = Array.from(numbers, (value) => value + 1);
  expect(numbers2.length).toBe(3);
  expect(numbers2[0]).toBe(2);
  expect(numbers2[1]).toBe(3);
  expect(numbers2[2]).toBe(4);
});

it("find() and findIndex() methods", function () {
  let numbers = [25, 30, 35, 40, 45];
  expect(numbers.find((n) => n > 33)).toBe(35); // 35 - the first value larger than 33
  expect(numbers.findIndex((n) => n > 33)).toBe(2); // 2 - the index of the first value larger than 33
  // Both find() and findIndex() are useful to find an array element that
  // matches a condition rather than a value. If you only want to find a value,
  // indexOf() and lastIndexOf() are better choices.
});

it("fill() method", function () {
  let numbers = [1, 2, 3, 4];
  numbers.fill(1);
  expect(numbers).toEqual([1, 1, 1, 1]);

  numbers = [1, 2, 3, 4];
  numbers.fill(1, 2);
  expect(numbers).toEqual([1, 2, 1, 1]);
  numbers.fill(0, 1, 3);
  expect(numbers).toEqual([1, 0, 0, 1]);
});

it("copyWithin() method", function () {
  let numbers = [1, 2, 3, 4];
  // paste values into array starting at index 2
  // copy values from array starting at index 0
  numbers.copyWithin(2, 0);
  expect(numbers).toEqual([1, 2, 1, 2]);

  numbers = [1, 2, 3, 4];
  // paste values into array starting at index 2
  // copy values from array starting at index 0
  // stop copying values when you hit index 1
  numbers.copyWithin(2, 0, 1);
  expect(numbers).toEqual([1, 2, 1, 4]);
});

describe("typed arrays", function () {
  it("array buffers - data view", function () {
    let buffer = new ArrayBuffer(10); // allocate 10 bytes
    expect(buffer.byteLength).toBe(10);

    let buffer2 = buffer.slice(4, 6);
    expect(buffer2.byteLength).toBe(2);
  });

  it("data views", function () {
    let buffer = new ArrayBuffer(10),
      view1 = new DataView(buffer), // cover all bytes
      view2 = new DataView(buffer, 5, 2); // cover bytes 5 and 6
    expect(view1.buffer === buffer).toBe(true);
    expect(view2.buffer === buffer).toBe(true);
    expect(view1.byteOffset).toBe(0);
    expect(view2.byteOffset).toBe(5);
    expect(view1.byteLength).toBe(10);
    expect(view2.byteLength).toBe(2);
  });

  it("getters and setters", function () {
    let buffer = new ArrayBuffer(2),
      view = new DataView(buffer);
    view.setInt8(0, 5);
    view.setInt8(1, -1);
    expect(view.getInt8(0)).toBe(5);
    expect(view.getInt8(1)).toBe(-1);
    expect(view.getInt16(0)).toBe(1535); // writing two int8 values and reading the buffer with an
    // int16 method works just fine
  });

  it("type-specific views", function () {
    let buffer = new ArrayBuffer(10),
      view1 = new Int8Array(buffer),
      view2 = new Int8Array(buffer, 5, 2);
    expect(view1.buffer === buffer).toBe(true);
    expect(view2.buffer === buffer).toBe(true);
    expect(view1.byteOffset).toBe(0);
    expect(view2.byteOffset).toBe(5);
    expect(view1.byteLength).toBe(10);
    expect(view2.byteLength).toBe(2);
  });
  it("create a types array with a number of elements (not bytes)", function () {
    let ints = new Int16Array(2),
      floats = new Float32Array(5);
    expect(ints.byteLength).toBe(4);
    expect(ints.length).toBe(2);
    expect(floats.byteLength).toBe(20);
    expect(floats.length).toBe(5);
  });

  it("alternative ways to create typed arrays", function () {
    let ints1 = new Int16Array([25, 50]),
      ints2 = new Int32Array(ints1);
    expect(ints1.buffer === ints2.buffer).toBe(false);
    expect(ints1.byteLength).toBe(4);
    expect(ints1.length).toBe(2);
    expect(ints1[0]).toBe(25);
    expect(ints1[1]).toBe(50);
    expect(ints2.byteLength).toBe(8);
    expect(ints2.length).toBe(2);
    expect(ints2[0]).toBe(25);
    expect(ints2[1]).toBe(50);
  });

  it("similarities between typed arrays and regular arrays", function () {
    let ints = new Int16Array([25, 50]);
    expect(ints.length).toBe(2);
    expect(ints[0]).toBe(25);
    expect(ints[1]).toBe(50);

    let mapped = ints.map((v) => v * 2);
    expect(mapped.length).toBe(2);
    expect(mapped[0]).toBe(50);
    expect(mapped[1]).toBe(100);
    expect(mapped instanceof Int16Array).toBe(true); //  when an
    // array is returned, it is a typed array instead of a regular array (due to Symbol.species

    ints[0] = 1;
    ints[1] = 2;
    expect(ints[0]).toBe(1);
    expect(ints[1]).toBe(2);

    // Typed arrays have the same three iterators as regular arrays, too. Those are
    // the entries() method, the keys() method, and the values() method.
    let intsArray = [...ints];
    expect(intsArray instanceof Array).toBe(true);
    expect(intsArray[0]).toBe(1);
    expect(intsArray[1]).toBe(2);

    ints = Int16Array.of(25, 50);
    let floats = Float32Array.from([1.5, 2.5]);
    expect(ints instanceof Int16Array).toBe(true);
    expect(floats instanceof Float32Array).toBe(true);
    expect(ints.length).toBe(2);
    expect(ints[0]).toBe(25);
    expect(ints[1]).toBe(50);
    expect(floats.length).toBe(2);
    expect(floats[0]).toBe(1.5);
    expect(floats[1]).toBe(2.5);
  });

  it("differences between typed and regular arrays", function () {
    let ints = new Int16Array([25, 50]);
    expect(ints instanceof Array).toBe(false);
    expect(Array.isArray(ints)).toBe(false);

    expect(ints.length).toBe(2);
    expect(ints[0]).toBe(25);
    expect(ints[1]).toBe(50);
    ints[2] = 5;
    expect(ints.length).toBe(2);
    expect(ints[2]).toBeUndefined(); // undefined - the size cannot be changed
    // the Array methods which change the size of the array are missing
    // concat()  shift()
    // pop()  splice()
    // push()  unshift()

    let ints2 = new Int16Array(["hi"]);

    expect(ints2.length).toBe(1); // 1
    expect(ints2[0]).toBe(0); // 0 is placed for invalid values - there is type checking in place

    let mapped = ints.map((v) => "hi");
    expect(mapped[1]).toBe(0);
    expect(mapped.length).toBe(2);
    expect(mapped[0]).toBe(0); // 0 -  if the function passed to map() returns an invalid
    // value for the type array, then 0 is used instead

    // new methods: set() and subarray()
    ints = new Int16Array([25, 50, 75, 100]);
    let subints1 = ints.subarray(),
      subints2 = ints.subarray(2),
      subints3 = ints.subarray(1, 3);
    expect(subints1.toString()).toBe("25,50,75,100");
    expect(subints2.toString()).toBe("75,100");
    expect(subints3.toString()).toBe("50,75");
  });
});
