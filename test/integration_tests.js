const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const expect = require('chai').expect

describe('App Integration Tests', function () {
  this.timeout(10000)

  describe('Create', function () {

    openAndCloseApp();

    it('shows an initial window', async function () {
      const count = await this.app.client.getWindowCount();
      expect(count).to.equal(1);
    });

    it('shows an initial window with app title', async function () {
      const title = await this.app.client.getTitle();
      expect(title).to.equal('SemRand');
    });
  });

  describe('About view', function () {

    openAndCloseApp();

    it('shows a logo art', async function () {
      const logoart = await this.app.client.$('.logo-art');
      expect(logoart).to.exist;
    });

    it('shows about information', async function () {
      const version = await this.app.client.$('.about-version');
      expect(version).to.exist;
      const description = await this.app.client.$('.about-description');
      expect(description).to.exist;
      const team = await this.app.client.$('.about-team');
      expect(team).to.exist;
    });
  });

});

function openAndCloseApp() {

  before(function () {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')]
    })
    return this.app.start()
  })

  after(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })
}
