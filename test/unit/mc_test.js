const expect = require('chai').expect
const Mc = require('../../models/mc.js');

describe('MC Model Unit Tests', () => {

  // Number of iterations in tests.
  let n0 = 5;
  let n1 = 4;

  describe('create', () => {
    let mc = new Mc();
    it('should create an instance', () => {
      expect(mc).to.exist;
    });
  });

  describe('error', () => {
    let mc = new Mc();

    it('should return error ZeroModuleError when module is 0', () => {
      let finalResult = mc.generate(0, 0, 0, 0, n0);
      expect(finalResult.error).to.equal('ZeroModuleError');
    });

    it('should return null error when module is not 0', () => {
      let finalResult = mc.generate(0, 0, 0, 1, n0);
      expect(finalResult.error).to.be.null;
    });
  });

  describe('generate with zeroes and n positive iterations', () => {
    let mc = new Mc();
    let finalResult = mc.generate(0, 0, 0, 1, n0);
    
    it('should generate n randoms', () => {
      expect(finalResult.randoms).to.have.lengthOf(n0);
    });

    it('should generate all zeros', () => {
      let expectedResult = Array(n0).fill(0);
      expect(finalResult.randoms).to.deep.equal(expectedResult);
    });
  });

  describe('generate with no iterations', () => {
    let mc = new Mc();
    let finalResult = mc.generate(0, 0, 0, 1, 0);
    it('should have empty randoms', () => {
      expect(finalResult.randoms).to.be.empty;
    });
  });

  describe('generate with zero module', () => {
    let mc = new Mc();
    let finalResult = mc.generate(0, 0, 0, 0, n0);
    it('should have empty randoms', () => {
      expect(finalResult.randoms).to.be.empty;
    });
  });

  describe('change randoms after every generation', () => {
    let mc = new Mc();

    it('should have empty randoms when no iterations have passed', () => {
      mc.generate(0, 0, 0, 1, n0);
      mc.generate(0, 0, 0, 1, 0);
      expect(mc.getRandoms()).to.be.empty;
    });

    it('should have previous values when zero module is passed', () => {
      let firstResult = mc.generate(0, 0, 0, 1, n0);
      mc.generate(0, 0, 0, 0, n0);
      expect(mc.getRandoms()).to.equal(firstResult.randoms);
    });

    it('should have new number of randoms', () => {
      mc.generate(0, 0, 0, 1, n0);
      mc.generate(0, 0, 0, 1, n1);
      expect(mc.getRandoms()).to.have.lengthOf(n1);
    });
  });

  describe('class example x0=4, a=5, c=7, m=8, i=5', () => {
    let mc = new Mc();
    let x0 = 4, a = 5, c = 7, m = 8, i = 5;
    let expectedRandoms = [3, 6, 5, 0, 7];
    let finalResult = mc.generate(x0, a, c, m, i);

    it('should return a null error', () => {
      expect(finalResult.error).to.be.null;
    });

    it('should return correct values', () => {
      expect(finalResult.randoms).to.deep.equal(expectedRandoms);
    });
  });
});

