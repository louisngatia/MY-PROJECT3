document.addEventListener("DOMContentLoaded", function () {
  /*
    MAIN CALCULATORS
  */

  const budgetForm = document.getElementById("budgetForm");
  const savingsForm = document.getElementById("savingsForm");

  const budgetResult = document.getElementById("budgetResult");
  const savingsResult = document.getElementById("savingsResult");

  const salaryInput = document.getElementById("salary");
  const salaryPeriodInput =
    document.getElementById("salaryPeriod");

  const savingPercentageInput =
    document.getElementById("savingPercentage");

  const weeklySavingsInput =
    document.getElementById("weeklySavings");

  const savingsTargetInput =
    document.getElementById("savingsTarget");

  const interestRateInput =
    document.getElementById("interestRate");

  const compoundMonthlyInput =
    document.getElementById("compoundMonthly");

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
  */

  budgetForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const salary = Number(salaryInput.value);
    const period = salaryPeriodInput.value;
    const savingPercentage =
      Number(savingPercentageInput.value);

    if (
      salary < 1000 ||
      savingPercentage < 5 ||
      savingPercentage > 100
    ) {
      showResult(
        budgetResult,
        "Please enter a salary of at least 1,000 and a savings percentage between 5 and 100."
      );

      return;
    }

    const savings = salary * (savingPercentage / 100);
    const spending = salary - savings;

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

    weeklySavingsInput.value =
      weeklySavings.toFixed(2);

    const periodText =
      period === "weekly" ? "week" : "month";

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

        Weekly savings:
        <strong>${formatMoney(weeklySavings)}</strong>.
      `
    );
  });

  /*
    SAVINGS TARGET CALCULATOR
  */

  savingsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const target = Number(savingsTargetInput.value);
    const interestRate = Number(interestRateInput.value);
    const compoundMonthly = compoundMonthlyInput.checked;

    if (target < 100) {
      showResult(
        savingsResult,
        "Please enter a savings target of at least 100."
      );

      return;
    }

    if (sharedBudget.weeklySavings <= 0) {
      showResult(
        savingsResult,
        "Please calculate your budget first. The weekly savings value will then be used here."
      );

      return;
    }

    if (
      interestRate < 0 ||
      interestRate > 100
    ) {
      showResult(
        savingsResult,
        "Please enter an interest rate between 0 and 100."
      );

      return;
    }

    const weeklySavings =
      sharedBudget.weeklySavings;

    let weeks;
    let interestMessage;

    if (interestRate === 0) {
      weeks = Math.ceil(target / weeklySavings);

      interestMessage =
        "Interest was not included because the rate is 0%.";
    } else {
      const periodsPerYear =
        compoundMonthly ? 12 : 52;

      const periodicRate =
        interestRate / 100 / periodsPerYear;

      const periodicSavings =
        weeklySavings * (52 / periodsPerYear);

      const periods = Math.log(
        1 +
          (target * periodicRate) /
          periodicSavings
      ) / Math.log(1 + periodicRate);

      weeks = Math.ceil(
        periods * (52 / periodsPerYear)
      );

      interestMessage = compoundMonthly
        ? "Interest is compounded monthly."
        : "Interest is compounded weekly.";
    }

    const months = weeks / 4.345;

    const earlierWeeks = Math.max(weeks - 1, 1);

    const earlierWeeklySavings =
      target / earlierWeeks;

    showResult(
      savingsResult,
      `
        <strong>Your savings plan:</strong><br>

        Target:
        <strong>${formatMoney(target)}</strong>.<br>

        Weekly savings:
        <strong>${formatMoney(weeklySavings)}</strong>.<br>

        Estimated time:
        <strong>${weeks} week${weeks === 1 ? "" : "s"}</strong>.<br>

        Approximately:
        <strong>${months.toFixed(1)} months</strong>.<br>

        <span>${interestMessage}</span>

        <div class="suggestion">
          To reach your target one week earlier, save approximately
          <strong>${formatMoney(earlierWeeklySavings)}</strong>
          per week.
        </div>
      `
    );
  });

  /*
    INVESTMENT PLANS AND FINANCIAL SKILLS
  */

  const growthMainToggle =
    document.getElementById("growthMainToggle");

  const growthPanel =
    document.getElementById("growthPanel");

  const growthSearch =
    document.getElementById("growthSearch");

  const growthToggleView =
    document.getElementById("growthToggleView");

  const growthShowMore =
    document.getElementById("growthShowMore");

  const growthStatus =
    document.getElementById("growthStatus");

  const growthCards =
    document.getElementById("growthCards");

  const growthEmpty =
    document.getElementById("growthEmpty");

  let showAllIdeas = false;

  const growthIdeas = [
    {
      title: "Emergency fund",
      description:
        "Build a cash reserve for unexpected expenses before taking higher risks.",
      risk: "Low",
      tier: "Starter",
      details:
        "Start with a small target, then work toward several months of essential expenses."
    },
    {
      title: "Debt repayment",
      description:
        "Reduce expensive debt so more of your income can go toward your goals.",
      risk: "Low",
      tier: "Starter",
      details:
        "List your debts, interest rates, and minimum payments. Prioritize high-interest debt."
    },
    {
      title: "Budgeting skills",
      description:
        "Track income and expenses so you can make informed spending decisions.",
      risk: "Low",
      tier: "Starter",
      details:
        "Review your budget regularly and adjust it when your income or expenses change."
    },
    {
      title: "Index funds",
      description:
        "Learn how diversified funds can provide long-term investment exposure.",
      risk: "Varies",
      tier: "Intermediate",
      details:
        "Research fees, diversification, time horizon, and the possibility of losing money."
    },
    {
      title: "Retirement planning",
      description:
        "Plan long-term contributions around your goals, income, and expected needs.",
      risk: "Varies",
      tier: "Intermediate",
      details:
        "Consider your time horizon, contribution consistency, and available retirement products."
    },
    {
      title: "Negotiation skills",
      description:
        "Improve your ability to negotiate salary, fees, and important purchases.",
      risk: "Low",
      tier: "Useful skill",
      details:
        "Research comparable prices or salaries and prepare your points before negotiating."
    },
    {
      title: "Side-income skills",
      description:
        "Develop useful skills that may help you create additional income streams.",
      risk: "Varies",
      tier: "Useful skill",
      details:
        "Examples include writing, design, tutoring, coding, sales, and digital marketing."
    },
    {
      title: "Investment research",
      description:
        "Learn how to compare risk, fees, returns, and information before investing.",
      risk: "Varies",
      tier: "Advanced",
      details:
        "Avoid making decisions based only on popularity or past performance."
    }
  ];

  function renderGrowthCards() {
    const searchTerm =
      growthSearch.value.trim().toLowerCase();

    const matchingIdeas = growthIdeas.filter(function (idea) {
      const searchableText = `
        ${idea.title}
        ${idea.description}
        ${idea.risk}
        ${idea.tier}
        ${idea.details}
      `.toLowerCase();

      return searchableText.includes(searchTerm);
    });

    const visibleIdeas = showAllIdeas
      ? matchingIdeas
      : matchingIdeas.slice(0, 4);

    growthCards.innerHTML = "";

    visibleIdeas.forEach(function (idea) {
      const card = document.createElement("article");

      const riskClass =
        idea.risk.toLowerCase() === "low"
          ? "low"
          : idea.risk.toLowerCase() === "medium"
            ? "medium"
            : "varies";

      card.className = "growth-card";

      card.innerHTML = `
        <h3>${idea.title}</h3>

        <p>${idea.description}</p>

        <div class="tags">
          <span class="risk-tag ${riskClass}">
            ${idea.risk} risk
          </span>

          <span class="tier-tag">
            ${idea.tier}
          </span>
        </div>

        <details>
          <summary>More information</summary>
          <p>${idea.details}</p>
        </details>
      `;

      growthCards.appendChild(card);
    });

    const totalMatches = matchingIdeas.length;

    growthStatus.textContent =
      totalMatches === 0
        ? ""
        : `Showing ${visibleIdeas.length} of ${totalMatches} idea${
            totalMatches === 1 ? "" : "s"
          }.`;

    growthEmpty.classList.toggle(
      "hidden",
      totalMatches !== 0
    );

    growthShowMore.classList.toggle(
      "hidden",
      totalMatches <= 4
    );

    growthShowMore.textContent = showAllIdeas
      ? "Show fewer ideas"
      : "Show more ideas";

    growthToggleView.textContent = showAllIdeas
      ? "Show featured ideas"
      : "Show all ideas";
  }

  /*
    Hide/show the entire Investment Plans and
    Financial Skills section.
  */

  growthMainToggle.addEventListener("click", function () {
    const isHidden =
      growthPanel.classList.toggle("hidden");

    growthMainToggle.textContent = isHidden
      ? "Show Investment Plans & Financial Skills"
      : "Hide Investment Plans & Financial Skills";

    if (!isHidden) {
      renderGrowthCards();
    }
  });

  /*
    Search ideas while typing.
  */

  growthSearch.addEventListener("input", function () {
    renderGrowthCards();
  });

  /*
    Show all ideas or only featured ideas.
  */

  growthToggleView.addEventListener("click", function () {
    showAllIdeas = !showAllIdeas;
    renderGrowthCards();
  });

  /*
    Show more or fewer ideas.
  */

  growthShowMore.addEventListener("click", function () {
    showAllIdeas = !showAllIdeas;
    renderGrowthCards();
  });
});