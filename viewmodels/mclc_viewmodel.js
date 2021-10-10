let mclc = new Mclc();

const inputForm = document.querySelector('#form-inputs');
inputForm.addEventListener('submit', (event) => {
  // stop form submission
  event.preventDefault();

  // Hide error messages.
  hideFormError('input-form-error')

  // Get Seed and Iterations.
  let seed1 = +inputForm.elements['seed1'].value;
  let seed2 = +inputForm.elements['seed2'].value;
  let a1 = +inputForm.elements['a1'].value;
  let a2 = +inputForm.elements['a2'].value;
  let m1 = +inputForm.elements['m1'].value;
  let m2 = +inputForm.elements['m2'].value;
  let m = +inputForm.elements['m'].value;
  let i = +inputForm.elements['i'].value;

  let result = mclc.generate(seed1, seed2, a1, a2, m1, m2, m, i);

  if (result.error != null) {
    if (result.error == 'ZeroModuleError') {
      showFormError('input-form-error', 'El módulo no puede ser cero.');
    }
    if (result.error == 'SmallerModuleError') {
      showFormError('input-form-error', 'Módulo debe ser mayor a "seed" y "a".');
    }
    if (result.error == 'NegativeNumberError') {
        showFormError('input-form-error', 'Números deben ser positivos.');
    }
    return;
  }

  let randoms = result.randoms;
  let xone = result.xone;
  let xtwo = result.xtwo;

  let tbody = document.querySelector('.table-container tbody');
  // Clear table body.
  tbody.innerHTML = '';
  for (let j = 0; j < randoms.length; j++) {
    // Add rows
    let resultsRow = tbody.insertRow();

    // Add columns
    let x1s = (j > 0) ? xone[j-1] : seed1;

    let x2s = (j > 0) ? xtwo[j-1] : seed2;
    
    let textSem1 = `X1,${j}=${x1s}`;
    addCell(textSem1, resultsRow);

    let textSem2 = `X2,${j}=${x2s}`;
    addCell(textSem2, resultsRow);

    let textX1 = `${xone[j]}`;
    addCell(textX1, resultsRow);

    let textX2 = `${xtwo[j]}`;
    addCell(textX2, resultsRow);

    let textRand = `${randoms[j]}`;
    addCell(textRand, resultsRow);

    let randomi = randoms[j]/m;
    let randomiR = Math.round((randomi + Number.EPSILON) * 10000) / 10000

    let textRi = `${randomiR}`;
    addCell(textRi, resultsRow);
  }
});

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
