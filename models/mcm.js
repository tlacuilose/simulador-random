/**
 * Result from a MCM generator.
 * @class ResultMCM
 * @type {Object}
 * @property {Array.<Number>} randoms The random numbers generated.
 * @property {String} error Error description or null if no errors found.
 * @param {Array.<Number>} randoms The random numbers generated.
 * @param {String} error Error description or null if no errors found.
 * */
function ResultMCM(randoms, error) {
  this.randoms = randoms;
  this.error = error;
}

/**
 * Result from a MCM generator.
 * @class ResultMCM
 * @type {Object}
 * @property {boolean} first c and m are coprimes
 * @property {boolean} second a ≈ 1modq where 1 divides m.
 * @property {boolean} first m is divided by 4 and a ≈ 1mod4.
 * @param {boolean} first c and m are coprimes
 * @param {boolean} second a ≈ 1modq where 1 divides m.
 * @param {boolean} first m is divided by 4 and a ≈ 1mod4.
 * */
function ResultHullDobell(first, second, third) {
  this.first = first;
  this.second = second;
  this.third = third;
}

/**
 * Metodo Congruencial Mixto Generator.
 * @class Mcm
 * @type {Object}
 * @property {Array.<Number>} randoms The random numbers generated.
 * @property {Number} x0 The seed.
 * @property {Number} a Multiplier.
 * @property {Number} c Increment.
 * @property {Number} m Mod.
 * @property {Number} i Number of iterations.
 * */
function Mcm() {
  this._randoms = [];
  this._x0 = 0;
  this._a = 0;
  this._c = 0;
  this._m = 0;
  this._i = 0;

  /**
   * Get randoms generated by the model.
   * @memberof Mcm
   * @returns {Array.<Number>} The last randoms generated by the model.
   * */
  this.getRandoms = function() {
    return this._randoms;
  }

  /**
   * Get ri values generated by the model.
   * @memberof Mcm
   * @returns {Array.<Number>} The last ris generated by the model.
   * */
  this.getRis = function() {
    let ris =  this._randoms.map((random) => random / this._m);
    return ris;
  }

  /**
   * Generate random numbers for Metodo Congruencial Mixto.
   * @memberof Mcm
   * @param {Number} x0 The seed.
   * @param {Number} a Multiplier.
   * @param {Number} c Increment.
   * @param {Number} m Mod.
   * @param {Number} i Number of iterations.
   * @returns {ResultMCM} All the generated random in the iterations.
   * */
  this.generate = function(x0, a, c, m, i) {

    // Save  new values.
    this._x0 = x0, this._a = a, this._c = c, this._m = m, this._i = i;
    // There cant be a mod 0.
    if (m == 0) {
      return new ResultMCM([], "ZeroModuleError");
    }
    // Clear saved randoms.
    this._randoms = [];

    // Calculate mcm: Xi+1 = (aXi + c) mod m for i e N.
    let xn = x0;
    for (let j = 0; j < i; j++) {
      xn = (a * xn + c) % m
      this._randoms.push(xn);
    }
    return new ResultMCM(this._randoms, null);
  }
  
  /**
   * Validate Hull-Dobell
   * @memberof Mcm
   * @returns {ResultHullDobell} A set of three booleans representing rules validated.
   * */
  this.validateHullDobell = function() {

    // Validate that c and m are coprimers or gcd is 1.
    first = this._gcd_euclidean(this._c, this._m) == 1

    // Validate that a ≈ 1modq,  where q is a prime dividing m
    q_arr = this._prime_factors(this._m);
    second = true;
    for (const q of q_arr) {
      if (this._a % q !==  1) second = false;
    }

    // Validate that 4 divides m and a ≈ 1mod4
    third = (this._m % 4 == 0 && this._a % 4 == 1);

    return new ResultHullDobell(first, second, third);
  }

  /**
   * Find greatest common divisor
   * using euclidean algorithm
   * @memberof Mcm
   * @param {Number} a First number
   * @param {Number} b Second number
   * @returns {Number} gcd
   * */
  this._gcd_euclidean = function(a, b) {
    if (a == 0) return b;
    if (b == 0) return a; if (a == b) return a;
    return (a > b) ? this._gcd_euclidean(a-b, b) : this._gcd_euclidean(a, b-a);
  }

  /**
   * Find the unique prime factors of a number.
   * @memberof Mcm
   * @param {Number} a Number to factorize
   * @returns {Array.<Number>} the unique prime factors of a
   * */
  this._prime_factors= function(a) {
    prime_factors = [];


    // Get number of twos in the factors
    n = a;
    while (n % 2 == 0) {
      prime_factors.push(2);
      n = n / 2;
    }

    // Now the number is odd.
    // Find all prime factors that obey i + 2, up until sqrt(n)
    for (let i = 3; i < Math.floor(Math.sqrt(n)) + 1; i += 2) {
      while (n % i == 0) {
        prime_factors.push(i);
        n = n / i;
      }
    }

    // If n is not a prime number at least one prime factor would be less than sqrt(n)
    // If n is not a prime number, there can be at most 1 prime factor of n greater than sqrt(n)
    // Remaining number ends up being a prime factor greater than the sq rt.
    if (n > 2) {
      prime_factors.push(Math.floor(n));
    }
    return [...new Set(prime_factors)];
  }

}

if (typeof module !== "undefined") {
  module.exports = Mcm;
}
