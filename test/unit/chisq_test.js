const expect = require('chai').expect
const Chisq = require('../../models/chisq.js');

describe('Chi Squared Unit Tests', () => {

  describe('create', () => {
    let cs = new Chisq();
    it('should create an instance', () => {
      expect(cs).to.exist;
    });
  });

  describe('example test of  [0.44, 0.81, 0.14, 0.05, 0.93]', () => {
    let Ri_s = [0.411, 0.819, 0.191, 0.037, 0.894, 0.575, 0.073, 0.281, 0.408, 0.541, 0.995, 0.233, 0.553, 0.469, 0.392, 0.598, 0.434, 0.668, 0.719, 0.791, 0.213, 0.077, 0.671, 0.156, 0.383, 0.771, 0.914, 0.826, 0.018, 0.984];
    let cs = new Chisq();
    let csResult = cs.test(Ri_s, "0.05");
    it('should expect x0 to equal 1', () => {
      expect(csResult.x0).to.equal(1);
    });

    it('should expect xA to equal 9.488', () => {
      expect(csResult.xA).to.equal(9.488);
    });

    it('should expect to accept h0', () => {
      expect(csResult.acceptance).to.be.true;
    })
  });
});
