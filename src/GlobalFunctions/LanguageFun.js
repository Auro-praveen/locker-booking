import { useState, useContext, createContext } from "react";
import EnglishLang from '../Languages/English.json';
import KannadaLang from '../Languages/Kannada.json';
import HindiLang from '../Languages/Hindi.json';

const LangContext = createContext(null);
export const LangContextProvider = ({ children }) => {
  const [userLanguage, setUserLanguage] = useState(EnglishLang);

  const changeUserLanguageFun = (lang) => {
    const userLanguage = lang;
    if (userLanguage === 'English') {
        setUserLanguage(EnglishLang)
    } else if(userLanguage === 'Kannada') {
        setUserLanguage(KannadaLang)
    } else if(userLanguage === 'Hindi') {
        setUserLanguage(HindiLang)
    } 
  }

  return <LangContext.Provider 
  value={{
    userLanguage,
    changeUserLanguageFun
  }}>{children}</LangContext.Provider>;
};

export const UseLanguage = () => {
  return useContext(LangContext);
};
