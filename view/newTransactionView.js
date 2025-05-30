import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useTransactionViewModel from '../viewmodels/useTransactionViewModel';
import useCategoryViewModel from '../viewmodels/useCategoryViewModel';

export default function NewTransactionView({ onTransactionAdded, onCancel }) {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const { createTransaction } = useTransactionViewModel();
  const { categories, loadCategories } = useCategoryViewModel();

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async () => {
    if (!type || !amount || !date || !categoryId) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    await createTransaction({
      type,
      amount: parseFloat(amount),
      date,
      categoryId: parseInt(categoryId),
      notes,
    });
    Alert.alert('Éxito', 'Transacción agregada');
    onTransactionAdded && onTransactionAdded();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Transacción</Text>
      {/* Picker para tipo */}
      <Picker
        selectedValue={type}
        onValueChange={setType}
        style={styles.input}
      >
        <Picker.Item label="Selecciona tipo" value="" />
        <Picker.Item label="Ingreso" value="ingreso" />
        <Picker.Item label="Gasto" value="gasto" />
      </Picker>
      <TextInput style={styles.input} placeholder="Monto" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Fecha (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      {/* Picker para categoría */}
      <Picker
        selectedValue={categoryId}
        onValueChange={setCategoryId}
        style={styles.input}
      >
        <Picker.Item label="Selecciona categoría" value="" />
        {categories.map(cat => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
        ))}
      </Picker>
      <TextInput style={styles.input} placeholder="Notas" value={notes} onChangeText={setNotes} />
      <Button title="Guardar" onPress={handleSave} />
      <Button title="Cancelar" onPress={onCancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
});