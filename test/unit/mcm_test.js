const expect = require('chai').expect
const Mcm = require('../../models/mcm.js');

describe('MCM Model Unit Tests', () => {

  // Number of iterations in tests.
  let n0 = 5;
  let n1 = 4;

  describe('create', () => {
    let mcm = new Mcm();
    it('should have empty randoms', () => {
      expect(mcm.randoms).to.be.empty;
    });
  });

  describe('error', () => {
    let mcm = new Mcm();

    it('should return error ZeroModuleError when module is 0', () => {
      let finalResult = mcm.generate(0, 0, 0, 0, n0);
      expect(finalResult.error).to.equal('ZeroModuleError');
    });

    it('should return null error when module is not 0', () => {
      let finalResult = mcm.generate(0, 0, 0, 1, n0);
      expect(finalResult.error).to.be.null;
    });
  });

  describe('generate with zeroes and n positive iterations', () => {
    let mcm = new Mcm();
    let finalResult = mcm.generate(0, 0, 0, 1, n0);
    
    it('should generate n randoms', () => {
      expect(finalResult.randoms).to.have.lengthOf(n0);
    });

    it('should generate all zeros', () => {
      let expectedResult = Array(n0).fill(0);
      expect(finalResult.randoms).to.deep.equal(expectedResult);
    });
  });

  describe('generate with no iterations', () => {
    let mcm = new Mcm();
    let finalResult = mcm.generate(0, 0, 0, 1, 0);
    it('should have empty randoms', () => {
      expect(finalResult.randoms).to.be.empty;
    });
  });

  describe('generate with zero module', () => {
    let mcm = new Mcm();
    let finalResult = mcm.generate(0, 0, 0, 0, n0);
    it('should have empty randoms', () => {
      expect(finalResult.randoms).to.be.empty;
    });
  });

  describe('change randoms after every generation', () => {
    let mcm = new Mcm();

    it('should have empty randoms when no iterations have passed', () => {
      mcm.generate(0, 0, 0, 1, n0);
      mcm.generate(0, 0, 0, 1, 0);
      expect(mcm.randoms).to.be.empty;
    });

    it('should have previous values when zero module is passed', () => {
      let firstResult = mcm.generate(0, 0, 0, 1, n0);
      mcm.generate(0, 0, 0, 0, n0);
      expect(mcm.randoms).to.equal(firstResult.randoms);
    });

    it('should have new number of randoms', () => {
      mcm.generate(0, 0, 0, 1, n0);
      mcm.generate(0, 0, 0, 1, n1);
      expect(mcm.randoms).to.have.lengthOf(n1);
    });
  });

  describe('class example x0=4, a=5, c=7, m=8, i=5', () => {
    let mcm = new Mcm();
    let x0 = 4, a = 5, c = 7, m = 8, i = 5;
    let expectedRandoms = [3, 6, 5, 0, 7];
    let finalResult = mcm.generate(x0, a, c, m, i);

    it('should return a null error', () => {
      expect(finalResult.error).to.be.null;
    });

    it('should return correct values', () => {
      expect(finalResult.randoms).to.deep.equal(expectedRandoms);
    });
  });
});
