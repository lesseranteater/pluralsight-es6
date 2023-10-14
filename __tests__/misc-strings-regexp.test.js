import { describe, expect, it } from "@jest/globals";
import console from "console";
global.console = console;

it("u flag in regular expressions", () => {
  let text = "\uD83D\uDC04";
  console.log(text);

  expect(text.length).toBe(2);
  expect(/^.$/.test(text)).toBe(false); // when the u flag is missing, the regex matches on code units
  // so the character represented by 2 code units doesn't match the regular expression
  expect(/^.$/u.test(text)).toBe(true); // when used with the u flag, the regex compares characters instead of
  // code unit, so the character is matched
});

it("u flag in regular expressions", () => {
  let text = "\uD83D\uDC04";
  console.log(text);

  expect(text.length).toBe(2);
  expect(/^.$/.test(text)).toBe(false); // when the u flag is missing, the regex matches on code units
  // so the character represented by 2 code units doesn't match the regular expression
  expect(/^.$/u.test(text)).toBe(true); // when used with the u flag, the regex compares characters instead of
  // code unit, so the character is matched
});

it("Counting code points", () => {
  function codePointLength(text) {
    let result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
  }
  expect(codePointLength("abc")).toBe(3);
  expect("abc".length).toBe(3);

  expect(codePointLength("\uD83D\uDC04bc")).toBe(3);
  expect("\uD83D\uDC04bc".length).toBe(4);
});

it("Determine support for the u flag", () => {
  function hasRegExpU() {
    try {
      var pattern = new RegExp(".", "u");
      return true;
    } catch (ex) {
      return false;
    }
  }
  let isUSupported = hasRegExpU();
  expect(isUSupported).toBe(true);
});

it("Substrings", () => {
  let msg = "Hello world!";
  expect(msg.startsWith("Hello")).toBe(true);
  expect(msg.endsWith("!")).toBe(true);
  expect(msg.includes("o")).toBe(true);
  expect(msg.startsWith("o")).toBe(false);
  expect(msg.endsWith("world!")).toBe(true);
  expect(msg.includes("x")).toBe(false);
  expect(msg.startsWith("o", 4)).toBe(true);
  expect(msg.endsWith("o", 8)).toBe(true);
  expect(msg.includes("o", 8)).toBe(false);
});

it("Repeat", () => {
  expect("x".repeat(3)).toBe("xxx");
  expect("hello".repeat(2)).toBe("hellohello");
  expect("abc".repeat(4)).toBe("abcabcabcabc");
});

it("Regex y flag", () => {
  let text = "hello1 hello2 hello3";
  let pattern = /hello\d\s?/;
  let globalPattern = /hello\d\s?/g;
  let stickyPattern = /hello\d\s?/y;

  // check if the pattern is sticky
  expect(stickyPattern.sticky).toBe(true);

  // first round of matching
  let result = pattern.exec(text);
  let globalResult = globalPattern.exec(text);
  let stickyResult = stickyPattern.exec(text);

  expect(result[0]).toBe("hello1 ");
  expect(globalResult[0]).toBe("hello1 ");
  expect(stickyResult[0]).toBe("hello1 ");

  // set the lastIndex position
  // The y flag affects a regular
  // expression search’s sticky property, and it tells the search to start matching
  // characters in a string at the position specified by the regular expression’s
  // lastIndex property.
  // Then, the lastIndex property is changed to 1 on all three patterns,
  // meaning that the regular expression should start matching from the second
  // character on all of them. The regular expression with no flags
  // completely ignores the change to lastIndex and still matches "hello1 " without
  // incident. The regular expression with the g flag goes on to match "hello2 "
  // because it’s searching forward from the second character of the string
  // ("e"). The sticky regular expression doesn’t match anything beginning at
  // the second character, so stickyResult is null.
  pattern.lastIndex = 1;
  globalPattern.lastIndex = 1;
  stickyPattern.lastIndex = 1;

  result = pattern.exec(text);
  globalResult = globalPattern.exec(text);
  stickyResult = stickyPattern.exec(text);

  expect(result[0]).toBe("hello1 "); //
  expect(globalResult[0]).toBe("hello2 "); //
  try {
    let result = stickyResult[0]; // an error is raised
    expect(true).toBe(false);
  } catch (e) {
    expect(e.message).toBe("Cannot read properties of null (reading '0')");
  }
});

