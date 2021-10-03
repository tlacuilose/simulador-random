const expect = require('chai').expect

const env = require('./tests_env.js');

describe('About View Tests', function () {

  describe('has about view as the first view', function () {

    this.timeout(60000);
    env.openAndCloseApp();

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

