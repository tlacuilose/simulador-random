const expect = require('chai').expect
const Kolsmi = require('../../models/kolsmi.js');

describe('Kolmogorov-Smirnov Unit Tests', () => {

  describe('create', () => {
    let kol = new Kolsmi();
    it('should create an instance', () => {
      expect(kol).to.exist;
    });
  });

  describe('example test of  [0.44, 0.81, 0.14, 0.05, 0.93]', () => {
    let Ri_s = [0.44, 0.81, 0.14, 0.05, 0.93];
    let kol = new Kolsmi();
    let kolResult = kol.test(Ri_s, "0.05");
    it('should expect D+ to equal 1', () => {
      expect(kolResult.dp).to.closeTo(0.26, 0.01);
    });

    it('should expect D- to equal 9.488', () => {
      expect(kolResult.dm).to.closeTo(0.21, 0.01);
    });

    it('should expect D to equal 9.488', () => {
      expect(kolResult.dr).to.closeTo(0.26, 0.01);
    });

    it('should expect to accept h0', () => {
      expect(kolResult.acceptance).to.be.true;
    })
  });
});
