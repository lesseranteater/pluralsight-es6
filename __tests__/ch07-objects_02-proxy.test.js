import { describe, it, expect } from "@jest/globals";

describe("Proxies", function () {
  it("simple forwarding proxy", function () {
    let target = {};
    let proxy = new Proxy(target, {});
    proxy.name = "proxy";
    expect(proxy.name).toBe("proxy");
    expect(target.name).toBe("proxy");
    target.name = "target";
    expect(proxy.name).toBe("target");
    expect(target.name).toBe("target");
  });

  it("should let you intercept gets", function () {
    let unicorn = {
      legs: 4,
      color: "brown",
      horn: true // awesome brown
    };
    let proxyUnicorn = new Proxy(unicorn, {
      get: function (target, property) {
        if (property === "color") {
          return "awesome " + target[property];
        } else {
          return target[property];
        }
      }
    });

    expect(proxyUnicorn.legs).toBe(4);
    expect(proxyUnicorn.horn).toBe(true);
    expect(proxyUnicorn.color).toBe("awesome brown");
  });

  it("throw an error if a property does not exist on an object", function () {
    let proxy = new Proxy(
      {},
      {
        get(trapTarget, key, receiver) {
          if (!(key in receiver)) {
            //The receiver is used with in instead of trapTarget in case receiver is a proxy
            // with a has trap. Using trapTarget in this
            // case would sidestep the has trap and potentially give you the wrong result.
            throw new TypeError("Property " + key + " doesn't exist.");
          }
          return Reflect.get(trapTarget, key, receiver);
        }
      }
    );
    // adding a property still works
    proxy.name = "proxy";
    expect(proxy.name).toBe("proxy");
    // nonexistent properties throw an error
    try {
      console.log(proxy.nme); // throws an error
    } catch (e) {
      expect(e.message).toBe("Property nme doesn't exist.");
    }
  });

  it("intercept set to create new properties that are numbers only", function () {
    let target = {
      name: "target"
    };
    let proxy = new Proxy(target, {
      set(trapTarget, key, value, receiver) {
        // ignore existing properties so as not to affect them
        if (!trapTarget.hasOwnProperty(key)) {
          if (isNaN(value)) {
            // throw an exception if the value of the new property is not a number
            throw new TypeError("Property must be a number.");
          }
        }
        // add the property
        return Reflect.set(trapTarget, key, value, receiver);
      }
    });
    // adding a new property
    proxy.count = 1;
    expect(proxy.count).toBe(1);
    expect(target.count).toBe(1);
    // you can assign to name because it exists on target already
    proxy.name = "proxy";
    expect(proxy.name).toBe("proxy");
    expect(target.name).toBe("proxy");
    // throws an error
    try {
      proxy.anotherName = "proxy";
    } catch (e) {
      expect(e.message).toBe("Property must be a number.");
    }
  });

  it("should let you intercept sets", function () {
    const monster = { eyeCount: 4 };

    const handler = {
      set(obj, prop, value) {
        if (prop === "eyeCount" && value % 2 !== 0) {
          console.log("Monsters must have an even number of eyes"); // just a warning
          return true;
          // The set method should return a boolean value. Return true to indicate that assignment succeeded.
          // If the set method returns false, and the assignment happened in strict-mode code,
          // a TypeError will be thrown.
        } else {
          return Reflect.set(...arguments);
        }
      }
    };

    const proxy = new Proxy(monster, handler);

    proxy.eyeCount = 1;
    // expected output: "Monsters must have an even number of eyes"
    expect(monster.eyeCount).toBe(4);

    proxy.eyeCount = 2;
    expect(proxy.eyeCount).toBe(2);
    expect(monster.eyeCount).toBe(2);
  });

  it("hiding property existence with the has trap", function () {
    // The has trap is called whenever the in operator is used
    let target = {
      name: "target",
      value: 42
    };
    let proxy = new Proxy(target, {
      has(trapTarget, key) {
        if (key === "value") {
          return false;
        } else {
          return Reflect.has(trapTarget, key);
        }
      }
    });
    expect("value" in proxy).toBe(false); // false
    expect("name" in proxy).toBe(true);
    expect("toString" in proxy).toBe(true);
  });

  it("prevent property deletion with the deleteProperty trap", function () {
    let target = {
      name: "target",
      value: 42
    };
    let proxy = new Proxy(target, {
      deleteProperty(trapTarget, key) {
        if (key === "value") {
          return false;
        } else {
          return Reflect.deleteProperty(trapTarget, key);
        }
      }
    });
    // attempt to delete proxy.value
    expect("value" in proxy).toBe(true);

    try {
      delete proxy.value; // an exception is thrown
    } catch (e) {
      expect(e.message).toBe("'deleteProperty' on proxy: trap returned falsish for property 'value'");
    }

    expect("value" in proxy).toBe(true);
    // attempt to delete proxy.name
    expect("name" in proxy).toBe(true);
    let result2 = delete proxy.name;
    expect(result2).toBe(true);
    expect("name" in proxy).toBe(false);
  });

  it("should let you know how to proxy functions", function () {
    let unicorn = {
      legs: 4,
      color: "brown",
      horn: true,
      hornAttack: function (target) {
        return target.name + " was obliterated";
      }
    };
    unicorn.hornAttack = new Proxy(unicorn.hornAttack, {
      apply: function (target, context, args) {
        if (context !== unicorn) {
          return "Nobody can use hornAttack but unicorn itself.";
        } else {
          return target.apply(context, args);
        }
      }
    });
    let thief = {
      name: "Rupert"
    };
    thief.attack = unicorn.hornAttack;
    expect(thief.attack()).toBe("Nobody can use hornAttack but unicorn itself.");
    expect(unicorn.hornAttack(thief)).toBe("Rupert was obliterated");
  });

  it("apply and construct traps - validating functional parameters", function () {
    // we can check the type of the arguments in the apply trap
    // adds together all arguments
    function sum(...values) {
      return values.reduce((previous, current) => previous + current, 0);
    }
    let sumProxy = new Proxy(sum, {
      apply: function (trapTarget, thisArg, argumentList) {
        argumentList.forEach((arg) => {
          if (typeof arg !== "number") {
            throw new TypeError("All arguments must be numbers.");
          }
        });
        return Reflect.apply(trapTarget, thisArg, argumentList);
      },
      construct: function (trapTarget, argumentList) {
        throw new TypeError("This function can't be called with new.");
      }
    });
    expect(sumProxy(1, 2, 3, 4)).toBe(10);
    try {
      // throws an error
      console.log(sumProxy(1, "2", 3, 4));
    } catch (e) {
      expect(e.message).toBe("All arguments must be numbers.");
    }

    try {
      // also throws an error
      let result = new sumProxy();
    } catch (e) {
      expect(e.message).toBe("This function can't be called with new.");
    }
  });
});
