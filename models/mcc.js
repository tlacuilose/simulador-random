/**
 * Result from a Mcc generator.
 * @class ResultMcc
 * @type {Object}
 * @property {Array.<Number>} randoms The random numbers generated.
 * @property {String} error Error description or null if no errors found.
 * @param {Array.<Number>} randoms The random numbers generated.
 * @param {String} error Error description or null if no errors found.
 * */
 function ResultMCC(randoms, error) {
    this.randoms = randoms;
    this.error = error;
  }
  
  /**
   * Metodo Centros Cuadrados
   * @class Mcc
   * @type {Object}
   * @property {Array.<Number>} randoms The random numbers generated.
   * */
  function Mcc() {
    this._randoms = [];
  
    /**
     * Get randoms generated by the model.
     * @memberof Mcc
     * @returns {Array.<Number>} The last randoms generated by the model.
     * */
    this.getRandoms = function() {
      return this._randoms;
    }
  
    /**
     * Generate random numbers for Metodo Centros Cuadrados.
     * @memberof Mcc
     * @param {Number} x0 The seed.
     * @param {Number} i Number of iterations.
     * @returns {ResultMCC} All the generated random in the iterations.
     * */
    this.generate = function(x0, i) {
      if (i<0){
        return new ResultMCC([], "NegativeNumberError");
      }
      if (x0<1000 || x0>9999){
        return new ResultMCC([], "WrongSeedError");
      }
      // Clear saved randoms.
      this._randoms = [];
  
      // Calculate mcc.
      let xn = x0;
      for (let j = 0; j < i; j++) {
        xn = (xn * xn);
        alt = Math.floor(xn/100)-Math.floor(xn/1000000)*10000;
        xn = alt;
        this._randoms.push(alt);
      }
      return new ResultMCC(this._randoms, null);
    }
  
  }
  
  if (typeof module !== "undefined") {
    module.exports = Mcc;
  }
  