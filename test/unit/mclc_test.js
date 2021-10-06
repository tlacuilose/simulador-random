const expect = require('chai').expect
const Mclc = require('../../models/mclc.js');

describe('MCLC Model Unit Tests', () => {

  // Number of iterations in tests.
  let n0 = 5;
  let n1 = 4;

  describe('create', () => {
    let mclc = new Mclc();
    it('should create an instance', () => {
      expect(mclc).to.exist;
    });
  });

  describe('error', () => {
    let mclc = new Mclc();

    it('should return error ZeroModuleError when module is 0', () => {
      let finalResult = mclc.generate(0, 0, 0, 0, 0, 0, 0, n0);
      expect(finalResult.error).to.equal('ZeroModuleError');
    });

    it('should return null error when module is not 0', () => {
      let finalResult = mclc.generate(1, 3, 3, 5, 5, 7, 7, n0);
      expect(finalResult.error).to.be.null;
    });
  });

  describe('generate n positive iterations', () => {
    let mclc = new Mclc();
    let finalResult = mclc.generate(1, 3, 3, 5, 5, 7, 7, n0);
    
    it('should generate n randoms', () => {
      expect(finalResult.randoms).to.have.lengthOf(n0);
    });
  });

  describe('generate with no iterations', () => {
    let mclc = new Mclc();
    let finalResult = mclc.generate(1, 3, 3, 5, 5, 7, 7, 0);
    it('should have empty randoms', () => {
      expect(finalResult.randoms).to.be.empty;
    });
  });

  describe('generate with zero module', () => {
    let mclc = new Mclc();
    let finalResult = mclc.generate(1, 3, 3, 5, 5, 7, 0, n0);
    it('should have empty randoms', () => {
      expect(finalResult.randoms).to.be.empty;
    });
  });

  describe('change randoms after every generation', () => {
    let mclc = new Mclc();

    it('should have empty randoms when no iterations have passed', () => {
      mclc.generate(1, 3, 3, 5, 5, 7, 7, n0);
      mclc.generate(1, 3, 3, 5, 5, 7, 7, 0);
      expect(mclc.getRandoms()).to.be.empty;
    });

    it('should have previous values when zero module is passed', () => {
      let firstResult = mclc.generate(1, 3, 3, 5, 5, 7, 7, n0);
      mclc.generate(1, 3, 3, 5, 5, 7, 0, n0);
      expect(mclc.getRandoms()).to.equal(firstResult.randoms);
    });

    it('should have new number of randoms', () => {
      mclc.generate(1, 3, 3, 5, 5, 7, 7, n0);
      mclc.generate(1, 3, 3, 5, 5, 7, 7, n1);
      expect(mclc.getRandoms()).to.have.lengthOf(n1);
    });
  });

  describe('class example seed1=1, seed2=3, a1=3, a2=5, m1=5, m2=7, m=7, i=5', () => {
    let mclc = new Mclc();
    let seed1 = 1, seed2 = 3, a1 = 3, a2 = 5, m1 = 5, m2 = 7, m = 7, i = 5;
    let expectedRandoms = [2, 6, 5, 2, 1];
    let finalResult = mclc.generate(seed1, seed2, a1, a2, m1, m2, m, i);

    it('should return a null error', () => {
      expect(finalResult.error).to.be.null;
    });

    it('should return correct values', () => {
      expect(finalResult.randoms).to.deep.equal(expectedRandoms);
    });
  });
});
