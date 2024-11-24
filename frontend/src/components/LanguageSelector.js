// frontend/src/components/LanguageSelector.js
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const LanguageSelector = () => {
  const [language, setLanguage] = React.useState('en');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ar', name: 'العربية' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'de', name: 'Deutsch' }
  ];

  const handleChange = async (event) => {
    const newLanguage = event.target.value;
    try {
      await axios.patch('/api/users/me/language', { language: newLanguage });
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  return (
    <FormControl>
      <InputLabel>Language</InputLabel>
      <Select value={language} onChange={handleChange}>
        {languages.map(({ code, name }) => (
          <MenuItem key={code} value={code}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;