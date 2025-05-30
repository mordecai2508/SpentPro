import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import useAuthViewModel from '../viewmodels/useAuthViewModel';

export default function NewPasswordView({ username, onPasswordChanged, onCancel }) {
  const [newPassword, setNewPassword] = useState('');
  const { handleChangePassword } = useAuthViewModel();

  const handleSubmit = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Ingresa una nueva contraseña');
      return;
    }
    const result = await handleChangePassword(username, newPassword);
    if (result.success) {
      Alert.alert('Listo', 'Contraseña cambiada correctamente');
      onPasswordChanged && onPasswordChanged();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nueva Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Button title="Guardar" onPress={handleSubmit} />
      <Button title="Cancelar" onPress={onCancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
});