import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import useAuthViewModel from '../viewmodels/useAuthViewModel.js';

export default function RegisterView({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const { handleRegister } = useAuthViewModel();

  const handleSubmit = async () => {
    if (!password || !nombre || !apellidos || !correo || !securityQuestion || !securityAnswer) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    const result = await handleRegister({
      password,
      nombre,
      apellidos,
      correo,
      securityQuestion,
      securityAnswer
    });
    if (result.success) {
      Alert.alert('Listo', 'Usuario registrado correctamente');
      onRegisterSuccess && onRegisterSuccess();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Apellidos" value={apellidos} onChangeText={setApellidos} />
      <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Usuario" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Pregunta de seguridad" value={securityQuestion} onChangeText={setSecurityQuestion} />
      <TextInput style={styles.input} placeholder="Respuesta de seguridad" value={securityAnswer} onChangeText={setSecurityAnswer} />
      <Button title="Registrarse" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16,borderRadius: 8 },
});