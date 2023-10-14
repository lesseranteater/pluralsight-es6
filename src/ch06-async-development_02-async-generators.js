// function oldPause(delay, cb) {
//   setTimeout(function () {
//     console.log("paused for " + delay + "ms");
//     cb();
//   }, delay);
// }

// console.log("start");
// oldPause(1000, function () {
//   console.log("middle");
//   oldPause(1000, function () {
//     console.log("end");
//   });
// });

class Wrapper {
  constructor(gen) {
    this._gen = gen;
  }

  start() {
    this._gen.next();
  }

  resume() {
    this._gen.next();
  }
}

function* main() {
  console.log("start");
  yield pause(1000);
  console.log("middle");
  yield pause(1000);
  console.log("done");
}

function pause(delay) {
  setTimeout(function () {
    console.log("paused for " + delay + "ms");
    wrapper.resume();
  }, delay);
}

const m = main();
let wrapper = new Wrapper(m);
wrapper.start();
