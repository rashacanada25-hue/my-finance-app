import { useState } from 'react';

// 1. הגדרת המבנה (Interface)
interface Transaction {
  id: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
  description: string;
  date: string;
}

// 2. הגדרת האייקונים (אמוג'י) עבור כל קטגוריה - השיפור החדש!
const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔',
  Salary: '💰',
  Entertainment: '🎉',
  Housing: '🏠',
  Transport: '🚗',
  Shopping: '🛍️',
  Other: '🏷️',
};

// יצירת רשימת קטגוריות מתוך המיפוי
const CATEGORIES = Object.keys(CATEGORY_ICONS);

export default function App() {
  // State לניהול הרשימה והעריכה
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State עבור השדות בטופס
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [type, setType] = useState<'Income' | 'Expense'>('Expense');
  // הגדרת תאריך ברירת מחדל להיום
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // פונקציה להוספה או עדכון טרנזקציה
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    if (editingId) {
      // עדכון טרנזקציה קיימת
      setTransactions(transactions.map(t => 
        t.id === editingId ? { ...t, description, amount: Number(amount), category, type, date } : t
      ));
      setEditingId(null);
    } else {
      // הוספת טרנזקציה חדשה
      const newTx: Transaction = {
        id: Date.now().toString(),
        description,
        amount: Number(amount),
        category,
        type,
        date
      };
      // תצוגה בסדר כרונולוגי הפוך (החדש ביותר למעלה)
      setTransactions([newTx, ...transactions]);
    }

    // איפוס טופס
    setDescription('');
    setAmount('');
    setCategory('Other');
    setDate(new Date().toISOString().split('T')[0]);
  };

  // פונקציה למחיקה
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // פונקציה להכנת עריכה
  const startEdit = (t: Transaction) => {
    setEditingId(t.id);
    setDescription(t.description);
    setAmount(t.amount.toString());
    setCategory(t.category);
    setType(t.type);
    setDate(t.date);
  };

  // חישובי תקציר בזמן אמת (Real-time Budget Summary)
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
  const totalSavings = totalIncome - totalExpense;

  // חישוב הוצאות לפי קטגוריות
  const categoryTotals = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12" dir="ltr">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight text-indigo-600">Finance Tracker Pro 💰</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your income and expenses with style</p>
        </header>

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-emerald-500">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Income</span>
            <p className="text-2xl font-black text-emerald-600">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-rose-500">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Expenses</span>
            <p className="text-2xl font-black text-rose-600">${totalExpense.toLocaleString()}</p>
          </div>
          <div className={`p-6 rounded-3xl shadow-lg text-white ${totalSavings >= 0 ? 'bg-indigo-600' : 'bg-rose-600'}`}>
            <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Total Savings</span>
            <p className="text-2xl font-black">${totalSavings.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add/Edit Transaction Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-slate-800">
                {editingId ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl outline-none border focus:border-indigo-500 transition-all" />
                <input required type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl outline-none border focus:border-indigo-500 transition-all" />
                
                <div className="grid grid-cols-2 gap-3">
                  <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-3 bg-slate-50 rounded-xl border font-bold">
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl border">
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {CATEGORY_ICONS[c]} {c}
                      </option>
                    ))}
                  </select>
                </div>

                <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl outline-none border focus:border-indigo-500 transition-all" />
                
                <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-indigo-600 transition-colors">
                  {editingId ? 'Update Activity' : 'Save Transaction'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => setEditingId(null)} className="w-full text-slate-400 font-bold py-2">Cancel</button>
                )}
              </form>
            </div>
          </div>

          {/* Transactions List & Category BreakDown */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Category Analysis */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                Expenses by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryTotals).map(([cat, val]) => (
                  <div key={cat} className="bg-slate-50 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">{cat}</span>
                      <span className="font-black text-indigo-600 block">${val.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {Object.keys(categoryTotals).length === 0 && <p className="text-slate-400 italic text-sm">No expenses yet...</p>}
              </div>
            </div>

            {/* History List */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Transaction History</h3>
              {transactions.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-50 group hover:shadow-md transition-all">
                  <div className="flex gap-4 items-center">
                    {/* הצגת האייקון  של הקטגוריה בהיסטוריה */}
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner border">
                      {CATEGORY_ICONS[t.category]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg">{t.description}</p>
                      <p className="text-[11px] text-slate-400 uppercase font-bold tracking-tight">
                        {t.category} • {t.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className={`text-xl font-black ${t.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'Income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(t)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg font-bold text-xs uppercase">Edit</button>
                      <button onClick={() => deleteTransaction(t.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg font-bold text-xs uppercase">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed text-slate-300 font-medium">
                  No transactions recorded yet. Start adding!
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}