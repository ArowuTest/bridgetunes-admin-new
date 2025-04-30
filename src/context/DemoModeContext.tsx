import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setIsDemoMode: (value: boolean) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

interface DemoModeProviderProps {
  children: ReactNode | ((props: { isDemoMode: boolean }) => ReactNode);
}

export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(
    localStorage.getItem('bridgetunes_demo_mode') === 'true' || true
  );

  // Update localStorage when isDemoMode changes
  useEffect(() => {
    localStorage.setItem('bridgetunes_demo_mode', String(isDemoMode));
  }, [isDemoMode]);

  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  const value = { isDemoMode, toggleDemoMode, setIsDemoMode };

  return (
    <DemoModeContext.Provider value={value}>
      {typeof children === 'function' 
        ? (children as (props: { isDemoMode: boolean }) => ReactNode)({ isDemoMode }) 
        : children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = (): DemoModeContextType => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
