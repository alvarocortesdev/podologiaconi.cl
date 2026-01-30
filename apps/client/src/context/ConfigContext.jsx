import React, { useEffect, useState } from "react";
import { ConfigContext } from "./configContextBase";

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [successCases, setSuccessCases] = useState([]);
  const [aboutCards, setAboutCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safeJson = async (res, fallback) => {
      if (!res.ok) return fallback;
      const type = res.headers.get("content-type") || "";
      if (!type.includes("application/json")) return fallback;
      try {
        return await res.json();
      } catch {
        return fallback;
      }
    };
    Promise.all([
      fetch("/api/config").then((res) => safeJson(res, null)),
      fetch("/api/success-cases").then((res) => safeJson(res, [])),
      fetch("/api/about-cards").then((res) => safeJson(res, [])),
    ])
      .then(([configData, casesData, cardsData]) => {
        setConfig(configData);
        setSuccessCases(casesData);
        setAboutCards(cardsData);
        setLoading(false);
      })
      .catch(() => {
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
