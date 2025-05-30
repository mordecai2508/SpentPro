import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'transactions';

export async function getTransactions() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function addTransaction(transaction) {
  const transactions = await getTransactions();
  const newId = transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1;
  const newTransaction = { ...transaction, id: newId };
  const updated = [...transactions, newTransaction];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newTransaction;
}

export async function updateTransaction(updatedTransaction) {
  const transactions = await getTransactions();
  const updated = transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function deleteTransaction(id) {
  const transactions = await getTransactions();
  const updated = transactions.filter(t => t.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
