class Mcm {
  constructor() {
    this.x0 = 0;
  }

  generate(x0, a, c, m, i) {
    this.x0 = x0;
    let xn = this.x0;
    for (let j = 0; j < i; j++) {
      xn = (a * xn + c) % m
    }
    return {
      "randoms": xn
    };
  }
}

module.exports = Mcm
