/**
 * Result from a MCM generator.
 * @class ResultMCM
 * @type {Object}
 * @property {Array.<Number>} results The random numbers generated.
 * @property {String} error Error description or null if no errors found.
 * @param {Array.<Number>} randoms The random numbers generated.
 * @param {String} error Error description or null if no errors found.
 * */
class ResultMCM {
  constructor(results, error) {
    this.randoms = results;
    this.error = error;
  }
}

/**
 * Metodo Congruencial Mixto Generator.
 * @class Mcm
 * @type {Object}
 * @property {Array.<Number>} results The random numbers generated.
 * */
class Mcm {
  constructor() {
    this.results = [];
  }

  /**
   * Generate random numbers for Metodo Congruencial Mixto..
   * @param {Number} x0 The seed.
   * @param {Number} a Multiplier.
   * @param {Number} c Increment.
   * @param {Number} m Mod.
   * @param {Number} i Number of iterations.
   * @returns {ResultMCM} All the generated random in the iterations.
   * */
  generate(x0, a, c, m, i) {
    // There cant be a mod 0.
    if (m == 0) {
      return new ResultMCM([], "ZeroModuleError");
    }

    // Calculate mcm: Xi+1 = (aXi + c) mod m for i e N.
    let xn = x0;
    for (let j = 0; j < i; j++) {
      xn = (a * xn + c) % m
      this.results.push(xn);
    }
    return new ResultMCM(this.results, null);
  }
}

module.exports = Mcm
