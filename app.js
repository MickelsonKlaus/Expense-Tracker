/**Select items */
const form = document.getElementById('form');
const tbody = document.querySelector('tbody');
const total = document.getElementById('total');
const clear = document.getElementById('clear');

/**Event Listener */
form.addEventListener('submit', expenseSubmitted);
clear.addEventListener('click', clearExpense);
window.addEventListener('load', setUpExpenses)
/**Functions */
function expenseSubmitted(e) {
    e.preventDefault()

    let expense = document.getElementById('expense').value;
    let date = document.getElementById('date').value;
    let amount = document.getElementById('amount').value;

    //console.log(date.toString())
    addExpense(expense, date, amount);
}
//function for adding expense data to the table
function addExpense(expense, date, amount) {
    if (expense && date && amount) {
        let idValues = new Date().getTime();
        createData(idValues, expense, date.toString(), amount)
        
        totalExpense();
        addToLocal(idValues, expense, date.toString(), amount)

        setBackToDefault();
    } else {
        console.log("fail")
        setBackToDefault();
    }
}

function createData(id, expense, date, amount) {
    let tr = document.createElement('tr');
    tr.id = `${id}`;
    tr.innerHTML = `<td>${expense}</td>
    <td>${date}</td>
    <td class="amount">${amount}</td>
    <td style="background: red; padding: 5px; display: inline; cursor: pointer; border-radius: 3px" onclick="deleteExpense(this)">X</td>
    `

    tbody.append(tr);
}
//function for deleting expense data from table
function deleteExpense(e) {
    let parent = e.parentElement;

    let parentID = e.parentElement.id;

    tbody.removeChild(parent);
    totalExpense();

    removeFromLocal(parentID)
}

//function for getting the total of the expense datas
function totalExpense() {
    let expenseAmount = document.querySelectorAll('.amount');

    let valueArray = []
    expenseAmount.forEach(function (value) {
        valueArray.push(Number(value.innerHTML))

    })
    if (valueArray.length != 0) {
        total.innerHTML = `#${valueArray.reduce(function(totalAmount, value){
            return totalAmount + value
        })}`
        localStorage.setItem("Total", total.innerHTML)
    } else {
        total.innerHTML = "";
    }

}

//function for clear the entire expense data
function clearExpense() {
    let expenseTR = document.querySelectorAll("tr");

    expenseTR.forEach(function (items) {
        tbody.remove(items)
    })

    totalExpense();

    localStorage.removeItem("Expense")
    localStorage.removeItem("Total")
}
//function that reset form to default
function setBackToDefault() {
    let expense = document.getElementById('expense').value = "";
    let date = document.getElementById('date').value = "";
    let amount = document.getElementById('amount').value = "";

}
/**Local Storage */
//function that add expenses to local storage
function addToLocal(id, expense, date, amount) {
    let data = getData();

    let dataObj = {
        id,
        expense,
        date,
        amount
    };
    data.push(dataObj)

    localStorage.setItem("Expense", JSON.stringify(data))
}

//function that remove expenses from local storage
function removeFromLocal(id) {
    let data = getData();

    data = data.filter(function (items) {
        if (items.id != id) {
            return items
        }
    })
    localStorage.setItem("Expense", JSON.stringify(data));
}

//function that gets local storage datas
function getData() {
    return localStorage.getItem("Expense") ? JSON.parse(localStorage.getItem("Expense")) : []
}
/**Setup expense data from local storage */
function setUpExpenses() {
    let data = getData()

    data.forEach(function (items) {
        createData(items.id, items.expense, items.date, items.amount)
    })

    total.innerHTML = localStorage.getItem("Total")
}