import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'uk';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    title: 'Crypto Loan Calculator',
    help: 'Help',
    howToUse: 'How to Use This Calculator',
    loanPositions: 'Loan Positions',
    addPosition: 'Add Position',
    interestRates: 'Interest Rates',
    addRate: 'Add Rate',
    btcPriceScenarios: 'BTC Price Scenarios',
    addPrice: 'Add Price',
    results: 'Results',
    initialDebt: 'Initial Debt',
    totalInterest: 'Total Interest',
    monthlyInterest: 'Monthly Interest',
    finalDebt: 'Final Debt',
    effectiveRate: 'Effective Rate',
    totalCollateral: 'Total Collateral',
    priceScenarios: 'Price Scenarios',
    requiredBtc: 'Required BTC',
    remainingBtc: 'Remaining BTC',
    worth: 'Worth',
    ofCollateral: 'of collateral',
    loanDuration: 'Loan Duration',
    principal: 'Principal',
    collateral: 'Collateral',
    rate: 'Rate',
    period: 'Period',
    btcPrice: 'Add new price',
    month: 'month',
    months: 'months',
    showMore: 'Show more',
    showMoreMonths: 'Show months 25-48',
    backToStart: 'Back to start',
    ratesAdjusted: 'Interest rate periods have been automatically adjusted to match the loan duration.',
    add: 'Add',
    fillRates: 'Please specify interest rates for the entire loan duration to see complete calculations.',
    ratePercentage: 'Interest rate (%)',
    periodMonths: 'Period (months)',
    principalAmount: 'Principal amount (USDT)',
    collateralAmount: 'Collateral amount (BTC)',
    enterPrice: 'Enter BTC price in USDT',
    price: 'Price'
  },
  uk: {
    title: 'Калькулятор Крипто Позик',
    help: 'Допомога',
    howToUse: 'Як користуватися калькулятором',
    loanPositions: 'Позиції позики',
    addPosition: 'Додати позицію',
    interestRates: 'Процентні ставки',
    addRate: 'Додати ставку',
    btcPriceScenarios: 'Сценарії ціни BTC',
    addPrice: 'Додати ціну',
    results: 'Результати',
    initialDebt: 'Початковий борг',
    totalInterest: 'Загальні відсотки',
    monthlyInterest: 'Щомісячні відсотки',
    finalDebt: 'Кінцевий борг',
    effectiveRate: 'Ефективна ставка',
    totalCollateral: 'Загальна застава',
    priceScenarios: 'Цінові сценарії',
    requiredBtc: 'Необхідно BTC',
    remainingBtc: 'Залишок BTC',
    worth: 'Вартість',
    ofCollateral: 'від застави',
    loanDuration: 'Тривалість позики',
    principal: 'Тіло кредиту',
    collateral: 'Застава',
    rate: 'Ставка',
    period: 'Період',
    btcPrice: 'Додати нову ціну',
    month: 'місяць',
    months: 'місяців',
    showMore: 'Показати більше',
    showMoreMonths: 'Показати місяці 25-48',
    backToStart: 'Повернутися на початок',
    ratesAdjusted: 'Періоди процентних ставок були автоматично скориговані відповідно до тривалості позики.',
    add: 'Додати',
    fillRates: 'Будь ласка, вкажіть процентні ставки для всього терміну позики, щоб побачити повні розрахунки.',
    ratePercentage: 'Процентна ставка (%)',
    periodMonths: 'Період (місяців)',
    principalAmount: 'Сума позики (USDT)',
    collateralAmount: 'Сума застави (BTC)',
    enterPrice: 'Введіть ціну BTC в USDT',
    price: 'Ціна'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}