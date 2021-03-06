/**
 * Result from a Chi Squared test.
 * @class ResultChisq
 * @type {Object}
 * @property {Number} x0 Calculated x0
 * @property {Number} xA Calculated xA
 * @property {Number} acceptance Calculated acceptance
 * @param {Number} x0 Calculated x0
 * @param {Number} xA Calculated xA
 * @param {Number} acceptance Calculated acceptance
 * */
function ResultChisq(x0, xA, acceptance, error) {
  this.x0 = x0;
  this.xA = xA;
  this.acceptance = acceptance;
  this.error = error;
}

/**
 * Chi Cuadrada, pruebas de ajuste, distribucion uniforme.
 * @class Chisq
 * @type {Object}
 * @property {Array.<Number>} Ri_s The Randoms from 0 to 1
 * */
function Chisq() {
  this._Ri_s = [];
  this._alpha = "";
  this._k = 0;

  /**
   * Evaluate a set of Ri from a generated randoms.
   * @memberof Chisq
   * @param {Array.<Number>} Ri_s The Randoms from 0 to 1.
   * @returns {ResultChisq} The resulting variables of the Chi Squared test.
   * */
  this.test = function(Ri_s, alpha) {

    if (Ri_s.length == 0) {
      return new ResultChisq(0, 0, false, "NORANDOMS");
    }
    // Save  new values.
    this._Ri_s = Ri_s, this._alpha = alpha;

    // Calculate x0.
    let x0 = this._calculateX0(Ri_s);

    if (this._k > 250) {
      return new ResultChisq(0, 0, false, "KOUTOFBOUNDS");
    }

    // Get xalpha from table.
    let xAResult = this._calculateXA();
    if (xAResult.error != null) {
      return new ResultChisq(0, 0, false, xAResult.error);
    }
    let xA = xAResult.xA;

    // Check if it acceptance.
    let acceptance = x0 < xA;

    return new ResultChisq(x0, xA, acceptance, null);
  }

  // Calculate x0
  this._calculateX0 = function() {

    // Sort the array.
    let Ri_sorted = [...this._Ri_s].sort();

    // Get class size
    let cls_dim = this._calcClassDimension(Ri_sorted);
    let k = cls_dim.k;
    this._k = k;
    let cls_size = cls_dim.cls_size;

    // Get classes and frecuencies.
    classes = this._getFrecuencies(Ri_sorted, k, cls_size);

    // Fix classes with less than 5 ocurrences.
    let resultFix = this._fixClassesFrec(classes);
    classes = resultFix.newClasses;
    this._k = resultFix.k;

    // Find Xi for every class.
    let xis = this._calcXi(classes);

    // Find x0
    let x0 = xis.reduce((prev, curr) => prev + curr, 0);

    x0 = Math.round((x0 + Number.EPSILON) * 10000) / 10000;
    
    return x0;
  }

  // Calculate xA.
  this._calculateXA = function() {
    let v = this._k - 1;
    if (v == 0) {
      return { "xA": 0, "error": "VISZERO"};
    }
    let xA = CHI_TABLE[v-1][ALPHA_MAP[this._alpha]];
    return { "xA": xA, "error": null};
  }

  // Calculate class size
  this._calcClassDimension = function(items) {
    // Get N
    let n = items.length;

    // Find number of intervals with sturge's rule.
    let k = 1 + 3.322*Math.log10(n);
    k = Math.floor(k);

    // Find range
    let r = Math.max.apply(Math, items) - Math.min.apply(Math, items);

    // Class size is range over intervals.
    let cls_size = r / k;

    // Fit class size to cover the whole range 0 to 1.
    cls_size = cls_size + (1 - cls_size*k) / k

    // Get class size.
    return { "k": k, "cls_size": cls_size};
  }

  // Get all frecuency of classes.
  this._getFrecuencies = function(items, k, cls_size) {
    let classes = [];
    let l_fin = 0;
    for (let i = 0; i < k; i++) {
      let ini = l_fin;
      let fin = l_fin + cls_size;
      let freq_abs = this._getAbsFrec(items, ini, fin);
      classes.push({
        "ini": ini,
        "fin": fin,
        "abs_frec": freq_abs
      });
      l_fin += cls_size;
    }
    return classes;
  }

  // Calculate Xi for all classes.
  this._calcXi = function(classes) {
    let xis = [];
    let nClasses = classes.reduce((prev, curr) => prev + curr.abs_frec, 0);
    for (let i = 0; i < classes.length; i++) {
      // Probabilidad uniforme es el rango de la clase.
      let p = classes[i].fin - classes[i].ini;

      // Oi
      let oi = classes[i].abs_frec;

      // Ei
      let ei = p * nClasses;

      // Xi
      let xi = Math.pow(oi-ei, 2) / ei;

      xis.push(xi);
    }
    return xis;
  }

  //  Find the frecuency of objects within range.
  this._getAbsFrec = function(items, a, b) {
    return items.filter(item => item > a && item <= b).length;
  }

  // Fix the classes to match frecuencies bigger than 5.
  this._fixClassesFrec= function(classes) {
    // No classes case.
    if (classes.length == 0) {
      return classes;
    }

    // Fit classes such that absolute frecuency for each is above 5
    let newClasses = [];
    let carried_ini = classes[0].ini;
    let carried_fin = classes[0].fin;
    let carried_freq = classes[0].abs_frec;

    // One element.
    if (classes.length == 1) {
        newClasses.push({
          "ini": carried_ini,
          "fin": carried_fin,
          "abs_frec": carried_freq
        });
        return newClasses;
    }

    // Searching more elements.
    for (let i = 1; i < classes.length; i++) {
      if (carried_freq < 5) {
        carried_fin = classes[i].fin;
        carried_freq += classes[i].abs_frec;
      } else {
        newClasses.push({
          "ini": carried_ini,
          "fin": carried_fin,
          "abs_frec": carried_freq
        });
        carried_ini = classes[i].ini;
        carried_fin = classes[i].fin;
        carried_freq = classes[i].abs_frec;
      }
    }

    // No new classes where found
    if (newClasses.length == 0) {
      newClasses.push({
        "ini": carried_ini,
        "fin": carried_fin,
        "abs_frec": carried_freq
      });
      return { 'k': newClasses.length, 'newClasses': newClasses};
    }

    // Insert last, join with prior if frequency is less than 5.
    if (carried_freq < 5) {
      carried_ini = newClasses[newClasses.length - 1].ini;
      carried_freq += newClasses[newClasses.length - 1].abs_frec;
      newClasses[newClasses.length - 1] = {
        "ini": carried_ini,
        "fin": carried_fin,
        "abs_frec": carried_freq
      };
    } else {
      newClasses.push({
        "ini": carried_ini,
        "fin": carried_fin,
        "abs_frec": carried_freq
      });
    }
    
    return { 'k': newClasses.length, 'newClasses': newClasses};
  }
}

