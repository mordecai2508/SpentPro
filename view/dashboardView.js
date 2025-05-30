import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DashboardView({
  user,
  transactions,
  onGoToTransactions,
  onGoToSettings,
  onGoToAddTransaction,
}) {
  const ingresos = transactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0);
  const egresos = transactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0);
    const saldo = ingresos - egresos;
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{user?.nombre || 'Usuario'}</Text>
        <Button title="Configuración" onPress={onGoToSettings} />
      </View>

      {/* Dashboard Info */}
      <View style={styles.dashboard}>
        <Text style={styles.title}>Dashboard</Text>
        <Text>Ingresos: ${ingresos}</Text>
        <Text>Egresos: ${egresos}</Text>
        <Text>Saldo: ${saldo}</Text>
        {/* Aquí puedes agregar gráficas o resumen mensual si lo deseas */}
      </View>

      {/* Botones inferiores */}
      <View style={styles.bottomButtons}>
        <Button title="Transacciones" onPress={onGoToTransactions} />
        <Button title="Agregar una Transacción" onPress={onGoToAddTransaction} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  username: { fontSize: 18, fontWeight: 'bold' },
  dashboard: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    width: '100%',
  },
});