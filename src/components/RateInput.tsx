import React from 'react';
import { Minus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RateInputProps {
  id: number;
  rate: string;
  period: string;
  onRateChange: (id: number, value: string) => void;
  onPeriodChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  showRemove: boolean;
}

const RateInput: React.FC<RateInputProps> = ({
  id,
  rate,
  period,
  onRateChange,
  onPeriodChange,
  onRemove,
  showRemove
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <input
          type="number"
          step="0.01"
          min="0"
          value={rate}
          onChange={(e) => onRateChange(id, e.target.value)}
          placeholder={t('rate')}
          className="input-field"
        />
      </div>
      <div className="flex-1">
        <input
          type="number"
          min="1"
          value={period}
          onChange={(e) => onPeriodChange(id, e.target.value)}
          placeholder={t('period')}
          className="input-field"
        />
      </div>
      <button
        onClick={() => onRemove(id)}
        className={`text-gray-400 hover:text-red-500 transition-colors ${!showRemove ? 'invisible' : ''}`}
      >
        <Minus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default RateInput;