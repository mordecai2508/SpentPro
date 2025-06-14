import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'categories';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Comida', type: 'gasto', isCustom: false },
  { id: 2, name: 'Transporte', type: 'gasto', isCustom: false },
  { id: 3, name: 'Salud', type: 'gasto', isCustom: false },
  { id: 4, name: 'Salario', type: 'ingreso', isCustom: false },
  { id: 5, name: 'Inversiones', type: 'ingreso', isCustom: false },
  { id: 6, name: 'Otros pagos', type: 'ingreso', isCustom: false },
];

// Obtener todas las categorías
export async function getCategories() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  let parsed = data ? JSON.parse(data) : [];
  // Si el array está vacío, volver a cargar las categorías por defecto
  if (!parsed || parsed.length === 0) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  // Fusionar por defecto si alguna falta (por si el usuario nunca las eliminó)
  const merged = [
    ...DEFAULT_CATEGORIES.filter(def =>
      !parsed.some(cat => cat.id === def.id || cat.name === def.name)
    ),
    ...parsed
  ];
  // Si hubo cambios, actualiza el storage
  if (merged.length !== parsed.length) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }
  return merged;
}

// Agregar una categoría
export async function addCategory(category) {
  const categories = await getCategories();
  const newId = categories.length > 0 ? categories[categories.length - 1].id + 1 : 1;
  const newCategory = { ...category, id: newId };
  const updated = [...categories, newCategory];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newCategory;
}

// Actualizar una categoría
export async function updateCategory(id, updatedData) {
  const categories = await getCategories();
  const updated = categories.map(c => c.id === id ? { ...c, ...updatedData } : c);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Eliminar una categoría
export async function deleteCategory(id) {
  const categories = await getCategories();
  const updated = categories.filter(c => c.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}