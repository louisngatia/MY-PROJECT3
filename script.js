// Wait until the entire HTML page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  // Find the button that triggers the savings calculation
  var calculateButton = document.getElementById('calculate');
  // Listen for clicks on the calculate button
  calculateButton.addEventListener('click', calculateWeeksToGoal);
});

// Calculate how many weeks are needed to reach the savings goal
function calculateWeeksToGoal() {
  // Get the input field where the user enters their savings goal
  var goalInput = document.getElementById('goal');
  // Get the input field where the user enters their weekly savings amount
  var weeklyInput = document.getElementById('weekly');
  // Get the div where the plain-language result will be shown
  var resultDiv = document.getElementById('result');
  // Convert the goal input value from text to a number
  var goal = Number(goalInput.value);
  // Convert the weekly savings input value from text to a number
  var weekly = Number(weeklyInput.value);
  // Stop if weekly savings is zero, negative, or not a valid number
  if (!weekly || weekly <= 0 || Number.isNaN(weekly)) {
    // Tell the user they must enter a positive weekly savings amount
    resultDiv.textContent = 'Please enter a weekly savings amount greater than zero.';
    // Exit the function because the calculation cannot be done
    return;
  }
  // Stop if the goal is negative or not a valid number
  if (goal < 0 || Number.isNaN(goal)) {
    // Tell the user they must enter a valid savings goal
    resultDiv.textContent = 'Please enter a valid savings goal of zero or more.';
    // Exit the function because the calculation cannot be done
    return;
  }
  // Divide the goal by weekly savings and round up to count partial weeks
  var weeks = Math.ceil(goal / weekly);
  // Choose "week" or "weeks" depending on whether the result is exactly one
  var weekWord = weeks === 1 ? 'week' : 'weeks';
  // Build a friendly sentence that explains how long saving will take
  var message = 'It will take you ' + weeks + ' ' + weekWord + ' to reach your savings goal of $' + goal + ' if you save $' + weekly + ' per week.';
  // Display the message inside the result div on the page
  resultDiv.textContent = message;
}
document
  .getElementById("calculateSalary")
  .addEventListener("click", function () {
    const salary = Number(document.getElementById("salary").value);
    const period = document.getElementById("salaryPeriod").value;
    const savingPercentage = Number(
      document.getElementById("savingPercentage").value
    );

    const result = document.getElementById("salaryResult");

    if (
      salary <= 0 ||
      savingPercentage < 0 ||
      savingPercentage > 100
    ) {
      result.textContent =
        "Please enter a valid salary and savings percentage.";
      return;
    }

    const savings = salary * (savingPercentage / 100);
    const spending = salary - savings;

    result.innerHTML = `
      You can save <strong>${savings.toFixed(2)}</strong>
      ${period === "weekly" ? "per week" : "per month"} and spend
      <strong>${spending.toFixed(2)}</strong>
      ${period === "weekly" ? "per week" : "per month"}.
    `;
  });
