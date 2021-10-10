let mcm = new Mcm();
let chi = new Chisq();
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
}

const testsForm = document.querySelector('#form-tests');
testsForm.addEventListener('submit', (event) => {
  // stop form submission
  event.preventDefault();

  // Hide error messages.
  hideFormError('input-form-error')

  const radios = document.querySelectorAll('input[name="radio-alpha"]');

  let alpha = 0;
  for (const radio of radios) {
    if (radio.checked) {
      alpha = radio.value;
    }
  }

  let results = validateChiSq(alpha);

  if (results.error == null) {
    showChiValidation(results);
  }

});

function validateChiSq(alpha) {
  // Get Seed and Iterations.

  let ris = mcm.getRis();
  let result = chi.test(ris, alpha);

  if (result.error != null) {
    switch (result.error) {
      case "KOUTOFBOUNDS":
        showFormError('tests-form-error', 'No hay valores arriba de 250 intervalos para Chi.');
        break;
      case "VISZERO":
        showFormError('tests-form-error', 'No hay intervalos suficientes para evaluar Chi.');
        break;
      case "NORANDOMS":
        showFormError('tests-form-error', 'No hay numeros random que evaluar Chi.');
        break;
    }
    return result;
  }
  return result;
}

function showChiValidation(results) {
  let complete = results.acceptance;
  let evalu = (complete) ? 'X0 < XA' : 'XA < X0';
  let conculsion = `${evalu}, por lo tanto se ${(complete) ? '<span class="is-valid">ACEPTA</span>' : '<span class="is-not-valid">RECHAZA</span>'} h0.`;
  let testDescription = document.querySelector('#chi-results .is-description');
  testDescription.innerHTML = `
  1) <span id="x0-result">${results.x0}</span> = X0<br>
  2) <span id="xA-result">${results.xA}</span> = XA<br>
  <br>
  <span id="chi-conclusion">${conculsion}</span>
  `
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
