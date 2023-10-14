class Wrapper {
  constructor(gen) {
    this._gen = gen;
  }

  start() {
    this._gen.next();
  }

  resume(val) {
    this._gen.next(val);
  }

  fail(reason) {
    this._gen.throw(reason); // the yield statement will throw an exception
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
  } catch (error) {
    console.log("Error in an asynchronous call: " + error.message);
  }
}

function getStockPrice() {
  setTimeout(function () {
    try {
      console.log("Getting stock price");
      throw new Error("There was a problem in the getStockPrice method"); // comment this out for the happy path
      wrapper.resume(50);
    } catch (error) {
      wrapper.fail(error);
    }
  }, 300);
}

function executeTrade() {
  setTimeout(function () {
    console.log("Trade completed");
    wrapper.resume();
  }, 300);
}

const m = main();
let wrapper = new Wrapper(m);
wrapper.start();
