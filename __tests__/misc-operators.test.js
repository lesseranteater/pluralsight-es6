import { describe, expect, it } from "@jest/globals";

describe("Miscellaneous - Operators", () => {
  it("Operators", () => {
    // equality operators
    expect(1 == true).toBe(true);
    expect(1 === true).toBe(false);
    expect(1 == "1").toBe(true);
    expect(1 === "1").toBe(false);

    // unary operator
    // convert a string to a number with a plus
    let year = "1967";
    expect(+year).toBe(1967);

    // default settings with a logical OR
    let userSettings = { name: "Joe" };
    let defaultSettings = { name: "Default" };
    expect((userSettings || defaultSettings).name).toBe("Joe");

    userSettings = null; // no user settings to overwrite the default settings
    defaultSettings = { name: "Default" };
    expect((userSettings || defaultSettings).name).toBe("Default");
  });
});
