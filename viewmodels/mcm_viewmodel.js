import mcm from '../models/mcm.js';

let mcm = mcm();
const inputForm = document.querySelector('#form-inputs');

inputForm.addEventListener('submit', (event) => {
  // stop form submission
  event.preventDefault();


  // Get Seed and Iterations.
  let seed = inputForm.elements['seed'].value;
  let iterations = inputForm.elements['iterations'].value;
  console.log(seed + "iters: " + iterations);
});