it("Determine support for the y flag", () => {
  function hasRegExpY() {
    try {
      var pattern = new RegExp(".", "y");
      return true;
    } catch (ex) {
      return false;
    }
  }
  let isYSupported = hasRegExpY();
  expect(isYSupported).toBe(true);
});

it("Overriding regex flags", () => {
  // In this code, re1 has the i (case-insensitive) flag, whereas re2 has only
  // the g (global) flag. The RegExp constructor duplicated the pattern from re1
  // and substituted the g flag for the i flag. Without the second argument, re2
  // would have the same flags as re1.
  let re1 = /ab/i;
  // throws an error in ES5, okay in ES6
  let re2 = new RegExp(re1, "g");

  expect(re1.toString()).toBe("/ab/i");
  expect(re2.toString()).toBe("/ab/g");
  expect(re1.test("ab")).toBe(true);
  expect(re2.test("ab")).toBe(true);
  expect(re1.test("AB")).toBe(true);
  expect(re2.test("AB")).toBe(false);
});

it("Regex flag property", function () {
  let re = /ab/g;
  expect(re.source).toBe("ab");
  expect(re.flags).toBe("g");
});

describe("Template Literals", function () {
  it("Basic syntax", function () {
    let message = `Hello world!`;
    expect(message).toBe("Hello world!");
    expect(typeof message).toBe("string");
    expect(message.length).toBe(12);
  });

  it("Using backticks in a string ", function () {
    let message = `\`Hello\` world!`; // escape it with a backslash
    expect(message).toBe("`Hello` world!");
    expect(typeof message).toBe("string");
    expect(message.length).toBe(14);
  });

  it("no need to escape double and single quotes", function () {
    let message = `'Hello' "world!"`;
    expect(message).toBe("'Hello' \"world!\"");
    expect(typeof message).toBe("string");
    expect(message.length).toBe(16);
  });

  it("Multiline strings", function () {
    let message = `Multiline
                   string`;
    console.log(message); // All whitespace inside the backticks is part of the string, so be careful
    // with indentation.
    // Multiline
    //                    string
    console.log(message.length); // 32
  });

  it("Text alignment with proper indentation", function () {
    let html = `
<div>
    <h1>Title</h1>
</div>`.trim();
    // The HTML tags are indented to look correct
    // and then the trim() method is called to remove the initial empty line.

    // we can use the \n literal to indicate where a new line should be inserted
    let message = `Multiline\nstring`;
    console.log(message); // "Multiline
    //  string"
    console.log(message.length); // 16
  });

  it("Making substitutions", function () {
    let name = "John";
    let message = `Hello, ${name}.`;
    expect(message).toBe("Hello, John.");

    let count = 10,
      price = 0.25;
    message = `${count} items cost $${(count * price).toFixed(2)}.`;
    expect(message).toBe("10 items cost $2.50.");
  });

  it("Tagged templates", function () {
    function highlight(literals, ...substitutions) {
      let result = "";
      // run the loop only for the substitution count
      for (let i = 0; i < substitutions.length; i++) {
        result += literals[i];
        result += `<span class='hl'>${substitutions[i]}</span>`;
      }
      // add the last literal
      result += literals[literals.length - 1];
      return result;
    }
    const name = "Snickers";
    const age = "100";
    const sentence = highlight`My dog's name is ${name} and he is ${age} years old.`;
    expect(sentence).toBe(
      "My dog's name is <span class='hl'>Snickers</span> and he is <span class='hl'>100</span> years old."
    );
  });
});
