import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import useTransactionViewModel from '../viewmodels/useTransactionViewModel';

export default function TransactionsView({ onAdd, onEdit, onDelete }) {
  const { transactions, loadTransactions, removeTransaction } = useTransactionViewModel();

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Transacciones</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.type} - ${item.amount} - {item.date}</Text>
            <Button title="Editar" onPress={() => onEdit(item)} />
            <Button title="Eliminar" onPress={() => { removeTransaction(item.id); onDelete && onDelete(item.id); }} />
          </View>
        )}
        ListEmptyComponent={<Text>No hay transacciones</Text>}
      />
      <Button title="Agregar Transacción" onPress={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  item: { marginBottom: 12, padding: 8, borderBottomWidth: 1, borderColor: '#ccc' },
});