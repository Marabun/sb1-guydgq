import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import MonthSelector from './MonthSelector';
import Results from './Results';
import InputCard from './InputCard';
import LanguageToggle from './LanguageToggle';
import { 
  HelpCircle, 
  Percent, 
  DollarSign, 
  Bitcoin, 
  PlusCircle,
  AlertCircle 
} from 'lucide-react';
import DataTag from './DataTag';
import TagList from './TagList';

interface Position {
  principal: string;
  collateral: string;
}

interface Rate {
  rate: string;
  period: string;
}

interface FormErrors {
  rate?: string;
  period?: string;
  principal?: string;
  collateral?: string;
  price?: string;
}

const LoanCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [loanDuration, setLoanDuration] = useState(12);
  const [positions, setPositions] = useState<Position[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [newPosition, setNewPosition] = useState<Position>({ principal: '', collateral: '' });
  const [newRate, setNewRate] = useState<Rate>({ rate: '', period: '' });
  const [newPrice, setNewPrice] = useState('');
  const [adjustmentNotification, setAdjustmentNotification] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleDurationChange = (duration: number) => {
    setLoanDuration(duration);
    adjustRatePeriods(duration);
  };

  const adjustRatePeriods = (duration: number) => {
    let totalPeriod = 0;
    const adjustedRates = rates.map((rate, index) => {
      const remainingDuration = duration - totalPeriod;
      if (remainingDuration <= 0) return null;
      
      const periodNum = Math.min(parseInt(rate.period) || 0, remainingDuration);
      totalPeriod += periodNum;
      
      return {
        ...rate,
        period: periodNum.toString()
      };
    }).filter((rate): rate is Rate => rate !== null);

    if (adjustedRates.length !== rates.length) {
      setRates(adjustedRates);
      setAdjustmentNotification(t('ratesAdjusted'));
      setTimeout(() => setAdjustmentNotification(null), 5000);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (newRate.rate && (parseFloat(newRate.rate) < 0 || parseFloat(newRate.rate) > 100)) {
      newErrors.rate = t('invalidRate');
      isValid = false;
    }

    if (newRate.period && parseInt(newRate.period) < 1) {
      newErrors.period = t('invalidPeriod');
      isValid = false;
    }

    if (newPosition.principal && parseFloat(newPosition.principal) <= 0) {
      newErrors.principal = t('invalidPrincipal');
      isValid = false;
    }

    if (newPosition.collateral && parseFloat(newPosition.collateral) <= 0) {
      newErrors.collateral = t('invalidCollateral');
      isValid = false;
    }

    if (newPrice && parseFloat(newPrice) <= 0) {
      newErrors.price = t('invalidPrice');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddPosition = () => {
    if (newPosition.principal && newPosition.collateral && validateForm()) {
      setPositions([...positions, newPosition]);
      setNewPosition({ principal: '', collateral: '' });
      setErrors({});
    }
  };

  const handleRemovePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  const handleAddRate = () => {
    if (newRate.rate && newRate.period && validateForm()) {
      const totalPeriod = rates.reduce((sum, rate) => sum + (parseInt(rate.period) || 0), 0);
      const remainingDuration = loanDuration - totalPeriod;
      
      if (remainingDuration > 0) {
        const periodNum = Math.min(parseInt(newRate.period), remainingDuration);
        setRates([...rates, { ...newRate, period: periodNum.toString() }]);
        setNewRate({ rate: '', period: '' });
        setErrors({});
      }
    }
  };

  const handleRemoveRate = (index: number) => {
    setRates(rates.filter((_, i) => i !== index));
  };

  const handleAddPrice = () => {
    if (newPrice && validateForm()) {
      setPrices([...prices, newPrice]);
      setNewPrice('');
      setErrors({});
    }
  };

  const handleRemovePrice = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f7] to-[#e5e5e7] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            {t('title')}
          </motion.h1>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-xl">
              <span className="text-sm font-medium text-blue-900">{t('loanDuration')}:</span>
              <MonthSelector
                value={loanDuration}
                onChange={handleDurationChange}
                variant="minimal"
              />
            </div>
            <button className="button-secondary">
              <HelpCircle className="w-4 h-4" />
              <span>{t('help')}</span>
            </button>
            <LanguageToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <InputCard 
            title={t('interestRates')}
            icon={<Percent className="w-5 h-5 text-blue-600" />}
          >
            <AnimatePresence>
              {adjustmentNotification && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-700 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {adjustmentNotification}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-1.5">{t('rate')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      className={`input-field pl-8 ${errors.rate ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                      placeholder="0.00"
                      value={newRate.rate}
                      onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    <Percent className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.rate && (
                    <span className="text-xs text-red-500 mt-1">{errors.rate}</span>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-1.5">{t('period')}</label>
                  <input
                    type="number"
                    className={`input-field ${errors.period ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                    placeholder="0"
                    value={newRate.period}
                    onChange={(e) => setNewRate({ ...newRate, period: e.target.value })}
                    min="1"
                  />
                  {errors.period && (
                    <span className="text-xs text-red-500 mt-1">{errors.period}</span>
                  )}
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleAddRate} 
                    className="button-primary h-[42px] min-w-[5rem] flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t('add')}
                  </button>
                </div>
              </div>
              <TagList items={rates.map((rate, index) => (
                <DataTag key={index} onRemove={() => handleRemoveRate(index)}>
                  <Percent className="w-3.5 h-3.5 text-blue-600" />
                  <span>{rate.rate}%</span>
                  <span className="tag-divider" />
                  <span>{rate.period} {parseInt(rate.period) === 1 ? t('month') : t('months')}</span>
                </DataTag>
              ))} />
            </div>
          </InputCard>

          <InputCard 
            title={t('loanPositions')}
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-1.5">{t('principal')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      className={`input-field pl-8 ${errors.principal ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                      placeholder="0.00"
                      value={newPosition.principal}
                      onChange={(e) => setNewPosition({ ...newPosition, principal: e.target.value })}
                      min="0"
                      step="0.01"
                    />
                    <DollarSign className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.principal && (
                    <span className="text-xs text-red-500 mt-1">{errors.principal}</span>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-1.5">{t('collateral')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      className={`input-field pl-8 ${errors.collateral ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                      placeholder="0.00000000"
                      value={newPosition.collateral}
                      onChange={(e) => setNewPosition({ ...newPosition, collateral: e.target.value })}
                      min="0"
                      step="0.00000001"
                    />
                    <Bitcoin className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.collateral && (
                    <span className="text-xs text-red-500 mt-1">{errors.collateral}</span>
                  )}
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleAddPosition}
                    className="button-primary h-[42px] min-w-[5rem] flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t('add')}
                  </button>
                </div>
              </div>
              <TagList items={positions.map((position, index) => (
                <DataTag key={index} onRemove={() => handleRemovePosition(index)}>
                  <DollarSign className="w-3.5 h-3.5 text-green-600" />
                  <span>{position.principal} USDT</span>
                  <span className="tag-divider" />
                  <Bitcoin className="w-3.5 h-3.5 text-orange-500" />
                  <span>{position.collateral} BTC</span>
                </DataTag>
              ))} />
            </div>
          </InputCard>

          <InputCard 
            title={t('btcPriceScenarios')}
            icon={<Bitcoin className="w-5 h-5 text-orange-500" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-1.5">{t('price')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      className={`input-field pl-8 ${errors.price ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                      placeholder="0.00"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                    <DollarSign className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.price && (
                    <span className="text-xs text-red-500 mt-1">{errors.price}</span>
                  )}
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleAddPrice}
                    className="button-primary h-[42px] min-w-[5rem] flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t('add')}
                  </button>
                </div>
              </div>
              <TagList items={prices.map((price, index) => (
                <DataTag key={index} onRemove={() => handleRemovePrice(index)}>
                  <DollarSign className="w-3.5 h-3.5 text-green-600" />
                  <span>{price} USDT</span>
                </DataTag>
              ))} />
            </div>
          </InputCard>
        </div>

        <Results
          positions={positions}
          rates={rates}
          prices={prices}
          loanDuration={loanDuration}
        />
      </div>
    </div>
  );
};

export default LoanCalculator;