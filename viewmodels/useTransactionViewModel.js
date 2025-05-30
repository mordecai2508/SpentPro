import { useState } from 'react';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';

export default function useTransactionViewModel() {
  const [transactions, setTransactions] = useState([]);

  async function loadTransactions() {
    const data = await getTransactions();
    setTransactions(data);
  }

  async function createTransaction(transaction) {
    await addTransaction(transaction);
    await loadTransactions();
  }

  async function editTransaction(id, updatedData) {
    await updateTransaction(id, updatedData);
    await loadTransactions();
  }

  async function removeTransaction(id) {
    await deleteTransaction(id);
    await loadTransactions();
  }

  return {
    transactions,
    loadTransactions,
    createTransaction,
    editTransaction,
    removeTransaction,
  };
}