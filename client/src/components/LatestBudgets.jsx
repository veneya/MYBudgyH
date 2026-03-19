import React from "react";

const LatestBudgets = () => {
  const budgets = [
    { category: "Shopping", spent: 150, remaining: 2150 },
    { category: "Home Decor", spent: 3800, remaining: 1200 },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mt-6">
      <h3 className="text-xl font-semibold text-gray-800">Latest Budgets</h3>
      {budgets.map((budget, index) => (
        <div key={index} className="flex justify-between border-b py-3">
          <span className="text-gray-700 font-semibold">{budget.category}</span>
          <span className="text-gray-500">${budget.spent} spent</span>
          <span className="text-gray-800 font-bold">${budget.remaining} remaining</span>
        </div>
      ))}
    </div>
  );
};

export default LatestBudgets;
