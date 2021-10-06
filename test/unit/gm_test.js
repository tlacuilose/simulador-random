const expect = require('chai').expect
const Gm = require('../../models/gm.js');

describe('GM Model Unit Tests', () => {

  // Number of iterations in tests.
  let n0 = 5;
  let n1 = 4;

  describe('create', () => {
    let gm = new Gm();
    it('should create an instance', () => {
      expect(gm).to.exist;
    });
  });

  describe('error', () => {
    let gm = new Gm();

    it('should return error ZeroModuleError when module is 0', () => {
      let finalResult = gm.generate(0, 0, 0, n0);
      expect(finalResult.error).to.equal('ZeroModuleError');
    });

    it('should return null error when module is not 0', () => {
      let finalResult = gm.generate(0, 0, 1, n0);
      expect(finalResult.error).to.be.null;
    });
  });

  describe('generate with zeroes and n positive iterations', () => {
    let gm = new Gm();
    let finalResult = gm.generate(0, 0, 1, n0);
    
    it('should generate n randoms', () => {
      expect(finalResult.randoms).to.have.lengthOf(n0);
    });

    it('should generate all zeros', () => {
      let expectedResult = Array(n0).fill(0);
      expect(finalResult.randoms).to.deep.equal(expectedResult);
    });
  });

  describe('generate with no iterations', () => {
    let gm = new Gm();
    let finalResult = gm.generate(0, 0, 1, 0);
    it('should have empty randoms', () => {
      expect(finalResult.randoms).to.be.empty;
    });
  });

  describe('generate with zero module', () => {
    let gm = new Gm();
    let finalResult = gm.generate(0, 0, 0, n0);
    it('should have empty randoms', () => {
      expect(finalResult.randoms).to.be.empty;
    });
  });

  describe('change randoms after every generation', () => {
    let gm = new Gm();

    it('should have empty randoms when no iterations have passed', () => {
      gm.generate(0, 0, 1, n0);
      gm.generate(0, 0, 1, 0);
      expect(gm.getRandoms()).to.be.empty;
    });

    it('should have previous values when zero module is passed', () => {
      let firstResult = gm.generate(0, 0, 1, n0);
      gm.generate(0, 0, 0, n0);
      expect(gm.getRandoms()).to.equal(firstResult.randoms);
    });

    it('should have new number of randoms', () => {
      gm.generate(0, 0, 1, n0);
      gm.generate(0, 0, 1, n1);
      expect(gm.getRandoms()).to.have.lengthOf(n1);
    });
  });

  describe('class example x0=4, a=5, c=7, m=8, i=5', () => {
    let gm = new Gm();
    let x0 = 4, a = 5, m = 11, i = 5;
    let expectedRandoms = [9, 1, 5, 3, 4];
    let finalResult = gm.generate(x0, a, m, i);

    it('should return a null error', () => {
      expect(finalResult.error).to.be.null;
    });

    it('should return correct values', () => {
      expect(finalResult.randoms).to.deep.equal(expectedRandoms);
    });
  });
});
