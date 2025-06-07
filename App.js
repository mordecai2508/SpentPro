import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import LoginView from './view/loginView.js';
import RegisterView from './view/registerView.js';
import DashboardView from './view/dashboardView.js';
import TransactionsView from './view/transactionsView.js';
import SettingsView from './view/settingsView.js';
import RecoverAccountView from './view/recoverAccountView.js';
import SecurityQuestionsView from './view/securityQuestionsView.js';
import NewPasswordView from './view/newPasswordView.js';
import NewTransactionView from './view/newTransactionView.js';
import { getTransactions } from './services/transactionService';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [recoverUsername, setRecoverUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [transactions, setTransactions] = useState([]);

  async function loadTransactions() {
    const data = await getTransactions();
    setTransactions(data);
  }

  // Carga las transacciones cada vez que se agrega una nueva
  useEffect(() => {
    loadTransactions();
  }, [screen]); // Se recarga al cambiar de pantalla

  // Navegación simple entre pantallas
  if (screen === 'login') {
    return (
      <View style={styles.container}>
        <LoginView
          onLoginSuccess={user => {
            setCurrentUser(user);
            setScreen('dashboard');
          }}
          onRegister={() => setScreen('register')}
          onRecover={() => setScreen('recover')}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (screen === 'register') {
    return (
      <View style={styles.container}>
        <RegisterView onRegisterSuccess={() => setScreen('login')} />
        <Button title="Regresar" onPress={() => setScreen('login')} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (screen === 'recover') {
    return (
      <View style={styles.container}>
        <RecoverAccountView
          onQuestionReceived={(username, question) => {
            setRecoverUsername(username);
            setSecurityQuestion(question);
            setScreen('security');
          }}
        />
        <Button title="Regresar" onPress={() => setScreen('login')} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (screen === 'security') {
    return (
      <View style={styles.container}>
        <SecurityQuestionsView
          correo={recoverUsername}
          question={securityQuestion}
          onAnswerCorrect={() => setScreen('newPassword')}
        />
        <Button title="Regresar" onPress={() => setScreen('recover')} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (screen === 'newPassword') {
    return (
      <View style={styles.container}>
        <NewPasswordView
          username={recoverUsername}
          onPasswordChanged={() => setScreen('login')}
          onCancel={() => setScreen('login')}
        />
        <Button title="Regresar" onPress={() => setScreen('login')} />
        <StatusBar style="auto" />
      </View>
    );
  }
 
  if (screen === 'dashboard') {
    return (
      <View style={styles.container}>
        <DashboardView
          user={currentUser}
          transactions={transactions}
          onGoToTransactions={() => setScreen('transactions')}
          onGoToSettings={() => setScreen('settings')}
          onGoToAddTransaction={() => setScreen('newTransaction')}
        />
        <Button title="Cerrar sesión" onPress={() => setScreen('login')} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (screen === 'transactions') {
    return (
      <View style={styles.container}>
        <TransactionsView
          onAdd={() => setScreen('newTransaction')}
          onEdit={() => {/* Implementa editar si lo necesitas */}}
          onDelete={() => {/* Implementa eliminar si lo necesitas */}}
        />
        <Button title="Regresar" onPress={() => setScreen('dashboard')} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (screen === 'settings') {
    return (
      <View style={styles.container}>
        <SettingsView
          onBack={() => setScreen('dashboard')}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (screen === 'newTransaction') {
    return (
      <View style={styles.container}>
        <NewTransactionView
          onTransactionAdded={() => setScreen('transactions')}
          onCancel={() => setScreen('transactions')}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Pantalla por defecto
  return (
    <View style={styles.container}>
      <LoginView onLoginSuccess={user => {
        setCurrentUser(user);
        setScreen('dashboard');
      }} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
