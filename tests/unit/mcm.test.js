const Mcm = require('../../models/mcm.js');

test('creates a mcm generator', () => {
  let mcm = new Mcm();
  expect(mcm.results).toEqual([]);
});

test('generate a zero value random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(0, 0, 0, 0, 0);
  expect(finalResult.randoms).toEqual([]);
})

test('generate class example random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(4, 5, 7, 8, 5);
  expect(finalResult.randoms.at(-1)).toBe(7);
})

test('generate zero value random', () => {
  let mcm = new Mcm();
  let finalResult = mcm.generate(0, 0, 0, 0, 5);
  expect(finalResult.randoms).toEqual([]);
})

test('generate zero value random and throw error', () => {
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
