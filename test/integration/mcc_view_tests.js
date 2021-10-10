const expect = require('chai').expect

const env = require('./tests_env.js');

var visitMCC = async function(client) {
  const mButton = await client.$('a.button[href="mcc.html"');
  await mButton.click();
}

var fillInputForm = async function(client, x0, i) {
  const x0Input = await client.$('#form-inputs input[name="x0"]');
  await x0Input.setValue(x0);
  const iInput = await client.$('#form-inputs input[name="i"]');
  await iInput.setValue(i);
}

describe('MCC View Tests', function () {

  describe('has mcc view', function () {

    this.timeout(60000);
    env.openAndCloseApp();

    it('navigates to mcc screen', async function () {
      const mButton = await this.app.client.$('a.button[href="mcc.html"');
      expect(mButton).to.exist;
      await mButton.click();
      const windowtitle = await this.app.client.getTitle();
      expect(windowtitle).to.equal('SemRand - Centros Cuadarados');
      const title = await this.app.client.$('.is-title');
      const generatorTitle = await title.getText();
      expect(generatorTitle).to.equal('Método de los Centros Cuadrados')
    });

    it('has inputs for x0, i', async function () {
      const x0Input = await this.app.client.$('#form-inputs input[name="x0"]');
      expect(x0Input).to.exist;
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

  describe('runs class example x0 = 3547, i = 5', function () {

    env.openAndCloseApp();
    this.timeout(10000);

    let randomsColumn = 2; // Start on 0.
    let expectedRandoms = ["X1=5812", "X2=7793", "X3=7308", "X4=4068", "X5=5486"];
    it('displays correct randoms in table', async function () {
      await visitMCC(this.app.client);
      await fillInputForm(this.app.client, 3547, 5);
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
