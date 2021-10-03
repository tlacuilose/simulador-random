let mcm = new Mcm();

const inputForm = document.querySelector('#form-inputs');
inputForm.addEventListener('submit', (event) => {
  // stop form submission
  event.preventDefault();

  // Hide error messages.
  hideFormError('input-form-error')

  // Get Seed and Iterations.
  let x0 = +inputForm.elements['x0'].value;
  let a = +inputForm.elements['a'].value;
  let c = +inputForm.elements['c'].value;
  let m = +inputForm.elements['m'].value;
  let i = +inputForm.elements['i'].value;

  let result = mcm.generate(x0, a, c, m, i);

  if (result.error != null) {
    if (result.error == 'ZeroModuleError') {
      showFormError('input-form-error', 'El módulo no puede ser cero.');
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
    let xs = (j < 0) ? randoms[j-1] : x0;
    
    let textSem = `X${j}=${xs}`;
    addCell(textSem, resultsRow);

    let textGen = `X${j+1}=(${a}(${xs}+${c})mod${m}`;
    addCell(textGen, resultsRow);

    let textRand = `X${j+1}=${randoms[j]}`;
    addCell(textRand, resultsRow);

    let textRi = `R${j+1}=${randoms[j]/i}`;
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
