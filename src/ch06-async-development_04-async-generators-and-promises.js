class Wrapper {
  constructor(sequence) {
    this._sequence = sequence;
  }
  run() {
    let sequence;
    let process = function (result) {
      // the result is the promise returned by the yield statement
      if (!result.done) {
        result.value.then(
          function (value) {
            process(sequence.next(value));
          },
          function (error) {
            process(sequence.throw(error));
          }
        );
      }
    };
    sequence = this._sequence();
    process(sequence.next());
  }
}

function* main() {
  try {
    let price = yield getStockPrice();
    if (price > 45) {
      yield executeTrade();
    } else {
      console.log("Trade not made");
    }
    console.log("Done");
  } catch (error) {
    console.log("Error in an asynchronous call: " + error.message);
  }
}

function getStockPrice() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("Executing the getStockPrice function");
      resolve(50); // the return value of the call
    }, 300);
  });
}

function executeTrade() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("Executing the executeTrade function");
      resolve();
    }, 300);
  });
}

let wrapper = new Wrapper(main);
wrapper.run();
