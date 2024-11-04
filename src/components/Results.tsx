import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Bitcoin, DollarSign, Percent } from 'lucide-react';

interface ResultsProps {
  positions: Array<{ principal: string; collateral: string }>;
  rates: Array<{ rate: string; period: string }>;
  prices: string[];
  loanDuration: number;
}

const Results: React.FC<ResultsProps> = ({ positions, rates, prices, loanDuration }) => {
  const { t } = useLanguage();

  // Calculate total months covered by interest rates
  const coveredMonths = rates.reduce((sum, rate) => sum + (parseInt(rate.period) || 0), 0);
  const hasIncompleteRates = coveredMonths < loanDuration;

  // Calculate initial debt (sum of all principals)
  const totalInitialDebt = positions.reduce((sum, pos) => sum + (parseFloat(pos.principal) || 0), 0);

  // Calculate total collateral
  const totalCollateral = positions.reduce((sum, pos) => sum + (parseFloat(pos.collateral) || 0), 0);

  // Calculate total interest
  const calculateTotalInterest = () => {
    if (hasIncompleteRates) return null;

    let totalInterest = 0;
    let remainingMonths = loanDuration;
    let currentDebt = totalInitialDebt;

    rates.forEach(({ rate, period }) => {
      const monthsToCalculate = Math.min(parseInt(period) || 0, remainingMonths);
      const rateDecimal = (parseFloat(rate) || 0) / 100;
      const periodInterest = currentDebt * rateDecimal * (monthsToCalculate / 12);
      
      totalInterest += periodInterest;
      remainingMonths -= monthsToCalculate;
      currentDebt += periodInterest;
    });

    return totalInterest;
  };

  const totalInterest = calculateTotalInterest();
  const finalDebt = totalInterest !== null ? totalInitialDebt + totalInterest : null;
  const effectiveRate = totalInterest !== null && totalInitialDebt > 0 
    ? (totalInterest / totalInitialDebt) * 100 
    : null;
  const monthlyInterest = totalInterest !== null && loanDuration > 0 
    ? totalInterest / loanDuration 
    : null;

  return (
    <div className="card p-6">
      <h3 className="section-title mb-8">{t('results')}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-6">
          <div>
            <div className="result-label">{t('initialDebt')}</div>
            <div className="result-value flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {totalInitialDebt.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
            </div>
          </div>
          
          <div>
            <div className="result-label">{t('totalInterest')}</div>
            <div className="result-value flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {totalInterest !== null 
                ? `${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT`
                : '—'}
            </div>
          </div>

          <div>
            <div className="result-label">{t('monthlyInterest')}</div>
            <div className="result-value flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {monthlyInterest !== null 
                ? `${monthlyInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT`
                : '—'}
            </div>
          </div>

          <div>
            <div className="result-label">{t('finalDebt')}</div>
            <div className="result-value flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {finalDebt !== null 
                ? `${finalDebt.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT`
                : '—'}
            </div>
          </div>

          <div>
            <div className="result-label">{t('effectiveRate')}</div>
            <div className="result-value flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              {effectiveRate !== null 
                ? `${effectiveRate.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
                : '—'}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="result-label">{t('totalCollateral')}</div>
            <div className="result-value flex items-center gap-2">
              <Bitcoin className="w-5 h-5 text-orange-500" />
              {totalCollateral.toLocaleString(undefined, { maximumFractionDigits: 8 })} BTC
            </div>
          </div>

          {prices.length > 0 && finalDebt !== null && (
            <div className="space-y-4">
              <div className="result-label">{t('priceScenarios')}</div>
              {prices.map((price, index) => {
                const btcPrice = parseFloat(price) || 0;
                const collateralValue = totalCollateral * btcPrice;
                const collateralPercentage = totalInitialDebt > 0 
                  ? (collateralValue / totalInitialDebt) * 100 
                  : 0;
                const requiredBtc = btcPrice > 0 ? finalDebt / btcPrice : 0;
                const remainingBtc = totalCollateral - requiredBtc;

                return (
                  <div key={index} className="scenario-card">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">
                        <Bitcoin className="w-4 h-4 inline-block mr-1.5 text-orange-500" />
                        @ {btcPrice.toLocaleString()} USDT
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        {collateralPercentage.toFixed(1)}% {t('ofCollateral')}
                      </div>
                    </div>
                    <div className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      {collateralValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200/80">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{t('requiredBtc')}</div>
                        <div className="font-medium flex items-center gap-1.5">
                          <Bitcoin className="w-4 h-4 text-orange-500" />
                          {requiredBtc.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{t('remainingBtc')}</div>
                        <div className="font-medium flex items-center gap-1.5">
                          <Bitcoin className="w-4 h-4 text-orange-500" />
                          {remainingBtc.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;