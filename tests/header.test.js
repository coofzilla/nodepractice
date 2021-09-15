//jest tests need to end in .test.js
const puppeteer = require("puppeteer");

//first argument describes the test, second is the logic to test
test("Adds two numbers", () => {
  const sum = 1 + 2;

  expect(sum).toEqual(3);
});
//headless = open browser w/o gui
test("We can launch a browser", async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
});
