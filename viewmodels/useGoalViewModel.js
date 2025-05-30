import { useState } from 'react';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../services/goalService';

export default function useGoalViewModel() {
  const [goals, setGoals] = useState([]);

  async function loadGoals() {
    const data = await getGoals();
    setGoals(data);
  }

  async function createGoal(goal) {
    await addGoal(goal);
    await loadGoals();
  }

  async function editGoal(id, updatedData) {
    await updateGoal(id, updatedData);
    await loadGoals();
  }

  async function removeGoal(id) {
    await deleteGoal(id);
    await loadGoals();
  }

  return {
    goals,
    loadGoals,
    createGoal,
    editGoal,
    removeGoal,
  };
}