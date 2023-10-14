import { describe, expect, it } from "@jest/globals";

it("Date functions", () => {
  let val;

  const today = new Date();
  const birthday = new Date(2022, 11, 24);

  expect(birthday.getFullYear()).toBe(2022);
  expect(birthday.getMonth()).toBe(11);
  expect(birthday.getDate()).toBe(24);

  const strDob = new Date(1977, 4, 3).toLocaleString("bg-BG", {
    timeZone: "Europe/Sofia"
  });
  expect(strDob).toBe("3.05.1977 г., 00:00:00 ч.");
});
