import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTransactionViewModel from '../viewmodels/useTransactionViewModel';
import useCategoryViewModel from '../viewmodels/useCategoryViewModel';
import { getTransactions } from '../services/transactionService';

export default function NewTransactionView({ userEmail, onTransactionAdded, onCancel }) {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { createTransaction, loadTransactions } = useTransactionViewModel(userEmail);
  const { categories, loadCategories } = useCategoryViewModel();

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async () => {
    if (!type || !amount || !date || !categoryId) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // Obtener saldo actual
    const allTransactions = await getTransactions();
    const ingresos = allTransactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0);
    const egresos = allTransactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0);
    const saldo = ingresos - egresos;

    if (type === 'gasto' && parseFloat(amount) > saldo) {
      // Reiniciar saldo: puedes agregar una transacción de ajuste o limpiar todas las transacciones
      // Opción 1: Limpiar todas las transacciones
      await AsyncStorage.setItem('transactions', JSON.stringify([]));
      Alert.alert('Saldo reiniciado', 'El egreso supera el saldo, el saldo ha sido reiniciado.');
      onTransactionAdded && onTransactionAdded();
      return;
      // Opción 2: Agregar una transacción de ajuste (opcional)
      // await createTransaction({ type: 'ajuste', amount: -saldo, date, categoryId: 0, notes: 'Ajuste por saldo negativo' });
    } else {
      await createTransaction({
        type,
        amount: parseFloat(amount),
        date,
        categoryId: parseInt(categoryId),
        notes,
      });
      Alert.alert('Éxito', 'Transacción agregada');
      onTransactionAdded && onTransactionAdded();
    }
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
        <Picker.Item label="Egreso" value="gasto" />
      </Picker>
      <TextInput style={styles.input} placeholder="Monto" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 4 }}>Fecha</Text>
        <Button
          title={date ? date : "Selecciona una fecha"}
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const iso = selectedDate.toISOString().split('T')[0];
                setDate(iso);
              }
            }}
          />
        )}
      </View>
      {/* Picker para categoría */}
      <Picker
        selectedValue={categoryId}
        onValueChange={setCategoryId}
        style={styles.input}
        enabled={!!type} // Deshabilita si no hay tipo seleccionado
      >
        <Picker.Item label="Selecciona categoría" value="" />
        {type
          ? categories
              .filter(cat => cat.type === type)
              .map(cat => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
              ))
          : null}
      </Picker>
      {!type && (
        <Text style={{ color: 'gray', marginBottom: 16 }}>
          Selecciona primero el tipo de transacción
        </Text>
      )}
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