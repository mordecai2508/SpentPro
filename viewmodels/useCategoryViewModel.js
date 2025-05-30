import { useState } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/categoryService';

export default function useCategoryViewModel() {
  const [categories, setCategories] = useState([]);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function createCategory(category) {
    await addCategory(category);
    await loadCategories();
  }

  async function editCategory(id, updatedData) {
    await updateCategory(id, updatedData);
    await loadCategories();
  }

  async function removeCategory(id) {
    await deleteCategory(id);
    await loadCategories();
  }

  return {
    categories,
    loadCategories,
    createCategory,
    editCategory,
    removeCategory,
  };
}