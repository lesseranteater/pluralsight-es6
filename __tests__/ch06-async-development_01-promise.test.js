import { describe, expect, it } from "@jest/globals";

import { getCompany, getCourse, getOrder, getUser } from "../src/ch06-async-development_01-promise-code";

describe("Promises", function () {
  it("should execute the callback given to then", function () {
    // New promises are created using the Promise constructor. This constructor
    // accepts a single argument: a function called the executor, which contains the
    // code to initialize the promise. The executor is passed two functions named
    // resolve() and reject() as arguments. The resolve() function is called when
    // the executor has finished successfully to signal that the promise is ready to
    // be resolved, whereas the reject() function indicates that the executor has
    // failed.
    let promise = new Promise(function (resolve, reject) {
      resolve();
    });

    promise.then(function () {
      console.log("The promised was resolved successfully.");
    });
  });

  it("order of execution", function () {
    let promise = new Promise(function (resolve, reject) {
      console.log("Promise");
      resolve();
    });
    promise.then(function () {
      console.log("Resolved.");
    });
    console.log("Hi!");

    // The promise executor executes immediately,
    // before anything that appears after it in the source code.
    // When either resolve() or reject() is called inside the executor, a job
    // is added to the job queue to resolve the promise.
    // Calling resolve() triggers an asynchronous operation. Functions passed
    // to then() and catch() are executed asynchronously, because these are also
    // added to the job queue.
    // Note that even though the call to then() appears before the line
    // console.log("Hi!"), it doesn’t actually execute until later (unlike the executor).
    // The reason is that fulfillment and rejection handlers are always
    // added to the end of the job queue after the executor has completed.

    // Promise
    // Hi!
    // Resolved
  });

  it("a fulfilment handler adds another handler", function () {
    // A fulfillment or rejection handler will still be executed even if it is
    // added to the job queue after the promise is already settled.
    let promise = new Promise(function (resolve, reject) {
      resolve();
    });

    promise.then(function () {
      console.log("The promised was resolved successfully.");
      promise.then(function () {
        console.log("The second handler was triggered.");
      });
    });
  });

  it("return a promise in the fulfilled state without scheduling", function () {
    let promise = Promise.resolve(42);
    promise.then(function (value) {
      console.log(value); // 42
    });
    // This code creates a fulfilled promise so the fulfillment handler receives
    // 42 as value. If a rejection handler were added to this promise, the rejection
    // handler would never be called because the promise will never be in the
    // rejected state.
  });

  it("create rejected promises", function () {
    let promise = Promise.reject(42);
    promise.catch(function (value) {
      console.log(value); // 42
    });
    // Any additional rejection handlers added to this promise would be
    // called but not fulfillment handlers.
  });

  it("non-promise thenable - resolve", function () {
    // Both Promise.resolve() and Promise.reject() also accept non-promise then-
    // ables as arguments. When passed a non-promise thenable, these methods
    // create a new promise that is called after the then() function.
    let thenable = {
      then: function (resolve, reject) {
        resolve(42);
      }
    };
    let p1 = Promise.resolve(thenable);
    p1.then(function (value) {
      console.log(value); // 42
    });
  });

  it("non-promise thenable - reject", function () {
    let thenable = {
      then: function (resolve, reject) {
        reject(42);
      }
    };
    let p1 = Promise.resolve(thenable);
    p1.catch(function (value) {
      console.log(value); // 42
    });
  });

  it("executor errors", function () {
    // If an error is thrown inside an executor, the promise’s rejection handler is called.
    let promise = new Promise(function (resolve, reject) {
      throw new Error("Explosion!");
    });
    // the shortcut above is equivalent to
    // let promise = new Promise(function(resolve, reject) {
    //     try {
    //         throw new Error("Explosion!");
    //     } catch (ex) {
    //         reject(ex);
    //     }
    // });

    promise.catch(function (error) {
      console.log(error.message); // "Explosion!"
    });
    // an error thrown in the executor is only reported when a rejection
    // handler is present. Otherwise, the error is suppressed.
  });

  it("should receive the resolved data", function () {
    let promise = new Promise(function (resolve, reject) {
      resolve(1);
    });

    promise.then(function (data) {
      expect(data).toBe(1);
    });
  });

  it("should fail when rejected", function () {
    let promise = new Promise(function (resolve, reject) {
      reject(Error("oh noes!"));
    });
    promise.then(
      function () {
        // success
      },
      function (error) {
        // rejection
        expect(error.message).toBe("oh noes!");
      }
    );
  });

  it("should have a catch", function () {
    let promise = new Promise(function (resolve, reject) {
      reject(Error("oh noes!"));
    });
    promise.catch(function (error) {
      expect(error.message).toBe("oh noes!");
    });
  });

  it("should compose when resolved with a promise", function () {
    let previousPromise = new Promise(function (resolve, reject) {
      resolve(3);
    });

    let promise = new Promise(function (resolve, reject) {
      resolve(previousPromise);
    });
    promise.then(function (data) {
      expect(data).toBe(3);
    });
  });

  it("should have a static resolve", function () {
    let previousPromise = Promise.resolve(3);

    let promise = Promise.resolve(previousPromise); // promises pass through unchanged
    promise.then(function (data) {
      expect(data).toBe(3);
    });
  });

  it("should have a static reject", function () {
    let promise = Promise.reject(Error("oh noes!"));
    promise.catch(function (error) {
      expect(error.message).toBe("oh noes!");
    });
  });

  it("should be asynchronous", function () {
    let async = false;

    let promise = new Promise(function (resolve, reject) {
      resolve();
    });
    promise.then(function () {
      expect(async).toBe(true);
    });
    async = true;
  });

  it("should chain sequentially using then", function () {
    getOrder(3)
      .then(function (order) {
        // each call to then() or catch() returns a promise
        return getUser(order.userId);
      })
      .then(function (user) {
        // the second promise is resolved only when the first has been fulfilled
        // or rejected
        return getCompany(user.companyId);
      })
      .then(function (company) {
        expect(company.name).toBe("Pluralsight");
      })
      .catch(function (error) {
        // handle error
      });
  });

  it("chaining exception handlers", function () {
    let p1 = new Promise(function (resolve, reject) {
      throw new Error("Explosion!"); // Here, the executor throws an error and triggers the p1 promise’s
      // rejection handler.
    });
    p1.catch(function (error) {
      console.log(error.message); // "Explosion!"
      throw new Error("Boom!"); //
    }).catch(function (error) {
      console.log(error.message); // "Boom!"
    });

    // Output:
    // Explosion!
    // Boom!
  });

  it("pass data from one promise to the next using a return statement", function () {
    let p1 = new Promise(function (resolve, reject) {
      resolve(42);
    });
    p1.then(function (value) {
      console.log(value); // "42"
      return value + 1;
    }).then(function (value) {
      console.log(value); // "43"
    });

    // passing value from a rejection handler
    let p2 = new Promise(function (resolve, reject) {
      reject(42);
    });
    p2.catch(function (value) {
      // first fulfillment handler
      console.log(value); // "42"
      return value + 1;
    }).then(function (value) {
      // second fulfillment handler
      console.log(value); // "43"
    });
  });

  it("wait until a previous promise has been settled before triggering another promise", function () {
    let p1 = new Promise(function (resolve, reject) {
      resolve(42);
    });
    p1.then(function (value) {
      console.log(value); // 42
      // create a new promise
      return new Promise(function (resolve, reject) {
        resolve(43);
      });
    }).then(function (value) {
      console.log(value); // 43
    });
  });

  it("execute a number of promises with Promise.all()", function () {
    let p1 = new Promise(function (resolve, reject) {
      resolve(42);
    });
    let p2 = new Promise(function (resolve, reject) {
      resolve(43);
    });
    let p3 = new Promise(function (resolve, reject) {
      resolve(44);
    });
    let p4 = Promise.all([p1, p2, p3]);
    p4.then(function (value) {
      expect(Array.isArray(value)).toBe(true);
      expect(value[0]).toBe(42);
      expect(value[1]).toBe(43);
      expect(value[2]).toBe(44);
    });
  });

  it("reject a promise with Promise.all()", function () {
    // If any promise passed to Promise.all() is rejected, the returned promise
    // is immediately rejected without waiting for the other promises to complete:
    let p1 = new Promise(function (resolve, reject) {
      resolve(42);
    });
    let p2 = new Promise(function (resolve, reject) {
      reject(43);
    });
    let p3 = new Promise(function (resolve, reject) {
      resolve(44);
    });
    let p4 = Promise.all([p1, p2, p3]);
    p4.catch(function (value) {
      expect(Array.isArray(value)).toBe(false);
      expect(value).toBe(43);
    });
  });

  it("should execute after all promises with all", function () {
    let courseIds = [1, 2, 3];
    let promises = [];
    for (let i = 0; i < courseIds.length; i++) {
      promises.push(getCourse(courseIds[i]));
    }
    Promise.all(promises).then(function (values) {
      // the constructor accept an iterable
      // returns a promise that is resolved only when every promise in the iterable is resolved.
      expect(values.length).toBe(3);
    });
  });

  it("should resolve after the first promise", function () {
    let courseIds = [1, 2, 3];
    let promises = [];
    for (let i = 0; i < courseIds.length; i++) {
      promises.push(getCourse(courseIds[i]));
    }
    // Promise.race() method returns
    // an appropriate promise as soon as any promise in the array is fulfilled
    Promise.race(promises).then(function (firstValue) {
      expect(firstValue.name).toBeDefined();
    });
  });

  it("inheriting from promises", function () {
    // we can use a promise as the base for a derived class
    class MyPromise extends Promise {
      // use default constructor
      success(resolve, reject) {
        return this.then(resolve, reject);
      }
      failure(reject) {
        return this.catch(reject);
      }
    }
    let promise = new MyPromise(function (resolve, reject) {
      resolve(42);
    });
    promise
      .success(function (value) {
        console.log(value); // 42
      })
      .failure(function (value) {
        console.log(value);
      });
  });
});

it("asynchronous task runner", function (done) {
  let fs = require("fs");
  function run(taskDef) {
    // create the iterator
    let task = taskDef();
    // start the task
    let result = task.next();
    // recursive function to iterate through
    (function step() {
      // if there's more to do
      if (!result.done) {
        // resolve to a promise to make it easy
        let promise = Promise.resolve(result.value);
        promise
          .then(function (value) {
            result = task.next(value);
            step(); // recursive calls until the iterator is complete
          })
          .catch(function (error) {
            result = task.throw(error);
            step();
          });
      }
    })();
  }
  // define a function to use with the task runner
  function readFile(filename) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filename, function (err, contents) {
        if (err) {
          reject(err);
        } else {
          resolve(contents);
        }
      });
    });
  }
  // run a task
  run(function* () {
    let contents = yield readFile("./config.js");
    console.log(String(contents));
    console.log("Done");
    done();
  });
});
