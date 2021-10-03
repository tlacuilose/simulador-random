const expect = require('chai').expect

const env = require('./tests_env.js');

describe('App Tests', function () {

  describe('open app', function () {

    // this.timeout(5000), default is 2 secs
    env.openAndCloseApp();

    it('shows an initial window', async function () {
      const count = await this.app.client.getWindowCount();
      expect(count).to.equal(1);
    });

    it('shows an initial window with app title', async function () {
      const title = await this.app.client.getTitle();
      expect(title).to.equal('SemRand');
    });
  });

});
