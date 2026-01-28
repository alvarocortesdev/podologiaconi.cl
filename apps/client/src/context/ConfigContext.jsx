import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [successCases, setSuccessCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/config').then(res => res.ok ? res.json() : null),
      fetch('/api/success-cases').then(res => res.ok ? res.json() : [])
    ]).then(([configData, casesData]) => {
      setConfig(configData);
      setSuccessCases(casesData);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading config:', err);
      setLoading(false);
    });
  }, []);

  return (
    <ConfigContext.Provider value={{ config, successCases, loading }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
