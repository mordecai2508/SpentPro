import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import useAuthViewModel from '../viewmodels/useAuthViewModel.js';

export default function SecurityQuestionsView({ correo, question, onAnswerCorrect }) {
  const [answer, setAnswer] = useState('');
  const { validateSecurityAnswer } = useAuthViewModel();

  const handleSubmit = async () => {
    if (!answer) {
      Alert.alert('Error', 'Ingresa tu respuesta');
      return;
    }
    const result = await validateSecurityAnswer(correo, answer);
    if (result.success) {
      onAnswerCorrect && onAnswerCorrect(answer); // Esto debe cambiar la pantalla
    } else {
      Alert.alert('Error', 'Respuesta incorrecta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pregunta de Seguridad</Text>
      <Text style={styles.question}>{question}</Text>
      <TextInput
        style={styles.input}
        placeholder="Respuesta"
        value={answer}
        onChangeText={setAnswer}
      />
      <Button title="Validar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 16, textAlign: 'center', fontWeight: 'bold' },
  question: { fontSize: 18, marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
});