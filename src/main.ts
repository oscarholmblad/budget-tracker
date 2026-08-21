/** PSEUDOKOD (vecka 1)
 *
 * 1. Datastruktur
 * - budgetItems = en array som lagrar alla inkomster/utgifter
 * - varje item är ett objekt med:
 *  - id (unik identifierare)
 *  - type (inkomst eller utgift)
 *  - description
 *  - amount
 *  - category
 *
 * 2. Kategorier (laddas från JSON)
 * - skapa categories.json i public-mappen med:
 *  - array av objekt med id och namn
 *  - t.ex. "mat", "transport", "lön"
 * - skapa loadCategories():
 *  - fetch("/ categories.json")
 *  - spara i categories-variabel
 *  - populateCategoryDropdowns()
 *
 * 3. HTML-struktur
 * - Bygg i index.html:
 *  - header med titel
 *  - balands-sektion:
 *   - #balance (visar totalt)
 *   - #total-income
 *   - #total-expenses
 *  - formulär för inkomst:
 *   - input description
 *   - input amount
 *   - select category
 *   - submit knapp
 *  - formulär för utgift:
 *   - samma struktur som inkomst
 *  - lista för transaktioner:
 *   - #transaction-list (ul eller div)
 *
 * 4. Visa kategorier i dropdown
 * - skapa populateCategoryDropdowns():
 *  - för varje category i categories:
 *   - skapa <option> med value=id och text=namn
 *   - lägg till i båda select-elementen
 *
 * 5. Lägg till inkomst/utgift
 * - lyssna på submit på båda formulären
 * - skapa addItem(type, description, amount, category):
 *  - skapa nytt objekt med unikt id (t.ex. Date.now())
 *  - pusha till budgetItems
 *  - saveToLocalStorage()
 *  - renderTransactions()
 *  - updateBalance()
 *  - rensa formuläret
 *
 * 6. Ta bort item
 * - Varje item i listan har en delete-knapp
 * - skapa deleteItem(id):
 *  - filtrera bort item med matchande id från budgetItems
 *  - saveToLocalStorage()
 *  - renderTransactions()
 *  - updateBalance()
 *
 * 7. Beräkna och visa balans
 * - skapa calculateBalance():
 *  - totalIncome = summa av alla items där type === "income"
 *  - totalExpenses = summa av alla items där type === "expense"
 *  - balance = totalIncome - totalExpenses
 *  - return { totalIncome, totalExpenses, balance }
 *
 * - skapa updateBalance():
 *  - kalla på calculateBalance()
 *  - uppdatera #balance, #total-income, #total-expenses i DOM
 *  - om balance >= 0, sätt grönfärg (class "positive")
 *  - om balance < 0, sätt röd färg (class "negative")
 *
 * 8. Rendera transaktioner
 * - skapa renderTransactions():
 *  - töm #transaction-list
 *  - för varje item i budgetItems:
 *   - skapa element (t.ex. <li>) med :
 *    - description
 *    - category
 *    - amount
 *    - delete-knapp
 *   - lägg till i #transaction-list
 *  - koppla evenListeners till delete-knappar
 *
 * 9. localStorage
 * - skapa saveToLocalStorage():
 *  - localStorage.setItem("budgetItems", JSON.stringify(budgetItems))
 *
 * - skapa loadFromLocalStorage():
 *  - hämta data från localStorage
 *  - om data finns, parse och sätt till budgetItems
 *  - om inte finns: budgetItems = []
 *
 * 10. Init (när sidan laddas)
 * - skapa init():
 *  - loadCategories()
 *  - loadFromLocalStorage()
 *  - renderTransactions()
 *  - updateBalance()
 *  - sätt upp eventListeners för formulären
 *
 * - kör init() när DOM är redo
 */

/** PSEUDOKOD (vecka 2)
 *
 * 1. Skapa model.ts
 * - skapa interface BudgetItem:
 *  - id: string
 *  - type: "income" | "expense"
 *  - description: string
 *  - amount: number
 *  - category: string
 *
 * - skapa interface category:
 *  - id: string
 *  - name: string
 *
 * 2. Importera interfaces
 * - i main.ts:
 *  - import type { BudgetItem, Category } from "./model.ts"
 *
 * 3. använda interface i array
 * - let budgetItems: BudgetItem[] = []
 * - let categories: Category[] = []
 *
 * 4. Typa funktioner
 * - function addItem(
 *  type: "income" | "expense",
 *  description: string,
 *  amount: number,
 *  category: string)
 *  : void
 *
 * - function calculateBalance(items: BudgetItem[]): {
 *    totalIncome: number,
 *    totalExpenses: number,
 *    balance: number
 * }
 *
 * - function deleteItem(id: string): void
 * function loadFromLocalStorage(): BudgetItem[]
 *
 * 5. Ta bort @ts-nocheck
 * - se till att TypeScript-checken är aktiverad
 * - fixa eventuella TypeScript-fel
 */

