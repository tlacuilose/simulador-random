/**
 * Result from a Kolmogorov-Smirnov test
 * @class ResultKolsmi
 * @type {Object}
 * @property {Number} dp D+ result
 * @property {Number} dm D- result
 * @property {Number} dr D result
 * @property {Number} dr DA result
 * @property {Number} acceptance Calculated acceptance
 * @param {Number} dp D+ result
 * @param {Number} dm D- result
 * @param {Number} dr D result
 * @param {Number} dr DA result
 * @param {Number} acceptance Calculated acceptance
 * */
function ResultKolsmi(dp, dm, dr, da, acceptance, error) {
  this.dp = dp;
  this.dm = dm;
  this.dr = dr;
  this.da = da;
  this.acceptance = acceptance;
  this.error = error;
}

/**
 * Kolmogorov-Smirnov test.
 * @class Kolsmi
 * @type {Object}
 * @property {Array.<Number>} Ri_s The Randoms from 0 to 1
 * */
function Kolsmi() {
  this._Ri_s = [];
  this._alpha = "";

  /**
   * Evaluate a set of Ri from a generated randoms.
   * @memberof Kolsmi
   * @param {Array.<Number>} Ri_s The Randoms from 0 to 1.
   * @returns {ResultKolsmi} The resulting variables of the Kolmogorov-Smirnov test.
   * */
  this.test = function(Ri_s, alpha) {

    if (Ri_s.length == 0) {
      return new ResultKolsmi(0, 0, false, "NORANDOMS");
    }

    // Set values
    this._Ri_s = Ri_s;
    this._alpha = alpha;

    // Sort the array.
    let Ri_sorted = [...this._Ri_s].sort();

    let n = Ri_sorted.length;

    let sn = 0;
    let d_curr = [];
    let d_last = [];

    for (let i = 1; i < (n + 1); i++) {
      let si = i / n;
      // i/N - Ri
      d_curr.push(si - Ri_sorted[i-1]);
      // (i - 1)/N - Ri
      d_last.push(Ri_sorted[i-1] - sn);
      sn = si;
    }
    let dp = Math.max.apply(Math, d_curr);
    let dm = Math.max.apply(Math, d_last);
    let dr = Math.max(dp, dm);

    let da = this._calcDA(n);
    let accept = dr < da;

    return new ResultKolsmi(dp, dm, dr, da, accept, null);
  }

  // Calculate Dalpha
  this._calcDA = function(n) {
    if (n <= 40) {
      return KOL_TABLE[n-1][AALPHA_MAP[this._alpha]];
    } else {
      calcs = [1.22/Math.sqrt(n), 1.36/Math.sqrt(n), 1.51/Math.sqrt(n), 1.63/Math.sqrt(n)];
      return calcs[AALPHA_MAP[this._alpha]];
    }
  }
}

if (typeof module !== "undefined") {
  module.exports = Kolsmi;
}

const AALPHA_MAP = {"0.1": 0, "0.05": 1, "0.02": 2, "0.01": 3}

const KOL_TABLE = [
	[0.95, 0.975, 0.99, 0.995], 
	[0.77639, 0.84189, 0.9, 0.92929], 
	[0.63604, 0.7076, 0.78456, 0.829], 
	[0.56522, 0.62394, 0.68887, 0.73424], 
	[0.50945, 0.56328, 0.62718, 0.66853], 
	[0.46799, 0.51926, 0.57741, 0.61661], 
	[0.43607, 0.48342, 0.53844, 0.57581], 
	[0.40962, 0.45427, 0.50654, 0.54179], 
	[0.38746, 0.43001, 0.4796, 0.51332], 
	[0.36866, 0.40925, 0.45662, 0.48893], 
	[0.35242, 0.39122, 0.4367, 0.4677], 
	[0.33815, 0.37543, 0.41918, 0.44905], 
	[0.32549, 0.36143, 0.40362, 0.43247], 
	[0.31417, 0.3489, 0.3897, 0.41762], 
	[0.30397, 0.3376, 0.37713, 0.4042], 
	[0.29472, 0.32733, 0.36571, 0.39201], 
	[0.28627, 0.31796, 0.35528, 0.38086], 
	[0.27851, 0.30936, 0.34569, 0.37062], 
	[0.27136, 0.30143, 0.33685, 0.36117], 
	[0.26473, 0.29408, 0.32866, 0.35241], 
	[0.25858, 0.28724, 0.32104, 0.34427], 
	[0.25283, 0.28087, 0.31394, 0.33666], 
	[0.24746, 0.2749, 0.30728, 0.32954], 
	[0.24242, 0.26931, 0.30104, 0.32286], 
	[0.23768, 0.26404, 0.29516, 0.31657], 
	[0.2332, 0.25907, 0.28962, 0.31064], 
	[0.22898, 0.25438, 0.28438, 0.30502], 
	[0.22497, 0.24993, 0.27942, 0.29971], 
	[0.22117, 0.24571, 0.27471, 0.29466], 
	[0.21756, 0.2417, 0.27023, 0.28987], 
	[0.21412, 0.23788, 0.26596, 0.2853], 
	[0.21085, 0.23424, 0.26189, 0.28094], 
	[0.20771, 0.23076, 0.25801, 0.27677], 
	[0.20472, 0.22743, 0.25429, 0.27279], 
	[0.20185, 0.22425, 0.26073, 0.26897], 
	[0.1991, 0.22119, 0.24732, 0.26532], 
	[0.19646, 0.21826, 0.24404, 0.2618], 
	[0.19392, 0.21544, 0.24089, 0.25843], 
	[0.19148, 0.21273, 0.23786, 0.25518], 
	[0.18913, 0.21012, 0.23494, 0.25205]
];
