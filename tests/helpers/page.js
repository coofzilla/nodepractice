const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    //create instance of browser
    const browser = await puppeteer.launch({
      headless: true,
    });
    //create instance of page
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    //combine all three into proxy and return
    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }
  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    //setCookie from puppeteer
    //get name from application/cookies in browser
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }
}
module.exports = CustomPage;
