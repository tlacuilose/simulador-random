const expect = require('chai').expect

const env = require('./tests_env.js');

var visitModel = async function(client, url) {
  const mcmButton = await client.$(`a.button[href="${url}"`);
  await mcmButton.click();
}

var fillInputForm = async function(client, x0, a, c, m, i) {
  const x0Input = await client.$('#form-inputs input[name="x0"]');
  await x0Input.setValue(x0);
  const aInput = await client.$('#form-inputs input[name="a"]');
  await aInput.setValue(a);
  const cInput = await client.$('#form-inputs input[name="c"]');
  await cInput.setValue(c);
  const mInput = await client.$('#form-inputs input[name="m"]');
  await mInput.setValue(m);
  const iInput = await client.$('#form-inputs input[name="i"]');
  await iInput.setValue(i);
}

var fillInputFormGM = async function(client, x0, a, m, i) {
  const x0Input = await client.$('#form-inputs input[name="x0"]');
  await x0Input.setValue(x0);
  const aInput = await client.$('#form-inputs input[name="a"]');
  await aInput.setValue(a);
  const mInput = await client.$('#form-inputs input[name="m"]');
  await mInput.setValue(m);
  const iInput = await client.$('#form-inputs input[name="i"]');
  await iInput.setValue(i);
}

var fillTestForm = async function(client) {
  const fiveInput = await client.$('#five-alpha');
  await fiveInput.click();
  const kolInput = await client.$('#kol-smi-input');
  await kolInput.click();
}

describe('Kolmogorov Smirnov View Tests in MC', function () {

  describe('validates example', function () {

    env.openAndCloseApp();
    this.timeout(10000);

    it('displays correct validation in results', async function () {
      await visitModel(this.app.client, "mc.html");
      await fillInputForm(this.app.client, 4, 5, 7, 8, 50);
      const formButton = await this.app.client.$('#form-inputs .button');
      await formButton.click();
      await fillTestForm(this.app.client);
      const testButton = await this.app.client.$('#form-tests .button');
      await testButton.click();
      const kolResult = await this.app.client.$('#kol-results');
      const dpResult = await kolResult.$('#dp-result');
      const dp = await dpResult.getText();
      expect(dp).to.deep.equal("0.13");
      const dmResult = await kolResult.$('#dm-result');
      const dm = await dmResult.getText();
      expect(dm).to.deep.equal("0.015000000000000013");
      const drResult = await kolResult.$('#dr-result');
      const dr = await drResult.getText();
      expect(dr).to.deep.equal("0.13");
      const conclusion = await kolResult.$('#kol-conclusion span');
      const conclusionText = await conclusion.getText();
      expect(conclusionText).to.deep.equal("ACEPTA");
    });
  });
});

describe('Kolmogorov Smirnov View Tests in MCM', function () {

  describe('validates example', function () {

    env.openAndCloseApp();
    this.timeout(10000);

    it('displays correct validation in results', async function () {
      await visitModel(this.app.client, "mcm.html");
      await fillInputForm(this.app.client, 4, 5, 7, 8, 50);
      const formButton = await this.app.client.$('#form-inputs .button');
      await formButton.click();
      await fillTestForm(this.app.client);
      const testButton = await this.app.client.$('#form-tests .button');
      await testButton.click();
      const kolResult = await this.app.client.$('#kol-results');
      const dpResult = await kolResult.$('#dp-result');
      const dp = await dpResult.getText();
      expect(dp).to.deep.equal("0.13");
      const dmResult = await kolResult.$('#dm-result');
      const dm = await dmResult.getText();
      expect(dm).to.deep.equal("0.015000000000000013");
      const drResult = await kolResult.$('#dr-result');
      const dr = await drResult.getText();
      expect(dr).to.deep.equal("0.13");
      const conclusion = await kolResult.$('#kol-conclusion span');
      const conclusionText = await conclusion.getText();
      expect(conclusionText).to.deep.equal("ACEPTA");
    });
  });
});

describe('Kolmogorov Smirnov View Tests in GM', function () {

  describe('validates example', function () {

    env.openAndCloseApp();
    this.timeout(10000);

    it('displays correct validation in results.', async function () {
      await visitModel(this.app.client, "gm.html");
      await fillInputFormGM(this.app.client, 4, 5, 11, 50);
      const formButton = await this.app.client.$('#form-inputs .button');
      await formButton.click();
      await fillTestForm(this.app.client);
      const testButton = await this.app.client.$('#form-tests .button');
      await testButton.click();
      const kolResult = await this.app.client.$('#kol-results');
      const dpResult = await kolResult.$('#dp-result');
      const dp = await dpResult.getText();
      expect(dp).to.deep.equal("0.3454545454545455");
      const dmResult = await kolResult.$('#dm-result');
      const dm = await dmResult.getText();
      expect(dm).to.deep.equal("0.09090909090909091");
      const drResult = await kolResult.$('#dr-result');
      const dr = await drResult.getText();
      expect(dr).to.deep.equal("0.3454545454545455");
      const conclusion = await kolResult.$('#kol-conclusion span');
      const conclusionText = await conclusion.getText();
      expect(conclusionText).to.deep.equal("RECHAZA");
    });
  });
});
