const budgetForm = document.getElementById("budgetForm");
const savingsForm = document.getElementById("savingsForm");

const budgetResult = document.getElementById("budgetResult");
const savingsResult = document.getElementById("savingsResult");

const salaryInput = document.getElementById("salary");
const salaryPeriodInput = document.getElementById("salaryPeriod");
const savingPercentageInput = document.getElementById("savingPercentage");
const weeklySavingsInput = document.getElementById("weeklySavings");

let sharedBudget = {
  salary: 0,
  period: "",
  savings: 0,
  weeklySavings: 0,
  spending: 0
};

function formatMoney(amount) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function showResult(element, message) {
  element.classList.remove("hidden");
  element.innerHTML = message;
}

/*
  BUDGET PLANNER

  This calculation creates the shared values used by both calculators.
*/
budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const salary = Number(salaryInput.value);
  const period = salaryPeriodInput.value;
  const savingPercentage = Number(savingPercentageInput.value);

  if (
    salary <= 0 ||
    savingPercentage < 0 ||
    savingPercentage > 100
  ) {
    showResult(
      budgetResult,
      "Please enter a valid salary and a savings percentage between 0 and 100."
    );

    return;
  }

  const savings = salary * (savingPercentage / 100);
  const spending = salary - savings;

  /*
    Convert the savings amount to weekly savings.

    Weekly salary:
    weekly savings = savings

    Monthly salary:
    weekly savings = monthly savings divided by 4.345
  */
  const weeklySavings =
    period === "weekly"
      ? savings
      : savings / 4.345;

  sharedBudget = {
    salary: salary,
    period: period,
    savings: savings,
    weeklySavings: weeklySavings,
    spending: spending
  };

  /*
    Put the exact shared weekly savings value into the savings calculator.
  */
  weeklySavingsInput.value = weeklySavings.toFixed(2);

  const periodText = period === "weekly" ? "week" : "month";

  showResult(
    budgetResult,
    `
      <strong>Your budget plan:</strong><br>
      Salary:
      <strong>${formatMoney(salary)}</strong>
      per ${periodText}.<br>

      You can save:
      <strong>${formatMoney(savings)}</strong>
      per ${periodText}.<br>

      You can spend:
      <strong>${formatMoney(spending)}</strong>
      per ${periodText}.<br>

      Your weekly savings value is:
      <strong>${formatMoney(weeklySavings)}</strong>.
    `
  );
});

/*
  SAVINGS TARGET CALCULATOR

  This uses sharedBudget.weeklySavings, which is the same value shown
  in the budget planner.
*/
savingsForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const target = Number(
    document.getElementById("savingsTarget").value
  );

  if (target <= 0) {
    showResult(
      savingsResult,
      "Please enter a savings target greater than zero."
    );

    return;
  }

  if (sharedBudget.weeklySavings <= 0) {
    showResult(
      savingsResult,
      "Please calculate your budget plan first."
    );

    return;
  }

  /*
    Use the shared weekly savings value instead of calculating
    another separate amount.
  */
  const weeklySavings = sharedBudget.weeklySavings;

  const weeks = Math.ceil(target / weeklySavings);
  const months = weeks / 4.345;

  /*
    This is an optional suggestion showing the weekly amount needed
    to finish one week earlier.
  */
  const earlierWeeks = Math.max(weeks - 1, 1);
  const earlierWeeklySavings = target / earlierWeeks;

  showResult(
    savingsResult,
    `
      <strong>Your savings plan:</strong><br>

      Target:
      <strong>${formatMoney(target)}</strong>.<br>

      Weekly savings:
      <strong>${formatMoney(weeklySavings)}</strong>.<br>

      You will reach your target in approximately:
      <strong>${weeks} week${weeks === 1 ? "" : "s"}</strong>.<br>

      That is approximately:
      <strong>${months.toFixed(1)} months</strong>.

      <div class="suggestion">
        To reach your target one week earlier, save approximately
        <strong>${formatMoney(earlierWeeklySavings)}</strong>
        per week.
      </div>
    `
  );
});