import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import useAuthViewModel from '../viewmodels/useAuthViewModel';

export default function RecoverAccountView({ onQuestionReceived }) {
  const [username, setUsername] = useState('');
  const { handleRecoverAccount } = useAuthViewModel();

  const handleSubmit = async () => {
    if (!username) {
      Alert.alert('Error', 'Ingresa tu usuario');
      return;
    }
    const result = await handleRecoverAccount(username);
    if (result.success) {
      onQuestionReceived && onQuestionReceived(username, result.question);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Button title="Siguiente" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
});