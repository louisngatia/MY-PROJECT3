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

// Define a function that calculates how many weeks it takes to reach a savings goal
function calculateWeeksToGoal() {
  // Get the savings goal input element from the page using its id attribute
  const goalInput = document.getElementById('goal');
  // Get the weekly savings input element from the page using its id attribute
  const weeklyInput = document.getElementById('weekly');
  // Get the result output div from the page using its id attribute
  const resultDiv = document.getElementById('result');
  // Read the goal value from the input field and convert it to a number
  const goal = parseFloat(goalInput.value);
  // Read the weekly savings value from the input field and convert it to a number
  const weekly = parseFloat(weeklyInput.value);
  // Check whether either value is missing, not a number, or invalid for calculation
  if (isNaN(goal) || isNaN(weekly) || goal <= 0 || weekly <= 0) {
    // Display a helpful error message when the user enters invalid numbers
    resultDiv.textContent = 'Please enter a valid savings goal and a weekly amount greater than zero.';
    // Exit the function early because we cannot calculate with bad input
    return;
  }
  // Divide the goal by the weekly savings amount to find weeks needed
  const weeks = Math.ceil(goal / weekly);
  // Choose the correct singular or plural word for "week" based on the result
  const weekWord = weeks === 1 ? 'week' : 'weeks';
  // Build a plain-language sentence that tells the user how long saving will take
  const message = `It will take you ${weeks} ${weekWord} to reach your savings goal of $${goal.toFixed(2)} if you save $${weekly.toFixed(2)} each week.`;
  // Write the message into the result div so the user can read it on the page
  resultDiv.textContent = message;
}

// Get the calculate button element from the page using its id attribute
const calculateButton = document.getElementById('calculate');
// Attach a click listener so the calculation runs when the user presses the button
calculateButton.addEventListener('click', calculateWeeksToGoal);
