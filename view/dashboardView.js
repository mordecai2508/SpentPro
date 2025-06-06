import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import useGoalViewModel from '../viewmodels/useGoalViewModel';

export default function DashboardView({
  user,
  transactions,
  onGoToTransactions,
  onGoToSettings,
  onGoToAddTransaction,
}) {
  const { goals, loadGoals } = useGoalViewModel();

  useEffect(() => {
    loadGoals();
  }, []);

  const ingresos = transactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0);
  const egresos = transactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0);
  const saldo = ingresos - egresos;
  const screenWidth = Dimensions.get('window').width;

  const pieData = [
    { name: 'Ingresos', amount: ingresos, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 15 },
    { name: 'Egresos', amount: egresos, color: '#F44336', legendFontColor: '#333', legendFontSize: 15 },
  ].filter(d => d.amount > 0);

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
        {/* Gráfica circular */}
        <PieChart
          data={pieData}
          width={screenWidth - 48}
          height={180}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Metas de ahorro */}
      <View style={styles.goals}>
        <Text style={{ fontWeight: 'bold', marginTop: 16 }}>Metas de ahorro</Text>
        {goals.length === 0 && <Text>No hay metas</Text>}
        {goals.map(goal => {
          const porcentaje = Math.min(100, Math.round((goal.progress / goal.amount) * 100));
          return (
            <View key={goal.id} style={{ marginVertical: 8 }}>
              <Text>{goal.period} - ${goal.amount}</Text>
              <View style={{ height: 20, backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden' }}>
                <View style={{
                  width: `${porcentaje}%`,
                  height: '100%',
                  backgroundColor: porcentaje >= 100 ? '#4CAF50' : '#2196F3'
                }} />
              </View>
              <Text>{porcentaje}%</Text>
            </View>
          );
        })}
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
  goals: { marginBottom: 24 },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    width: '100%',
  },
});