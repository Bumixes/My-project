import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);

  const [balance, setBalance] = useState(5000);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");
  const [transactions, setTransactions] = useState([]);

  // Load saved user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("user", username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleTransaction = (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert("Enter a valid amount!");
      return;
    }

    const transactionAmount = Number(amount);

    if (type === "withdraw" && transactionAmount > balance) {
      alert("Insufficient funds!");
      return;
    }

    const newBalance =
      type === "deposit"
        ? balance + transactionAmount
        : balance - transactionAmount;

    setBalance(newBalance);

    const newTransaction = {
      id: Date.now(),
      type,
      amount: transactionAmount,
      date: new Date().toLocaleString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount("");
  };

  // If no user logged in, show login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <div className="top-bar">
        <h1 className="title">💳 Transaction App</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <p className="welcome">Welcome, <span>{user}</span> 👋</p>

      <div className="card">
        <h2>Current Balance</h2>
        <p className="balance">₦{balance.toLocaleString()}</p>
      </div>

      <form className="form" onSubmit={handleTransaction}>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>

        <button type="submit">
          {type === "deposit" ? "Add Money" : "Withdraw Money"}
        </button>
      </form>

      <div className="history">
        <h2>Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="empty">No transactions yet...</p>
        ) : (
          <ul>
            {transactions.map((t) => (
              <li key={t.id} className={t.type}>
                <span>
                  {t.type === "deposit" ? "➕ Deposit" : "➖ Withdraw"}
                </span>
                <span>₦{t.amount.toLocaleString()}</span>
                <small>{t.date}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
