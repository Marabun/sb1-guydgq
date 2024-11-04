import React from 'react';
import LoanCalculator from './components/LoanCalculator';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <LoanCalculator />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;