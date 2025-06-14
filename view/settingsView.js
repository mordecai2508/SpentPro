import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useCategoryViewModel from '../viewmodels/useCategoryViewModel';
import useGoalViewModel from '../viewmodels/useGoalViewModel';

export default function SettingsView({ onBack }) {
  const { customCategories, loadCustomCategories, createCategory, editCategory, removeCategory } = useCategoryViewModel();
  const { goals, loadGoals, createGoal, editGoal, removeGoal } = useGoalViewModel();

  useEffect(() => {
    loadCustomCategories();
    loadGoals();
  }, []);

  // Estado para modales de categoría
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('gasto');
  const [editingCategory, setEditingCategory] = useState(null);

  // Estado para modales de objetivo
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalAmount, setGoalAmount] = useState('');
  const [goalPeriod, setGoalPeriod] = useState('');
  const [goalProgress, setGoalProgress] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [modifyGoalModalVisible, setModifyGoalModalVisible] = useState(false);
  const [modifyGoalAmount, setModifyGoalAmount] = useState('');
  const [modifyGoalType, setModifyGoalType] = useState('agregar');
  const [goalToModify, setGoalToModify] = useState(null);

  // Lógica para agregar/editar categoría
  const handleSaveCategory = async () => {
    if (!categoryName) {
      Alert.alert('Error', 'El nombre de la categoría es obligatorio');
      return;
    }
    if (editingCategory) {
      await editCategory(editingCategory.id, { name: categoryName, type: categoryType, isCustom: true });
    } else {
      await createCategory({ name: categoryName, type: categoryType, isCustom: true });
    }
    setCategoryModalVisible(false);
    setCategoryName('');
    setCategoryType('gasto');
    setEditingCategory(null);
  };

  // Lógica para agregar/editar objetivo
  const handleSaveGoal = async () => {
    if (!goalAmount || !goalPeriod) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    const goalData = {
      amount: parseFloat(goalAmount),
      period: goalPeriod,
      progress: goalProgress ? parseFloat(goalProgress) : 0,
    };
    if (editingGoal) {
      await editGoal(editingGoal.id, goalData);
    } else {
      await createGoal(goalData);
    }
    setGoalModalVisible(false);
    setGoalAmount('');
    setGoalPeriod('');
    setGoalProgress('');
    setEditingGoal(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de Categorías</Text>
      <FlatList
        data={customCategories}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Button
              title="Editar"
              onPress={() => {
                setEditingCategory(item);
                setCategoryName(item.name);
                setCategoryType(item.type || 'gasto');
                setCategoryModalVisible(true);
              }}
            />
            <Button title="Eliminar" onPress={() => removeCategory(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No hay categorías</Text>}
      />
      <Button
        title="Agregar Categoría"
        onPress={() => {
          setEditingCategory(null);
          setCategoryName('');
          setCategoryType('gasto');
          setCategoryModalVisible(true);
        }}
      />

      <Text style={styles.title}>Configuración de Objetivos</Text>
      <FlatList
        data={goals}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>
              Monto: ${item.amount} - Período: {item.period} - Progreso: {item.progress}
            </Text>
            <Button
              title="Editar"
              onPress={() => {
                setEditingGoal(item);
                setGoalAmount(item.amount.toString());
                setGoalPeriod(item.period);
                setGoalProgress(item.progress ? item.progress.toString() : '');
                setGoalModalVisible(true);
              }}
            />
            <Button title="Eliminar" onPress={() => removeGoal(item.id)} />
            <Button
              title="Progreso"
              onPress={() => {
                setGoalToModify(item);
                setModifyGoalAmount('');
                setModifyGoalType('agregar');
                setModifyGoalModalVisible(true);
              }}
            />
          </View>
        )}
        ListEmptyComponent={<Text>No hay objetivos</Text>}
      />
      <Button
        title="Agregar Objetivo"
        onPress={() => {
          setEditingGoal(null);
          setGoalAmount('');
          setGoalPeriod('');
          setGoalProgress('');
          setGoalModalVisible(true);
        }}
      />

      <Button title="Regresar" onPress={onBack} />

      {/* Modal para Categoría */}
      <Modal visible={categoryModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la categoría"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <Picker
              selectedValue={categoryType}
              onValueChange={setCategoryType}
              style={styles.input}
            >
              <Picker.Item label="Gasto" value="gasto" />
              <Picker.Item label="Ingreso" value="ingreso" />
            </Picker>
            <Button title="Guardar" onPress={handleSaveCategory} />
            <Button
              title="Cancelar"
              onPress={() => {
                setCategoryModalVisible(false);
                setCategoryName('');
                setCategoryType('gasto');
                setEditingCategory(null);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal para Objetivo */}
      <Modal visible={goalModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingGoal ? 'Editar Objetivo' : 'Agregar Objetivo'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Monto"
              value={goalAmount}
              onChangeText={setGoalAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Período (semanal, mensual, anual)"
              value={goalPeriod}
              onChangeText={setGoalPeriod}
            />
            <Button title="Guardar" onPress={handleSaveGoal} />
            <Button
              title="Cancelar"
              onPress={() => {
                setGoalModalVisible(false);
                setGoalAmount('');
                setGoalPeriod('');
                setGoalProgress('');
                setEditingGoal(null);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal para modificar objetivo */}
      <Modal visible={modifyGoalModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modificar Meta</Text>
            <TextInput
              style={styles.input}
              placeholder="Cantidad"
              value={modifyGoalAmount}
              onChangeText={setModifyGoalAmount}
              keyboardType="numeric"
            />
            <Picker
              selectedValue={modifyGoalType}
              onValueChange={setModifyGoalType}
              style={styles.input}
            >
              <Picker.Item label="Agregar" value="agregar" />
              <Picker.Item label="Retirar" value="retirar" />
            </Picker>
            <Button
              title="Guardar"
              onPress={async () => {
                if (!modifyGoalAmount) {
                  Alert.alert('Error', 'Ingresa una cantidad');
                  return;
                }
                let newProgress = goalToModify.progress || 0;
                const amount = parseFloat(modifyGoalAmount);
                if (modifyGoalType === 'agregar') {
                  newProgress += amount;
                } else {
                  newProgress -= amount;
                  if (newProgress < 0) newProgress = 0;
                }
                // Si el progreso alcanza o supera la meta, reinicia y felicita
                if (newProgress >= goalToModify.amount) {
                  await editGoal(goalToModify.id, { ...goalToModify, progress: 0 });
                  Alert.alert('¡Felicidades!', '¡Has completado tu objetivo de ahorro! El progreso se ha reiniciado.');
                } else {
                  await editGoal(goalToModify.id, { ...goalToModify, progress: newProgress });
                }
                setModifyGoalModalVisible(false);
                setGoalToModify(null);
              }}
            />
            <Button
              title="Cancelar"
              onPress={() => {
                setModifyGoalModalVisible(false);
                setGoalToModify(null);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
  item: { marginBottom: 12, padding: 8, borderBottomWidth: 1, borderColor: '#ccc' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});