import "./style.css";
import type { BudgetItem, Category } from "./models";
import categoriesData from "./categories.json";

// === DATA ===
let budgetItems: BudgetItem[] = [];
const categories: Category[] = categoriesData.categories;
// === FUNKTIONER ===

function addItem(
  type: "income" | "expense",
  description: string,
  amount: number,
  category: string,
): void {
  const newItem = {
    id: Date.now().toString(),
    type: type,
    description: description,
    amount: amount,
    category: category,
  };

  budgetItems.push(newItem);

  saveToLocalStorage();
  renderTransactions();
  updateBalance();
}

function saveToLocalStorage(): void {
  localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
}

function loadFromLocalStorage(): void {
  const data = localStorage.getItem("budgetItems");
  if (data) {
    budgetItems = JSON.parse(data);
  }
}

function renderTransactions() {
  const list = document.getElementById("transaction-list");
  if (!list) return;

  list.innerHTML = "";

  budgetItems.forEach((item) => {
    const li = document.createElement("li");

    const categoryName =
      categories.find((c) => c.id === item.category)?.name ?? item.category;

    li.innerHTML = `
    <span class="tx-description">${item.description}</span>
    <span class="tx-category">${categoryName}</span>
    <span class="tx-amount">${item.type === "income" ? "+" : "-"}${item.amount} kr</span>
    <button class="tx-delete" data-id="${item.id}" aria-label="Ta bort ${item.description}">Ta bort</button>
    `;

    const deleteBtn = li.querySelector("button");
    deleteBtn?.addEventListener("click", () => {
      deleteItem(item.id);
    });

    list.appendChild(li);
  });
}

function deleteItem(id: string): void {
  budgetItems = budgetItems.filter((item) => item.id !== id);

  saveToLocalStorage();
  renderTransactions();
  updateBalance();
}

function calculateBalance() {
  const totalIncome = budgetItems
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = budgetItems
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, balance };
}

function updateBalance() {
  const { totalIncome, totalExpenses, balance } = calculateBalance();

  const balanceEl = document.getElementById("balance");
  const incomeEl = document.getElementById("total-income");
  const expensesEl = document.getElementById("total-expenses");

  if (balanceEl) {
    balanceEl.textContent = `${balance} kr`;
    balanceEl.className = balance >= 0 ? "positive" : "negative";
  }

  if (incomeEl) incomeEl.textContent = `${totalIncome} kr`;
  if (expensesEl) expensesEl.textContent = `${totalExpenses} kr`;
}

function populateCategoryDropdowns() {
  const incomeSelect = document.getElementById("income-category");
  const expenseSelect = document.getElementById("expense-category");

  categories.forEach((category) => {
    const incomeOption = document.createElement("option");
    incomeOption.value = category.id;
    incomeOption.textContent = category.name;
    incomeSelect?.appendChild(incomeOption);

    const expenseOption = document.createElement("option");
    expenseOption.value = category.id;
    expenseOption.textContent = category.name;
    expenseSelect?.appendChild(expenseOption);
  });
}

// === INIT ===

function init() {
  populateCategoryDropdowns();
  loadFromLocalStorage();
  renderTransactions();
  updateBalance();

  const incomeForm = document.getElementById("income-form") as HTMLFormElement;
  const expenseForm = document.getElementById(
    "expense-form",
  ) as HTMLFormElement;

  incomeForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = (
      document.getElementById("income-description") as HTMLInputElement
    ).value;
    const amount = parseFloat(
      (document.getElementById("income-amount") as HTMLInputElement).value,
    );
    const category = (
      document.getElementById("income-category") as HTMLInputElement
    ).value;

    addItem("income", description, amount, category);
    incomeForm.reset();
  });

  expenseForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = (
      document.getElementById("expense-description") as HTMLInputElement
    ).value;
    const amount = parseFloat(
      (document.getElementById("expense-amount") as HTMLInputElement).value,
    );
    const category = (
      document.getElementById("expense-category") as HTMLInputElement
    ).value;

    addItem("expense", description, amount, category);
    expenseForm.reset();
  });
}

init();
