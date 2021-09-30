const Mcm = require('../../models/mcm.js');

test('creates a mcm generator', () => {
  let mcm = new Mcm();
  expect(mcm.results).toEqual([]);
});

test('generate a five iterations random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(0, 0, 0, 1, 5);
  expect(finalResult.randoms.length).toBe(5);
})

test('generate a zero value random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(0, 0, 0, 1, 5);
  let expected = [0, 0, 0, 0, 0];
  expect(finalResult.randoms).toEqual(expected);
})

test('generate a zero iterations random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(0, 0, 0, 1, 0);
  expect(finalResult.randoms).toEqual([]);
})

test('generate zero module random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(0, 0, 0, 0, 5);
  expect(finalResult.randoms).toEqual([]);
})

test('generate zero module random and throw error', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(0, 0, 0, 0, 5);
  expect(finalResult.error).toBeDefined();
})

test('generate class example random and return randoms', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(4, 5, 7, 8, 5);
  expect(finalResult.randoms).toBeDefined();
})

test('generate class example random and return null error', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(4, 5, 7, 8, 5);
  expect(finalResult.error).toEqual(null);
})

test('generate class example random and return a randoms array', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(4, 5, 7, 8, 5);
  let expected = [3, 6, 5, 0, 7];
  expect(finalResult.randoms).toEqual(expected);
})
