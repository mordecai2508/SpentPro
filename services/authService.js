import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'users';

// Obtener todos los usuarios
async function getUsers() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Guardar todos los usuarios
async function saveUsers(users) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Registrar usuario
export async function register(data) {
  const users = await getUsers();
  if (users.find(u => u.correo === data.correo)) {
    return { success: false, message: 'El correo ya está registrado' };
  }
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    password: data.password,
    nombre: data.nombre,
    apellidos: data.apellidos,
    correo: data.correo,
    securityQuestion: data.securityQuestion,
    securityAnswer: data.securityAnswer,
  };
  users.push(newUser);
  await saveUsers(users);
  return { success: true, user: newUser };
}

// Login
export async function login(correo, password) {
  const users = await getUsers();
  const user = users.find(u => u.correo === correo && u.password === password);
  if (user) {
    return { success: true, user };
  }
  return { success: false, message: 'Correo o contraseña incorrectos' };
}

// Recuperar pregunta de seguridad
export async function recoverAccount(correo) {
  const users = await getUsers();
  const user = users.find(u => u.correo === correo);
  if (user) {
    return { success: true, question: user.securityQuestion };
  }
  return { success: false, message: 'Correo no encontrado' };
}

// Validar respuesta de seguridad
export async function validateSecurityAnswer(correo, answer) {
  const users = await getUsers();
  const user = users.find(u => u.correo === correo);
  if (user && user.securityAnswer === answer) {
    console.log('Respuesta correcta');
    return { success: true };
  }
  console.log('Respuesta incorrecta');
  return { success: false, message: 'Respuesta incorrecta' };
}

// Cambiar contraseña
export async function changePassword(correo, newPassword) {
  const users = await getUsers();
  const idx = users.findIndex(u => u.correo === correo);
  if (idx !== -1) {
    users[idx].password = newPassword;
    await saveUsers(users);
    return { success: true };
  }
  return { success: false, message: 'Correo no encontrado' };
}
