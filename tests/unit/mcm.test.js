const Mcm = require('../../models/mcm.js');

test('creates a mcm generator', () => {
  let mcm = new Mcm();
  expect(mcm.x0).toBe(0);
});

test('generate a zero value random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(0, 0, 0, 0, 0);
  expect(finalResult.randoms).toBe(0);
})

test('generate class example random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(4, 5, 7, 8, 5);
  expect(finalResult.randoms).toBe(7);
})

test('generate class example random and return every random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(4, 5, 7, 8, 5);
  expect(finalResult.randoms).toBeDefined();
})


