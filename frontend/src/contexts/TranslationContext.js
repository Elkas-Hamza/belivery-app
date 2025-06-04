import React, { createContext, useContext } from "react";
import translations from "../services/translations";

// Create the translation context
const TranslationContext = createContext();

// Create a provider component
export const TranslationProvider = ({ children }) => {
  // For now we only have French, but this could be expanded for multiple languages
  const currentTranslations = translations;

  // Format currency to DH (Moroccan Dirham)
  const formatCurrency = (amount) => {
    return `${Number(amount).toFixed(2)} DH`;
  };

  // Export the context value
  const value = {
    t: currentTranslations,
    formatCurrency,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Create a hook for easy access to translations
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};

export default TranslationContext;