if (typeof module !== "undefined") {
  module.exports = Chisq;
}

const ALPHA_MAP = {"0.1": 0, "0.05": 1, "0.02": 2, "0.01": 3}

const CHI_TABLE = [
	[2.706, 3.841, 5.412, 6.635], 
	[4.605, 5.991, 7.824, 9.21], 
	[6.251, 7.815, 9.837, 11.345], 
	[7.779, 9.488, 11.668, 13.277], 
	[9.236, 11.07, 13.388, 15.086], 
	[10.645, 12.592, 15.033, 16.812], 
	[12.017, 14.067, 16.622, 18.475], 
	[13.362, 15.507, 18.168, 20.09], 
	[14.684, 16.919, 19.679, 21.666], 
	[15.987, 18.307, 21.161, 23.209], 
	[17.275, 19.675, 22.618, 24.725], 
	[18.549, 21.026, 24.054, 26.217], 
	[19.812, 22.362, 25.472, 27.688], 
	[21.064, 23.685, 26.873, 29.141], 
	[22.307, 24.996, 28.259, 30.578], 
	[23.542, 26.296, 29.633, 32], 
	[24.769, 27.587, 30.995, 33.409], 
	[25.989, 28.869, 32.346, 34.805], 
	[27.204, 30.144, 33.687, 36.191], 
	[28.412, 31.41, 35.02, 37.566], 
	[29.615, 32.671, 36.343, 38.932], 
	[30.813, 33.924, 37.659, 40.289], 
	[32.007, 35.172, 38.968, 41.638], 
	[33.196, 36.415, 40.27, 42.98], 
	[34.382, 37.652, 41.566, 44.314], 
	[35.563, 38.885, 42.856, 45.642], 
	[36.741, 40.113, 44.14, 46.963], 
	[37.916, 41.337, 45.419, 48.278], 
	[39.087, 42.557, 46.693, 49.588], 
	[40.256, 43.773, 47.962, 50.892], 
	[41.422, 44.985, 49.226, 52.191], 
	[42.585, 46.194, 50.487, 53.486], 
	[43.745, 47.4, 51.743, 54.776], 
	[44.903, 48.602, 52.995, 56.061], 
	[46.059, 49.802, 54.244, 57.342], 
	[47.212, 50.998, 55.489, 58.619], 
	[48.363, 52.192, 56.73, 59.893], 
	[49.513, 53.384, 57.969, 61.162], 
	[50.66, 54.572, 59.204, 62.428], 
	[51.805, 55.758, 60.436, 63.691], 
	[52.949, 56.942, 61.665, 64.95], 
	[54.09, 58.124, 62.892, 66.206], 
	[55.23, 59.304, 64.116, 67.459], 
	[56.369, 60.481, 65.337, 68.71], 
	[57.505, 61.656, 66.555, 69.957], 
	[58.641, 62.83, 67.771, 71.201], 
	[59.774, 64.001, 68.985, 72.443], 
	[60.907, 65.171, 70.197, 73.683], 
	[62.038, 66.339, 71.406, 74.919], 
	[63.167, 67.505, 72.613, 76.154], 
	[64.295, 68.669, 73.818, 77.386], 
	[65.422, 69.832, 75.021, 78.616], 
	[66.548, 70.993, 76.223, 79.843], 
	[67.673, 72.153, 77.422, 81.069], 
	[68.796, 73.311, 78.619, 82.292], 
	[69.919, 74.468, 79.815, 83.513], 
	[71.04, 75.624, 81.009, 84.733], 
	[72.16, 76.778, 82.201, 85.95], 
	[73.279, 77.931, 83.391, 87.166], 
	[74.397, 79.082, 84.58, 88.379], 
	[75.514, 80.232, 85.767, 89.591], 
	[76.63, 81.381, 86.953, 90.802], 
	[77.745, 82.529, 88.137, 92.01], 
	[78.86, 83.675, 89.32, 93.217], 
	[79.973, 84.821, 90.501, 94.422], 
	[81.085, 85.965, 91.681, 95.626], 
	[82.197, 87.108, 92.86, 96.828], 
	[83.308, 88.25, 94.037, 98.028], 
	[84.418, 89.391, 95.213, 99.228], 
	[85.527, 90.531, 96.388, 100.425], 
	[86.635, 91.67, 97.561, 101.621], 
	[87.743, 92.808, 98.733, 102.816], 
	[88.85, 93.945, 99.904, 104.01], 
	[89.956, 95.081, 101.074, 105.202], 
	[91.061, 96.217, 102.243, 106.393], 
	[92.166, 97.351, 103.41, 107.583], 
	[93.27, 98.484, 104.576, 108.771], 
	[94.374, 99.617, 105.742, 109.958], 
	[95.476, 100.749, 106.906, 111.144], 
	[96.578, 101.879, 108.069, 112.329], 
	[97.68, 103.01, 109.232, 113.512], 
	[98.78, 104.139, 110.393, 114.695], 
	[99.88, 105.267, 111.553, 115.876], 
	[100.98, 106.395, 112.712, 117.057], 
	[102.079, 107.522, 113.871, 118.236], 
	[103.177, 108.648, 115.028, 119.414], 
	[104.275, 109.773, 116.184, 120.591], 
	[105.372, 110.898, 117.34, 121.767], 
	[106.469, 112.022, 118.495, 122.942], 
	[107.565, 113.145, 119.648, 124.116], 
	[108.661, 114.268, 120.801, 125.289], 
	[109.756, 115.39, 121.954, 126.462], 
	[110.85, 116.511, 123.105, 127.633], 
	[111.944, 117.632, 124.255, 128.803], 
	[113.038, 118.752, 125.405, 129.973], 
	[114.131, 119.871, 126.554, 131.141], 
	[115.223, 120.99, 127.702, 132.309], 
	[116.315, 122.108, 128.849, 133.476], 
	[117.407, 123.225, 129.996, 134.642], 
	[118.498, 124.342, 131.142, 135.807], 
	[119.589, 125.458, 132.287, 136.971], 
	[120.679, 126.574, 133.431, 138.134], 
	[121.769, 127.689, 134.575, 139.297], 
	[122.858, 128.804, 135.718, 140.459], 
	[123.947, 129.918, 136.86, 141.62], 
	[125.035, 131.031, 138.002, 142.78], 
	[126.123, 132.144, 139.143, 143.94], 
	[127.211, 133.257, 140.283, 145.099], 
	[128.298, 134.369, 141.423, 146.257], 
	[129.385, 135.48, 142.562, 147.414], 
	[130.472, 136.591, 143.7, 148.571], 
	[131.558, 137.701, 144.838, 149.727], 
	[132.643, 138.811, 145.975, 150.882], 
	[133.729, 139.921, 147.111, 152.037], 
	[134.813, 141.03, 148.247, 153.191], 
	[135.898, 142.138, 149.383, 154.344], 
	[136.982, 143.246, 150.517, 155.496], 
	[138.066, 144.354, 151.652, 156.648], 
	[139.149, 145.461, 152.785, 157.8], 
	[140.233, 146.567, 153.918, 158.95], 
	[141.315, 147.674, 155.051, 160.1], 
	[142.398, 148.779, 156.183, 161.25], 
	[143.48, 149.885, 157.314, 162.398], 
	[144.562, 150.989, 158.445, 163.546], 
	[145.643, 152.094, 159.575, 164.694], 
	[146.724, 153.198, 160.705, 165.841], 
	[147.805, 154.302, 161.834, 166.987], 
	[148.885, 155.405, 162.963, 168.133], 
	[149.965, 156.508, 164.091, 169.278], 
	[151.045, 157.61, 165.219, 170.423], 
	[152.125, 158.712, 166.346, 171.567], 
	[153.204, 159.814, 167.473, 172.711], 
	[154.283, 160.915, 168.6, 173.854], 
	[155.361, 162.016, 169.725, 174.996], 
	[156.44, 163.116, 170.851, 176.138], 
	[157.518, 164.216, 171.976, 177.28], 
	[158.595, 165.316, 173.1, 178.421], 
	[159.673, 166.415, 174.224, 179.561], 
	[160.75, 167.514, 175.348, 180.701], 
	[161.827, 168.613, 176.471, 181.84], 
	[162.904, 169.711, 177.594, 182.979], 
	[163.98, 170.809, 178.716, 184.118], 
	[165.056, 171.907, 179.838, 185.256], 
	[166.132, 173.004, 180.959, 186.393], 
	[167.207, 174.101, 182.08, 187.53], 
	[168.283, 175.198, 183.2, 188.666], 
	[169.358, 176.294, 184.321, 189.802], 
	[170.432, 177.39, 185.44, 190.938], 
	[171.507, 178.485, 186.56, 192.073], 
	[172.581, 179.581, 187.678, 193.208], 
	[173.655, 180.676, 188.797, 194.342], 
	[174.729, 181.77, 189.915, 195.476], 
	[175.803, 182.865, 191.033, 196.609], 
	[176.876, 183.959, 192.15, 197.742], 
	[177.949, 185.052, 193.267, 198.874], 
	[179.022, 186.146, 194.384, 200.006], 
	[180.094, 187.239, 195.5, 201.138], 
	[181.167, 188.332, 196.616, 202.269], 
	[182.239, 189.424, 197.731, 203.4], 
	[183.311, 190.516, 198.846, 204.53], 
	[184.382, 191.608, 199.961, 205.66], 
	[185.454, 192.7, 201.076, 206.79], 
	[186.525, 193.791, 202.19, 207.919], 
	[187.596, 194.883, 203.303, 209.047], 
	[188.667, 195.973, 204.417, 210.176], 
	[189.737, 197.064, 205.53, 211.304], 
	[190.808, 198.154, 206.642, 212.431], 
	[191.878, 199.244, 207.755, 213.558], 
	[192.948, 200.334, 208.867, 214.685], 
	[194.017, 201.423, 209.978, 215.812], 
	[195.087, 202.513, 211.09, 216.938], 
	[196.156, 203.602, 212.201, 218.063], 
	[197.225, 204.69, 213.311, 219.189], 
	[198.294, 205.779, 214.422, 220.314], 
	[199.363, 206.867, 215.532, 221.438], 
	[200.432, 207.955, 216.641, 222.563], 
	[201.5, 209.042, 217.751, 223.687], 
	[202.568, 210.13, 218.86, 224.81], 
	[203.636, 211.217, 219.969, 225.933], 
	[204.704, 212.304, 221.077, 227.056], 
	[205.771, 213.391, 222.185, 228.179], 
	[206.839, 214.477, 223.293, 229.301], 
	[207.906, 215.563, 224.401, 230.423], 
	[208.973, 216.649, 225.508, 231.544], 
	[210.04, 217.735, 226.615, 232.665], 
	[211.106, 218.82, 227.722, 233.786], 
	[212.173, 219.906, 228.828, 234.907], 
	[213.239, 220.991, 229.935, 236.027], 
	[214.305, 222.076, 231.04, 237.147], 
	[215.371, 223.16, 232.146, 238.266], 
	[216.437, 224.245, 233.251, 239.386], 
	[217.502, 225.329, 234.356, 240.505], 
	[218.568, 226.413, 235.461, 241.623], 
	[219.633, 227.496, 236.566, 242.742], 
	[220.698, 228.58, 237.67, 243.86], 
	[221.763, 229.663, 238.774, 244.977], 
	[222.828, 230.746, 239.877, 246.095], 
	[223.892, 231.829, 240.981, 247.212], 
	[224.957, 232.912, 242.084, 248.329], 
	[226.021, 233.994, 243.187, 249.445], 
	[227.085, 235.077, 244.29, 250.561], 
	[228.149, 236.159, 245.392, 251.677], 
	[229.213, 237.24, 246.494, 252.793], 
	[230.276, 238.322, 247.596, 253.908], 
	[231.34, 239.403, 248.698, 255.023], 
	[232.403, 240.485, 249.799, 256.138], 
	[233.466, 241.566, 250.9, 257.253], 
	[234.529, 242.647, 252.001, 258.367], 
	[235.592, 243.727, 253.102, 259.481], 
	[236.655, 244.808, 254.202, 260.595], 
	[237.717, 245.888, 255.302, 261.708], 
	[238.78, 246.968, 256.402, 262.821], 
	[239.842, 248.048, 257.502, 263.934], 
	[240.904, 249.128, 258.601, 265.047], 
	[241.966, 250.207, 259.701, 266.159], 
	[243.028, 251.286, 260.8, 267.271], 
	[244.09, 252.365, 261.898, 268.383], 
	[245.151, 253.444, 262.997, 269.495], 
	[246.213, 254.523, 264.095, 270.606], 
	[247.274, 255.602, 265.193, 271.717], 
	[248.335, 256.68, 266.291, 272.828], 
	[249.396, 257.758, 267.389, 273.939], 
	[250.457, 258.837, 268.486, 275.049], 
	[251.517, 259.914, 269.584, 276.159], 
	[252.578, 260.992, 270.681, 277.269], 
	[253.638, 262.07, 271.777, 278.379], 
	[254.699, 263.147, 272.874, 279.488], 
	[255.759, 264.224, 273.97, 280.597], 
	[256.819, 265.301, 275.066, 281.706], 
	[257.879, 266.378, 276.162, 282.814], 
	[258.939, 267.455, 277.258, 283.923], 
	[259.998, 268.531, 278.354, 285.031], 
	[261.058, 269.608, 279.449, 286.139], 
	[262.117, 270.684, 280.544, 287.247], 
	[263.176, 271.76, 281.639, 288.354], 
	[264.235, 272.836, 282.734, 289.461], 
	[265.294, 273.911, 283.828, 290.568], 
	[266.353, 274.987, 284.922, 291.675], 
	[267.412, 276.062, 286.016, 292.782], 
	[268.471, 277.138, 287.11, 293.888], 
	[269.529, 278.213, 288.204, 294.994], 
	[270.588, 279.288, 289.298, 296.1], 
	[271.646, 280.362, 290.391, 297.206], 
	[272.704, 281.437, 291.484, 298.311], 
	[273.762, 282.511, 292.577, 299.417], 
	[274.82, 283.586, 293.67, 300.522], 
	[275.878, 284.66, 294.762, 301.626], 
	[276.935, 285.734, 295.855, 302.731], 
	[277.993, 286.808, 296.947, 303.835], 
	[279.05, 287.882, 298.039, 304.94]
]
