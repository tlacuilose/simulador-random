const expect = require('chai').expect
const Mcc = require('../../models/mcc.js');

describe('MCC Model Unit Tests', () => {

  // Number of iterations in tests.
  let n0 = 5;
  let n1 = 4;

  describe('create', () => {
    let mcc = new Mcc();
    it('should create an instance', () => {
      expect(mcc).to.exist;
    });
  });

  describe('error', () => {
    let mcc = new Mcc();

    it('should return error WrongSeedError if seed is not a 4 digit number', () => {
      let finalResult = mcc.generate(0, n0);
      expect(finalResult.error).to.equal('WrongSeedError');
    });

    it('should return error NegativeNumberError if iterations are negative', () => {
        let finalResult = mcc.generate(3547, -1);
        expect(finalResult.error).to.equal('NegativeNumberError');
      });

    it('should return null error when data is valid', () => {
      let finalResult = mcc.generate(3547, n0);
      expect(finalResult.error).to.be.null;
    });
  });

  describe('generate with n positive iterations', () => {
    let mcc = new Mcc();
    let finalResult = mcc.generate(3547, n0);
    
    it('should generate n randoms', () => {
      expect(finalResult.randoms).to.have.lengthOf(n0);
    });
  });

  describe('generate with no iterations', () => {
    let mcc = new Mcc();
    let finalResult = mcc.generate(3547, 0);
    it('should have empty randoms', () => {
      expect(finalResult.randoms).to.be.empty;
    });
  });

  describe('change randoms after every generation', () => {
    let mcc = new Mcc();

    it('should have empty randoms when no iterations have passed', () => {
      mcc.generate(3547, n0);
      mcc.generate(3547, 0);
      expect(mcc.getRandoms()).to.be.empty;
    });

    it('should have previous values when wrong seed is passed', () => {
      let firstResult = mcc.generate(3547, n0);
      mcc.generate(0, n0);
      expect(mcc.getRandoms()).to.equal(firstResult.randoms);
    });

    it('should have new number of randoms', () => {
      mcc.generate(3547, n0);
      mcc.generate(3547, n1);
      expect(mcc.getRandoms()).to.have.lengthOf(n1);
    });
  });

  describe('class example x0=3547, i=5', () => {
    let mcc = new Mcc();
    let x0 = 3547, i = 5;
    let expectedRandoms = [5812, 7793, 7308, 4068, 5486];
    let finalResult = mcc.generate(x0, i);

    it('should return a null error', () => {
      expect(finalResult.error).to.be.null;
    });

    it('should return correct values', () => {
      expect(finalResult.randoms).to.deep.equal(expectedRandoms);
    });
  });
});
