import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import useAuthViewModel from '../viewmodels/useAuthViewModel.js';

export default function LoginView({ onLoginSuccess, onRegister, onRecover }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, error } = useAuthViewModel();

  const handlePress = async () => {
    const result = await handleLogin(correo, password);
    if (result.success) {
      onLoginSuccess && onLoginSuccess(result.user);
    } else {
      Alert.alert('Error', result.message || error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Icono de la app */}
      <Image
        source={require('../assets/SpentProo.png')} // Cambia el nombre si tu icono es diferente
        style={styles.icon}
      />
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Ingresar" onPress={handlePress} />
      <Button title="Registrarse" onPress={onRegister} />
      <Button title="Recuperar cuenta" onPress={onRecover} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
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