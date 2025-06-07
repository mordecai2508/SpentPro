import { useState } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/categoryService';

export default function useCategoryViewModel() {
  const [categories, setCategories] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function loadCustomCategories() {
    const data = await getCategories();
    setCustomCategories(data.filter(cat => cat.isCustom));
  }

  async function createCategory(category) {
    await addCategory(category);
    await loadCategories();
    await loadCustomCategories();
  }

  async function editCategory(id, updatedData) {
    await updateCategory(id, updatedData);
    await loadCategories();
    await loadCustomCategories();
  }

  async function removeCategory(id) {
    await deleteCategory(id);
    await loadCategories();
    await loadCustomCategories();
  }

  return {
    categories,
    customCategories,
    loadCategories,
    loadCustomCategories,
    createCategory,
    editCategory,
    removeCategory,
  };
}