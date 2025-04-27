import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { demoModeConfig } from '../config/appConfig';
import { generateDemoData, DemoDataType } from '../utils/demoDataGenerator';

interface DemoModeContextProps {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoData: DemoDataType;
  updateDemoData: (dataType: keyof DemoDataType, data: any) => void;
  resetDemoData: () => void;
  uploadCSVToDemoMode: (csvData: any[]) => void;
}

const DemoModeContext = createContext<DemoModeContextProps | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(
    demoModeConfig.enabled && 
    localStorage.getItem(demoModeConfig.storageKeys.demoMode) !== 'false'
  );
  
  const [demoData, setDemoData] = useState<DemoDataType>(() => {
    // Initialize with data from localStorage if available, otherwise use generated demo data
    if (demoModeConfig.persistData) {
      const storedData: Partial<DemoDataType> = {};
      
      Object.entries(demoModeConfig.storageKeys).forEach(([key, storageKey]) => {
        if (key === 'demoMode') return;
        
        const storedItem = localStorage.getItem(storageKey as string);
        if (storedItem) {
          try {
            storedData[key as keyof DemoDataType] = JSON.parse(storedItem);
          } catch (error) {
            console.error(`Error parsing stored demo data for ${key}:`, error);
          }
        }
      });
      
      // If we have complete stored data, use it; otherwise generate new demo data
      if (Object.keys(storedData).length === Object.keys(demoModeConfig.storageKeys).length - 1) {
        return storedData as DemoDataType;
      }
    }
    
    return generateDemoData();
  });
  
  // Update localStorage when demo mode or data changes
  useEffect(() => {
    if (demoModeConfig.persistData) {
      localStorage.setItem(demoModeConfig.storageKeys.demoMode, isDemoMode.toString());
      
      Object.entries(demoModeConfig.storageKeys).forEach(([key, storageKey]) => {
        if (key === 'demoMode') return;
        
        const data = demoData[key as keyof DemoDataType];
        if (data) {
          try {
            localStorage.setItem(storageKey as string, JSON.stringify(data));
          } catch (error) {
            console.error(`Error storing demo data for ${key}:`, error);
          }
        }
      });
    }
  }, [isDemoMode, demoData]);
  
  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };
  
  const updateDemoData = (dataType: keyof DemoDataType, data: any) => {
    setDemoData(prev => ({
      ...prev,
      [dataType]: data
    }));
  };
  
  const resetDemoData = () => {
    const newDemoData = generateDemoData();
    setDemoData(newDemoData);
    
    if (demoModeConfig.persistData) {
      Object.entries(demoModeConfig.storageKeys).forEach(([key, storageKey]) => {
        if (key === 'demoMode') return;
        
        const data = newDemoData[key as keyof DemoDataType];
        if (data) {
          try {
            localStorage.setItem(storageKey as string, JSON.stringify(data));
          } catch (error) {
            console.error(`Error storing demo data for ${key}:`, error);
          }
        }
      });
    }
  };
  
  const uploadCSVToDemoMode = (csvData: any[]) => {
    // Process CSV data and update relevant demo data
    // This is a simplified implementation - in a real app, you'd need to validate and transform the data
    
    // Extract subscriber data from CSV
    const subscribers = csvData.map(row => ({
      id: `sub_${Math.random().toString(36).substr(2, 9)}`,
      msisdn: row.MSISDN || row.msisdn,
      optInStatus: row['Opt-In Status'] === 'Yes' || row.optInStatus === true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    // Extract top-up data from CSV
    const topUps = csvData.map(row => ({
      id: `topup_${Math.random().toString(36).substr(2, 9)}`,
      msisdn: row.MSISDN || row.msisdn,
      amount: parseFloat(row['Recharge Amount (Naira)'] || row.rechargeAmount || 0),
      date: row['Recharge Date'] || row.rechargeDate || new Date().toISOString(),
      source: 'csv',
      createdAt: new Date().toISOString()
    }));
    
    // Update demo data with new subscribers and top-ups
    setDemoData(prev => ({
      ...prev,
      subscribers: [...prev.subscribers, ...subscribers],
      topUps: [...prev.topUps, ...topUps]
    }));
  };
  
  return (
    <DemoModeContext.Provider 
      value={{ 
        isDemoMode, 
        toggleDemoMode, 
        demoData, 
        updateDemoData, 
        resetDemoData,
        uploadCSVToDemoMode
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

export default DemoModeContext;
