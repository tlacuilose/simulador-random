const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const expect = require('chai').expect

describe('App Integration Tests', function () {

  describe('Create', function () {

    // this.timeout(5000), default is 2 secs
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

  describe('MCM View', function () {

    openAndCloseApp();

    it('navigates to mcm screen', async function () {
      const mcmButton = await this.app.client.$('a.button[href="mcm.html"');
      expect(mcmButton).to.exist;
      await mcmButton.click();
      const windowtitle = await this.app.client.getTitle();
      expect(windowtitle).to.equal('SemRand - Congruencial Mixto');
      const title = await this.app.client.$('.is-title');
      const generatorTitle = await title.getText();
      expect(generatorTitle).to.equal('Método Congruencial Mixto')
    });

    it('has inputs for x0, a, c, m, i', async function () {
      const x0Input = await this.app.client.$('#form-inputs input[name="x0"]');
      expect(x0Input).to.exist;
      const aInput = await this.app.client.$('#form-inputs input[name="a"]');
      expect(aInput).to.exist;
      const cInput = await this.app.client.$('#form-inputs input[name="c"]');
      expect(cInput).to.exist;
      const mInput = await this.app.client.$('#form-inputs input[name="m"]');
      expect(mInput).to.exist;
      const iInput = await this.app.client.$('#form-inputs input[name="i"]');
      expect(iInput).to.exist;
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
