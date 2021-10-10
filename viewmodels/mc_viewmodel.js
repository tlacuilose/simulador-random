let mc = new Mc();
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
  }

});

function generateRandomsFromInput() {
  // Get Seed and Iterations.
  x0 = +inputForm.elements['x0'].value;
  a = +inputForm.elements['a'].value;
  c = +inputForm.elements['c'].value;
  m = +inputForm.elements['m'].value;
  i = +inputForm.elements['i'].value;

  let result = mc.generate(x0, a, c, m, i);

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

  let ris = mc.getRis();
  let result = chi.test(ris, alpha);

  if (result.error != null) {
    switch (result.error) {
      case "KOUTOFBOUNDS":
        showFormError('tests-form-error', 'No hay valores arriba de 250 intervalos para Chi.');
      case "VISZERO":
        showFormError('tests-form-error', 'No hay intervalos suficientes para evaluar Chi.');
    }
    return result;
  }
  return result;
}

function showChiValidation(results) {
  let complete = results.acceptance;
  let conculsion = `Por lo tanto se ${(complete) ? '<span class="is-valid">ACEPTA</span>' : '<span class="is-not-valid">RECHAZA</span>'} h0.`;
  let testDescription = document.querySelector('#chi-results .is-description');
  testDescription.innerHTML = `
  1) <span id="x0-result">${results.x0}</span> = X0<br>
  1) <span id="xA-result">${results.xA}</span> = XA<br>
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

