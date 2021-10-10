let gm = new Gm();
let chi = new Chisq();

const inputForm = document.querySelector('#form-inputs');
inputForm.addEventListener('submit', (event) => {
  // stop form submission
  event.preventDefault();

  // Hide error messages.
  hideFormError('input-form-error')

  // Get Seed and Iterations.
  let x0 = +inputForm.elements['x0'].value;
  let a = +inputForm.elements['a'].value;
  let m = +inputForm.elements['m'].value;
  let i = +inputForm.elements['i'].value;

  let result = gm.generate(x0, a, m, i);

  if (result.error != null) {
    if (result.error == 'ZeroModuleError') {
        showFormError('input-form-error', 'El módulo no puede ser cero.');
    }
    if (result.error == 'SmallerModuleError') {
        showFormError('input-form-error', 'Módulo debe ser mayor a "x0" y "a".');
    }
    if (result.error == 'NegativeNumberError') {
        showFormError('input-form-error', 'Números deben ser positivos.');
    }
    return;
  }

  let randoms = result.randoms;

  let tbody = document.querySelector('.table-container tbody');
  // Clear table body.
  tbody.innerHTML = '';
  for (let j = 0; j < randoms.length; j++) {
    // Add rows
    let resultsRow = tbody.insertRow();

    // Add columns
    let xs = (j > 0) ? randoms[j-1] : x0;
    
    let textSem = `X${j}=${xs}`;
    addCell(textSem, resultsRow);

    let textGen = `X${j+1}=(${a}*${xs})mod${m}`;
    addCell(textGen, resultsRow);

    let textRand = `X${j+1}=${randoms[j]}`;
    addCell(textRand, resultsRow);

    let textRi = `R${j+1}=${randoms[j]/m}`;
    addCell(textRi, resultsRow);
  }
});

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

  let ris = gm.getRis();
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
