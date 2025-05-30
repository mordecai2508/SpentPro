import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useSettingsViewModel() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    AsyncStorage.getItem('theme').then(value => {
      if (value) setTheme(value);
    });
  }, []);

  function changeTheme(newTheme) {
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  }

  return {
    theme,
    changeTheme,
  };
}