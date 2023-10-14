import { describe, expect, it } from "@jest/globals";
import { defaultRaise, Employee, employeeName as name, modelEmployee } from "../src/ch08-modules/employee";
import { Company } from "../src/ch08-modules/company";
import "../src/ch08-modules/array-methods"; // import module code without any bindings
import subtract, { add as sum } from "../src/ch08-modules/utils"; // subtract is the default export
import { subtr } from "../src/ch08-modules/array-methods";
// we can rename the default export
// import { default as subtract, add as sum } from "../src/ch08-modules/utils";

describe("Modules", () => {
  it("Test imports", () => {
    let e = new Employee("Scott");
    expect(e.doWork()).toBe("Scott is working");
    expect(defaultRaise).toBe(0.03);

    let company = new Company();
    company.hire("Joy", "Sue", "Tim", "Tom");
    expect(company.doWork()).toEqual(["Joy is working", "Sue is working", "Tim is working", "Tom is working"]);

    // execute
    expect(name(modelEmployee)).toBe("Allen");

    let colors = ["red", "green", "blue"];
    let items = [];
    items.pushAll(colors);
    expect(items[0]).toBe("red");
    expect(items[1]).toBe("green");
    expect(items[2]).toBe("blue");

    expect(sum(1, 2)).toBe(3);
    expect(subtract(2, 1)).toBe(1);
    expect(subtr(2, 1)).toBe(1);
  });
});
