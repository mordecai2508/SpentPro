import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'goals';

// Obtener todos los objetivos
export async function getGoals() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Agregar un objetivo
export async function addGoal(goal) {
  const goals = await getGoals();
  const newId = goals.length > 0 ? goals[goals.length - 1].id + 1 : 1;
  const newGoal = { ...goal, id: newId };
  const updated = [...goals, newGoal];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newGoal;
}

// Actualizar un objetivo
export async function updateGoal(id, updatedData) {
  const goals = await getGoals();
  const updated = goals.map(g => g.id === id ? { ...g, ...updatedData } : g);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Eliminar un objetivo
export async function deleteGoal(id) {
  const goals = await getGoals();
  const updated = goals.filter(g => g.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}