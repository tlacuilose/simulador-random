/**
 * Result from a MC generator.
 * @class ResultMC
 * @type {Object}
 * @property {Array.<Number>} randoms The random numbers generated.
 * @property {String} error Error description or null if no errors found.
 * @param {Array.<Number>} randoms The random numbers generated.
 * @param {String} error Error description or null if no errors found.
 * */
function ResultMC(randoms, error) {
  this.randoms = randoms;
  this.error = error;
}

/**
 * Metodo Congruencial Generator.
 * @class Mc
 * @type {Object}
 * @property {Array.<Number>} randoms The random numbers generated.
 * @property {Number} x0 The seed.
 * @property {Number} a Multiplier.
 * @property {Number} c Increment.
 * @property {Number} m Mod.
 * @property {Number} i Number of iterations.
 * */
function Mc() {
  this._randoms = [];
  this._x0 = 0;
  this._a = 0;
  this._c = 0;
  this._m = 0;
  this._i = 0;

  /**
   * Get randoms generated by the model.
   * @memberof Mc
   * @returns {Array.<Number>} The last randoms generated by the model.
   * */
  this.getRandoms = function() {
    return this._randoms;
  }

  /**
   * Get ri values generated by the model.
   * @memberof Mc
   * @returns {Array.<Number>} The last ris generated by the model.
   * */
  this.getRis = function() {
    let ris =  this._randoms.map((random) => random / this._m);
    return ris;
  }

  /**
   * Generate random numbers for Metodo Congruencial Mixto.
   * @memberof Mc
   * @param {Number} x0 The seed.
   * @param {Number} a Multiplier.
   * @param {Number} c Increment.
   * @param {Number} m Mod.
   * @param {Number} i Number of iterations.
   * @returns {ResultMC} All the generated random in the iterations.
   * */
  this.generate = function(x0, a, c, m, i) {

    // Save  new values.
    this._x0 = x0, this._a = a, this._c = c, this._m = m, this._i = i;
    // There cant be a mod 0.
    if (m == 0) {
      return new ResultMC([], "ZeroModuleError");
    }
    // Clear saved randoms.
    this._randoms = [];

    // Calculate mc: Xi+1 = (aXi + c) mod m for i e N.
    let xn = x0;
    for (let j = 0; j < i; j++) {
      xn = (a * xn + c) % m
      this._randoms.push(xn);
    }
    return new ResultMC(this._randoms, null);
  }
}

if (typeof module !== "undefined") {
  module.exports = Mc;
}

