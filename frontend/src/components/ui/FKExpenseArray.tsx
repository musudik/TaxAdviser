import React, { useState } from 'react';
import FKInputField from './FKInputField';
import { cn } from '../../lib/utils';

interface ExpenseItem {
  id: string;
  description: string;
  type: string;
  amount: string;
}

interface FKExpenseArrayProps {
  label: string;
  expenseTypes: Record<string, string>;
  className?: string;
  onChange: (expenses: ExpenseItem[]) => void;
  selectedLanguage: string;
}

const FKExpenseArray: React.FC<FKExpenseArrayProps> = ({
  label,
  expenseTypes,
  className,
  onChange,
  selectedLanguage
}) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  const handleAddExpense = () => {
    const newExpense = {
      id: Date.now().toString(),
      description: '',
      type: Object.keys(expenseTypes)[0],
      amount: ''
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    onChange(updatedExpenses);
  };

  const handleRemoveExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    onChange(updatedExpenses);
  };

  const handleChange = (id: string, field: keyof ExpenseItem, value: string) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    );
    setExpenses(updatedExpenses);
    onChange(updatedExpenses);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{label}</h3>
        <button
          type="button"
          onClick={handleAddExpense}
          className="px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          + Add
        </button>
      </div>

      {expenses.map((expense) => (
        <div key={expense.id} className="space-y-3 p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Expense #{expenses.indexOf(expense) + 1}</h4>
            <button
              type="button"
              onClick={() => handleRemoveExpense(expense.id)}
              className="text-red-500 hover:text-red-700"
            >
              - Remove
            </button>
          </div>

          <FKInputField
            selectedLanguage={selectedLanguage}
            id={`${expense.id}-description`}
            value={expense.description}
            onChange={(e) => handleChange(expense.id, 'description', e.target.value)}
            mainLanguage="Description"
            mandatory
          />

          <div className="space-y-1">
            <label className="font-medium text-sm">Type</label>
            <select
              value={expense.type}
              onChange={(e) => handleChange(expense.id, 'type', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 border-gray-300"
            >
              {Object.entries(expenseTypes).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <FKInputField
            selectedLanguage={selectedLanguage}
            id={`${expense.id}-amount`}
            type="number"
            value={expense.amount}
            onChange={(e) => handleChange(expense.id, 'amount', e.target.value)}
            mainLanguage="Amount"
            mandatory
          />
        </div>
      ))}
    </div>
  );
};

export default FKExpenseArray;
