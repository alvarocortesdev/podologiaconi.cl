import { createContext, useContext } from "react";

export const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);
