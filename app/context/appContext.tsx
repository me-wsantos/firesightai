/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { useState, createContext, useContext } from 'react';
import { IAppContext, IDataPrediction, IMessage } from '../interfaces';

const AppContext = createContext({} as IAppContext);

export const AppContextProvider = ({ children }: any) => {
  const [latitude, setLatitude] = useState(-15.7903);
  const [longitude, setLongitude] = useState(-48.0428);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]); //Format timezone -3 GMT
  const [startHour, setStartHour] = useState<number>(new Date().getHours());
  const [dataPrediction, setDataPrediction] = useState<IDataPrediction>({} as IDataPrediction);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMap, setActiveMap] = useState<'predictive' | 'historical'>('predictive');
  const [messages, setMessages] = useState<IMessage[]>([]);
  /* const [llmContext, setLlmContext] = useState<string[]>([`Hello! Welcome to the Virtual Assistant for Fire Prevention and Safety. 
    I&apos;m here to help you clarify any questions and provide reliable information on fire-related topics. Just ask me!
    I&apos;m ready to offer clear and objective guidance. Your safety is our top priority.`]); */
  const [llmContext, setLlmContext] = useState<string[]>([`Hi there! I&apos;m your Wildfire Assistant.
    I&apos;m here to help you better understand wildfires — from satellite data and fire detection to trends, terminology, and prevention tips.
    What would you like to know today?`]);

  return (
    <AppContext.Provider value={{ 
      latitude, setLatitude,
      longitude, setLongitude,
      startDate, setStartDate,
      startHour, setStartHour,
      dataPrediction, setDataPrediction,
      isLoading, setIsLoading,
      activeMap, setActiveMap,
      messages, setMessages,
      llmContext, setLlmContext
    }}>
      {children}
    </AppContext.Provider>
  );
}
const useAppContext = () => useContext(AppContext);
export default useAppContext;