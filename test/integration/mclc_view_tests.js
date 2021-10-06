const expect = require('chai').expect

const env = require('./tests_env.js');

var visitMCLC = async function(client) {
  const mButton = await client.$('a.button[href="mclc.html"');
  await mButton.click();
}

var fillInputForm = async function(client, seed1, seed2, a1, a2, m1, m2, m, i) {
  const s1Input = await client.$('#form-inputs input[name="seed1"]');
  await s1Input.setValue(seed1);
  const s2Input = await client.$('#form-inputs input[name="seed2"]');
  await s2Input.setValue(seed2);
  const a1Input = await client.$('#form-inputs input[name="a1"]');
  await a1Input.setValue(a1);
  const a2Input = await client.$('#form-inputs input[name="a2"]');
  await a2Input.setValue(a2);
  const m1Input = await client.$('#form-inputs input[name="m1"]');
  await m1Input.setValue(m1);
  const m2Input = await client.$('#form-inputs input[name="m2"]');
  await m2Input.setValue(m2);
  const mInput = await client.$('#form-inputs input[name="m"]');
  await mInput.setValue(m);
  const iInput = await client.$('#form-inputs input[name="i"]');
  await iInput.setValue(i);
}

describe('MCLC View Tests', function () {

  describe('has mclc view', function () {

    this.timeout(60000);
    env.openAndCloseApp();

    it('navigates to mclc screen', async function () {
      const mButton = await this.app.client.$('a.button[href="mclc.html"');
      expect(mButton).to.exist;
      await mButton.click();
      const windowtitle = await this.app.client.getTitle();
      expect(windowtitle).to.equal('SemRand - Congruencial Lineal Combinado');
      const title = await this.app.client.$('.is-title');
      const generatorTitle = await title.getText();
      expect(generatorTitle).to.equal('Método Congruencial Lineal Combinado')
    });

    it('has inputs for seed1, seed2, a1, a2, m1, m2, m, i', async function () {
      const s1Input = await this.app.client.$('#form-inputs input[name="seed1"]');
      expect(s1Input).to.exist;
      const s2Input = await this.app.client.$('#form-inputs input[name="seed2"]');
      expect(s2Input).to.exist;
      const a1Input = await this.app.client.$('#form-inputs input[name="a1"]');
      expect(a1Input).to.exist;
      const a2Input = await this.app.client.$('#form-inputs input[name="a2"]');
      expect(a2Input).to.exist;
      const m1Input = await this.app.client.$('#form-inputs input[name="m1"]');
      expect(m1Input).to.exist;
      const m2Input = await this.app.client.$('#form-inputs input[name="m2"]');
      expect(m2Input).to.exist;
      const mInput = await this.app.client.$('#form-inputs input[name="m"]');
      expect(mInput).to.exist;
      const iInput = await this.app.client.$('#form-inputs input[name="i"]');
      expect(iInput).to.exist;
    });

    let expectedHeaders = ['Sem. X1', 'Sem. X2', 'X1', 'X2', 'X', 'Random Ri'];
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

  describe('runs class example seed1=1, seed2=3, a1=3, a2=5, m1=5, m2=7, m=7, i=5', function () {

    env.openAndCloseApp();
    this.timeout(10000);

    let randomsColumn = 2; // Start on 0.
    let expectedRandoms = ["2", "6", "5", "2", "1"];
    it('displays correct randoms in table', async function () {
      await visitMCM(this.app.client);
      await fillInputForm(this.app.client, 1, 3, 3, 5, 5, 7, 7, 5);
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
