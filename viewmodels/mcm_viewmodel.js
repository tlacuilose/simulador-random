let mcm = new Mcm();
let x0, a, c, m, i;

const inputForm = document.querySelector('#form-inputs');
inputForm.addEventListener('submit', (event) => {
  // stop form submission
  event.preventDefault();

  // Hide error messages.
  hideFormError('input-form-error')

  let results = generateRandomsFromInput();

  if (results.error == null) {
    fillTableWithRandoms(results.randoms);
    showHullDobellValidation();
  }

});

function generateRandomsFromInput() {
  // Get Seed and Iterations.
  x0 = +inputForm.elements['x0'].value;
  a = +inputForm.elements['a'].value;
  c = +inputForm.elements['c'].value;
  m = +inputForm.elements['m'].value;
  i = +inputForm.elements['i'].value;

  let result = mcm.generate(x0, a, c, m, i);

  if (result.error != null) {
    if (result.error == 'ZeroModuleError') {
      showFormError('input-form-error', 'El módulo no puede ser cero.');
    }
    return;
  }
  return result;
}

function fillTableWithRandoms(randoms) {
  let tbody = document.querySelector('.table-container tbody');
  // Clear table body.
  tbody.innerHTML = '';
  for (let j = 0; j < randoms.length; j++) {
    // Add rows
    let resultsRow = tbody.insertRow();

    // Add columns
    let xs = (j < 0) ? randoms[j-1] : x0;
    
    let textSem = `X${j}=${xs}`;
    addCell(textSem, resultsRow);

    let textGen = `X${j+1}=(${a}(${xs}+${c})mod${m}`;
    addCell(textGen, resultsRow);

    let textRand = `X${j+1}=${randoms[j]}`;
    addCell(textRand, resultsRow);

    let textRi = `R${j+1}=${randoms[j]/m}`;
    addCell(textRi, resultsRow);
  }
}

function showHullDobellValidation() {
  results = mcm.validateHullDobell();
  let complete = results.first && results.second & results.third;
  let conculsion = `Por lo tanto el generador congruencial mixto ${(complete) ? 'SI' : 'NO'} tiene periodo completo.`;
  let testDescription = document.querySelector('#hd-validation-results .is-description');
  testDescription.innerHTML = `
  1) <span id="first-hd-rule" class="is-${(results.first) ? '' : 'not-'}valid">${(results.first) ? 'VERDADERO' : 'FALSO'}</span>: Sea ${c} y ${m} primos relativo<br>
  2) <span id="second-hd-rule" class="is-${(results.second) ? '' : 'not-'}valid">${(results.second) ? 'VERDADERO' : 'FALSO'}</span>: Si q es un n&uacute;mero primo que divide a ${m}; entonces, q divida a (${a}-1); ${a} ≡ 1modq.<br>
  3) <span id="third-hd-rule" class="is-${(results.third) ? '' : 'not-'}valid">${(results.third) ? 'VERDADERO' : 'FALSO'}</span>: Si 4 divide a ${m}; entonces, 4 divida a (${a}-1); ${a} ≡ 1mod4<br>
  <br>
  <span id="hd-conclusion">${conculsion}</span>
  `
  console.log(results);
}

function addCell(text, inRow) {
  var newCell = inRow.insertCell();
  var cellText = document.createTextNode(text);
  newCell.appendChild(cellText);
}

function showFormError(id, msg) {
  const errorField = document.querySelector('#' + id);
  errorField.textContent = msg;
  errorField.className = 'is-error-msg';
}

function hideFormError(id) {
  const errorField = document.querySelector('#' + id);
  errorField.textContent = '';
}
