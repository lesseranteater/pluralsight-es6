// module code without exports or imports
Array.prototype.pushAll = function (items) {
  // items must be an array
  if (!Array.isArray(items)) {
    throw new TypeError("Argument must be an array.");
  }
  // use built-in push() and spread operator
  return this.push(...items);
};

export { default as subtr } from "./utils.js"; // re-export the default export from utils.js
