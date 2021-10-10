const expect = require('chai').expect
const Mcm = require('../../models/mcm.js');

describe('MCM Model Unit Tests', () => {

  // Number of iterations in tests.
  let n0 = 5;
  let n1 = 4;

  describe('create', () => {
    let mcm = new Mcm();
    it('should create an instance', () => {
      expect(mcm).to.exist;
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
      expect(mcm.getRandoms()).to.be.empty;
    });

    it('should have previous values when zero module is passed', () => {
      let firstResult = mcm.generate(0, 0, 0, 1, n0);
      mcm.generate(0, 0, 0, 0, n0);
      expect(mcm.getRandoms()).to.equal(firstResult.randoms);
    });

    it('should have new number of randoms', () => {
      mcm.generate(0, 0, 0, 1, n0);
      mcm.generate(0, 0, 0, 1, n1);
      expect(mcm.getRandoms()).to.have.lengthOf(n1);
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

  describe('hull dobell validation of class example', () => {
    let mcm = new Mcm();
    let x0 = 4, a = 5, c = 7, m = 8, i = 5;
    mcm.generate(x0, a, c, m, i);
    let validationResult = mcm.validateHullDobell();

    it('should expect c and m to be coprime', () => {
      expect(validationResult.first).to.be.true;
    });

    it('should expect a≈1modq for q a prime factor of m', () => {
      expect(validationResult.second).to.be.true;
    });

    it('should expect that 4 divides m and a ≈ 1mod4', () => {
      expect(validationResult.third).to.be.true;
    });
  });

  describe('hull dobell failed validation of example, x0=37, a=7, c=29, m=100, i=10', () => {
    let mcm = new Mcm();
    let x0 = 37, a = 7, c = 29, m = 100, i = 10;
    mcm.generate(x0, a, c, m, i);
    let validationResult = mcm.validateHullDobell();

    it('should expect c and m to be coprime', () => {
      expect(validationResult.first).to.be.true;
    });

    it('should expect to fail a≈1modq for q a prime factor of m', () => {
      expect(validationResult.second).to.be.false;
    });

    it('should expect that 4 divides m and a ≈ 1mod4', () => {
      expect(validationResult.third).to.be.false;
    });
  });

  describe('prime factorization', () => {
    let mcm = new Mcm();
    it('should return correct primes', () => {
      let result = mcm._prime_factors(12);
      let expected = [2, 3];
      expect(result).to.deep.equal(expected);
      result = mcm._prime_factors(84);
      expected = [2, 3, 7];
      expect(result).to.deep.equal(expected);
      result = mcm._prime_factors(65);
      expected = [5, 13];
      expect(result).to.deep.equal(expected);
      result = mcm._prime_factors(31);
      expected = [31];
      expect(result).to.deep.equal(expected);
      result = mcm._prime_factors(5);
      expected = [5];
      expect(result).to.deep.equal(expected);
      result = mcm._prime_factors(32);
      expected = [2];
      expect(result).to.deep.equal(expected);
      result = mcm._prime_factors(21);
      expected = [3, 7];
      expect(result).to.deep.equal(expected);
      result = mcm._prime_factors(9791);
      expected = [9791];
      expect(result).to.deep.equal(expected);
      result = mcm._prime_factors(9792);
      expected = [2, 3, 17];
      expect(result).to.deep.equal(expected);
    });
  });
});
