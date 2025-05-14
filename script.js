const form = document.getElementById("transactionForm");
const list = document.getElementById("transactionList");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const ctx = document.getElementById("expenseChart").getContext("2d");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = document.getElementById("desc").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!desc || isNaN(amount)) return;

  transactions.push({ desc, amount, type });
  localStorage.setItem("transactions", JSON.stringify(transactions));

  form.reset();
  updateUI();
});

function updateUI() {
  list.innerHTML = "";
  let totalIncome = 0;
  let totalExpense = 0;

  const categoryTotals = {};

  transactions.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = t.type;
    li.textContent = `${t.desc} - ₹${t.amount}`;
    list.appendChild(li);

    if (t.type === "income") totalIncome += t.amount;
    else {
      totalExpense += t.amount;
      categoryTotals[t.desc] = (categoryTotals[t.desc] || 0) + t.amount;
    }
  });

  balance.textContent = totalIncome - totalExpense;
  income.textContent = totalIncome;
  expense.textContent = totalExpense;

  updateChart(categoryTotals);
}

let chart;
function updateChart(data) {
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: Object.keys(data).map(() => getRandomColor())
      }]
    }
  });
}

function getRandomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
}

// Initial render
updateUI();
