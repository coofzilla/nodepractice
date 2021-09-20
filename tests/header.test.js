//jest tests need to end in .test.js
const puppeteer = require("puppeteer");
let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto("localhost:3000");
});

// afterEach(async () => {
//   await browser.close();
// });

//headless = open browser w/o gui
test("header has correct text", async () => {
  //$eval from puppeteer basically does queryselector
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  expect(text).toEqual("Blogster");
});

test("clicking login starts oauth flow", async () => {
  await page.click(".right a");

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test.only("When signed in, shows logout button", async () => {
  const id = "6147de0ea16fd2dec5f96849";

  const Buffer = require("safe-buffer").Buffer;
  const sessionObject = {
    passport: {
      user: id,
    },
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );
  //keygrip node.js module for signing and verifying data
  const Keygrip = require("keygrip");
  const keys = require("../config/keys");
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign(`session=${sessionString}`);
  //setCookie from puppeteer
  //get name from application/cookies in browser
  await page.setCookie({ name: "session", value: sessionString });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("localhost:3000");
});
