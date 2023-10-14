import { describe, expect, it } from "@jest/globals";

describe("Miscellaneous - Types", () => {
  it("Test typeof", () => {
    expect(typeof 1).toBe("number");
    expect(typeof true).toBe("boolean");
    expect(typeof "Hello").toBe("string");
    expect(typeof function () {}).toBe("function");
    expect(typeof {}).toBe("object"); // an empty object
    expect(typeof null).toBe("object"); // !!!
    expect(typeof undefined).toBe("undefined"); // !!!
    expect(typeof NaN).toBe("number"); // !!!
  });

  it("Test type conversion", () => {
    // object to string
    class Foo {
      toString() {
        return "Pity the Foo";
      }
    }

    const foo = new Foo();
    expect(String(foo)).toBe("Pity the Foo");

    // String to number
    let n1 = Number.parseInt("55");
    expect(n1).toBe(55);
    let n2 = Number.parseInt("55.66");
    expect(n2).toBe(55); // the decimal part is truncated
    let n3 = Number.parseFloat("55.66");
    expect(n3).toBe(55.66);
    let n4 = Number.parseInt("55ABC");
    expect(n4).toBe(55); // ABC is ignored at the end, an error at the start
    let n5 = Number.parseFloat("55.66ABC"); // ABC is ignore at the end, an error at the start
    expect(n5).toBe(55.66);
    let n6 = Number.parseFloat("ABC55.66ABC"); // ABC is ignore at the end, an error at the start
    expect(n6).toBe(NaN);
  });
});
