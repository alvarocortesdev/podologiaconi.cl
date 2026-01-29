import React, { useEffect, useState } from "react";
import { ConfigContext } from "./configContextBase";

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [successCases, setSuccessCases] = useState([]);
  const [aboutCards, setAboutCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/config").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/success-cases").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/about-cards").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([configData, casesData, cardsData]) => {
        setConfig(configData);
        setSuccessCases(casesData);
        setAboutCards(cardsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading config:", err);
        setLoading(false);
      });
  }, []);

  return (
    <ConfigContext.Provider
      value={{ config, successCases, aboutCards, loading }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
