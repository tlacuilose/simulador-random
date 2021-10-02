let results = window.mcm.generate(0, 0, 0, 1, 0);
console.log(results);


const inputForm = document.querySelector('#form-inputs');

inputForm.addEventListener('submit', (event) => {
  // stop form submission
  event.preventDefault();


  // Get Seed and Iterations.
  let x0 = inputForm.elements['x0'].value;
  let a = inputForm.elements['a'].value;
  let c = inputForm.elements['c'].value;
  let m = inputForm.elements['m'].value;
  let i = inputForm.elements['i'].value;
  let randoms = mcm.generate(x0, a, c, m, i);

  let tbody = document.querySelector('.table-container tbody');
  for (let j = 0; j < randoms.length; j++) {
    tbody.insertRow();
  }
});

