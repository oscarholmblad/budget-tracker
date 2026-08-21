export interface BudgetItem {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}
