const expect = require('chai').expect

const env = require('./tests_env.js');

var visitMC = async function(client) {
  const mcButton = await client.$('a.button[href="mc.html"');
  await mcButton.click();
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

describe('MC View Tests', function () {

  describe('has mc view', function () {

    this.timeout(60000);
    env.openAndCloseApp();

    it('navigates to mc screen', async function () {
      const mcButton = await this.app.client.$('a.button[href="mc.html"');
      expect(mcButton).to.exist;
      await mcButton.click();
      const windowtitle = await this.app.client.getTitle();
      expect(windowtitle).to.equal('SemRand - Congruencial Lineal');
      const title = await this.app.client.$('.is-title');
      const generatorTitle = await title.getText();
      expect(generatorTitle).to.equal('Método Congruencial Lineal')
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

    let expectedHeaders = ['Semilla', 'Generador', 'No. Aleatorio', 'Random Ri'];
    it('has table with headers: ' + Array.toString(expectedHeaders), async function () {
      const table = await this.app.client.$('.table-container.is-header table');
      expect(table).to.exist;
      const headerRow = await table.$('tr');
      expect(headerRow).to.exist;
      const headers = await headerRow.$$('th');
      expect(headers.length).to.equal(expectedHeaders.length);
      let titles = [];
      for (let i = 0; i < headers.length; i++) {
        const text = await headers[i].getText();
        titles.push(text);
      }
      expect(titles).to.deep.equal(expectedHeaders);
    })
  });

  describe('runs class example x0 = 4, a = 5, c = 7, m = 8, i = 5', function () {

    env.openAndCloseApp();
    this.timeout(10000);

    let randomsColumn = 2; // Start on 0.
    let expectedRandoms = ["X1=3", "X2=6", "X3=5", "X4=0", "X5=7"];
    it('displays correct randoms in table', async function () {
      await visitMC(this.app.client);
      await fillInputForm(this.app.client, 4, 5, 7, 8, 5);
      const formButton = await this.app.client.$('#form-inputs .button');
      await formButton.click();
      const table = await this.app.client.$('.table-container:not(.is-header) table');
      const rows = await table.$$('tr');
      expect(rows.length).to.equal(5); // Expect same as i.
      let results = [];
      for (let i = 0; i < rows.length; i++) {
        const resultColumns = await rows[i].$$('td');
        expect(resultColumns).to.exist;
        const random = await resultColumns[randomsColumn].getText();
        results.push(random);
      }
      expect(results).to.deep.equal(expectedRandoms);
    });
  });
});
