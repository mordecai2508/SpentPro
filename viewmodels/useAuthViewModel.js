import { useState } from 'react';
import { login, register, recoverAccount, changePassword, validateSecurityAnswer } from '../services/authService.js';

export default function useAuthViewModel() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  async function handleLogin(correo, password) {
    const result = await login(correo, password);
    if (result.success) setUser(result.user);
    else setError(result.message);
    return result;
  }

  async function handleRegister(data) {
    return await register(data);
  }

  async function handleRecoverAccount(correo) {
    return await recoverAccount(correo);
  }

  async function handleChangePassword(correo, newPassword) {
    return await changePassword(correo, newPassword);
  }

  async function validateSecurityAnswerVM(correo, answer) {
    return await validateSecurityAnswer(correo, answer);
  }

  return {
    user,
    error,
    handleLogin,
    handleRegister,
    handleRecoverAccount,
    handleChangePassword,
    validateSecurityAnswer: validateSecurityAnswerVM,
  };
}