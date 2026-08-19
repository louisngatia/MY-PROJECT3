document.addEventListener("DOMContentLoaded", function () {
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

    let lowSavingsNote = "";
    if (savingPercentage < 20) {
      lowSavingsNote = `
        <div class="suggestion">
          A common starting benchmark is saving around 20% of income.
          Saving less isn't wrong, but it may take longer to build an
          emergency fund or hit bigger goals.
        </div>
      `;
    }

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

        ${lowSavingsNote}
      `
    );

    // Re-tier the financial ideas panel now that we know the salary.
    updateTierFromSalary(salary, period);
  });

  /*
    SAVINGS TARGET CALCULATOR
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

    const weeklySavings =
      sharedBudget.weeklySavings;

    const weeks = Math.ceil(
      target / weeklySavings
    );

    const months = weeks / 4.345;

    const earlierWeeks = Math.max(weeks - 1, 1);

    const earlierWeeklySavings =
      target / earlierWeeks;

    let interestHtml = "";

    const annualRatePercent = Number(interestRateInput.value) || 0;

    if (annualRatePercent > 0) {
      const compoundMonthly = compoundMonthlyInput.checked;

      const weeksWithInterest = simulateWeeksToTarget(
        target,
        weeklySavings,
        annualRatePercent,
        compoundMonthly
      );

      const weeksSaved = Math.max(0, weeks - weeksWithInterest);
      const monthsWithInterest = weeksWithInterest / 4.345;

      interestHtml = `
        <div class="suggestion">
          With a <strong>${annualRatePercent}%</strong> annual interest rate
          (compounded ${compoundMonthly ? "monthly" : "weekly"}), you would
          reach your target in approximately
          <strong>${weeksWithInterest} week${weeksWithInterest === 1 ? "" : "s"}</strong>
          (about <strong>${monthsWithInterest.toFixed(1)} months</strong>) &mdash;
          roughly ${weeksSaved} week${weeksSaved === 1 ? "" : "s"} sooner than
          saving the same amount with no interest at all. That difference is
          compound interest doing part of the work for you.
        </div>
      `;
    }

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

        ${interestHtml}
      `
    );
  });

  /*
    Simulates weekly contributions growing with compound interest, one
    period at a time, until the balance reaches the target.
  */
  function simulateWeeksToTarget(
    target,
    weeklyContribution,
    annualRatePercent,
    compoundMonthly
  ) {
    const annualRate = annualRatePercent / 100;
    let balance = 0;
    let weeks = 0;
    const maxWeeks = 52 * 100; // safety cap: 100 years

    if (compoundMonthly) {
      const monthlyRate = annualRate / 12;
      let weeksSinceLastMonth = 0;

      while (balance < target && weeks < maxWeeks) {
        balance += weeklyContribution;
        weeks += 1;
        weeksSinceLastMonth += 1;

        if (weeksSinceLastMonth >= 4.345) {
          balance += balance * monthlyRate;
          weeksSinceLastMonth -= 4.345;
        }
      }
    } else {
      const weeklyRate = annualRate / 52;

      while (balance < target && weeks < maxWeeks) {
        balance += weeklyContribution;
        balance += balance * weeklyRate;
        weeks += 1;
      }
    }

    return weeks;
  }

  /* ==========================================================
     INVESTMENT PLANS & FINANCIAL SKILLS PANEL
     ==========================================================

     Each idea has a "tier":
       "saving"    -> best suited to lower / tighter incomes
       "investing" -> best suited to higher incomes with more spare cash
       "both"      -> useful at any income level

     ADJUST THIS THRESHOLD to match your currency and audience.
     It's currently set as an ANNUAL salary figure.
  */
  const ANNUAL_INCOME_THRESHOLD = 40000;

  const growthIdeas = [
    // ---- SAVING-FOCUSED (lower / tighter income) ----
    {
      title: "Build an emergency fund first",
      tier: "saving",
      risk: "low",
      text: "Aim for 3-6 months of essential expenses in an easy-to-reach account before anything else.",
      moreInfo: "An emergency fund is what stops a broken phone or a missed shift from turning into high-interest debt. Start small (even one week of expenses) and build it up automatically with each paycheck."
    },
    {
      title: "Automate your savings",
      tier: "saving",
      risk: "low",
      text: "Set up an automatic transfer to savings on payday so it happens before you have a chance to spend it.",
      moreInfo: "This is sometimes called 'paying yourself first.' Removing the decision from your hands each month is one of the most reliable ways to actually stick to a savings goal."
    },
    {
      title: "Use the 50/30/20 rule",
      tier: "saving",
      risk: "low",
      text: "A simple starting split: 50% needs, 30% wants, 20% savings or debt repayment.",
      moreInfo: "It's a guideline, not a law — adjust the percentages to fit your real costs. The value is in having a simple default instead of guessing every month."
    },
    {
      title: "Cut recurring subscriptions",
      tier: "saving",
      risk: "low",
      text: "Review streaming, app, and membership subscriptions every few months and cancel what you don't use.",
      moreInfo: "Small recurring charges are easy to forget about. A 15-minute audit every quarter often frees up real monthly cash without changing your lifestyle much."
    },
    {
      title: "Avoid lifestyle inflation",
      tier: "saving",
      risk: "low",
      text: "When your income goes up, try to save or invest a good chunk of the raise instead of raising spending to match.",
      moreInfo: "It's natural to want to upgrade your lifestyle after a raise. Even saving half of each future raise, while enjoying the other half, keeps your savings rate climbing over time."
    },
    {
      title: "Pay down high-interest debt",
      tier: "saving",
      risk: "low",
      text: "Paying off a credit card charging 20%+ interest is like an instant, guaranteed 20% return.",
      moreInfo: "Before aggressively saving or investing, high-interest debt (credit cards, some personal loans) is usually worth clearing first, since few investments reliably beat that interest cost."
    },
    {
      title: "Use cash-back and rewards wisely",
      tier: "saving",
      risk: "low",
      text: "Cash-back or rewards can add up, but only if you pay the balance in full and wouldn't overspend to earn them.",
      moreInfo: "Rewards are only a win if they don't change your spending habits. If a reward program tempts you to spend more than you would otherwise, the math usually doesn't work in your favor."
    },
    {
      title: "Meal planning to cut food costs",
      tier: "saving",
      risk: "low",
      text: "Planning meals and shopping with a list can meaningfully lower one of the biggest flexible expenses: food.",
      moreInfo: "Food spending is one of the few 'needs' categories with real room to adjust. Batch cooking and planning around sales can cut costs without much sacrifice in quality."
    },
    {
      title: "Build credit responsibly",
      tier: "saving",
      risk: "low",
      text: "Paying bills on time and keeping credit card balances low builds a credit history that saves you money later.",
      moreInfo: "A stronger credit history often means lower interest rates on future loans, car financing, or even some rental applications — it's worth treating as a long-term asset."
    },
    {
      title: "Negotiate recurring bills",
      tier: "saving",
      risk: "low",
      text: "Phone, internet, and insurance providers will sometimes lower your rate if you simply ask or compare offers.",
      moreInfo: "Many providers have retention discounts they don't advertise. A short call once a year comparing your rate against competitors can save a meaningful amount with very little effort."
    },

    // ---- INVESTING-FOCUSED (higher income / more spare cash) ----
    {
      title: "Employer retirement matching",
      tier: "investing",
      risk: "low",
      text: "If an employer matches retirement contributions, that match is essentially free, immediate return on your money.",
      moreInfo: "Not contributing enough to get the full employer match is often described as leaving free money on the table — it's usually the first place to direct extra income."
    },
    {
      title: "Tax-advantaged retirement accounts",
      tier: "investing",
      risk: "low",
      text: "Many countries offer retirement accounts with tax benefits for long-term saving and investing.",
      moreInfo: "These accounts often reduce your taxable income now or let investments grow tax-free, depending on the type. The rules vary a lot by country, so it's worth checking what's available locally."
    },
    {
      title: "Index funds & ETFs",
      tier: "investing",
      risk: "medium",
      text: "These pool your money into a broad basket of investments, spreading risk compared to picking individual stocks.",
      moreInfo: "Because they track a broad market rather than betting on one company, index funds are often used as a simple, lower-effort long-term core investment. Value can still go up and down."
    },
    {
      title: "Dollar-cost averaging",
      tier: "investing",
      risk: "medium",
      text: "Investing a fixed amount on a regular schedule, rather than one lump sum, smooths out the effect of market ups and downs.",
      moreInfo: "This approach removes the pressure of trying to 'time the market.' You buy more units when prices are low and fewer when prices are high, automatically, without having to guess."
    },
    {
      title: "Diversification across asset classes",
      tier: "investing",
      risk: "varies",
      text: "Spreading money across stocks, bonds, and other assets means a drop in one area is less likely to sink your whole plan.",
      moreInfo: "Diversification manages risk, it doesn't eliminate it. How much to diversify, and into what, usually depends on your goals, timeline, and comfort with short-term swings in value."
    },
    {
      title: "Bonds and fixed income",
      tier: "investing",
      risk: "low",
      text: "Bonds generally offer more predictable, lower returns than stocks, often used to balance out riskier investments.",
      moreInfo: "As you get closer to needing the money (like retirement), many people shift some investments from stocks toward bonds to reduce how much the balance can swing right before they need it."
    },
    {
      title: "Real estate investing",
      tier: "investing",
      risk: "medium",
      text: "Owning property, or investing in real estate funds, is another way people build long-term wealth beyond a savings account.",
      moreInfo: "Real estate can generate rental income and may appreciate over time, but it also involves larger upfront costs, less liquidity, and ongoing responsibilities like maintenance or property management."
    },
    {
      title: "Understanding your risk tolerance",
      tier: "investing",
      risk: "varies",
      text: "Higher potential returns usually come with higher potential swings in value — know how much of that you can handle.",
      moreInfo: "Risk tolerance depends on your timeline and temperament, not just your income. Money you'll need in a year should generally sit somewhere more stable than money you won't touch for 20 years."
    },
    {
      title: "Rebalancing your portfolio",
      tier: "investing",
      risk: "medium",
      text: "Periodically adjusting your investments back to your target mix keeps your risk level from drifting over time.",
      moreInfo: "If stocks grow faster than bonds, your portfolio can quietly become riskier than you intended. Rebalancing once or twice a year resets the mix back to what you originally planned."
    },
    {
      title: "Investing in yourself",
      tier: "investing",
      risk: "low",
      text: "Courses, certifications, or skills that raise your earning potential can be one of the highest-return 'investments' available.",
      moreInfo: "Unlike market investments, the return on a new skill or qualification is often more within your control, and it can compound through higher income for the rest of your career."
    },

    // ---- UNIVERSAL (useful at any income level) ----
    {
      title: "Compound interest",
      tier: "both",
      risk: "low",
      text: "Money earns 'interest on interest' over time, so starting early matters more than starting big.",
      moreInfo: "Because growth builds on itself, a smaller amount saved or invested early can end up outgrowing a larger amount started later. Time in the market is often more powerful than timing it perfectly."
    },
    {
      title: "Building financial literacy",
      tier: "both",
      risk: "low",
      text: "Understanding terms like APR, net vs. gross income, and credit scores helps you spot good and bad deals before they cost you money.",
      moreInfo: "Financial literacy compounds like money does — the more you understand, the fewer expensive mistakes you make, and the easier it becomes to evaluate new financial decisions confidently."
    },
    {
      title: "Setting SMART financial goals",
      tier: "both",
      risk: "low",
      text: "Specific, measurable, achievable, relevant, and time-bound goals are easier to actually follow through on than vague ones.",
      moreInfo: "\"Save more\" is hard to act on. \"Save $200/month for a 6-month emergency fund by December\" gives you a clear number to track and a moment to celebrate when you hit it."
    },
    {
      title: "Understanding inflation",
      tier: "both",
      risk: "low",
      text: "Prices tend to rise over time, so money sitting completely idle slowly loses purchasing power.",
      moreInfo: "This is part of why many long-term goals aim for returns that at least keep pace with inflation, rather than only cash sitting at 0%. A savings target set today may need adjusting later."
    },
  ];

  const growthCardsContainer = document.getElementById("growthCards");
  const growthEmptyMessage = document.getElementById("growthEmpty");
  const growthStatus = document.getElementById("growthStatus");
  const growthSearchInput = document.getElementById("growthSearch");
  const growthToggleButton = document.getElementById("growthToggleView");

  // Panel state
  let currentTier = null; // "saving" | "investing" | null (unknown yet)
  let showAllIdeas = false;
  let searchQuery = "";

  function updateTierFromSalary(salary, period) {
    const annualSalary =
      period === "weekly" ? salary * 52 : salary * 12;

    currentTier =
      annualSalary >= ANNUAL_INCOME_THRESHOLD ? "investing" : "saving";

    showAllIdeas = false;
    renderGrowthCards();
  }

  function renderGrowthCards() {
    if (!growthCardsContainer) {
      return;
    }

    const query = searchQuery.trim().toLowerCase();

    let filtered = growthIdeas;

    if (query.length > 0) {
      // Searching looks across ALL ideas, regardless of tier filtering.
      filtered = growthIdeas.filter(function (idea) {
        const haystack =
          (idea.title + " " + idea.text + " " + idea.moreInfo).toLowerCase();
        return haystack.indexOf(query) !== -1;
      });
    } else if (!showAllIdeas && currentTier) {
      filtered = growthIdeas.filter(function (idea) {
        return idea.tier === currentTier || idea.tier === "both";
      });
    }

    // Status line above the cards
    if (growthStatus) {
      if (query.length > 0) {
        growthStatus.textContent = `Showing results for "${searchQuery.trim()}" (${filtered.length} found).`;
      } else if (showAllIdeas || !currentTier) {
        growthStatus.textContent = "Showing all financial ideas.";
      } else if (currentTier === "investing") {
        growthStatus.textContent =
          "Showing investment-focused ideas, based on your salary.";
      } else {
        growthStatus.textContent =
          "Showing saving-focused ideas, based on your salary.";
      }
    }

    // Toggle button label/state
    if (growthToggleButton) {
      if (query.length > 0) {
        growthToggleButton.disabled = true;
        growthToggleButton.textContent = "Show all ideas";
      } else {
        growthToggleButton.disabled = false;
        growthToggleButton.textContent = showAllIdeas
          ? "Show recommended ideas"
          : "Show all ideas";
      }
    }

    if (filtered.length === 0) {
      growthCardsContainer.innerHTML = "";
      if (growthEmptyMessage) {
        growthEmptyMessage.classList.remove("hidden");
      }
      return;
    }

    if (growthEmptyMessage) {
      growthEmptyMessage.classList.add("hidden");
    }

    growthCardsContainer.innerHTML = filtered
      .map(function (idea) {
        const riskLabel =
          idea.risk === "varies" ? "Risk varies" : idea.risk + " risk";

        const tierLabel =
          idea.tier === "both"
            ? "Any income"
            : idea.tier === "investing"
            ? "Higher income"
            : "Any budget";

        return `
          <div class="growth-card">
            <h3>${idea.title}</h3>
            <p>${idea.text}</p>
            <div class="tags">
              <span class="risk-tag ${idea.risk}">${riskLabel}</span>
              <span class="tier-tag">${tierLabel}</span>
            </div>
            <details>
              <summary>More info</summary>
              <p>${idea.moreInfo}</p>
            </details>
          </div>
        `;
      })
      .join("");
  }

  if (growthSearchInput) {
    growthSearchInput.addEventListener("input", function () {
      searchQuery = growthSearchInput.value;
      renderGrowthCards();
    });
  }

  if (growthToggleButton) {
    growthToggleButton.addEventListener("click", function () {
      showAllIdeas = !showAllIdeas;
      renderGrowthCards();
    });
  }
  const growthMainToggle = document.getElementById("growthMainToggle");
const growthPanel = document.getElementById("growthPanel");

growthMainToggle.addEventListener("click", () => {
  growthPanel.classList.toggle("hidden");

  if (growthPanel.classList.contains("hidden")) {
    growthMainToggle.textContent =
      "Show Investment Plans & Financial Skills";
  } else {
    growthMainToggle.textContent =
      "Hide Investment Plans & Financial Skills";
  }
});

  // Initial render (before any budget is calculated, shows everything)
  renderGrowthCards();
});