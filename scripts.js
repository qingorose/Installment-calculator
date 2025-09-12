let debtList = JSON.parse(localStorage.getItem('debtList')) || [];
let monthList = JSON.parse(localStorage.getItem('monthList')) || [];
let monthlyPaymentList = JSON.parse(localStorage.getItem('monthlyPaymentList')) || [];

function saveToLocalStorage() {
  localStorage.setItem('debtList', JSON.stringify(debtList));
  localStorage.setItem('monthList', JSON.stringify(monthList));
  localStorage.setItem('monthlyPaymentList', JSON.stringify(monthlyPaymentList));
}

renderDebtList();


function renderDebtList() {
  let debtListHTML = `
    <div>Name of Purchases</div>
    <div>Purchase Amount €</div>
    <div>Months of Installments</div>
    <div>Date of Purchases</div>
    <div>Delete Debt</div> 
    `;
  debtList.forEach((debtObject, index) => {
    const name = debtObject.name;
    const date = debtObject.date;
    const amount = debtObject.amount;
    const months = debtObject.months;
    const html = `
    <div>${name}</div>
    <div>${amount} €</div>
    <div>${months} months</div>
    <div>${date}</div>
    <button class="delete-button js-delete-button">Delete Debt</button>
    `;
    debtListHTML += html;
  });

  document.querySelector('.js-debt-list')
    .innerHTML = debtListHTML;

  document.querySelectorAll('.js-delete-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        debtList.splice(index, 1);
        saveToLocalStorage();
        renderDebtList();
      });
    })
}

function listsGenerator() {
  let currentMonthpayment = 0;
  debtList.forEach((debtObject, index) => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; 
      const amount = debtObject.amount;
      let remainingMonths = 0;
      const paymentMonths = debtObject.months;
      const date = debtObject.date;
      const [dYear, dMonth] = date.split('-'); 
      const debtYear = parseInt(dYear, 10);   
      const debtMonth = parseInt(dMonth, 10);
      currentMonthpayment = amount/paymentMonths;
      monthlyPaymentList.push(
      currentMonthpayment);
      if (currentYear > debtYear){
        remainingMonths = 12 - (12-debtMonth);
        remainingMonths = remainingMonths - currentMonth;
      } else if (currentMonth === debtMonth){
        remainingMonths = paymentMonths
      } else if (currentMonth > debtMonth){
        remainingMonths = paymentMonths - (currentMonth - debtMonth); 
      }
      monthList.push(
      remainingMonths);
    }); 
}

function renderPaymentList() {
  listsGenerator();
  let dictionary = {};
  dictionary = {1: "January", 2: "February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"};
  const today = new Date();
  const currentMonth = today.getMonth() + 1; 
  const currentYear = today.getFullYear();
  const largestMonth = Math.max(...monthList);
  let paymentListHTML = ``;
  for (let monthIndex = currentMonth + 1; monthIndex < 10 + largestMonth; monthIndex++) {
    let paymentMonth = monthIndex;
    let paymentYear = 0;
    if (paymentMonth < 13) {
      paymentMonth = dictionary[paymentMonth];
      paymentYear = currentYear;
    } else if (paymentMonth >= 13){
      paymentYear = currentYear + 1;
      paymentMonth = paymentMonth % 12;
      paymentMonth = dictionary[paymentMonth];
    }
    let totalPayment = 0;
    for (let debtIndex = 0; debtIndex < monthList.length; debtIndex++) {
      if (monthList[debtIndex] > 0) {
        totalPayment += monthlyPaymentList[debtIndex];
        monthList[debtIndex] = monthList[debtIndex] - 1;
    }
    }
    const html = `
    <div>${paymentYear} ${paymentMonth}:</div>
    <div>${totalPayment}€</div>
    <div>&nbsp;</div>
    `;
    paymentListHTML += html;
  }
  document.querySelector('.js-payment-list')
    .innerHTML = paymentListHTML;
  }; 

document.querySelector('.js-add-button')
  .addEventListener('click', addDebt
  );

document.querySelector('.js-check-button')
  .addEventListener('click', renderPaymentList
  );

function addDebt() {
  const inputDebt = document.querySelector('.js-name-input'); // input field container
  const name = inputDebt.value.trim(); // input field's value

  const dateInputElement = document.querySelector('.js-date-input');
  const date = dateInputElement.value;

  const purchaseAmount = document.querySelector('.js-amount-input');
  const amount = purchaseAmount.value.trim();

  const paymentMonths = document.querySelector('.js-months'); 
  const months = paymentMonths.value.trim();

  const amountPattern = /^\d+(\.\d{1,2})?$/;
  if (!amountPattern.test(amount)) {
    alert("Input must be number with max. 2 decimal places!");
    return;
  }

  const monthsNumber = parseInt(months, 10);
  if (!Number.isInteger(monthsNumber) || monthsNumber < 2 || monthsNumber > 12) {
    alert("Input must be an integer between 2 to 12!");
    return;
  }

  if (!name || !date || !amount || !months) {
    alert("Please fill out all the required blanks!");
    return; 
  }

  debtList.push({
    name,
    date,
    amount,
    months});
  saveToLocalStorage();
  inputDebt.value = '';
  dateInputElement.value = '';
  purchaseAmount.value = '';
  paymentMonths.value = '';
  dateInputElement.value = '';
  renderDebtList();
}